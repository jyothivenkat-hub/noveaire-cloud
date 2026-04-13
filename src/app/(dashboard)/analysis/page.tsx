'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'
import { ArrowRight, Smile, Link2, HelpCircle, Hash, Upload, Eye, Heart, UserPlus, FileText } from 'lucide-react'
import { Card } from '@/components/Card'
import { Stat } from '@/components/Stat'
import { api } from '@/api/client'
import { formatNumber } from '@/lib/utils'
import type { AnalysisResponse } from '@/types'

const featureIcons: Record<string, any> = {
  Emoji: Smile, Link: Link2, Question: HelpCircle, Numbers: Hash,
}

export default function AnalysisPage() {
  const [data, setData] = useState<AnalysisResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.getAnalysis()
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

  if (error || !data) {
    return (
      <div className="text-center py-20">
        <Upload className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <h2 className="text-xl font-light mb-2">No analysis available</h2>
        <p className="text-white/40 mb-6 text-sm">Upload your data first.</p>
        <Link href="/upload" className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent/10 text-accent rounded-lg text-sm hover:bg-accent/20 transition-colors">
          Upload Data <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    )
  }

  const { analysis } = data
  const { summary } = analysis

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <div className="mb-8">
        <h2 className="text-2xl font-light tracking-tight">Analysis</h2>
        <p className="text-white/40 text-sm mt-1">Deep dive into your content performance</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        <Stat label="Posts" value={formatNumber(summary.total_posts)} icon={FileText} />
        <Stat label="Avg Impressions" value={formatNumber(Math.round(summary.avg_impressions))} icon={Eye} />
        <Stat label="Avg Likes" value={summary.avg_likes.toFixed(1)} icon={Heart} />
        <Stat label="Avg Follows" value={summary.avg_follows.toFixed(2)} icon={UserPlus} />
      </div>

      <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Feature Impact</h3>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {Object.entries(analysis.feature_analysis).map(([feature, stats]) => {
          const Icon = featureIcons[feature] || Hash
          const mult = stats.multiplier
          const isPositive = mult > 1

          return (
            <Card key={feature} className="!p-4">
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-accent/60" />
                <span className="text-xs uppercase tracking-wider text-white/40">{feature}</span>
              </div>
              <p className={`text-2xl font-light ${isPositive ? 'text-accent' : 'text-red-400'}`}>{mult.toFixed(1)}x</p>
              <p className="text-xs text-white/30 mt-1">impression multiplier</p>
              <div className="mt-3 text-xs text-white/30 space-y-1">
                <div className="flex justify-between">
                  <span>With:</span>
                  <span>{stats.with.count} posts, {formatNumber(Math.round(stats.with.avg_impressions))} avg</span>
                </div>
                <div className="flex justify-between">
                  <span>Without:</span>
                  <span>{stats.without.count} posts, {formatNumber(Math.round(stats.without.avg_impressions))} avg</span>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Post Type Breakdown</h3>
      <Card className="mb-8">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-white/40 font-medium">Type</th>
                <th className="text-right py-3 px-4 text-xs uppercase tracking-wider text-white/40 font-medium">Count</th>
                <th className="text-right py-3 px-4 text-xs uppercase tracking-wider text-white/40 font-medium">Avg Impressions</th>
                <th className="text-right py-3 px-4 text-xs uppercase tracking-wider text-white/40 font-medium">Avg Likes</th>
                <th className="text-right py-3 px-4 text-xs uppercase tracking-wider text-white/40 font-medium">Avg Follows</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(analysis.post_type_breakdown).map(([type, stats]) => (
                <tr key={type} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="py-3 px-4 capitalize">{type}</td>
                  <td className="py-3 px-4 text-right text-white/60">{stats.count}</td>
                  <td className="py-3 px-4 text-right text-white/60">{formatNumber(Math.round(stats.avg_impressions))}</td>
                  <td className="py-3 px-4 text-right text-white/60">{stats.avg_likes.toFixed(1)}</td>
                  <td className="py-3 px-4 text-right text-white/60">{stats.avg_follows.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {analysis.day_of_week && Object.keys(analysis.day_of_week).length > 0 && (
        <>
          <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Performance by Day</h3>
          <Card className="mb-8">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.06]">
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-wider text-white/40 font-medium">Day</th>
                    <th className="text-right py-3 px-4 text-xs uppercase tracking-wider text-white/40 font-medium">Posts</th>
                    <th className="text-right py-3 px-4 text-xs uppercase tracking-wider text-white/40 font-medium">Avg Impressions</th>
                    <th className="text-right py-3 px-4 text-xs uppercase tracking-wider text-white/40 font-medium">Avg Likes</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(analysis.day_of_week).map(([day, stats]) => (
                    <tr key={day} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                      <td className="py-3 px-4">{day}</td>
                      <td className="py-3 px-4 text-right text-white/60">{stats.posts}</td>
                      <td className="py-3 px-4 text-right text-white/60">{formatNumber(Math.round(stats.avg_impressions))}</td>
                      <td className="py-3 px-4 text-right text-white/60">{stats.avg_likes.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}

      <h3 className="text-sm font-medium text-white/60 mb-4 uppercase tracking-wider">Top Posts by Impressions</h3>
      <div className="space-y-3 mb-8">
        {analysis.top_by_impressions.slice(0, 10).map((post, i) => (
          <Card key={i} className="!p-4">
            <div className="flex items-start gap-3">
              <span className="text-xs text-accent/50 font-mono mt-0.5 w-6 flex-shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/80 mb-2">{post['Post text']}</p>
                <div className="flex gap-4 text-xs text-white/30">
                  <span>{formatNumber(post.Impressions)} impressions</span>
                  <span>{formatNumber(post.Likes)} likes</span>
                  <span>{post['New follows']} follows</span>
                  <span className="text-accent/40">{post.post_type}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </motion.div>
  )
}
