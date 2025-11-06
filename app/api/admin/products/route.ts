import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Product from '@/models/Product'
import { requireAdmin } from '@/app/api/admin/_utils'
import { ZodError } from 'zod'
import { productCreateSchema } from '@/lib/validations'

export async function GET(request: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.res
  await connectDB()
  const { searchParams } = new URL(request.url)
  const page = Math.max(parseInt(searchParams.get('page') || '1', 10), 1)
  const pageSize = Math.min(Math.max(parseInt(searchParams.get('pageSize') || '10', 10), 1), 100)
  const q = (searchParams.get('q') || '').trim()

  const filter: any = {}
  if (q) {
    const regex = { $regex: q, $options: 'i' }
    filter.$or = [
      { title: regex },
      { slug: regex },
      { description: regex },
    ]
  }

  const total = await Product.countDocuments(filter)
  const products = await Product.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .populate('author', 'name')
    .lean()

  return NextResponse.json({ products, page, pageSize, total }, { status: 200 })
}

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.res
  try {
    const body = await request.json()
    const parsed = productCreateSchema.parse(body)
    const makeSlug = (s: string) => s.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    let slug = parsed.slug && parsed.slug.length > 0 ? makeSlug(parsed.slug) : makeSlug(parsed.title)
    await connectDB()
    let candidate = slug
    let n = 1
    while (await Product.exists({ slug: candidate })) {
      candidate = `${slug}-${n++}`
    }
    slug = candidate

    const data = {
      ...parsed,
      slug,
      images: (parsed.images && parsed.images.length > 0)
        ? parsed.images
        : (parsed.image ? [parsed.image] : []),
      stock: typeof parsed.amount === 'number' ? parsed.amount : parsed.stock ?? 0,
    }
    const created = await Product.create(data)
    return NextResponse.json({ product: created }, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    if ((error as any)?.code === 11000) {
      return NextResponse.json({ error: 'Duplicate key', key: (error as any).keyValue }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
