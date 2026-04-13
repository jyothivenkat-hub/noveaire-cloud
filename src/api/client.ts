import type {
  StatsResponse,
  UploadResponse,
  AnalysisResponse,
  ExperimentsResponse,
  ExperimentRunResponse,
  SuggestionsResponse,
  GenerateSuggestionsResponse,
  ComposeResponse,
} from '@/types'

const API_BASE = '/api'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(error.error || error.message || 'API request failed')
  }
  return res.json()
}

export const api = {
  // Dashboard stats
  getStats: () => request<StatsResponse>('/stats'),

  // Upload CSV
  uploadCSV: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData()
    formData.append('csv_file', file)
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData,
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Upload failed')
    return data
  },

  // Analysis
  getAnalysis: () => request<AnalysisResponse>('/analysis'),

  // Experiments
  getExperiments: () => request<ExperimentsResponse>('/experiments'),
  runExperiments: (experiments: string[], custom_prompt?: string) =>
    request<ExperimentRunResponse>('/experiments/run', {
      method: 'POST',
      body: JSON.stringify({ experiments, custom_prompt }),
    }),

  // Suggestions
  getSuggestions: () => request<SuggestionsResponse>('/suggestions'),
  generateSuggestions: () =>
    request<GenerateSuggestionsResponse>('/suggestions/generate', { method: 'POST' }),
  markSuggestionUsed: (id: number) =>
    request<{ status: string }>(`/suggestions/${id}/used`, { method: 'POST' }),

  // Compose
  synthesizeResearch: (research: string) =>
    request<ComposeResponse>('/compose/synthesize', {
      method: 'POST',
      body: JSON.stringify({ research }),
    }),
  generateReplies: (post: string) =>
    request<ComposeResponse>('/compose/reply', {
      method: 'POST',
      body: JSON.stringify({ post }),
    }),
  composeBreakingNews: (news: string) =>
    request<ComposeResponse>('/compose/breaking', {
      method: 'POST',
      body: JSON.stringify({ news }),
    }),
}
