import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { z, ZodError } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Cart from "@/models/Cart";
import { shippingSchema, egyptPhoneRegex } from "@/lib/validation/shipping";

const orderItemSchema = z.object({
  productId: z.string(),
  title: z.string(),
  price: z.number(),
  quantity: z.number().int().min(1),
});

const payloadSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  shipping: z.number().optional(),
  currency: z.string().default("EGP"),
  customer: z
    .object({
      name: z.string().min(1),
      email: z.string().email().optional(),
      phone: z.string().regex(egyptPhoneRegex).optional(),
    })
    .default({ name: "" }),
  shippingDetails: shippingSchema,
});

function buildWhatsAppMessage(data: z.infer<typeof payloadSchema>, total: number) {
  const s = data.shippingDetails;
  const lines = [
    "الاوردر بياخد من ٢ ل 5 أيام عمل إن شاء الله غير شامل الجمعة والاجازات الرسمية 👍🏻",
    "",
    `🫠 اسم المستلم: ${s.recipientName}`,
    `🏠 العنوان: ${s.province} - ${s.cityOrDistrict} - ${s.streetInfo}`,
    s.landmark ? `📍 العلامة المميزة: ${s.landmark}` : undefined,
    "",
    `📞 رقم الموبايل: ${s.phone}`,
    s.phoneAlternate ? `📱 رقم بديل: ${s.phoneAlternate}` : undefined,
    "",
    "📚 الكتب المطلوبة:",
    ...data.items.map((it) => `• ${it.title} × ${it.quantity}`),
    "",
    `💸 إجمالي السعر: ${total.toFixed(2)} ${data.currency}`,
    "",
    'برجاء الضغط على "إرسال" لتأكيد الطلب 💚',
  ].filter(Boolean) as string[];
  return lines.join("\n");
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const parsed = payloadSchema.parse(body);

    const subtotal = parsed.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingFee = parsed.shipping ?? 0;
    const total = subtotal + shippingFee;
    const session = await getServerSession(authOptions);
    type SessionUser = { id?: string; _id?: string };
    const sUser = (session?.user || {}) as SessionUser;
    const userId = sUser.id || sUser._id || undefined;

    const order = await Order.create({
      items: parsed.items,
      subtotal,
      shipping: shippingFee,
      total,
      userId,
      customer: parsed.customer,
      shippingDetails: parsed.shippingDetails,
      status: "pending",
    });

    // clear user's server cart after placing order
    if (userId) {
      await Cart.findOneAndUpdate({ userId }, { $set: { items: [], updatedAt: new Date() } }, { upsert: true });
    }

    const message = buildWhatsAppMessage(parsed, total);
    const storePhone = "201275574271"; // TODO: move to env
    const encoded = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${storePhone}?text=${encoded}`;

    return NextResponse.json({ success: true, orderId: order._id, whatsappUrl });
  } catch (err: unknown) {
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, error: "Validation failed", details: err.issues }, { status: 400 });
    }
    console.error("/api/checkout error", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}


