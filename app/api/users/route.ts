import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import crypto from 'crypto';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { userCreateSchema } from '@/lib/validations';

async function scryptHash(password: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) return reject(err);
      resolve(derivedKey.toString('hex'));
    });
  });
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const data = userCreateSchema.parse(body);

    const existing = await User.findOne({ email: data.email.toLowerCase().trim() });
    if (existing) {
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = await scryptHash(data.password, salt);

    const user = await User.create({
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      email: data.email.toLowerCase().trim(),
      passwordHash,
      passwordSalt: salt,
      role: 'user',
    });

    return NextResponse.json(
      {
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.issues },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}


