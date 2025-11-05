import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Cart from '@/models/Cart';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
  await connectDB();
  // We store by userId on checkout creation; derive user via email here
  const userId = (session as any).user.id || (session as any).user._id;
  if (!userId) return NextResponse.json({ items: [] }, { status: 200 });
  const cart = await Cart.findOne({ userId }).lean();
  return NextResponse.json({ items: cart?.items || [] }, { status: 200 });
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const userId = (session as any).user.id || (session as any).user._id;
  const body = await req.json();
  const { action, item, productId, quantity, items } = body || {};

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  if (action === 'setAll' && Array.isArray(items)) {
    cart.items = items;
  } else if (action === 'add' && item) {
    const qty = typeof quantity === 'number' && quantity > 0 ? quantity : 1;
    const idx = cart.items.findIndex((i: any) => String(i.productId) === String(item.productId));
    if (idx >= 0) cart.items[idx].quantity += qty;
    else cart.items.push({ ...item, quantity: qty });
  } else if (action === 'remove' && productId) {
    cart.items = cart.items.filter((i: any) => String(i.productId) !== String(productId));
  } else if (action === 'update' && productId && typeof quantity === 'number') {
    const idx = cart.items.findIndex((i: any) => String(i.productId) === String(productId));
    if (idx >= 0) cart.items[idx].quantity = Math.max(1, quantity);
  } else if (action === 'clear') {
    cart.items = [];
  } else {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }

  cart.updatedAt = new Date();
  await cart.save();
  return NextResponse.json({ items: cart.items }, { status: 200 });
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await connectDB();
  const userId = (session as any).user.id || (session as any).user._id;
  await Cart.findOneAndUpdate({ userId }, { $set: { items: [], updatedAt: new Date() } }, { upsert: true });
  return NextResponse.json({ ok: true }, { status: 200 });
}


