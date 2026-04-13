'use client'

import { useState, useEffect } from 'react'
import { motion } from 'motion/react'
import { Lightbulb, Copy, Check, Sparkles, CheckCircle } from 'lucide-react'
import { Card } from '@/components/Card'
import { api } from '@/api/client'
import type { SuggestionsResponse, Suggestion } from '@/types'

export default function SuggestionsPage() {
  const [data, setData] = useState<SuggestionsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const fetchData = () => {
    api.getSuggestions()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleGenerate = async () => {
    setGenerating(true)
    setError(null)
    try {
      await api.generateSuggestions()
      setLoading(true)
      fetchData()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setGenerating(false)
    }
  }

  const handleCopy = async (text: string, id: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleMarkUsed = async (id: number) => {
    try {
      await api.markSuggestionUsed(id)
      setData((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          suggestions: prev.suggestions.map((s) => s.id === id ? { ...s, used: 1 } : s),
        }
      })
    } catch (e: any) {
      setError(e.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  const suggestions = data?.suggestions || []
  const unused = suggestions.filter((s) => !s.used)
  const used = suggestions.filter((s) => s.used)

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-light tracking-tight">Suggestions</h2>
          <p className="text-white/40 text-sm mt-1">AI-generated tweet suggestions based on your analytics</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent/10 text-accent rounded-lg text-sm hover:bg-accent/20 transition-colors disabled:opacity-30"
        >
          {generating ? (
            <>
              <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate New
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {suggestions.length === 0 ? (
        <div className="text-center py-20">
          <Lightbulb className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-lg font-light mb-2">No suggestions yet</h3>
          <p className="text-white/40 text-sm">Click &quot;Generate New&quot; to create AI-powered tweet suggestions.</p>
        </div>
      ) : (
        <>
          {unused.length > 0 && (
            <>
              <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Ready to Post ({unused.length})</h3>
              <div className="space-y-4 mb-8">
                {unused.map((s: Suggestion) => (
                  <SuggestionCard key={s.id} suggestion={s} copiedId={copiedId} onCopy={handleCopy} onMarkUsed={handleMarkUsed} />
                ))}
              </div>
            </>
          )}

          {used.length > 0 && (
            <>
              <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Previously Posted ({used.length})</h3>
              <div className="space-y-3 opacity-50">
                {used.map((s: Suggestion) => (
                  <Card key={s.id} className="!p-4">
                    <p className="text-sm text-white/50 line-through">{s.tweet_text}</p>
                  </Card>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </motion.div>
  )
}

function SuggestionCard({
  suggestion, copiedId, onCopy, onMarkUsed,
}: {
  suggestion: Suggestion
  copiedId: number | null
  onCopy: (text: string, id: number) => void
  onMarkUsed: (id: number) => void
}) {
  return (
    <Card className="!p-5">
      <p className="text-sm text-white/80 leading-relaxed mb-4">{suggestion.tweet_text}</p>

      <div className="flex items-center gap-3 mb-3">
        {suggestion.strategy && (
          <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent/70">{suggestion.strategy}</span>
        )}
        {suggestion.target_metric && (
          <span className="text-xs px-2 py-1 rounded-full bg-white/[0.05] text-white/40">{suggestion.target_metric}</span>
        )}
      </div>

      {suggestion.reasoning && (
        <p className="text-xs text-white/30 mb-4 italic">{suggestion.reasoning}</p>
      )}

      <div className="flex items-center gap-2">
        <button
          onClick={() => onCopy(suggestion.tweet_text || '', suggestion.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] text-xs text-white/50 hover:text-white/80 hover:bg-white/[0.08] transition-colors"
        >
          {copiedId === suggestion.id ? (
            <><Check className="w-3.5 h-3.5 text-accent" /> Copied</>
          ) : (
            <><Copy className="w-3.5 h-3.5" /> Copy</>
          )}
        </button>
        <button
          onClick={() => onMarkUsed(suggestion.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.05] text-xs text-white/50 hover:text-white/80 hover:bg-white/[0.08] transition-colors"
        >
          <CheckCircle className="w-3.5 h-3.5" /> Mark Posted
        </button>
      </div>
    </Card>
  )
}
