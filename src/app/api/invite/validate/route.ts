import { auth } from '@/lib/auth'
import { validateInviteCode, useInviteCode } from '@/lib/db/queries'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code } = await request.json()
  if (!code || typeof code !== 'string') {
    return NextResponse.json({ error: 'Invalid code' }, { status: 400 })
  }

  const inviteCode = await validateInviteCode(code.trim().toUpperCase())
  if (!inviteCode) {
    return NextResponse.json({ error: 'Invalid or already used invite code' }, { status: 400 })
  }

  await useInviteCode(code.trim().toUpperCase(), session.user.id)
  return NextResponse.json({ status: 'ok' })
}
