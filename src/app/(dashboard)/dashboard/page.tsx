'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import {
  Eye, Heart, UserPlus, FileText, ArrowRight,
  Upload, BarChart3, FlaskConical, Lightbulb, PenTool,
} from 'lucide-react'
import { Stat } from '@/components/Stat'
import { Card } from '@/components/Card'
import { api } from '@/api/client'
import { formatNumber } from '@/lib/utils'
import type { StatsResponse } from '@/types'

export default function DashboardPage() {
  const [data, setData] = useState<StatsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.getStats()
      .then(setData)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  if (error || !data?.upload || !data?.analysis) {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
        <Upload className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <h2 className="text-xl font-light mb-2">No data yet</h2>
        <p className="text-white/40 mb-6 text-sm">Upload your social media analytics CSV to get started.</p>
        <Link href="/upload" className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent/10 text-accent rounded-lg text-sm hover:bg-accent/20 transition-colors">
          Upload Data <ArrowRight className="w-4 h-4" />
        </Link>
      </motion.div>
    )
  }

  const { analysis, experiments, suggestions } = data
  const { summary } = analysis

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-8">
        <h2 className="text-2xl font-light tracking-tight">Dashboard</h2>
        <p className="text-white/40 text-sm mt-1">
          Noveaire turns your social media analytics into content strategy — upload data from X, LinkedIn, Instagram, Threads, or any platform, see what works, and let AI generate your next posts.
        </p>
      </div>

      <div className="mb-8 p-5 rounded-xl bg-white/[0.02] border border-white/[0.06]">
        <h3 className="text-xs uppercase tracking-[0.15em] text-white/30 mb-4">How to use Noveaire</h3>
        <div className="grid grid-cols-5 gap-3">
          {[
            { step: '01', label: 'Upload', desc: 'Import analytics from any platform', href: '/upload', icon: Upload },
            { step: '02', label: 'Analyze', desc: 'See what drives performance', href: '/analysis', icon: BarChart3 },
            { step: '03', label: 'Experiment', desc: 'Test content strategies with AI', href: '/experiments', icon: FlaskConical },
            { step: '04', label: 'Suggestions', desc: 'Get daily post ideas', href: '/suggestions', icon: Lightbulb },
            { step: '05', label: 'Compose', desc: 'Create threads & replies', href: '/compose', icon: PenTool },
          ].map((item) => (
            <Link key={item.href} href={item.href} className="group p-3 rounded-lg hover:bg-white/[0.04] transition-colors text-center">
              <div className="w-8 h-8 rounded-lg bg-accent/[0.07] border border-accent/10 flex items-center justify-center mx-auto mb-2">
                <item.icon className="w-3.5 h-3.5 text-accent/50 group-hover:text-accent/80 transition-colors" />
              </div>
              <span className="text-[10px] font-mono text-accent/30">{item.step}</span>
              <p className="text-xs font-medium text-white/70 group-hover:text-white/90 transition-colors">{item.label}</p>
              <p className="text-[10px] text-white/25 mt-0.5 leading-tight">{item.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <Stat label="Posts" value={formatNumber(summary.total_posts)} icon={FileText} />
        <Stat label="Impressions" value={formatNumber(summary.total_impressions)} icon={Eye} />
        <Stat label="Likes" value={formatNumber(summary.total_likes)} icon={Heart} />
        <Stat label="Follows" value={formatNumber(summary.total_follows)} icon={UserPlus} />
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <Card>
          <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Top Posts</h3>
          <div className="space-y-3">
            {analysis.top_by_impressions.slice(0, 5).map((post, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]">
                <span className="text-xs text-accent/60 font-mono mt-0.5">{String(i + 1).padStart(2, '0')}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white/80 line-clamp-2">{post['Post text']}</p>
                  <div className="flex gap-4 mt-1.5">
                    <span className="text-xs text-white/30">{formatNumber(post.Impressions)} views</span>
                    <span className="text-xs text-white/30">{formatNumber(post.Likes)} likes</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: '/analysis', label: 'Analysis', icon: BarChart3 },
                { href: '/experiments', label: 'Experiments', icon: FlaskConical },
                { href: '/suggestions', label: 'Suggestions', icon: Lightbulb },
                { href: '/upload', label: 'New Upload', icon: Upload },
              ].map((action) => (
                <Link key={action.href} href={action.href} className="flex items-center gap-2 p-3 rounded-lg bg-white/[0.02] hover:bg-white/[0.06] transition-colors text-sm text-white/60 hover:text-white/90">
                  <action.icon className="w-4 h-4" />
                  {action.label}
                </Link>
              ))}
            </div>
          </Card>

          {suggestions.length > 0 && (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider">Unused Suggestions</h3>
                <Link href="/suggestions" className="text-xs text-accent/60 hover:text-accent">View all</Link>
              </div>
              <div className="space-y-2">
                {suggestions.slice(0, 3).map((s) => (
                  <div key={s.id} className="p-3 rounded-lg bg-white/[0.02]">
                    <p className="text-sm text-white/70 line-clamp-2">{s.tweet_text}</p>
                    <span className="text-xs text-accent/40 mt-1 inline-block">{s.strategy}</span>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </motion.div>
  )
}
