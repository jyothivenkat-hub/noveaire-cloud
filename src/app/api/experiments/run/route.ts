import { auth } from '@/lib/auth'
import { getLatestUpload, getPosts, saveExperiment } from '@/lib/db/queries'
import { buildProfile } from '@/lib/analysis'
import type { DbPost } from '@/lib/analysis'
import { runExperiment, runCustomExperiment } from '@/lib/experiments'
import { NextResponse } from 'next/server'
import { isDev } from '@/lib/db'
import { demoExperimentRunResponse } from '@/lib/demo-data'

export async function POST(request: Request) {
  if (isDev) return NextResponse.json(demoExperimentRunResponse)

  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id
  const upload = await getLatestUpload(userId)
  if (!upload) return NextResponse.json({ error: 'No data uploaded' }, { status: 400 })

  const posts = await getPosts(upload.id, userId)
  const profile = buildProfile(posts as unknown as DbPost[])

  const data = await request.json()
  const experimentNames: string[] = data.experiments || []
  const customPrompt: string = data.custom_prompt || ''

  const results = []

  for (const name of experimentNames) {
    const result = await runExperiment(name, profile)
    if (result.status === 'success') {
      await saveExperiment(userId, upload.id, result.name, result.description, result.data || result.raw || '', result.time_seconds)
    }
    results.push(result)
  }

  if (customPrompt) {
    const result = await runCustomExperiment(customPrompt, profile)
    if (result.status === 'success') {
      await saveExperiment(userId, upload.id, 'custom', customPrompt, result.data || result.raw || '', result.time_seconds)
    }
    results.push(result)
  }

  return NextResponse.json({ results })
}
