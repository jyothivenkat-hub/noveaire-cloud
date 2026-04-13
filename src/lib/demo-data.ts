/**
 * Demo data for showcase mode.
 * Returns realistic sample data so the app works without any API keys or database.
 */

const DEMO_UPLOAD = {
  id: 1,
  filename: 'demo_analytics.csv',
  uploaded_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  row_count: 142,
}

const DEMO_TOP_POSTS = [
  {
    'Post text': 'Just spent 6 hours debugging a one-line fix. The line was a missing comma. Programming is humbling.',
    Impressions: 284300,
    Likes: 4812,
    'New follows': 89,
    Engagements: 12400,
    post_type: 'original',
  },
  {
    'Post text': 'The best code review feedback I ever got: "This works, but would you be proud to maintain it in 2 years?"',
    Impressions: 198700,
    Likes: 3241,
    'New follows': 67,
    Engagements: 8900,
    post_type: 'original',
  },
  {
    'Post text': 'Hot take: most "AI replacing developers" discourse misses the point. AI is making developers 10x more ambitious, not 10x more replaceable.',
    Impressions: 176200,
    Likes: 2890,
    'New follows': 54,
    Engagements: 7600,
    post_type: 'original',
  },
  {
    'Post text': 'Things I wish someone told me before my first startup:\n\n1. Ship weekly, not monthly\n2. Talk to users before writing code\n3. Revenue > vanity metrics\n4. Your first idea is probably wrong\n5. Burnout kills more startups than competition',
    Impressions: 152400,
    Likes: 2340,
    'New follows': 112,
    Engagements: 6800,
    post_type: 'thread',
  },
  {
    'Post text': 'Built a side project in a weekend that now makes $4k/mo. The secret? I solved my own problem first, then found 200 other people with the same one.',
    Impressions: 134800,
    Likes: 1920,
    'New follows': 78,
    Engagements: 5200,
    post_type: 'original',
  },
  {
    'Post text': 'Underrated programming skill: knowing when NOT to abstract. Three similar functions are better than one over-engineered generic one.',
    Impressions: 112500,
    Likes: 1680,
    'New follows': 41,
    Engagements: 4100,
    post_type: 'original',
  },
  {
    'Post text': 'The gap between a junior and senior developer is not code quality. It is knowing which problems to solve and which to avoid entirely.',
    Impressions: 98200,
    Likes: 1450,
    'New follows': 35,
    Engagements: 3600,
    post_type: 'original',
  },
  {
    'Post text': 'Open source maintainers are the most underappreciated people in tech. They build the foundations, handle the issues, and rarely get credited.',
    Impressions: 87600,
    Likes: 1290,
    'New follows': 28,
    Engagements: 3100,
    post_type: 'original',
  },
  {
    'Post text': 'Replying to a thread about TypeScript — strict mode is not optional if you are working on a team. The 30 min setup saves 30 hours of debugging.',
    Impressions: 72400,
    Likes: 980,
    'New follows': 19,
    Engagements: 2400,
    post_type: 'reply',
  },
  {
    'Post text': 'Weekend project: trained a small language model on my own tweets to see what "AI me" would post. Turns out AI me is funnier but less coherent.',
    Impressions: 64800,
    Likes: 870,
    'New follows': 22,
    Engagements: 2100,
    post_type: 'original',
  },
]

const DEMO_ANALYSIS = {
  summary: {
    total_posts: 142,
    total_impressions: 2_847_000,
    avg_impressions: 20_049,
    total_likes: 38_420,
    avg_likes: 270.6,
    total_follows: 1_240,
    avg_follows: 8.73,
  },
  post_type_breakdown: {
    original: { count: 89, avg_impressions: 24_100, avg_likes: 312.4, avg_follows: 10.2 },
    reply: { count: 38, avg_impressions: 8_400, avg_likes: 98.2, avg_follows: 3.1 },
    thread: { count: 15, avg_impressions: 31_200, avg_likes: 420.8, avg_follows: 18.6 },
  },
  top_by_impressions: DEMO_TOP_POSTS,
  top_by_follows: [...DEMO_TOP_POSTS].sort((a, b) => b['New follows'] - a['New follows']),
  day_of_week: {
    Monday: { posts: 22, avg_impressions: 18_400, avg_likes: 240.1, avg_follows: 7.2 },
    Tuesday: { posts: 24, avg_impressions: 22_800, avg_likes: 298.3, avg_follows: 9.8 },
    Wednesday: { posts: 21, avg_impressions: 19_100, avg_likes: 252.0, avg_follows: 8.1 },
    Thursday: { posts: 20, avg_impressions: 24_600, avg_likes: 320.5, avg_follows: 11.4 },
    Friday: { posts: 18, avg_impressions: 21_300, avg_likes: 278.9, avg_follows: 9.0 },
    Saturday: { posts: 19, avg_impressions: 16_200, avg_likes: 210.4, avg_follows: 6.4 },
    Sunday: { posts: 18, avg_impressions: 14_800, avg_likes: 195.2, avg_follows: 5.8 },
  },
  feature_analysis: {
    Emoji: {
      with: { count: 54, avg_impressions: 26_400, avg_likes: 342 },
      without: { count: 88, avg_impressions: 16_200, avg_likes: 226 },
      multiplier: 1.6,
    },
    Link: {
      with: { count: 28, avg_impressions: 12_800, avg_likes: 164 },
      without: { count: 114, avg_impressions: 21_800, avg_likes: 296 },
      multiplier: 0.6,
    },
    Question: {
      with: { count: 31, avg_impressions: 28_100, avg_likes: 364 },
      without: { count: 111, avg_impressions: 17_800, avg_likes: 244 },
      multiplier: 1.6,
    },
    Numbers: {
      with: { count: 42, avg_impressions: 24_900, avg_likes: 318 },
      without: { count: 100, avg_impressions: 18_000, avg_likes: 250 },
      multiplier: 1.4,
    },
  },
  text_length: {
    'short (< 100)': { count: 34, avg_impressions: 14_200 },
    'medium (100-200)': { count: 62, avg_impressions: 22_800 },
    'long (200-280)': { count: 46, avg_impressions: 21_400 },
  },
}

const DEMO_SUGGESTIONS = [
  {
    id: 1,
    upload_id: 1,
    tweet_text: 'The best engineers I know spend more time reading code than writing it. Understanding existing systems is the real superpower.',
    strategy: 'Insight sharing',
    reasoning: 'Observation-style posts with a contrarian angle perform 1.6x above average in your data. Thursday posting aligns with your highest engagement day.',
    target_metric: 'impressions',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    used: 0,
  },
  {
    id: 2,
    upload_id: 1,
    tweet_text: 'What is the one tool in your dev workflow you could not live without? Mine is a good terminal multiplexer. Changed everything.',
    strategy: 'Engagement driver',
    reasoning: 'Questions drive 1.6x more impressions in your analytics. This format invites replies and comments which boost algorithmic reach.',
    target_metric: 'engagement',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    used: 0,
  },
  {
    id: 3,
    upload_id: 1,
    tweet_text: '3 things that made me mass produce useful projects:\n\n1. Templates for everything\n2. One weekend = one MVP\n3. Only build what I personally need\n\nThe constraint of solving your own problems is incredibly freeing.',
    strategy: 'List format',
    reasoning: 'Numbered lists with personal experience get 1.4x engagement. Multi-part content is your highest performing post type.',
    target_metric: 'follows',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    used: 0,
  },
  {
    id: 4,
    upload_id: 1,
    tweet_text: 'Shipped a feature today that took 45 minutes to build and will save our team 10 hours per week. Automation is not about replacing people, it is about giving them their time back.',
    strategy: 'Story + insight',
    reasoning: 'Personal stories with concrete numbers perform well. Combining narrative with a takeaway matches your top-performing original posts.',
    target_metric: 'impressions',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    used: 0,
  },
  {
    id: 5,
    upload_id: 1,
    tweet_text: 'Unpopular opinion: most developer productivity tools are productivity theater. The real bottleneck is almost always unclear requirements, not slow typing.',
    strategy: 'Contrarian take',
    reasoning: 'Hot takes and contrarian opinions drive high engagement in your analytics. Posts with "unpopular opinion" framing tend to get 2x comment rates.',
    target_metric: 'engagement',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    used: 0,
  },
]

const DEMO_EXPERIMENTS = [
  {
    id: 1,
    name: 'original_post_topics',
    description: 'Generate original posts on trending AI topics',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    time_seconds: 4.2,
    data: [
      { tweet: 'Everyone is building AI wrappers. The real opportunity is building the picks and shovels — the infrastructure layer that every AI app needs.', reasoning: 'Contrarian framing + specific insight. Matches your top post patterns.', predicted_metric: 'impressions', confidence: 'high' },
      { tweet: 'I asked an AI to review my code. It found 3 bugs. Then I asked it to fix them. It introduced 5 new ones. We are not there yet, but we are getting closer.', reasoning: 'Humorous personal anecdote with numbers. Debugging stories resonate with your audience.', predicted_metric: 'engagement', confidence: 'high' },
      { tweet: 'The best way to learn a new framework: build something you have already built before. You already know the requirements, so you can focus on the new tool.', reasoning: 'Practical advice format. Actionable tips get high bookmark rates.', predicted_metric: 'follows', confidence: 'medium' },
    ],
    raw: '',
  },
  {
    id: 2,
    name: 'engagement_hooks',
    description: 'Test different hook styles',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    time_seconds: 3.8,
    data: [
      { strategy: 'Pattern interrupt', description: 'Open with something unexpected that breaks the scroll', example: 'I mass delete code on Fridays. Not as a ritual — I just write better code on Monday mornings when there is less to maintain.' },
      { strategy: 'Specific number', description: 'Lead with a concrete number or stat', example: '142 days of consistent shipping later: 12 projects launched, 3 profitable, 1 that changed my career trajectory.' },
      { strategy: 'Relatable frustration', description: 'Name a pain point your audience shares', example: 'Nothing humbles you faster than reading code you wrote 6 months ago and having zero idea what it does.' },
    ],
    raw: '',
  },
  {
    id: 3,
    name: 'reply_strategies',
    description: 'Reply templates for big accounts',
    created_at: new Date(Date.now() - 259200000).toISOString(),
    time_seconds: 3.1,
    data: [
      { strategy: 'Add context', description: 'Expand on the original post with personal experience', example: 'This matches what I saw building [project] — the counterintuitive part was that simpler architectures outperformed by 3x.' },
      { strategy: 'Respectful disagreement', description: 'Offer a nuanced counterpoint', example: 'Interesting take. In my experience the opposite is true for [specific case] because [reason]. Would love to hear if you have seen that too.' },
    ],
    raw: '',
  },
]

// --- Exported response shapes matching the API contracts ---

export const demoStatsResponse = {
  upload: DEMO_UPLOAD,
  analysis: DEMO_ANALYSIS,
  experiments: DEMO_EXPERIMENTS.slice(0, 2).map((e) => ({
    ...e,
    raw: JSON.stringify(e.data),
  })),
  suggestions: DEMO_SUGGESTIONS.slice(0, 3),
}

export const demoAnalysisResponse = {
  analysis: DEMO_ANALYSIS,
  upload: DEMO_UPLOAD,
}

export const demoExperimentsResponse = (experimentList: { name: string; description: string }[]) => ({
  experiment_list: experimentList,
  past_experiments: DEMO_EXPERIMENTS,
  upload: DEMO_UPLOAD,
})

export const demoExperimentRunResponse = {
  results: [
    {
      status: 'success',
      name: 'demo_run',
      description: 'Demo experiment',
      data: [
        { tweet: 'Sometimes the best optimization is deleting code. Removed 400 lines today and the app got faster AND more readable.', reasoning: 'Combines personal story with counter-intuitive insight.', predicted_metric: 'impressions', confidence: 'high' },
        { tweet: 'The 10x developer myth is real — but it is not about typing speed. It is about saying "no" to the wrong features 10x more often.', reasoning: 'Reframes a common debate with a fresh angle.', predicted_metric: 'engagement', confidence: 'medium' },
      ],
      time_seconds: 3.5,
    },
  ],
}

export const demoSuggestionsResponse = {
  suggestions: DEMO_SUGGESTIONS,
  upload: DEMO_UPLOAD,
}

export const demoGenerateSuggestionsResponse = {
  status: 'success',
  suggestions: DEMO_SUGGESTIONS.slice(0, 5),
  time_seconds: 5.2,
}

export const demoComposeBreakingResponse = {
  status: 'success',
  posts: [
    { angle: 'Analysis', text: 'This is bigger than it looks on the surface. Here is why it matters for developers and what to watch for next.', reasoning: 'Positions you as someone who sees deeper implications.' },
    { angle: 'Hot take', text: 'Everyone is calling this a game-changer. Having shipped something similar last year, I think the real impact is more nuanced than the headlines suggest.', reasoning: 'Contrarian but grounded in experience — your strongest engagement pattern.' },
  ],
  time_seconds: 3.1,
}

export const demoComposeSynthesizeResponse = {
  status: 'success',
  thread: [
    { label: 'Hook', text: 'I spent the last month researching this topic and the findings surprised me. A thread on what I learned and what it means for builders.' },
    { label: 'Setup', text: 'The conventional wisdom says X. But when you look at the actual data, the picture is very different.' },
    { label: 'Results', text: 'Three key takeaways:\n\n1. The bottleneck is not where you think\n2. Simple solutions outperform complex ones 80% of the time\n3. Most teams over-invest in tooling and under-invest in process' },
    { label: 'Take', text: 'The actionable insight: focus on the fundamentals before chasing the latest framework. The boring solution is usually the right one.' },
  ],
  time_seconds: 4.8,
}

export const demoComposeReplyResponse = {
  status: 'success',
  replies: [
    { type: 'Agree + add', reply: 'This resonates. I have seen the same pattern — the teams that ship fastest are the ones that say no to 90% of feature requests.', reasoning: 'Validates the original while adding personal experience.' },
    { type: 'Expand', reply: 'Great point. One thing I would add: this applies even more at the individual level. Knowing your highest-leverage work and protecting time for it is everything.', reasoning: 'Builds on the idea without contradicting.' },
    { type: 'Question', reply: 'Curious if you have found a good framework for deciding what to say no to? That is always the hardest part for me.', reasoning: 'Invites further conversation and positions you as thoughtful.' },
  ],
  time_seconds: 2.9,
}
