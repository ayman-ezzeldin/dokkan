import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import crypto from 'crypto';
import mongoose from 'mongoose';
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
      fullName: data.fullName,
      phonePrimary: data.phonePrimary,
      email: data.email.toLowerCase().trim(),
      passwordHash,
      passwordSalt: salt,
      role: 'user',
    });

    return NextResponse.json(
      {
        user: {
          _id: user._id,
          fullName: user.fullName,
          phonePrimary: user.phonePrimary,
          phoneSecondary: user.phoneSecondary,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("User creation error:", error);
    
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
        { error: error.message || 'Failed to create user' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create user', details: String(error) },
      { status: 500 }
    );
  }
}


