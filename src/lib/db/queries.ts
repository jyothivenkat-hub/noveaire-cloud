import { db } from '.'
import { uploads, posts, experiments, suggestions, inviteCodes, users } from './schema'
import { eq, and, desc, isNull } from 'drizzle-orm'

// --- Uploads ---
export async function getLatestUpload(userId: string) {
  const rows = await db.select().from(uploads)
    .where(eq(uploads.userId, userId))
    .orderBy(desc(uploads.id))
    .limit(1)
  return rows[0] || null
}

export async function saveUpload(userId: string, filename: string, rowCount: number) {
  const rows = await db.insert(uploads)
    .values({ userId, filename, rowCount })
    .returning({ id: uploads.id })
  return rows[0].id
}

// --- Posts ---
export async function getPosts(uploadId: number, userId: string) {
  return db.select().from(posts)
    .where(and(eq(posts.uploadId, uploadId), eq(posts.userId, userId)))
    .orderBy(desc(posts.impressions))
}

export async function savePosts(uploadId: number, userId: string, postRows: any[]) {
  if (postRows.length === 0) return
  const values = postRows.map((row) => ({
    uploadId,
    userId,
    postId: String(row['Post id'] || ''),
    date: String(row['Date'] || ''),
    postText: String(row['Post text'] || ''),
    postLink: String(row['Post Link'] || ''),
    impressions: parseInt(row['Impressions'] || '0') || 0,
    likes: parseInt(row['Likes'] || '0') || 0,
    engagements: parseInt(row['Engagements'] || '0') || 0,
    bookmarks: parseInt(row['Bookmarks'] || '0') || 0,
    shares: parseInt(row['Shares'] || '0') || 0,
    newFollows: parseInt(row['New follows'] || '0') || 0,
    replies: parseInt(row['Replies'] || '0') || 0,
    reposts: parseInt(row['Reposts'] || '0') || 0,
    profileVisits: parseInt(row['Profile visits'] || '0') || 0,
    detailExpands: parseInt(row['Detail Expands'] || '0') || 0,
    urlClicks: parseInt(row['URL Clicks'] || '0') || 0,
    hashtagClicks: parseInt(row['Hashtag Clicks'] || '0') || 0,
    permalinkClicks: parseInt(row['Permalink Clicks'] || '0') || 0,
  }))
  await db.insert(posts).values(values)
}

// --- Experiments ---
export async function getExperiments(uploadId: number | null, userId: string) {
  if (!uploadId) {
    return db.select().from(experiments)
      .where(eq(experiments.userId, userId))
      .orderBy(desc(experiments.id))
  }
  return db.select().from(experiments)
    .where(and(eq(experiments.uploadId, uploadId), eq(experiments.userId, userId)))
    .orderBy(desc(experiments.id))
}

export async function saveExperiment(
  userId: string,
  uploadId: number,
  name: string,
  description: string,
  result: any,
  timeSeconds: number
) {
  await db.insert(experiments).values({
    userId,
    uploadId,
    experimentName: name,
    description,
    resultJson: JSON.stringify(result),
    timeSeconds,
  })
}

// --- Suggestions ---
export async function getSuggestions(uploadId: number | null, userId: string, unusedOnly = false) {
  const conditions = [eq(suggestions.userId, userId)]
  if (uploadId) conditions.push(eq(suggestions.uploadId, uploadId))
  if (unusedOnly) conditions.push(eq(suggestions.used, 0))
  return db.select().from(suggestions)
    .where(and(...conditions))
    .orderBy(desc(suggestions.id))
}

export async function saveSuggestions(userId: string, uploadId: number, items: any[]) {
  if (items.length === 0) return
  const values = items.map((s) => ({
    userId,
    uploadId,
    tweetText: s.tweet || '',
    strategy: s.strategy || '',
    reasoning: s.reasoning || '',
    targetMetric: s.target_metric || '',
  }))
  await db.insert(suggestions).values(values)
}

export async function markSuggestionUsed(id: number, userId: string) {
  await db.update(suggestions)
    .set({ used: 1 })
    .where(and(eq(suggestions.id, id), eq(suggestions.userId, userId)))
}

// --- Invite Codes ---
export async function validateInviteCode(code: string) {
  const rows = await db.select().from(inviteCodes)
    .where(and(eq(inviteCodes.code, code), isNull(inviteCodes.usedBy)))
    .limit(1)
  return rows[0] || null
}

export async function useInviteCode(code: string, userId: string) {
  await db.update(inviteCodes)
    .set({ usedBy: userId, usedAt: new Date() })
    .where(eq(inviteCodes.code, code))
  await db.update(users)
    .set({ inviteCodeUsed: code })
    .where(eq(users.id, userId))
}

export async function getUserById(userId: string) {
  const rows = await db.select().from(users).where(eq(users.id, userId)).limit(1)
  return rows[0] || null
}
