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
    const data = productCreateSchema.parse(body)
    await connectDB()
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
