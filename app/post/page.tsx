'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/shared/Navbar'
import URLInputCard from '@/components/dashboard/URLInputCard'
import AnalysisPipeline from '@/components/shared/AnalysisPipeline'
import { AnalysisResults } from '@/components/dashboard/AnalysisResults'
import { useJobPoller } from '@/hooks/useJobPoller'
import { submitPostAnalysis } from '@/lib/api'
import { PostAnalysisResult } from '@/types/analytics'
import { useToast } from '@/components/ui/use-toast'

export default function PostAnalysisPage() {
  const { status, isPolling, startPolling } = useJobPoller()
  const [result, setResult] = useState<PostAnalysisResult | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (url: string, type: 'post' | 'profile', timeframe: string) => {
    if (type !== 'post') return;
    setResult(null)
    try {
      const job = await submitPostAnalysis(url, timeframe)
      startPolling(job.job_id)
    } catch (e: any) {
      toast({ title: 'Submission Failed', description: e.message, variant: 'destructive' })
    }
  }

  useEffect(() => {
    if (status?.status === 'completed' && status.result) {
      setResult(status.result)
      const saved = JSON.parse(localStorage.getItem('recent_jobs') || '[]')
      localStorage.setItem('recent_jobs', JSON.stringify([{id: status.job_id, date: new Date().toISOString()}, ...saved].slice(0, 5)))
    }
    if (status?.status === 'failed') {
      toast({ title: 'Analysis Failed', description: status.error || 'Unknown error', variant: 'destructive' })
    }
  }, [status, toast])

  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text">Post Analysis</h1>
          <p className="text-muted-foreground mt-1">Deep dive into a specific post's performance</p>
        </div>

        {/* We can reuse URLInputCard but force it to post mode in UI, or let user pick. We'll let them pick but it's on the post page */}
        <URLInputCard onSubmit={handleSubmit} isLoading={isPolling} />

        {(isPolling || status) && !result && (
          <div className="mt-6">
            <AnalysisPipeline status={status!} />
          </div>
        )}

        {result && <AnalysisResults result={result} jobId={status?.job_id} />}
      </div>
    </div>
  )
}
