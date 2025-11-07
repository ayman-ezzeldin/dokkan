import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { loginSchema } from '@/lib/validations';
import { scryptHash, createSessionToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const data = loginSchema.parse(body);

    const user = await User.findOne({ email: data.email.toLowerCase().trim() });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const salt = user.passwordSalt;
    const storedHash = user.passwordHash;
    if (!salt || !storedHash) {
      return NextResponse.json({ error: 'Password login unavailable for this account' }, { status: 401 });
    }

    const hash = await scryptHash(data.password, salt);
    if (hash !== storedHash) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = createSessionToken(user._id.toString());
    const response = NextResponse.json({ ok: true, user: { _id: user._id, email: user.email, fullName: user.fullName, phonePrimary: user.phonePrimary, phoneSecondary: user.phoneSecondary, role: user.role } }, { status: 200 });
    response.headers.append('Set-Cookie', `session=${token}; HttpOnly; Path=/; SameSite=Lax; Secure=${process.env.NODE_ENV !== 'development'}; Max-Age=${60 * 60 * 24 * 7}`);
    return response;
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.issues }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}


