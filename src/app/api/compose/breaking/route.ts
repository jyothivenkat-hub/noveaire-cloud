import { auth } from '@/lib/auth'
import { composeBreakingNews } from '@/lib/compose'
import { NextResponse } from 'next/server'
import { isDev } from '@/lib/db'
import { demoComposeBreakingResponse } from '@/lib/demo-data'

export async function POST(request: Request) {
  if (isDev) return NextResponse.json(demoComposeBreakingResponse)

  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const data = await request.json()
  const news = data.news || ''
  if (!news.trim()) return NextResponse.json({ error: 'No news text provided' }, { status: 400 })

  const result = await composeBreakingNews(news)
  return NextResponse.json(result)
}
