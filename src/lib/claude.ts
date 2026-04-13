/**
 * Shared Claude API helpers.
 * All Claude calls go through callClaude() for consistent error handling and timing.
 */

import Anthropic from '@anthropic-ai/sdk'

const MODEL = 'claude-sonnet-4-20250514'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export interface ClaudeResponse {
  text: string
  timeSeconds: number
}

/**
 * Call Claude with a prompt and return the response text + timing.
 */
export async function callClaude(prompt: string, maxTokens = 4096): Promise<ClaudeResponse> {
  const t0 = Date.now()
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  })
  const text = response.content[0].type === 'text' ? response.content[0].text : ''
  const timeSeconds = Math.round((Date.now() - t0) / 100) / 10
  return { text, timeSeconds }
}

/**
 * Extract JSON array or object from Claude's response text.
 * Looks for [...] or {...} patterns.
 */
export function parseJsonFromResponse(text: string): any | null {
  // Try array first
  const arrStart = text.indexOf('[')
  const arrEnd = text.lastIndexOf(']')
  if (arrStart >= 0 && arrEnd > arrStart) {
    try {
      return JSON.parse(text.slice(arrStart, arrEnd + 1))
    } catch {
      // fall through
    }
  }

  // Try object
  const objStart = text.indexOf('{')
  const objEnd = text.lastIndexOf('}')
  if (objStart >= 0 && objEnd > objStart) {
    try {
      return JSON.parse(text.slice(objStart, objEnd + 1))
    } catch {
      // fall through
    }
  }

  return null
}
