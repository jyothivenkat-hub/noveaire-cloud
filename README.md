# Noveaire Cloud

Content intelligence platform for X/Twitter creators. Upload your Twitter analytics, get AI-powered insights, and generate high-performing content.

## What It Does

- **Upload & Analyze** -- Import your Twitter analytics CSV and get breakdowns of what's working: feature impact, post type performance, day-of-week patterns, top posts
- **AI Experiments** -- Run 7 pre-built experiments (topic ideas, reply strategies, engagement hooks, viral formulas, weekly plans, A/B tests) or write custom prompts against your data
- **Daily Suggestions** -- Get 5 daily tweet suggestions tailored to your voice, audience, and best-performing patterns
- **Compose Tools** -- AI-assisted content creation for threads, replies, and breaking news posts
- **Auth via X** -- Sign in with your Twitter/X account

## Tech Stack

- **Framework:** Next.js (App Router), React, TypeScript
- **AI:** Anthropic Claude API (Sonnet)
- **Database:** PostgreSQL (Neon) with Drizzle ORM
- **Auth:** NextAuth.js with Twitter OAuth
- **Styling:** Tailwind CSS, Motion (animations), Lucide (icons)

## Getting Started

1. Clone the repo and install dependencies:

```bash
npm install
```

2. Copy the example env file and fill in your keys:

```bash
cp .env.example .env.local
```

You'll need:
- `AUTH_SECRET` -- generate with `openssl rand -base64 32`
- `AUTH_TWITTER_ID` / `AUTH_TWITTER_SECRET` -- from the X Developer Portal
- `DATABASE_URL` -- a Neon Postgres connection string
- `ANTHROPIC_API_KEY` -- from the Anthropic Console

3. Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Project Structure

```
src/
  app/           -- Pages and API routes (Next.js App Router)
  lib/           -- Core logic: analysis engine, Claude prompts, auth, DB
  components/    -- Reusable UI components
  types/         -- TypeScript interfaces
```
