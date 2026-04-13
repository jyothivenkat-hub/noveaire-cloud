import { auth } from '@/lib/auth'
import { getLatestUpload, getPosts, saveSuggestions } from '@/lib/db/queries'
import { buildProfile } from '@/lib/analysis'
import type { DbPost } from '@/lib/analysis'
import { generateSuggestions } from '@/lib/suggestions'
import { NextResponse } from 'next/server'
import { isDev } from '@/lib/db'
import { demoGenerateSuggestionsResponse } from '@/lib/demo-data'

export async function POST() {
  if (isDev) return NextResponse.json(demoGenerateSuggestionsResponse)

  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id
  const upload = await getLatestUpload(userId)
  if (!upload) return NextResponse.json({ error: 'No data uploaded' }, { status: 400 })

  const posts = await getPosts(upload.id, userId)
  const profile = buildProfile(posts as unknown as DbPost[])
  const result = await generateSuggestions(profile)

  if (result.status === 'success' && result.suggestions && result.suggestions.length > 0) {
    await saveSuggestions(userId, upload.id, result.suggestions)
  }

  return NextResponse.json(result)
}
