import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Author from '@/models/Author';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const author = await Author.findById(id).lean();
    if (!author) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ author });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch author' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();
    const updated = await Author.findByIdAndUpdate(id, { $set: body }, { new: true }).lean();
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ author: updated });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to update author' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await params;
    await Author.findByIdAndDelete(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to delete author' }, { status: 500 });
  }
}


