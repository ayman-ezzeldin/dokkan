import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Product from '@/models/Product'
import { requireAdmin } from '@/app/api/admin/_utils'
import { ZodError } from 'zod'
import { productCreateSchema } from '@/lib/validations'

export async function GET() {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.res
  await connectDB()
  const products = await Product.find({}).lean()
  return NextResponse.json({ products }, { status: 200 })
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
