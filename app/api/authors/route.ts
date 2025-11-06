import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import Author from '@/models/Author';

export async function GET() {
  try {
    await connectDB();
    const authors = await Author.find().lean();
    return NextResponse.json({ authors });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to list authors' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await connectDB();
    const created = await Author.create({ name: body.name, bio: body.bio, image: body.image });
    return NextResponse.json({ author: created }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to create author' }, { status: 500 });
  }
}


