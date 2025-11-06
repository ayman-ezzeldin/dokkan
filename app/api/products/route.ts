import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectDB from '@/lib/db';
import Product from '@/models/Product';
import mongoose from 'mongoose';
import Author from '@/models/Author';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const searchParams = request.nextUrl.searchParams;
    const q = searchParams.get('q') || '';
    const categorySingle = searchParams.get('category') || '';
    const categoryMulti = searchParams.getAll('category');
    const authorMulti = searchParams.getAll('author');
    const sort = searchParams.get('sort') || 'createdAt';
    const page = parseInt(searchParams.get('page') || '1');
    const perPage = parseInt(searchParams.get('perPage') || '12');

    const query: Record<string, unknown> = { isActive: true };

    if (q) {
      const regex = { $regex: q, $options: 'i' } as any;
      const authorIds = await Author.find({ name: regex }).select('_id').lean();
      const authorIdList = authorIds.map((a: any) => a._id);
      (query as any).$or = [
        { title: regex },
        { slug: regex },
        { description: regex },
        ...(authorIdList.length > 0 ? [{ author: { $in: authorIdList } }] : []),
      ];
    }

    const categoryIds = categoryMulti.length > 0 ? categoryMulti : (categorySingle ? [categorySingle] : []);
    if (categoryIds.length > 0) {
      query.categoryId = { $in: categoryIds };
    }

    if (authorMulti.length > 0) {
      (query as any).author = { $in: authorMulti };
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
        .select('title slug description author image images price currency categoryId tags stock amount')
        .sort(sortObj)
        .skip(skip)
        .limit(perPage)
        .populate('author', 'name image')
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

