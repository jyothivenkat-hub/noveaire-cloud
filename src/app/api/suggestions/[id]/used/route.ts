import { auth } from '@/lib/auth'
import { markSuggestionUsed } from '@/lib/db/queries'
import { NextResponse } from 'next/server'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  await markSuggestionUsed(parseInt(id, 10), session.user.id)
  return NextResponse.json({ status: 'ok' })
}
