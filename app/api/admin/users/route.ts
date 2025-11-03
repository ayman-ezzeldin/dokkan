import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/models/User'
import { requireAdmin } from '@/app/api/admin/_utils'

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
    filter.$or = [
      { firstName: { $regex: q, $options: 'i' } },
      { lastName: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
    ]
  }

  const total = await User.countDocuments(filter)
  const users = await User.find(filter, { passwordHash: 0, passwordSalt: 0 })
    .sort({ createdAt: -1 })
    .skip((page - 1) * pageSize)
    .limit(pageSize)
    .lean()

  return NextResponse.json({ users, page, pageSize, total }, { status: 200 })
}

export async function PATCH(request: Request) {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.res
  const body = await request.json()
  const { userId, role } = body as { userId?: string; role?: 'user' | 'admin' }
  if (!userId || (role !== 'user' && role !== 'admin')) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }
  await connectDB()
  const updated = await User.findByIdAndUpdate(userId, { $set: { role } }, { new: true, projection: { passwordHash: 0, passwordSalt: 0 } }).lean()
  if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ user: updated }, { status: 200 })
}
