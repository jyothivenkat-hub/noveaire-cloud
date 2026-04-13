# Noveaire Cloud

> Content intelligence platform for social media creators.

Upload your analytics from X, LinkedIn, Instagram, Threads, or any platform — get AI-powered insights and generate high-performing content matched to your voice and audience.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjyothivenkat-hub%2Fnoveaire-cloud&project-name=noveaire-cloud&repository-name=noveaire-cloud)

---

## Architecture

```
                         +------------------------------------------+
                         |              Noveaire Cloud               |
                         +------------------------------------------+
                                          |
              +---------------------------+---------------------------+
              |                           |                           |
     +--------v--------+       +---------v---------+       +---------v---------+
     |   Landing Page   |       |     Dashboard      |       |     API Routes     |
     |   (Next.js SSR)  |       |   (React Client)   |       |  (Next.js Edge)    |
     +-----------------+       +-------------------+       +-------------------+
                                          |                           |
              +---------------------------+---------------------------+
              |                           |                           |
     +--------v--------+       +---------v---------+       +---------v---------+
     |  Analysis Engine |       |  Experiment Engine |       |   Compose Engine   |
     |  (TypeScript)    |       |   (Claude API)     |       |   (Claude API)     |
     +-----------------+       +-------------------+       +-------------------+
              |                           |                           |
              +---------------------------+---------------------------+
                                          |
                               +---------v---------+
                               |   PostgreSQL (Neon) |
                               |   via Drizzle ORM   |
                               +-------------------+

     +------------------+
     | Social Platforms  |       CSV Upload
     +------------------+       or API Connect
     | X / Twitter      |  ──>  +-----------+
     | LinkedIn         |  ──>  |  Noveaire |
     | Instagram        |  ──>  |  Ingests  |
     | Threads          |  ──>  +-----------+
     | Any CSV source   |  ──>
     +------------------+
```

### Data Flow

```
 1. UPLOAD        2. ANALYZE         3. AI ENGINE         4. OUTPUT
 +---------+     +------------+     +--------------+     +-------------+
 | CSV from | --> | Feature    | --> | Claude API   | --> | Suggestions |
 | any      |     | extraction |     | generates    |     | Experiments |
 | platform |     | & stats    |     | content from |     | Threads     |
 +---------+     +------------+     | your data    |     | Replies     |
                                     +--------------+     +-------------+
```

---

## What It Does

### Upload & Analyze
Import your analytics CSV from any platform. Noveaire extracts features and calculates performance breakdowns:
- **Feature impact** -- which content features (emoji, links, questions, numbers) drive more impressions
- **Post type breakdown** -- performance by original posts, replies, and threads
- **Day-of-week patterns** -- which days get the most engagement
- **Top posts** -- your highest performing content ranked by impressions and follows

### AI Experiments
Run 7 pre-built experiments against your data or write custom prompts:

| Experiment | What it does |
|-----------|-------------|
| Original Post Topics | Generate post ideas based on your top-performing patterns |
| Reply Strategies | Templates for engaging with large accounts |
| Engagement Hooks | Test 5 different hook styles on your audience |
| Follower Conversion | Posts optimized specifically for follower growth |
| Viral Reply Formulas | Reusable reply templates that drive engagement |
| Weekly Plan | Optimized 7-day posting schedule |
| A/B Test Posts | Variations of your top posts to test what works |

### Daily Suggestions
Get 5 AI-generated post suggestions each day, tailored to your voice, best posting days, and highest-performing content patterns. Each suggestion includes the post text, strategy, reasoning, and target metric.

### Compose Tools
Three AI-powered content creation tools:
- **Breaking News** -- Generate post angles for timely events
- **Research Thread** -- Turn research notes into a multi-part thread
- **Reply Ideas** -- Generate thoughtful reply options for any post

---

## Supported Platforms

| Platform | How to get your data |
|----------|---------------------|
| X / Twitter | Analytics export (CSV) from analytics.twitter.com |
| LinkedIn | Post analytics export from your LinkedIn page |
| Instagram | Insights export via Meta Business Suite |
| Threads | Export from Meta Business Suite |
| Other | Any CSV with `Post text`, `Impressions`, and `Likes` columns |

---

## Download & Install

### Prerequisites
- [Node.js](https://nodejs.org/) 18 or later
- npm (comes with Node.js)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/jyothivenkat-hub/noveaire-cloud.git

# 2. Navigate to the project
cd noveaire-cloud

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and click **Explore Dashboard**.

The app runs in **demo mode** by default with realistic sample data. No API keys, database, or accounts needed.

### Production Setup

To connect real data and AI features:

```bash
cp .env.example .env.local
```

Fill in your keys:

| Variable | Where to get it |
|----------|----------------|
| `AUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `DATABASE_URL` | Free at [neon.tech](https://neon.tech) |
| `ANTHROPIC_API_KEY` | From [console.anthropic.com](https://console.anthropic.com) |

When all env vars are configured, the app automatically switches from demo mode to live mode.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript, React 19 |
| AI | Anthropic Claude API (Sonnet) |
| Database | PostgreSQL (Neon) + Drizzle ORM |
| Styling | Tailwind CSS 4 |
| Animations | Motion |
| Icons | Lucide React |

---

## Project Structure

```
noveaire-cloud/
  src/
    app/
      (auth)/              -- Login page
      (dashboard)/         -- Dashboard, Analysis, Upload, Experiments,
                              Suggestions, Compose pages
      api/                 -- REST API routes (stats, upload, analysis,
                              experiments, suggestions, compose)
    lib/
      analysis.ts          -- Feature extraction & stats engine (pure TS)
      claude.ts            -- Anthropic API wrapper
      experiments.ts       -- 7 pre-built AI experiments
      suggestions.ts       -- Daily suggestion generator
      compose.ts           -- Thread, reply, breaking news generators
      demo-data.ts         -- Sample data for demo mode
      auth.ts              -- Authentication config
      db/
        schema.ts          -- Database schema (Drizzle ORM)
        queries.ts         -- Database query helpers
    components/            -- Sidebar, Card, Stat, NavItem, UserMenu
    types/                 -- TypeScript interfaces
```

---

## License

MIT
