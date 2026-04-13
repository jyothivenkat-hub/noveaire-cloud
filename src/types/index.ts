// Types matching API response shapes

export interface Upload {
  id: number
  filename: string | null
  uploaded_at: string | null
  row_count: number | null
}

export interface AnalysisSummary {
  total_posts: number
  total_impressions: number
  avg_impressions: number
  total_likes: number
  avg_likes: number
  total_follows: number
  avg_follows: number
}

export interface PostTypeStats {
  count: number
  avg_impressions: number
  avg_likes: number
  avg_follows: number
}

export interface FeatureStats {
  with: { count: number; avg_impressions: number; avg_likes: number }
  without: { count: number; avg_impressions: number; avg_likes: number }
  multiplier: number
}

export interface DayOfWeekStats {
  posts: number
  avg_impressions: number
  avg_likes: number
  avg_follows: number
}

export interface TextLengthStats {
  count: number
  avg_impressions: number
}

export interface TopPost {
  'Post text': string
  Impressions: number
  Likes: number
  'New follows': number
  Engagements: number
  post_type: string
}

export interface AnalysisResults {
  summary: AnalysisSummary
  post_type_breakdown: Record<string, PostTypeStats>
  top_by_impressions: TopPost[]
  top_by_follows: TopPost[]
  day_of_week: Record<string, DayOfWeekStats>
  feature_analysis: Record<string, FeatureStats>
  text_length: Record<string, TextLengthStats>
}

export interface Suggestion {
  id: number
  upload_id: number | null
  tweet_text: string | null
  strategy: string | null
  reasoning: string | null
  target_metric: string | null
  created_at: string | null
  used: number | null
}

export interface ExperimentDefinition {
  name: string
  description: string
}

export interface Experiment {
  id: number
  name: string
  description: string
  created_at: string | null
  time_seconds: number | null
  data: any
  raw: string
}

// API response types
export interface StatsResponse {
  upload: Upload | null
  analysis: AnalysisResults | null
  experiments: Experiment[]
  suggestions: Suggestion[]
}

export interface UploadResponse {
  status: string
  upload_id: number
  row_count: number
  error?: string
}

export interface AnalysisResponse {
  analysis: AnalysisResults
  upload: Upload
  error?: string
}

export interface ExperimentsResponse {
  experiment_list: ExperimentDefinition[]
  past_experiments: Experiment[]
  upload: Upload | null
}

export interface SuggestionsResponse {
  suggestions: Suggestion[]
  upload: Upload | null
}

export interface GenerateSuggestionsResponse {
  status: string
  suggestions: any[]
  time_seconds: number
  error?: string
}

export interface ComposeResponse {
  status: string
  thread?: any[]
  replies?: any[]
  posts?: any[]
  time_seconds: number
  error?: string
}

export interface ExperimentRunResponse {
  results: any[]
}
