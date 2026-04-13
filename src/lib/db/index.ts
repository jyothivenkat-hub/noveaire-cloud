import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import * as schema from './schema'

const isDev = !process.env.DATABASE_URL || process.env.DATABASE_URL.includes('placeholder')

const sql = isDev ? (null as any) : neon(process.env.DATABASE_URL!)
export const db = isDev ? (null as any) : drizzle(sql, { schema })
export { isDev }
