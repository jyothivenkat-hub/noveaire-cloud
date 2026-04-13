/**
 * Twitter data analysis engine -- returns structured results.
 * TypeScript port of webapp/analysis.py
 *
 * Input: arrays of DbPost objects (snake_case DB fields).
 * Output: identical shapes to the Python version, using the renamed
 *         display-name keys (e.g. "Post text", "Impressions", "New follows").
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface DbPost {
  id: number;
  upload_id: number;
  post_id: string;
  date: string;
  post_text: string;
  post_link: string;
  impressions: number;
  likes: number;
  engagements: number;
  bookmarks: number;
  shares: number;
  new_follows: number;
  replies: number;
  reposts: number;
  profile_visits: number;
  detail_expands: number;
  url_clicks: number;
  hashtag_clicks: number;
  permalink_clicks: number;
}

/** A post after column-rename + feature extraction. */
interface EnrichedPost {
  "Post text": string;
  Impressions: number;
  Likes: number;
  Engagements: number;
  "New follows": number;
  Bookmarks: number;
  Shares: number;
  Replies: number;
  Reposts: number;
  Date: string;
  post_type: "original" | "reply" | "retweet";
  text_length: number;
  word_count: number;
  has_emoji: boolean;
  has_link: boolean;
  has_question: boolean;
  has_numbers: boolean;
  day_of_week: string;
}

export interface SummaryStats {
  total_posts: number;
  total_impressions: number;
  avg_impressions: number;
  total_likes: number;
  avg_likes: number;
  total_follows: number;
  avg_follows: number;
}

export interface TypeBreakdownEntry {
  count: number;
  avg_impressions: number;
  avg_likes: number;
  avg_follows: number;
}

export interface TopByImpressionsEntry {
  "Post text": string;
  Impressions: number;
  Likes: number;
  "New follows": number;
  Engagements: number;
  post_type: string;
}

export interface TopByFollowsEntry {
  "Post text": string;
  Impressions: number;
  Likes: number;
  "New follows": number;
  post_type: string;
}

export interface FeatureGroupStats {
  count: number;
  avg_impressions: number;
  avg_likes: number;
}

export interface FeatureEntry {
  with: FeatureGroupStats;
  without: FeatureGroupStats;
  multiplier: number;
}

export interface TextLengthEntry {
  count: number;
  avg_impressions: number;
}

export interface DayOfWeekEntry {
  posts: number;
  avg_impressions: number;
  avg_likes: number;
  avg_follows: number;
}

export interface AnalysisResults {
  summary: SummaryStats;
  post_type_breakdown: Record<string, TypeBreakdownEntry>;
  top_by_impressions: TopByImpressionsEntry[];
  top_by_follows: TopByFollowsEntry[];
  day_of_week: Record<string, DayOfWeekEntry>;
  feature_analysis: Record<string, FeatureEntry>;
  text_length: Record<string, TextLengthEntry>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const EMOJI_RE =
  /[\u{1F600}-\u{1F9FF}\u{2700}-\u{27BF}\u{1F300}-\u{1F5FF}]/u;
const LINK_RE = /http/i;
const QUESTION_RE = /\?/;
const NUMBERS_RE = /\d+/;

const DAY_ORDER = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

function round(value: number, decimals: number): number {
  if (!isFinite(value)) return 0;
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

/**
 * Parse a date string like "Thu, Feb 13, 2026" (format: "%a, %b %d, %Y")
 * and return the English day-of-week name, or "Unknown" on failure.
 */
function parseDayOfWeek(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Unknown";
    return DAY_ORDER[((d.getDay() + 6) % 7)]; // JS Sunday=0, we want Monday=0
  } catch {
    return "Unknown";
  }
}

/**
 * Return top-N items from an array, sorted descending by a numeric key.
 */
function nLargest<T>(arr: T[], n: number, key: (item: T) => number): T[] {
  return [...arr].sort((a, b) => key(b) - key(a)).slice(0, n);
}

/**
 * Determine which length bucket a text_length falls into.
 * Buckets: <50, 50-100, 100-150, 150-200, 200-280, 280+
 * Matches pd.cut(bins=[0,50,100,150,200,280,1000]) which uses (left, right].
 */
function lengthBucket(len: number): string {
  if (len <= 50) return "<50";
  if (len <= 100) return "50-100";
  if (len <= 150) return "100-150";
  if (len <= 200) return "150-200";
  if (len <= 280) return "200-280";
  return "280+";
}

/**
 * Format a number with thousands separators (like Python's {:,}).
 */
function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

// ---------------------------------------------------------------------------
// classify_post
// ---------------------------------------------------------------------------

export function classifyPost(text: string): "original" | "reply" | "retweet" {
  const t = String(text);
  if (t.startsWith("@")) return "reply";
  if (t.includes("RT @")) return "retweet";
  return "original";
}

// ---------------------------------------------------------------------------
// compute_features  (maps DbPost[] -> EnrichedPost[])
// ---------------------------------------------------------------------------

export function computeFeatures(posts: DbPost[]): EnrichedPost[] {
  return posts.map((p) => {
    const text = String(p.post_text);
    return {
      "Post text": text,
      Impressions: p.impressions,
      Likes: p.likes,
      Engagements: p.engagements,
      "New follows": p.new_follows,
      Bookmarks: p.bookmarks,
      Shares: p.shares,
      Replies: p.replies,
      Reposts: p.reposts,
      Date: p.date,
      post_type: classifyPost(text),
      text_length: text.length,
      word_count: text.split(/\s+/).filter(Boolean).length,
      has_emoji: EMOJI_RE.test(text),
      has_link: LINK_RE.test(text),
      has_question: QUESTION_RE.test(text),
      has_numbers: NUMBERS_RE.test(text),
      day_of_week: parseDayOfWeek(p.date),
    };
  });
}

// ---------------------------------------------------------------------------
// analyze_posts
// ---------------------------------------------------------------------------

export function analyzePosts(posts: DbPost[]): AnalysisResults {
  const df = computeFeatures(posts);

  // ---- Summary ----
  const impressions = df.map((p) => p.Impressions);
  const likes = df.map((p) => p.Likes);
  const follows = df.map((p) => p["New follows"]);

  const summary: SummaryStats = {
    total_posts: df.length,
    total_impressions: sum(impressions),
    avg_impressions: round(mean(impressions), 1),
    total_likes: sum(likes),
    avg_likes: round(mean(likes), 1),
    total_follows: sum(follows),
    avg_follows: round(mean(follows), 2),
  };

  // ---- Post type breakdown ----
  const postTypeBreakdown: Record<string, TypeBreakdownEntry> = {};
  const typeGroups = groupBy(df, (p) => p.post_type);
  for (const [type, group] of Object.entries(typeGroups)) {
    postTypeBreakdown[type] = {
      count: group.length,
      avg_impressions: round(mean(group.map((p) => p.Impressions)), 1),
      avg_likes: round(mean(group.map((p) => p.Likes)), 1),
      avg_follows: round(mean(group.map((p) => p["New follows"])), 1),
    };
  }

  // ---- Top posts by impressions ----
  const topImp = nLargest(df, 10, (p) => p.Impressions);
  const topByImpressions: TopByImpressionsEntry[] = topImp.map((p) => ({
    "Post text": p["Post text"],
    Impressions: p.Impressions,
    Likes: p.Likes,
    "New follows": p["New follows"],
    Engagements: p.Engagements,
    post_type: p.post_type,
  }));

  // ---- Top posts by follows ----
  const topFol = nLargest(df, 10, (p) => p["New follows"]);
  const topByFollows: TopByFollowsEntry[] = topFol.map((p) => ({
    "Post text": p["Post text"],
    Impressions: p.Impressions,
    Likes: p.Likes,
    "New follows": p["New follows"],
    post_type: p.post_type,
  }));

  // ---- Day of week ----
  const dayOfWeek: Record<string, DayOfWeekEntry> = {};
  const hasDayOfWeek =
    df.length > 0 && df[0].day_of_week !== "Unknown";
  if (hasDayOfWeek) {
    const dayGroups = groupBy(df, (p) => p.day_of_week);
    // Iterate in day_order to maintain correct ordering
    for (const day of DAY_ORDER) {
      const group = dayGroups[day];
      if (!group) continue;
      dayOfWeek[day] = {
        posts: group.length,
        avg_impressions: round(mean(group.map((p) => p.Impressions)), 1),
        avg_likes: round(mean(group.map((p) => p.Likes)), 1),
        avg_follows: round(mean(group.map((p) => p["New follows"])), 1),
      };
    }
  }

  // ---- Feature analysis ----
  const featureAnalysis: Record<string, FeatureEntry> = {};
  const featureKeys: (keyof Pick<
    EnrichedPost,
    "has_emoji" | "has_link" | "has_question" | "has_numbers"
  >)[] = ["has_emoji", "has_link", "has_question", "has_numbers"];

  for (const feat of featureKeys) {
    const yes = df.filter((p) => p[feat] === true);
    const no = df.filter((p) => p[feat] === false);
    const label = feat.replace("has_", "").charAt(0).toUpperCase() +
      feat.replace("has_", "").slice(1);

    const withAvgImp =
      yes.length > 0 ? round(mean(yes.map((p) => p.Impressions)), 0) : 0;
    const withoutAvgImp =
      no.length > 0 ? round(mean(no.map((p) => p.Impressions)), 0) : 0;

    featureAnalysis[label] = {
      with: {
        count: yes.length,
        avg_impressions: withAvgImp,
        avg_likes:
          yes.length > 0 ? round(mean(yes.map((p) => p.Likes)), 1) : 0,
      },
      without: {
        count: no.length,
        avg_impressions: withoutAvgImp,
        avg_likes:
          no.length > 0 ? round(mean(no.map((p) => p.Likes)), 1) : 0,
      },
      multiplier:
        withoutAvgImp > 0 ? round(withAvgImp / withoutAvgImp, 1) : 0,
    };
  }

  // ---- Text length buckets ----
  const textLength: Record<string, TextLengthEntry> = {};
  const bucketGroups = groupBy(df, (p) => lengthBucket(p.text_length));
  // Iterate in bucket order to maintain ordering
  const bucketOrder = ["<50", "50-100", "100-150", "150-200", "200-280", "280+"];
  for (const bucket of bucketOrder) {
    const group = bucketGroups[bucket];
    if (!group) continue;
    textLength[bucket] = {
      count: group.length,
      avg_impressions: round(mean(group.map((p) => p.Impressions)), 1),
    };
  }

  return {
    summary,
    post_type_breakdown: postTypeBreakdown,
    top_by_impressions: topByImpressions,
    top_by_follows: topByFollows,
    day_of_week: dayOfWeek,
    feature_analysis: featureAnalysis,
    text_length: textLength,
  };
}

// ---------------------------------------------------------------------------
// build_profile
// ---------------------------------------------------------------------------

export function buildProfile(posts: DbPost[]): string {
  const df = computeFeatures(posts);
  const originals = df.filter((p) => p.post_type === "original");
  const replies = df.filter((p) => p.post_type === "reply");
  const topImp = nLargest(df, 10, (p) => p.Impressions);
  const topFollows = nLargest(df, 10, (p) => p["New follows"]);
  const topLikes = nLargest(df, 10, (p) => p.Likes);

  let profile = `TWITTER PROFILE ANALYSIS
Total posts: ${df.length} (${originals.length} original, ${replies.length} replies)

STATS:
- Originals avg ${Math.round(mean(originals.map((p) => p.Impressions)))} impressions
- Replies avg ${Math.round(mean(replies.map((p) => p.Impressions)))} impressions

TOP 10 BY IMPRESSIONS:
`;

  for (const p of topImp) {
    const text = String(p["Post text"]).slice(0, 120);
    profile += `- ${formatNumber(p.Impressions)} imp | ${p.Likes} likes | ${p["New follows"]} follows | "${text}"\n`;
  }

  profile += "\nTOP 10 BY FOLLOWERS:\n";
  for (const p of topFollows) {
    const text = String(p["Post text"]).slice(0, 120);
    profile += `- ${p["New follows"]} follows | ${formatNumber(p.Impressions)} imp | "${text}"\n`;
  }

  profile += "\nTOP 10 BY LIKES:\n";
  for (const p of topLikes) {
    const text = String(p["Post text"]).slice(0, 120);
    profile += `- ${p.Likes} likes | ${formatNumber(p.Impressions)} imp | "${text}"\n`;
  }

  // Feature analysis
  const featureKeys: (keyof Pick<
    EnrichedPost,
    "has_emoji" | "has_link" | "has_question" | "has_numbers"
  >)[] = ["has_emoji", "has_link", "has_question", "has_numbers"];

  for (const feat of featureKeys) {
    const yesAvg = mean(
      df.filter((p) => p[feat] === true).map((p) => p.Impressions)
    );
    const noAvg = mean(
      df.filter((p) => p[feat] === false).map((p) => p.Impressions)
    );
    const label = feat.replace("has_", "");
    profile += `\n${label}: ${Math.round(yesAvg)} avg imp WITH vs ${Math.round(noAvg)} WITHOUT`;
  }

  // Best day
  const dayGroups = groupBy(df, (p) => p.day_of_week);
  let bestDay = "";
  let bestAvg = -Infinity;
  for (const [day, group] of Object.entries(dayGroups)) {
    if (day === "Unknown") continue;
    const avg = mean(group.map((p) => p.Impressions));
    if (avg > bestAvg) {
      bestAvg = avg;
      bestDay = day;
    }
  }
  if (bestDay) {
    profile += `\n\nBest day: ${bestDay} (${Math.round(bestAvg)} avg impressions)`;
  }

  return profile;
}

// ---------------------------------------------------------------------------
// Utility: groupBy
// ---------------------------------------------------------------------------

function groupBy<T>(arr: T[], keyFn: (item: T) => string): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const item of arr) {
    const key = keyFn(item);
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  }
  return groups;
}
