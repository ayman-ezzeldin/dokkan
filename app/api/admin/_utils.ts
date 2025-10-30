import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { ok: false as const, res: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }
  if ((session.user as any).role !== 'admin') {
    return { ok: false as const, res: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }
  }
  return { ok: true as const }
}
