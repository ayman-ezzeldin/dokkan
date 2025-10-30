import { NextResponse } from 'next/server'
import connectDB from '@/lib/db'
import User from '@/models/User'
import { requireAdmin } from '@/app/api/admin/_utils'

export async function GET() {
  const auth = await requireAdmin()
  if (!auth.ok) return auth.res
  await connectDB()
  const users = await User.find({}, { passwordHash: 0, passwordSalt: 0 }).lean()
  return NextResponse.json({ users }, { status: 200 })
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
