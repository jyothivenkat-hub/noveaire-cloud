import { auth } from '@/lib/auth'
import { saveUpload, savePosts } from '@/lib/db/queries'
import { NextResponse } from 'next/server'
import { parse } from 'csv-parse/sync'
import { isDev } from '@/lib/db'

export async function POST(request: Request) {
  if (isDev) return NextResponse.json({ status: 'success', upload_id: 1, row_count: 142 })

  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = session.user.id

  const formData = await request.formData()
  const file = formData.get('csv_file') as File | null

  if (!file || !file.name.endsWith('.csv')) {
    return NextResponse.json({ error: 'Please upload a CSV file.' }, { status: 400 })
  }

  const content = await file.text()
  const records: Record<string, string>[] = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })

  if (records.length === 0) {
    return NextResponse.json({ error: 'CSV file is empty.' }, { status: 400 })
  }

  const requiredCols = ['Post text', 'Impressions', 'Likes']
  const firstRow = records[0]
  const missing = requiredCols.filter((c) => !(c in firstRow))
  if (missing.length > 0) {
    return NextResponse.json({ error: `CSV is missing required columns: ${missing.join(', ')}` }, { status: 400 })
  }

  const uploadId = await saveUpload(userId, file.name, records.length)
  await savePosts(uploadId, userId, records)

  return NextResponse.json({ status: 'success', upload_id: uploadId, row_count: records.length })
}
