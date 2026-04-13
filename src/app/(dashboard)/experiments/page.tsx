'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { FlaskConical, Play, Clock, ChevronDown, ChevronUp } from 'lucide-react'
import { Card } from '@/components/Card'
import { api } from '@/api/client'
import type { ExperimentsResponse, ExperimentDefinition, Experiment } from '@/types'

export default function ExperimentsPage() {
  const [data, setData] = useState<ExperimentsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [customPrompt, setCustomPrompt] = useState('')
  const [running, setRunning] = useState(false)
  const [expandedExp, setExpandedExp] = useState<number | null>(null)

  const fetchData = () => {
    api.getExperiments()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const toggleExperiment = (name: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const handleRun = async () => {
    if (selected.size === 0 && !customPrompt.trim()) return
    setRunning(true)
    setError(null)
    try {
      await api.runExperiments(Array.from(selected), customPrompt || undefined)
      setSelected(new Set())
      setCustomPrompt('')
      setLoading(true)
      fetchData()
    } catch (e: any) {
      setError(e.message)
    } finally {
      setRunning(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-8">
        <h2 className="text-2xl font-light tracking-tight">Experiments</h2>
        <p className="text-white/40 text-sm mt-1">Run AI-powered experiments on your content data</p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
      )}

      <Card className="mb-8">
        <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Select Experiments</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {data?.experiment_list.map((exp: ExperimentDefinition) => (
            <button
              key={exp.name}
              onClick={() => toggleExperiment(exp.name)}
              className={`text-left p-4 rounded-lg border transition-all duration-200 ${
                selected.has(exp.name)
                  ? 'border-accent/40 bg-accent/[0.05]'
                  : 'border-white/[0.06] hover:border-white/10 bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <FlaskConical className={`w-3.5 h-3.5 ${selected.has(exp.name) ? 'text-accent' : 'text-white/30'}`} />
                <span className="text-sm font-medium">{exp.name.replace(/_/g, ' ')}</span>
              </div>
              <p className="text-xs text-white/30">{exp.description}</p>
            </button>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-xs text-white/40 mb-2 uppercase tracking-wider">Custom Experiment (optional)</label>
          <textarea
            value={customPrompt}
            onChange={(e) => setCustomPrompt(e.target.value)}
            placeholder="Describe a custom experiment to run on your data..."
            className="w-full bg-white/[0.03] border border-white/10 rounded-lg px-4 py-3 text-sm text-white/80 placeholder-white/20 focus:outline-none focus:border-accent/30 resize-none h-24"
          />
        </div>

        <button
          onClick={handleRun}
          disabled={running || (selected.size === 0 && !customPrompt.trim())}
          className="flex items-center gap-2 px-5 py-2.5 bg-accent/10 text-accent rounded-lg text-sm hover:bg-accent/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {running ? (
            <>
              <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
              Running...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Run Selected ({selected.size}{customPrompt.trim() ? ' + custom' : ''})
            </>
          )}
        </button>
      </Card>

      {data?.past_experiments && data.past_experiments.length > 0 && (
        <>
          <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Experiment History</h3>
          <div className="space-y-3">
            {data.past_experiments.map((exp: Experiment) => (
              <Card key={exp.id} className="!p-0">
                <button
                  onClick={() => setExpandedExp(expandedExp === exp.id ? null : exp.id)}
                  className="w-full text-left p-4 flex items-center justify-between"
                >
                  <div>
                    <span className="text-sm font-medium">{exp.name.replace(/_/g, ' ')}</span>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-white/30 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {exp.time_seconds?.toFixed(1)}s
                      </span>
                      <span className="text-xs text-white/20">
                        {exp.created_at ? new Date(exp.created_at).toLocaleDateString() : ''}
                      </span>
                    </div>
                  </div>
                  {expandedExp === exp.id ? <ChevronUp className="w-4 h-4 text-white/30" /> : <ChevronDown className="w-4 h-4 text-white/30" />}
                </button>

                <AnimatePresence>
                  {expandedExp === exp.id && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="px-4 pb-4 border-t border-white/[0.06] pt-4">
                        <ExperimentResult data={exp.data} raw={exp.raw} />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            ))}
          </div>
        </>
      )}
    </motion.div>
  )
}

function ExperimentResult({ data, raw }: { data: any; raw: string }) {
  if (!data) {
    return (
      <pre className="text-xs text-white/50 font-mono whitespace-pre-wrap bg-white/[0.02] p-3 rounded-lg overflow-x-auto">
        {raw || 'No data'}
      </pre>
    )
  }

  if (Array.isArray(data)) {
    return (
      <div className="space-y-3">
        {data.map((item: any, i: number) => (
          <div key={i} className="p-3 rounded-lg bg-white/[0.02]">
            {typeof item === 'string' ? (
              <p className="text-sm text-white/70">{item}</p>
            ) : (
              <div>
                {item.topic && <p className="text-sm font-medium mb-1">{item.topic}</p>}
                {item.title && <p className="text-sm font-medium mb-1">{item.title}</p>}
                {item.strategy && <p className="text-sm font-medium mb-1">{item.strategy}</p>}
                {item.description && <p className="text-xs text-white/40">{item.description}</p>}
                {item.explanation && <p className="text-xs text-white/40">{item.explanation}</p>}
                {item.reasoning && <p className="text-xs text-white/40">{item.reasoning}</p>}
                {item.example && <div className="mt-2 p-2 rounded bg-white/[0.03] text-xs text-white/50">{item.example}</div>}
                {item.tweet && <div className="mt-2 p-2 rounded bg-white/[0.03] text-xs text-white/50">{item.tweet}</div>}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  if (typeof data === 'object') {
    return (
      <div className="space-y-3">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="p-3 rounded-lg bg-white/[0.02]">
            <p className="text-xs text-accent/50 uppercase tracking-wider mb-1">{key.replace(/_/g, ' ')}</p>
            {typeof value === 'string' ? (
              <p className="text-sm text-white/70">{value}</p>
            ) : Array.isArray(value) ? (
              <ul className="space-y-1">
                {(value as any[]).map((item, i) => (
                  <li key={i} className="text-sm text-white/60">
                    {typeof item === 'string' ? item : JSON.stringify(item)}
                  </li>
                ))}
              </ul>
            ) : (
              <pre className="text-xs text-white/50 font-mono">{JSON.stringify(value, null, 2)}</pre>
            )}
          </div>
        ))}
      </div>
    )
  }

  return <p className="text-sm text-white/60">{String(data)}</p>
}
