import { auth } from '@/lib/auth'
import { getLatestUpload, getPosts, getExperiments, getSuggestions } from '@/lib/db/queries'
import { analyzePosts } from '@/lib/analysis'
import type { DbPost } from '@/lib/analysis'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id
  const upload = await getLatestUpload(userId)

  if (!upload) {
    return NextResponse.json({ upload: null, analysis: null, experiments: [], suggestions: [] })
  }

  const posts = await getPosts(upload.id, userId)
  if (posts.length === 0) {
    return NextResponse.json({ upload, analysis: null, experiments: [], suggestions: [] })
  }

  const analysis = analyzePosts(posts as unknown as DbPost[])
  const experiments = await getExperiments(upload.id, userId)
  const suggestions = await getSuggestions(upload.id, userId, true)

  // Parse experiment result_json and take latest per name
  const seen = new Set<string>()
  const parsedExperiments = []
  for (const exp of experiments) {
    if (!exp.experimentName || seen.has(exp.experimentName)) continue
    seen.add(exp.experimentName)
    let data = null
    try {
      const raw = typeof exp.resultJson === 'string' ? JSON.parse(exp.resultJson) : exp.resultJson
      data = typeof raw === 'string' ? JSON.parse(raw) : raw
    } catch {}
    parsedExperiments.push({
      id: exp.id,
      name: exp.experimentName,
      description: exp.description,
      created_at: exp.createdAt?.toISOString() || null,
      time_seconds: exp.timeSeconds,
      data,
      raw: exp.resultJson,
    })
  }

  // Map suggestions to expected shape
  const mappedSuggestions = suggestions.map((s) => ({
    id: s.id,
    upload_id: s.uploadId,
    tweet_text: s.tweetText,
    strategy: s.strategy,
    reasoning: s.reasoning,
    target_metric: s.targetMetric,
    created_at: s.createdAt?.toISOString() || null,
    used: s.used,
  }))

  return NextResponse.json({
    upload: { id: upload.id, filename: upload.filename, uploaded_at: upload.uploadedAt?.toISOString(), row_count: upload.rowCount },
    analysis,
    experiments: parsedExperiments.slice(0, 5),
    suggestions: mappedSuggestions.slice(0, 5),
  })
}
