import { auth } from '@/lib/auth'
import { getLatestUpload, getExperiments } from '@/lib/db/queries'
import { getExperimentList } from '@/lib/experiments'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id
  const upload = await getLatestUpload(userId)
  const expList = getExperimentList()
  const pastExperiments = upload ? await getExperiments(upload.id, userId) : []

  // Parse and deduplicate (latest run per experiment name)
  const seen = new Set<string>()
  const parsed = []
  for (const exp of pastExperiments) {
    if (!exp.experimentName || seen.has(exp.experimentName)) continue
    seen.add(exp.experimentName)
    let data = null
    try {
      const raw = typeof exp.resultJson === 'string' ? JSON.parse(exp.resultJson) : exp.resultJson
      data = typeof raw === 'string' ? JSON.parse(raw) : raw
    } catch {}
    parsed.push({
      id: exp.id,
      name: exp.experimentName,
      description: exp.description,
      created_at: exp.createdAt?.toISOString() || null,
      time_seconds: exp.timeSeconds,
      data,
      raw: exp.resultJson,
    })
  }

  return NextResponse.json({
    experiment_list: expList,
    past_experiments: parsed,
    upload: upload ? { id: upload.id, filename: upload.filename, uploaded_at: upload.uploadedAt?.toISOString(), row_count: upload.rowCount } : null,
  })
}
