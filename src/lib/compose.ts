/**
 * Compose engine — synthesize research into posts and generate replies.
 * Port of webapp/compose.py
 */

import { callClaude, parseJsonFromResponse } from './claude'

const RESEARCH_THREAD_EXAMPLE = [
  {
    label: 'Hook',
    text: 'Anthropic has proved that well behaved AI can secretly pursue hidden agendas (and we almost can\'t catch them).\n\nHere is a breakdown of the Anthropic paper: Auditing language models for hidden objectives\n\nThey trained a model to game its own scoring system. Then they ran a blind war game to see if humans could stop it. See the details and results below.',
  },
  {
    label: 'Setup',
    text: 'What is this about: Can we catch an AI secretly pursuing goals it was not supposed to have?\n\nThe Setup:\n1. Anthropic trained a model with a known hidden objective: reward model sycophancy.\n2. This means the AI learned to game the scoring system by exploiting 52 specific biases.',
  },
  {
    label: 'Results',
    text: 'The Results:\nThe team with only API access failed completely despite 70+ hours of investigation.\n\nKey Findings:\n1. The 3 teams with access to weights and training data found the secret.\n2. Behavioral testing alone is not enough to catch a model that is gaming the system.',
  },
  {
    label: 'Take',
    text: 'My take:\nThis was a great exercise, but real world AI misalignment will not come with a how to guide in the training data. It will emerge organically.\n\nAlignment auditing will need to become a serious discipline, like cybersecurity with constant war games and scenarios testing.',
  },
]

const BREAKING_NEWS_EXAMPLE = `\u{1F6A8} Breaking news: Meta just acquired Moltbook!!

Now how they perfectly named it: Moltbook (Facebook) love the irony.

Co founders Matt Schlicht and Ben Parr are joining Meta Superintelligence Labs under Alexandr Wang.

Schlicht built the entire platform with his own AI agent without writing a single line of code. 1.6M agents on the platform already.

Welcome to the new age where we will be watching agents chat with each other while the rest of us go touch grass.`

// ---------- Synthesize Research ----------

export interface ThreadItem {
  label: string
  text: string
}

export interface SynthesizeResult {
  status: 'success' | 'error'
  thread?: ThreadItem[]
  raw?: string
  message?: string
  time_seconds: number
}

export async function synthesizeResearch(
  researchText: string,
  profileText?: string | null
): Promise<SynthesizeResult> {
  let context = ''
  if (profileText) {
    context = `Here is the user's Twitter profile analysis for voice/style matching:\n\n${profileText}\n\n---\n\n`
  }

  const exampleJson = JSON.stringify(RESEARCH_THREAD_EXAMPLE, null, 2)

  const prompt = `${context}The user wants to turn the following research into a Twitter THREAD (multiple tweets posted in sequence).

---
${researchText}
---

Generate a thread that breaks down this research. Study this example carefully and match the format exactly:

EXAMPLE THREAD:
${exampleJson}

THREAD STRUCTURE (follow this pattern):
1. HOOK tweet: grab attention with the key finding or claim. Summarize what the research is about and tease the breakdown. Include "See the details and results below" or similar.
2. SETUP tweet: Start with "What is this about:" then explain the context. Use numbered points for the methodology or setup.
3. RESULTS tweet: Start with "The Results:" then share the key findings. Use numbered points for clarity.
4. TAKE tweet: Start with "My take:" then give a personal, opinionated conclusion. Connect it to the bigger picture.

You can add more tweets between Setup and Results if the research needs it (e.g. extra context, methodology details). Each tweet should be its own standalone thought.

ACCURACY RULES (critical):
- ONLY use facts, names, numbers, and claims that are explicitly stated in the research provided above
- Do NOT invent stats, names, findings, or details that are not in the source material
- If something is unclear from the source, leave it out rather than guessing
- The "My take" tweet is the ONLY place where personal opinion is allowed. Everything else must be factual and traceable to the input

STRICT STYLE RULES (never break these):
- NO emojis ever
- NO "this not that" constructions (e.g. "it's not about X, it's about Y")
- NO quotation marks for emphasis
- NO excessive em dashes or hyphens
- Write like a human explaining something interesting to a friend
- Short sentences. Plain words. No corporate or LinkedIn speak
- Use numbered lists for structured info
- Each tweet must be under 280 characters

Each tweet in the array needs a "label" (Hook, Setup, Results, Take, or a custom label) and "text" (the exact tweet text, ready to copy-paste).

Format as JSON array:
[{"label": "Hook", "text": "..."}, {"label": "Setup", "text": "..."}, ...]`

  try {
    const { text, timeSeconds } = await callClaude(prompt, 4096)
    const thread = parseJsonFromResponse(text)

    if (Array.isArray(thread) && thread.length > 0) {
      return { status: 'success', thread, time_seconds: timeSeconds }
    }

    return { status: 'success', thread: [], raw: text, time_seconds: timeSeconds }
  } catch (e: any) {
    return { status: 'error', message: e.message, time_seconds: 0 }
  }
}

// ---------- Generate Replies ----------

export interface ReplyItem {
  reply: string
  tone: string
  why_it_works: string
}

export interface RepliesResult {
  status: 'success' | 'error'
  replies?: ReplyItem[]
  raw?: string
  message?: string
  time_seconds: number
}

export async function generateReplies(
  postText: string,
  profileText?: string | null,
  numReplies = 3
): Promise<RepliesResult> {
  let context = ''
  if (profileText) {
    context = `Here is the user's Twitter profile analysis for voice/style matching:\n\n${profileText}\n\n---\n\n`
  }

  const prompt = `${context}The user wants to reply to this tweet:

---
${postText}
---

Generate ${numReplies} different reply options.

For each reply, vary the tone and approach:
- One could add a thoughtful insight or build on the idea
- One could respectfully challenge or offer a different perspective
- One could be supportive/agreeable while adding value

STRICT STYLE RULES (never break these):
- NO emojis ever
- NO "this not that" constructions (e.g. "it's not about X, it's about Y")
- NO quotation marks for emphasis
- NO excessive em dashes (\u2014) or hyphens (-)
- Write like a human talking to a friend. Simple, direct, conversational
- Short sentences. Plain words. No corporate or LinkedIn speak

Each reply should:
- Be under 280 characters
- Sound like a real person, not a content creator
- Not be generic or sycophantic (no "Great point!", "This!", "So true")
- Add genuine value to the conversation
- Be ready to copy-paste

Format as JSON array:
[{"reply": "...", "tone": "...", "why_it_works": "..."}]`

  try {
    const { text, timeSeconds } = await callClaude(prompt, 2048)
    const replies = parseJsonFromResponse(text)

    if (Array.isArray(replies) && replies.length > 0) {
      return { status: 'success', replies, time_seconds: timeSeconds }
    }

    return { status: 'success', replies: [], raw: text, time_seconds: timeSeconds }
  } catch (e: any) {
    return { status: 'error', message: e.message, time_seconds: 0 }
  }
}

// ---------- Breaking News ----------

export interface BreakingNewsItem {
  post: string
  angle: string
  why_it_works: string
}

export interface BreakingNewsResult {
  status: 'success' | 'error'
  posts?: BreakingNewsItem[]
  raw?: string
  message?: string
  time_seconds: number
}

export async function composeBreakingNews(
  newsText: string,
  numOptions = 2
): Promise<BreakingNewsResult> {
  const prompt = `You are writing a breaking news Twitter post. Here is the news:

---
${newsText}
---

Generate ${numOptions} different versions of a breaking news post following this EXACT format and style:

EXAMPLE (study this carefully):
${BREAKING_NEWS_EXAMPLE}

FORMAT RULES:
1. Start with "\u{1F6A8} Breaking news: [one line headline]"
2. Second paragraph: a personal observation, hot take, or witty comment about the news
3. Middle paragraphs: key facts, names, numbers, context. Keep it informative but punchy
4. Final paragraph: a bigger picture take or witty closer that makes people want to share

STYLE RULES:
- Write like you're telling a friend something wild that just happened
- Be conversational, opinionated, add personality
- Include specific details (names, numbers, facts) from the news
- The closer should be memorable, funny, or thought provoking
- Keep each paragraph short, 1-2 sentences max
- The \u{1F6A8} emoji on the first line is the ONLY emoji allowed
- NO "this not that" constructions
- NO quotation marks for emphasis
- NO excessive em dashes or hyphens
- Simple words, human voice

Format as JSON array:
[{"post": "...", "angle": "...", "why_it_works": "..."}]`

  try {
    const { text, timeSeconds } = await callClaude(prompt, 4096)
    const posts = parseJsonFromResponse(text)

    if (Array.isArray(posts) && posts.length > 0) {
      return { status: 'success', posts, time_seconds: timeSeconds }
    }

    return { status: 'success', posts: [], raw: text, time_seconds: timeSeconds }
  } catch (e: any) {
    return { status: 'error', message: e.message, time_seconds: 0 }
  }
}
