import { useState, useEffect, useCallback, useRef } from 'react'
import { getJobStatus } from '@/lib/api'
import type { JobStatusResponse } from '@/types/analytics'

export function useJobPoller() {
  const [jobId, setJobId] = useState<string | null>(null)
  const [status, setStatus] = useState<JobStatusResponse | null>(null)
  const [isPolling, setIsPolling] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const startPolling = useCallback((id: string) => {
    setJobId(id)
    setIsPolling(true)
    setStatus({ job_id: id, status: 'submitted', progress: 0, message: 'Starting...' })
  }, [])

  const stopPolling = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    setIsPolling(false)
  }, [])

  const reset = useCallback(() => {
    stopPolling()
    setJobId(null)
    setStatus(null)
  }, [stopPolling])

  useEffect(() => {
    if (!jobId || !isPolling) return
    const poll = async () => {
      try {
        const s = await getJobStatus(jobId)
        setStatus(s)
        if (s.status === 'completed' || s.status === 'failed') stopPolling()
      } catch (e) {
        console.error('Polling error:', e)
      }
    }
    poll()
    intervalRef.current = setInterval(poll, 1500)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [jobId, isPolling, stopPolling])

  return { jobId, status, isPolling, startPolling, stopPolling, reset }
}
