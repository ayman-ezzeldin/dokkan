import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ ok: true }, { status: 200 });
  response.headers.append('Set-Cookie', `session=; HttpOnly; Path=/; SameSite=Lax; Secure=${process.env.NODE_ENV !== 'development'}; Max-Age=0`);
  return response;
}


