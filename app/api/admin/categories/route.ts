import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import Category from '@/models/Category'
import { requireAdmin } from '@/app/api/admin/_utils'
import { ZodError } from 'zod'
import { categoryCreateSchema } from '@/lib/validations'

export async function GET() {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.res
  await connectDB()
  const categories = await Category.find({}).lean()
  return NextResponse.json({ categories }, { status: 200 })
}

export async function POST(request: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.res
  try {
    const body = await request.json()
    const data = categoryCreateSchema.parse(body)
    await connectDB()
    const created = await Category.create(data)
    return NextResponse.json({ category: created }, { status: 201 })
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    if ((error as any)?.code === 11000) {
      return NextResponse.json({ error: 'Duplicate key', key: (error as any).keyValue }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
