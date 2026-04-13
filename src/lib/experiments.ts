/**
 * Experiment engine — runs content experiments via Claude API.
 * Port of webapp/experiments.py
 */

import { callClaude, parseJsonFromResponse } from './claude'

export interface ExperimentDef {
  name: string
  description: string
  prompt: string
}

export interface ExperimentResult {
  status: 'success' | 'error'
  name: string
  description: string
  data?: any
  raw?: string
  message?: string
  time_seconds: number
}

const EXPERIMENTS: ExperimentDef[] = [
  {
    name: 'original_post_topics',
    description: 'Generate original posts on trending AI topics',
    prompt: `Based on the profile analysis below, generate 5 original tweet ideas that would maximize impressions and followers.

Each tweet should:
- Use patterns that worked: include numbers, emojis, conversational tone
- Be 50-200 characters
- Feel authentic to the voice in the top posts

For each tweet, explain WHY it should work based on the data patterns.

Format as JSON array:
[{"tweet": "...", "reasoning": "...", "predicted_metric": "impressions|follows|engagement", "confidence": "high|medium|low"}]`,
  },
  {
    name: 'reply_strategies',
    description: 'Generate high-impact reply templates for big accounts',
    prompt: `Based on the profile analysis, generate 5 reply strategies for big accounts in the user's niche.

For each, provide:
1. A template reply for when they post about their topic
2. A template reply for when they share a product/launch
3. Tips on timing and tone

The replies should feel genuine and add value.

Format as JSON array:
[{"target": "@handle", "topic_reply": "...", "launch_reply": "...", "tips": "..."}]`,
  },
  {
    name: 'engagement_hooks',
    description: 'Test different hook styles for original posts',
    prompt: `Generate 5 variations of a SINGLE topic relevant to the user using different hook styles.

Variations to test:
1. Question hook ("Have you ever...?")
2. Number hook ("3 things I learned...")
3. Contrarian hook ("Everyone says X, but...")
4. Story hook ("I just realized...")
5. Milestone hook ("Just hit X...")

For each, write the full tweet (under 280 chars) and predict which metrics it optimizes.

Format as JSON array:
[{"style": "...", "tweet": "...", "optimizes_for": "impressions|follows|engagement", "reasoning": "..."}]`,
  },
  {
    name: 'follower_conversion',
    description: 'Posts optimized specifically for follower growth',
    prompt: `Generate 10 tweet ideas specifically optimized for FOLLOWER GROWTH.

Strategies to use:
- Personal connection ("Hey! I'm...")
- Value proposition ("Follow me for...")
- Social proof ("Just hit X...")
- Community building ("Who else is...")
- Vulnerability/authenticity ("Honestly, I...")

Each should feel natural and authentic.

Format as JSON array:
[{"tweet": "...", "strategy": "...", "reasoning": "..."}]`,
  },
  {
    name: 'viral_reply_formulas',
    description: 'Reusable reply templates that go viral',
    prompt: `Generate 10 reply templates that could work on ANY big account's post.

Categories:
- Humor/wit
- Adding unique insight
- Personal story that relates
- Contrarian but respectful take
- Asking a smart follow-up question

For each template, include [PLACEHOLDER] for context.

Format as JSON array:
[{"category": "...", "template": "...", "example_usage": "...", "why_it_works": "..."}]`,
  },
  {
    name: 'weekly_plan',
    description: 'Optimized 7-day posting schedule',
    prompt: `Create an optimal weekly posting plan based on the data patterns.

Consider day-of-week performance, optimal mix of originals vs replies, and content themes.

Format as JSON:
{"weekly_plan": [{"day": "Monday", "originals": N, "replies": N, "themes": ["..."], "strategy": "..."}], "best_times": ["..."], "key_tactics": ["..."]}`,
  },
  {
    name: 'ab_test_posts',
    description: 'A/B test variations of top posts',
    prompt: `Take the top 3 performing posts from the profile and create A/B test variations.

For each, create 3 variations testing:
A) Different opening hook
B) Different length
C) Different call-to-action

Predict which variation would outperform.

Format as JSON array:
[{"original": "...", "variation_a": "...", "variation_b": "...", "variation_c": "...", "prediction": "..."}]`,
  },
]

export function getExperimentList(): { name: string; description: string }[] {
  return EXPERIMENTS.map(({ name, description }) => ({ name, description }))
}

export async function runExperiment(
  experimentName: string,
  profileText: string
): Promise<ExperimentResult> {
  const exp = EXPERIMENTS.find((e) => e.name === experimentName)
  if (!exp) {
    return {
      status: 'error',
      name: experimentName,
      description: '',
      message: `Unknown experiment: ${experimentName}`,
      time_seconds: 0,
    }
  }

  const fullPrompt = `${profileText}\n\n---\n\n${exp.prompt}`

  try {
    const { text, timeSeconds } = await callClaude(fullPrompt, 4096)
    const parsed = parseJsonFromResponse(text)

    return {
      status: 'success',
      name: exp.name,
      description: exp.description,
      data: parsed,
      raw: text,
      time_seconds: timeSeconds,
    }
  } catch (e: any) {
    return {
      status: 'error',
      name: exp.name,
      description: exp.description,
      message: e.message,
      time_seconds: 0,
    }
  }
}

export async function runCustomExperiment(
  prompt: string,
  profileText: string
): Promise<ExperimentResult> {
  const fullPrompt = `${profileText}\n\n---\n\n${prompt}\n\nFormat your response as a JSON array.`

  try {
    const { text, timeSeconds } = await callClaude(fullPrompt, 4096)
    const parsed = parseJsonFromResponse(text)

    return {
      status: 'success',
      name: 'custom',
      description: 'Custom experiment',
      data: parsed,
      raw: text,
      time_seconds: timeSeconds,
    }
  } catch (e: any) {
    return {
      status: 'error',
      name: 'custom',
      description: 'Custom experiment',
      message: e.message,
      time_seconds: 0,
    }
  }
}
