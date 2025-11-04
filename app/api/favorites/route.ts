import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import Favorite from '@/models/Favorite';
import type { FavoriteItem } from '@/lib/favorites';
import mongoose from 'mongoose';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
    }

    await connectDB();
    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    const favorites = await Favorite.find({ userId: userIdObjectId }).lean();
    
    const favoriteItems: FavoriteItem[] = favorites.map((fav) => ({
      productId: fav.productId,
      slug: fav.slug,
      title: fav.title,
      price: fav.price,
      image: fav.image,
    }));

    return NextResponse.json({ favorites: favoriteItems }, { status: 200 });
  } catch (error) {
    console.error('Failed to fetch favorites:', error);
    return NextResponse.json({ error: 'Failed to fetch favorites' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
    }

    const body = await request.json();
    const item: FavoriteItem = body.item;

    if (!item || !item.productId || !item.slug || !item.title || item.price === undefined || !item.image) {
      return NextResponse.json({ error: 'Invalid favorite item' }, { status: 400 });
    }

    await connectDB();
    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    
    const existingFavorite = await Favorite.findOne({ userId: userIdObjectId, productId: item.productId });
    if (existingFavorite) {
      return NextResponse.json({ message: 'Already in favorites' }, { status: 200 });
    }

    await Favorite.create({
      userId: userIdObjectId,
      productId: item.productId,
      slug: item.slug,
      title: item.title,
      price: item.price,
      image: item.image,
    });

    return NextResponse.json({ message: 'Added to favorites' }, { status: 201 });
  } catch (error: any) {
    if (error.code === 11000) {
      return NextResponse.json({ message: 'Already in favorites' }, { status: 200 });
    }
    console.error('Failed to add favorite:', error);
    return NextResponse.json({ error: 'Failed to add favorite' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    if (!userId) {
      return NextResponse.json({ error: 'User ID not found' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    await connectDB();
    const userIdObjectId = new mongoose.Types.ObjectId(userId);
    await Favorite.deleteOne({ userId: userIdObjectId, productId });

    return NextResponse.json({ message: 'Removed from favorites' }, { status: 200 });
  } catch (error) {
    console.error('Failed to remove favorite:', error);
    return NextResponse.json({ error: 'Failed to remove favorite' }, { status: 500 });
  }
}

