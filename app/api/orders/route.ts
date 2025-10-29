import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import connectDB from '@/lib/db';
import Order from '@/models/Order';
import { orderSchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const validatedData = orderSchema.parse(body);

    const subtotal = validatedData.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const total = subtotal + (validatedData.shipping || 0);

    const order = await Order.create({
      items: validatedData.items,
      subtotal,
      shipping: validatedData.shipping || 0,
      total,
      customer: validatedData.customer,
      shippingAddress: validatedData.shippingAddress,
      status: 'pending',
    });

    return NextResponse.json({ orderId: order._id, order }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

