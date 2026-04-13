import { pgTable, text, serial, integer, real, timestamp, uuid, boolean } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name'),
  email: text('email'),
  emailVerified: timestamp('email_verified'),
  image: text('image'),
  twitterId: text('twitter_id').unique(),
  twitterHandle: text('twitter_handle'),
  inviteCodeUsed: text('invite_code_used'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const inviteCodes = pgTable('invite_codes', {
  id: serial('id').primaryKey(),
  code: text('code').unique().notNull(),
  createdBy: uuid('created_by').references(() => users.id),
  usedBy: uuid('used_by').references(() => users.id),
  usedAt: timestamp('used_at'),
  createdAt: timestamp('created_at').defaultNow(),
})

// NextAuth.js required tables (property names must match adapter expectations)
export const accounts = pgTable('accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refresh_token: text('refresh_token'),
  access_token: text('access_token'),
  expires_at: integer('expires_at'),
  token_type: text('token_type'),
  scope: text('scope'),
  id_token: text('id_token'),
  session_state: text('session_state'),
})

export const sessions = pgTable('sessions', {
  sessionToken: text('session_token').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expires: timestamp('expires').notNull(),
})

export const verificationTokens = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires').notNull(),
})

// App tables
export const uploads = pgTable('uploads', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  filename: text('filename'),
  uploadedAt: timestamp('uploaded_at').defaultNow(),
  rowCount: integer('row_count'),
})

export const posts = pgTable('posts', {
  id: serial('id').primaryKey(),
  uploadId: integer('upload_id').references(() => uploads.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull().references(() => users.id),
  postId: text('post_id'),
  date: text('date'),
  postText: text('post_text'),
  postLink: text('post_link'),
  impressions: integer('impressions').default(0),
  likes: integer('likes').default(0),
  engagements: integer('engagements').default(0),
  bookmarks: integer('bookmarks').default(0),
  shares: integer('shares').default(0),
  newFollows: integer('new_follows').default(0),
  replies: integer('replies').default(0),
  reposts: integer('reposts').default(0),
  profileVisits: integer('profile_visits').default(0),
  detailExpands: integer('detail_expands').default(0),
  urlClicks: integer('url_clicks').default(0),
  hashtagClicks: integer('hashtag_clicks').default(0),
  permalinkClicks: integer('permalink_clicks').default(0),
})

export const experiments = pgTable('experiments', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  uploadId: integer('upload_id').references(() => uploads.id),
  experimentName: text('experiment_name'),
  description: text('description'),
  resultJson: text('result_json'),
  createdAt: timestamp('created_at').defaultNow(),
  timeSeconds: real('time_seconds'),
})

export const suggestions = pgTable('suggestions', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id),
  uploadId: integer('upload_id').references(() => uploads.id),
  tweetText: text('tweet_text'),
  strategy: text('strategy'),
  reasoning: text('reasoning'),
  targetMetric: text('target_metric'),
  createdAt: timestamp('created_at').defaultNow(),
  used: integer('used').default(0),
})
