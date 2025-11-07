"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { egyptPhoneRegex } from "@/lib/validation/shipping";
import { useCart } from "@/components/CartProvider";

type CheckoutFormData = {
  recipientName: string;
  province: string;
  cityOrDistrict: string;
  streetInfo: string;
  landmark: string;
  phone: string;
  phoneAlternate: string;
  notesOrBooksList: string;
};

type CheckoutFormProps = {
  defaultFormData: CheckoutFormData;
};

export default function CheckoutForm({ defaultFormData }: CheckoutFormProps) {
  const t = useTranslations("Checkout");
  const locale = useLocale();
  const { cart, clearCart, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [formData, setFormData] = useState<CheckoutFormData>(defaultFormData);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 10;
  const totalWithShipping = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    if (!formData.recipientName || formData.recipientName.length < 5) {
      return alert("من فضلك أدخل الاسم الثلاثي.");
    }
    if (
      !formData.province ||
      !formData.cityOrDistrict ||
      !formData.streetInfo
    ) {
      return alert("من فضلك أكمل بيانات العنوان.");
    }
    if (!egyptPhoneRegex.test(formData.phone)) {
      return alert(
        "رقم الموبايل غير صالح. الرجاء إدخال رقم صحيح (مثال: 01012345678)."
      );
    }
    setConfirmOpen(true);
  };

  const submitOrder = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({
            productId: item.productId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
          customer: { name: formData.recipientName, phone: formData.phone },
          shippingDetails: formData,
          shipping,
          currency: "EGP",
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setOrderId(data.orderId);
        clearCart();
        toast.success(
          "تم إنشاء الطلب! سيتم فتح واتساب لتأكيد الطلب مع خدمة العملاء."
        );
        setTimeout(() => {
          window.open(data.whatsappUrl, "_blank");
        }, 300);
      } else {
        const error = await res.json();
        if (error?.details && Array.isArray(error.details)) {
          error.details.forEach((d: any) => {
            const path = Array.isArray(d.path) ? d.path.join(".") : "";
            toast.error(`${d.message}${path ? ` (${path})` : ""}`);
          });
        } else if (error?.error) {
          toast.error(error.error);
        } else {
          toast.error("فشل إنشاء الطلب. حاول مرة أخرى.");
        }
      }
    } catch (error) {
      console.error("Order error:", error);
      toast.error("حدث خطأ غير متوقع.");
    } finally {
      setLoading(false);
      setConfirmOpen(false);
    }
  };

  if (orderId) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">{t("orderPlaced")}</h1>
          <p className="text-lg mb-4">
            {t("orderNumber")}: {orderId}</p>
          <Button asChild>
            <Link href={`/${locale}/shop`}>{t("continueShopping")}</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen py-8 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Cart is Empty</h1>
          <Button asChild>
            <Link href={`/${locale}/shop`}>Continue Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
              <div>
                <h2 className="text-xl font-semibold mb-4">بيانات الشحن</h2>
                <div className="space-y-4">
                  <Input
                    required
                    placeholder="أدخل الاسم الثلاثي (مثال: محمد أحمد علي)"
                    value={formData.recipientName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        recipientName: e.target.value,
                      })
                    }
                  />
                  <Input
                    type="tel"
                    placeholder="مثال: 01012345678"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="مثال: 01087654321"
                      value={formData.phoneAlternate}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneAlternate: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-4">العنوان</h2>
                <div className="space-y-4">
                  <Input
                    required
                    placeholder="مثال: القاهرة"
                    value={formData.province}
                    onChange={(e) =>
                      setFormData({ ...formData, province: e.target.value })
                    }
                  />
                  <Input
                    required
                    placeholder="مثال: مدينة نصر / الحي العاشر"
                    value={formData.cityOrDistrict}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        cityOrDistrict: e.target.value,
                      })
                    }
                  />
                  <Input
                    required
                    placeholder="مثال: شارع 9 - عقار 12 - الدور 3 - شقة 301"
                    value={formData.streetInfo}
                    onChange={(e) =>
                      setFormData({ ...formData, streetInfo: e.target.value })
                    }
                  />
                  <Input
                    placeholder="مثال: قرب مسجد الرحمة أو بجوار صيدلية النصر"
                    value={formData.landmark}
                    onChange={(e) =>
                      setFormData({ ...formData, landmark: e.target.value })
                    }
                  />
                  <Input
                    placeholder="اكتب أسماء الكتب المطلوبة أو ملاحظات للحجز"
                    value={formData.notesOrBooksList}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        notesOrBooksList: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={loading}
              >
                {loading ? "Processing..." : t("placeOrder")}
              </Button>
            </form>
            <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    سيتم الآن إرسال تفاصيل طلبك إلى خدمة العملاء على واتساب. هل
                    تريد المتابعة؟
                  </DialogTitle>
                </DialogHeader>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setConfirmOpen(false)}
                  >
                    إلغاء
                  </Button>
                  <Button onClick={submitOrder} disabled={loading}>
                    متابعة
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">{t("cartReview")}</h2>
              <div className="space-y-4 mb-4">
                {cart.map((item) => (
                  <div key={item.productId} className="flex gap-4 items-center">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm line-clamp-2">
                        {item.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity} × {item.price}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId)}
                      className="text-md text-gray-300 hover:underline cursor-pointer"
                      aria-label="Remove"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{t("subtotal")}</span>
                  <span>{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>{t("shipping")}</span>
                  <span>{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>{t("total")}</span>
                  <span>{totalWithShipping.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

