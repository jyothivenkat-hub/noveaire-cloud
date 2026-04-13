'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { PenTool, Newspaper, MessageSquare, Layers, Copy, Check, Clock } from 'lucide-react'
import { Card } from '@/components/Card'
import { api } from '@/api/client'

type ComposeTool = 'breaking' | 'research' | 'reply'

interface ToolConfig {
  id: ComposeTool
  label: string
  icon: any
  placeholder: string
  description: string
}

const tools: ToolConfig[] = [
  {
    id: 'breaking',
    label: 'Breaking News',
    icon: Newspaper,
    placeholder: 'Paste the breaking news or event details...',
    description: 'Generate post angles for breaking news',
  },
  {
    id: 'research',
    label: 'Research Thread',
    icon: Layers,
    placeholder: 'Paste your research notes or article...',
    description: 'Synthesize research into a content thread',
  },
  {
    id: 'reply',
    label: 'Reply Ideas',
    icon: MessageSquare,
    placeholder: 'Paste the post you want to reply to...',
    description: 'Generate thoughtful reply options',
  },
]

export default function ComposePage() {
  const [activeTool, setActiveTool] = useState<ComposeTool>('breaking')
  const [input, setInput] = useState('')
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const currentTool = tools.find((t) => t.id === activeTool)!

  const handleSubmit = async () => {
    if (!input.trim()) return
    setLoading(true)
    setError(null)
    setResults(null)

    try {
      let response
      switch (activeTool) {
        case 'breaking':
          response = await api.composeBreakingNews(input)
          break
        case 'research':
          response = await api.synthesizeResearch(input)
          break
        case 'reply':
          response = await api.generateReplies(input)
          break
      }
      setResults(response)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const getResultItems = (): any[] => {
    if (!results) return []
    return results.thread || results.replies || results.posts || []
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-8">
        <h2 className="text-2xl font-light tracking-tight">Compose</h2>
        <p className="text-white/40 text-sm mt-1">AI-powered content creation tools</p>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-8">
        {tools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => { setActiveTool(tool.id); setResults(null); setError(null) }}
            className={`p-4 rounded-lg border text-left transition-all duration-200 ${
              activeTool === tool.id
                ? 'border-accent/40 bg-accent/[0.05]'
                : 'border-white/[0.06] hover:border-white/10 bg-white/[0.02]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <tool.icon className={`w-4 h-4 ${activeTool === tool.id ? 'text-accent' : 'text-white/30'}`} />
              <span className="text-sm font-medium">{tool.label}</span>
            </div>
            <p className="text-xs text-white/30">{tool.description}</p>
          </button>
        ))}
      </div>

      <Card className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <PenTool className="w-4 h-4 text-accent/60" />
          <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">{currentTool.label}</h3>
        </div>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={currentTool.placeholder}
          className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-accent/30 resize-none h-36 mb-4"
        />

        <button
          onClick={handleSubmit}
          disabled={loading || !input.trim()}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent/10 text-accent rounded-lg text-sm hover:bg-accent/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <currentTool.icon className="w-4 h-4" />
              Generate
            </>
          )}
        </button>
      </Card>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      {results && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Results</h3>
            {results.time_seconds && (
              <span className="text-xs text-white/30 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {results.time_seconds.toFixed(1)}s
              </span>
            )}
          </div>

          <div className="space-y-4">
            {getResultItems().map((item: any, i: number) => {
              const text = typeof item === 'string'
                ? item
                : item.tweet || item.text || item.reply || item.content || JSON.stringify(item)
              const label = item.label || item.type || item.angle || null

              return (
                <Card key={i} className="!p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {label && (
                        <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent/70 mb-2">{label}</span>
                      )}
                      <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{text}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(text, i)}
                      className="flex-shrink-0 p-2 rounded-lg hover:bg-white/[0.05] transition-colors"
                    >
                      {copiedIndex === i ? (
                        <Check className="w-4 h-4 text-accent" />
                      ) : (
                        <Copy className="w-4 h-4 text-white/30" />
                      )}
                    </button>
                  </div>
                </Card>
              )
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
