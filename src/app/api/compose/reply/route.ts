import { auth } from '@/lib/auth'
import { getLatestUpload, getPosts } from '@/lib/db/queries'
import { buildProfile } from '@/lib/analysis'
import type { DbPost } from '@/lib/analysis'
import { generateReplies } from '@/lib/compose'
import { NextResponse } from 'next/server'
import { isDev } from '@/lib/db'
import { demoComposeReplyResponse } from '@/lib/demo-data'

export async function POST(request: Request) {
  if (isDev) return NextResponse.json(demoComposeReplyResponse)

  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await request.json()
  const post = data.post || ''
  if (!post.trim()) return NextResponse.json({ error: 'No post text provided' }, { status: 400 })

  let profile: string | null = null
  const upload = await getLatestUpload(session.user.id)
  if (upload) {
    const posts = await getPosts(upload.id, session.user.id)
    if (posts.length > 0) {
      profile = buildProfile(posts as unknown as DbPost[])
    }
  }

  const result = await generateReplies(post, profile)
  return NextResponse.json(result)
}
