import { NextResponse, NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import Category from '@/models/Category'
import Product from '@/models/Product'
import { requireAdmin } from '@/app/api/admin/_utils'
import { ZodError } from 'zod'
import { categoryUpdateSchema } from '@/lib/validations'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.res
  const { id } = await params
  await connectDB()
  const category = await Category.findById(id).lean()
  if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ category }, { status: 200 })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.res
  try {
    const body = await request.json()
    const data = categoryUpdateSchema.parse(body)
    const { id } = await params
    await connectDB()
    const updated = await Category.findByIdAndUpdate(id, { $set: data }, { new: true }).lean()
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ category: updated }, { status: 200 })
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    if ((error as any)?.code === 11000) {
      return NextResponse.json({ error: 'Duplicate key', key: (error as any).keyValue }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.res
  const { id } = await params
  await connectDB()
  const relatedCount = await Product.countDocuments({ categoryId: id })
  if (relatedCount > 0) {
    return NextResponse.json({ error: `This category has ${relatedCount} related products and cannot be deleted`, count: relatedCount }, { status: 409 })
  }
  const deleted = await Category.findByIdAndDelete(id).lean()
  if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ok: true }, { status: 200 })
}
