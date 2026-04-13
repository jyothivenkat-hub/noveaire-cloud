# Noveaire Cloud

Content intelligence platform for social media creators. Upload your analytics from X, LinkedIn, Instagram, Threads, or any platform — get AI-powered insights and generate high-performing content.

## Quick Start

Clone and run — no API keys, database, or accounts needed:

```bash
git clone https://github.com/jyothivenkat-hub/noveaire-cloud.git
cd noveaire-cloud
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **Explore Dashboard** to see the full app with sample data.

## What It Does

- **Upload & Analyze** -- Import your analytics CSV from any platform and get breakdowns of what's working: feature impact, post type performance, day-of-week patterns, top posts
- **AI Experiments** -- Run 7 pre-built experiments (topic ideas, reply strategies, engagement hooks, viral formulas, weekly plans, A/B tests) or write custom prompts against your data
- **Daily Suggestions** -- Get 5 daily post suggestions tailored to your voice, audience, and best-performing patterns
- **Compose Tools** -- AI-assisted content creation for threads, replies, and breaking news posts
- **Multi-Platform** -- Works with data from X/Twitter, LinkedIn, Instagram, Threads, and more

## Supported Platforms

| Platform | How to get your data |
|----------|---------------------|
| X/Twitter | Analytics export (CSV) from analytics.twitter.com |
| LinkedIn | Post analytics export from your LinkedIn page |
| Instagram | Insights export via Meta Business Suite |
| Threads | Export from Meta Business Suite |
| Other | Any CSV with `Post text`, `Impressions`, and `Likes` columns |

## Tech Stack

- **Framework:** Next.js (App Router), React, TypeScript
- **AI:** Anthropic Claude API (Sonnet)
- **Database:** PostgreSQL (Neon) with Drizzle ORM
- **Styling:** Tailwind CSS, Motion (animations), Lucide (icons)

## Production Setup

To connect real data and AI features, copy the example env file and fill in your keys:

```bash
cp .env.example .env.local
```

You'll need:
- `AUTH_SECRET` -- generate with `openssl rand -base64 32`
- `DATABASE_URL` -- a Neon Postgres connection string
- `ANTHROPIC_API_KEY` -- from the Anthropic Console

When all env vars are configured, the app automatically switches from demo mode to live mode.

## Project Structure

```
src/
  app/           -- Pages and API routes (Next.js App Router)
  lib/           -- Core logic: analysis engine, Claude prompts, auth, DB
    demo-data.ts -- Sample data for demo mode
  components/    -- Reusable UI components
  types/         -- TypeScript interfaces
```
