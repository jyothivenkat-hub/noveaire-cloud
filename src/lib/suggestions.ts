/**
 * Daily content suggestion engine.
 * Port of webapp/suggestions.py
 */

import { callClaude, parseJsonFromResponse } from './claude'

export interface Suggestion {
  tweet: string
  strategy: string
  reasoning: string
  target_metric: string
}

export interface SuggestionsResult {
  status: 'success' | 'error'
  suggestions?: Suggestion[]
  raw?: string
  message?: string
  time_seconds: number
}

export async function generateSuggestions(
  profileText: string,
  numSuggestions = 5
): Promise<SuggestionsResult> {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

  const prompt = `${profileText}

---

Today is ${today}. Generate ${numSuggestions} tweet suggestions for today.

For each suggestion, consider:
- Day-of-week performance patterns from the data
- The content patterns that work best (numbers, questions, etc.)
- Mix of original posts and reply strategies
- Authentic voice matching the top posts

STRICT STYLE RULES (never break these):
- NO emojis ever
- NO "this not that" constructions (e.g. "it's not about X, it's about Y")
- NO quotation marks for emphasis
- NO excessive em dashes (\u2014) or hyphens (-)
- Write like a human talking to a friend. Simple, direct, conversational
- Short sentences. Plain words. No corporate or LinkedIn speak

For each suggestion provide:
- The exact tweet text (ready to copy-paste)
- What strategy it uses
- Why it should work based on the data
- What metric it targets (impressions, follows, or engagement)

Format as JSON array:
[{"tweet": "...", "strategy": "...", "reasoning": "...", "target_metric": "impressions|follows|engagement"}]`

  try {
    const { text, timeSeconds } = await callClaude(prompt, 4096)
    const suggestions = parseJsonFromResponse(text)

    if (Array.isArray(suggestions) && suggestions.length > 0) {
      return { status: 'success', suggestions, time_seconds: timeSeconds }
    }

    return { status: 'success', suggestions: [], raw: text, time_seconds: timeSeconds }
  } catch (e: any) {
    return { status: 'error', message: e.message, time_seconds: 0 }
  }
}
