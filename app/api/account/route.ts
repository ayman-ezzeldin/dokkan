import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import connectDB from '@/lib/db'
import User from '@/models/User'
import { ZodError } from 'zod'
import mongoose from 'mongoose'
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
    if (data.fullName !== undefined) updates.fullName = data.fullName
    if (data.phonePrimary !== undefined) updates.phonePrimary = data.phonePrimary
    if (data.phoneSecondary !== undefined) updates.phoneSecondary = data.phoneSecondary
    if (data.email !== undefined) updates.email = data.email.toLowerCase().trim()
    if (data.address !== undefined) {
      const cleanAddress: Record<string, any> = {};
      if (data.address.province && data.address.province.trim()) cleanAddress.province = data.address.province.trim();
      if (data.address.cityOrDistrict && data.address.cityOrDistrict.trim()) cleanAddress.cityOrDistrict = data.address.cityOrDistrict.trim();
      if (data.address.streetInfo && data.address.streetInfo.trim()) cleanAddress.streetInfo = data.address.streetInfo.trim();
      if (data.address.landmark && data.address.landmark.trim()) cleanAddress.landmark = data.address.landmark.trim();
      
      if (Object.keys(cleanAddress).length > 0) {
        if (cleanAddress.province && cleanAddress.cityOrDistrict && cleanAddress.streetInfo) {
          updates.address = cleanAddress;
        } else {
          return NextResponse.json(
            { error: 'Address validation failed', details: 'Province, city/district, and street info are required when providing an address' },
            { status: 400 }
          );
        }
      } else {
        updates.$unset = { address: "" };
      }
    }

    const updateQuery: any = {};
    if (updates.$unset) {
      updateQuery.$unset = updates.$unset;
      delete updates.$unset;
    }
    if (Object.keys(updates).length > 0) {
      updateQuery.$set = updates;
    }

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      updateQuery,
      { new: true, runValidators: true }
    ).lean()

    if (!user) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    const { passwordHash, passwordSalt, ...safe } = user as any
    return NextResponse.json({ user: safe }, { status: 200 })
  } catch (error: unknown) {
    console.error("Account update error:", error);
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(err => ({
        path: err.path,
        message: err.message
      }));
      return NextResponse.json(
        { 
          error: 'User validation failed', 
          details: validationErrors,
          message: validationErrors.map(e => `${e.path}: ${e.message}`).join(', ')
        },
        { status: 400 }
      );
    }
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Failed to update account' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to update account', details: String(error) },
      { status: 500 }
    );
  }
}
