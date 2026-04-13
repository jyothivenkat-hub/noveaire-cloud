import { auth } from '@/lib/auth'
import { getLatestUpload, getSuggestions } from '@/lib/db/queries'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id
  const upload = await getLatestUpload(userId)
  const suggestions = upload ? await getSuggestions(upload.id, userId) : []

  return NextResponse.json({
    suggestions: suggestions.map((s) => ({
      id: s.id,
      upload_id: s.uploadId,
      tweet_text: s.tweetText,
      strategy: s.strategy,
      reasoning: s.reasoning,
      target_metric: s.targetMetric,
      created_at: s.createdAt?.toISOString() || null,
      used: s.used,
    })),
    upload: upload ? { id: upload.id, filename: upload.filename, uploaded_at: upload.uploadedAt?.toISOString(), row_count: upload.rowCount } : null,
  })
}
