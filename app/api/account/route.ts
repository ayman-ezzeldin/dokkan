import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/db'
import User from '@/models/User'
import { ZodError } from 'zod'
import { userUpdateSchema } from '@/lib/validations'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  await connectDB()
  const user = await User.findOne({ email: session.user.email }).lean()
  if (!user) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  const { passwordHash, passwordSalt, ...safe } = user as any
  return NextResponse.json({ user: safe }, { status: 200 })
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const body = await request.json()
    const data = userUpdateSchema.parse(body)

    await connectDB()
    const updates: Record<string, any> = {}
    if (data.firstName !== undefined) updates.firstName = data.firstName
    if (data.lastName !== undefined) updates.lastName = data.lastName
    if (data.phoneNumber !== undefined) updates.phoneNumber = data.phoneNumber
    if (data.email !== undefined) updates.email = data.email.toLowerCase().trim()

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      { $set: updates },
      { new: true, runValidators: true }
    ).lean()

    if (!user) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const { passwordHash, passwordSalt, ...safe } = user as any
    return NextResponse.json({ user: safe }, { status: 200 })
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: 'Failed to update account' }, { status: 500 })
  }
}
