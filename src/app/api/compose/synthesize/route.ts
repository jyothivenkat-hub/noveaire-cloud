import { auth } from '@/lib/auth'
import { getLatestUpload, getPosts } from '@/lib/db/queries'
import { buildProfile } from '@/lib/analysis'
import type { DbPost } from '@/lib/analysis'
import { synthesizeResearch } from '@/lib/compose'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await request.json()
  const research = data.research || ''
  if (!research.trim()) return NextResponse.json({ error: 'No research text provided' }, { status: 400 })

  let profile: string | null = null
  const upload = await getLatestUpload(session.user.id)
  if (upload) {
    const posts = await getPosts(upload.id, session.user.id)
    if (posts.length > 0) {
      profile = buildProfile(posts as unknown as DbPost[])
    }
  }

  const result = await synthesizeResearch(research, profile)
  return NextResponse.json(result)
}
