import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q') || '';
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const sort = searchParams.get('sort') || 'createdAt';
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '12');

    const query: Record<string, unknown> = { isActive: true };

    if (q) {
      const regex = { $regex: q, $options: 'i' } as any;
      (query as any).$or = [
        { title: regex },
        { slug: regex },
        { description: regex },
      ];
    }

    if (category) {
      query.categoryId = category;
    }

    if (minPrice || maxPrice) {
      (query as Record<string, { $gte?: number; $lte?: number }>).price = {};
      const priceQuery = (query as Record<string, { $gte?: number; $lte?: number }>).price;
      if (minPrice && priceQuery) priceQuery.$gte = parseFloat(minPrice);
      if (maxPrice && priceQuery) priceQuery.$lte = parseFloat(maxPrice);
    }

    const sortObj: Record<string, mongoose.SortOrder> = {};
    if (sort === 'price') {
      sortObj.price = 1;
    } else {
      sortObj.createdAt = -1;
    }

    const skip = (page - 1) * perPage;

    const [products, total] = await Promise.all([
      Product.find(query)
        .select('title slug description image images price currency categoryId tags stock amount')
        .sort(sortObj)
        .skip(skip)
        .limit(perPage)
        .lean(),
      Product.countDocuments(query),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        page,
        perPage,
        total,
        totalPages: Math.ceil(total / perPage),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

