'use client'

import { useState } from 'react'
import Navbar from '@/components/shared/Navbar'
import AnalysisPipeline from '@/components/shared/AnalysisPipeline'
import { CompareCharts } from '@/components/compare/CompareCharts'
import { PlatformBadge } from '@/components/dashboard/PlatformBadge'
import { useJobPoller } from '@/hooks/useJobPoller'
import { submitCompare } from '@/lib/api'
import { useToast } from '@/components/ui/use-toast'
import { Plus, X, BarChart } from 'lucide-react'

export default function ComparePage() {
  const [urls, setUrls] = useState<string[]>(['', ''])
  const { status, isPolling, startPolling } = useJobPoller()
  const { toast } = useToast()

  const handleAddUrl = () => {
    if (urls.length < 5) setUrls([...urls, ''])
  }

  const handleRemoveUrl = (index: number) => {
    if (urls.length > 2) setUrls(urls.filter((_, i) => i !== index))
  }

  const handleUpdateUrl = (index: number, value: string) => {
    const newUrls = [...urls]
    newUrls[index] = value
    setUrls(newUrls)
  }

  const handleSubmit = async () => {
    const validUrls = urls.filter(u => u.trim() !== '')
    if (validUrls.length < 2) {
      toast({ title: 'Need more URLs', description: 'Please provide at least 2 URLs to compare', variant: 'destructive' })
      return
    }
    try {
      const job = await submitCompare(validUrls, '30d')
      startPolling(job.job_id)
    } catch (e: any) {
      toast({ title: 'Comparison Failed', description: e.message, variant: 'destructive' })
    }
  }

  const result = status?.status === 'completed' ? status.result : null

  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Compare Profiles</h1>
          <p className="text-muted-foreground mt-1">Side-by-side analysis of up to 5 profiles</p>
        </div>

        <div className="glass-card p-6 mb-8">
          <div className="space-y-4">
            {urls.map((url, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder={`Profile URL ${i + 1}`}
                  value={url}
                  onChange={(e) => handleUpdateUrl(i, e.target.value)}
                  className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                {urls.length > 2 && (
                  <button onClick={() => handleRemoveUrl(i)} className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-6">
            <button onClick={handleAddUrl} disabled={urls.length >= 5 || isPolling} className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Profile
            </button>
            <button onClick={handleSubmit} disabled={isPolling} className="btn-primary flex items-center gap-2">
              <BarChart className="w-5 h-5" /> Compare {urls.filter(u=>u.trim()).length} Profiles
            </button>
          </div>
        </div>

        {(isPolling || status) && !result && (
          <div className="mt-6">
            <AnalysisPipeline status={status!} />
          </div>
        )}

        {result && (
          <div className="mt-8 space-y-8 animate-fade-in">
            {/* Winner Insights */}
            <div className="glass-card p-6 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20">
              <h3 className="text-lg font-semibold mb-4 text-indigo-400 flex items-center gap-2">
                <Sparkles className="w-5 h-5" /> Key Findings
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {result.winner_insights.map((insight: string, i: number) => (
                  <div key={i} className="bg-black/20 p-4 rounded-xl border border-white/5">
                    {insight}
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {result.profiles.map((p: any, i: number) => (
                <div key={i} className="glass-card p-5 text-center">
                  {p.avatar_url ? (
                    <img src={p.avatar_url} alt="" className="w-16 h-16 mx-auto rounded-full object-cover mb-3" />
                  ) : (
                    <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center mb-3">👤</div>
                  )}
                  <PlatformBadge platform={p.platform} />
                  <h3 className="font-semibold mt-2">{p.display_name || p.username}</h3>
                  <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                    <div className="bg-black/20 p-2 rounded-lg">
                      <div className="text-gray-400 text-xs">Followers</div>
                      <div className="font-semibold">{p.metrics.followers?.toLocaleString() || 0}</div>
                    </div>
                    <div className="bg-black/20 p-2 rounded-lg">
                      <div className="text-gray-400 text-xs">Engagement</div>
                      <div className="font-semibold">{p.metrics.avg_engagement_rate}%</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <CompareCharts profiles={result.profiles} comparison={result.comparison} />
          </div>
        )}
      </div>
    </div>
  )
}

function Sparkles(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
}
