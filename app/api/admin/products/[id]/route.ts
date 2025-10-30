import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Product from '@/models/Product'
import { requireAdmin } from '@/app/api/admin/_utils'
import { ZodError } from 'zod'
import { productUpdateSchema } from '@/lib/validations'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.res
  await connectDB()
  const product = await Product.findById(params.id).lean()
  if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ product }, { status: 200 })
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.res
  try {
    const body = await request.json()
    const data = productUpdateSchema.parse(body)
    await connectDB()
    const updated = await Product.findByIdAndUpdate(params.id, { $set: data }, { new: true }).lean()
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ product: updated }, { status: 200 })
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    if ((error as any)?.code === 11000) {
      return NextResponse.json({ error: 'Duplicate key', key: (error as any).keyValue }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.res
  await connectDB()
  const deleted = await Product.findByIdAndDelete(params.id).lean()
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true }, { status: 200 })
}
