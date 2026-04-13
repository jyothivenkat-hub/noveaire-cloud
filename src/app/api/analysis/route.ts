import { auth } from '@/lib/auth'
import { getLatestUpload, getPosts } from '@/lib/db/queries'
import { analyzePosts } from '@/lib/analysis'
import type { DbPost } from '@/lib/analysis'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id
  const upload = await getLatestUpload(userId)
  if (!upload) return NextResponse.json({ error: 'No data uploaded' }, { status: 404 })

  const posts = await getPosts(upload.id, userId)
  if (posts.length === 0) return NextResponse.json({ error: 'No posts found' }, { status: 404 })

  const analysis = analyzePosts(posts as unknown as DbPost[])
  return NextResponse.json({
    analysis,
    upload: { id: upload.id, filename: upload.filename, uploaded_at: upload.uploadedAt?.toISOString(), row_count: upload.rowCount },
  })
}
