'use client'

import { motion } from 'framer-motion'
import { Check, Download, Cpu, BarChart2, Sparkles, X, Send } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import type { JobStatusResponse, JobStatus } from '@/types/analytics'
import { cn } from '@/lib/utils'

const STAGES: { key: JobStatus; label: string; icon: React.ReactNode }[] = [
  { key: 'submitted', label: 'Submitted', icon: <Send className="w-4 h-4" /> },
  { key: 'fetching', label: 'Fetching', icon: <Download className="w-4 h-4" /> },
  { key: 'processing', label: 'Processing', icon: <Cpu className="w-4 h-4" /> },
  { key: 'analyzing', label: 'Analyzing', icon: <BarChart2 className="w-4 h-4" /> },
  { key: 'completed', label: 'Complete', icon: <Sparkles className="w-4 h-4" /> },
]

const ORDER: JobStatus[] = ['submitted', 'fetching', 'processing', 'analyzing', 'completed']

function getStageIndex(status: JobStatus) {
  if (status === 'failed') return -1
  return ORDER.indexOf(status)
}

export default function AnalysisPipeline({ status }: { status: JobStatusResponse }) {
  const currentIndex = getStageIndex(status.status)
  const isFailed = status.status === 'failed'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-white/80">Analysis Pipeline</h3>
        <span className="text-xs text-white/40">{status.message}</span>
      </div>

      {/* Steps */}
      <div className="flex items-start justify-between mb-6 overflow-x-auto pb-2">
        {STAGES.map((stage, i) => {
          const isDone = !isFailed && currentIndex > i
          const isActive = !isFailed && currentIndex === i
          const isFail = isFailed

          return (
            <div key={stage.key} className="flex items-center">
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300',
                    isDone && 'bg-green-500/20 border-green-500 text-green-400',
                    isActive &&
                      'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.4)]',
                    !isDone &&
                      !isActive &&
                      !isFail &&
                      'bg-white/[0.03] border-white/10 text-white/20',
                    isFail && i === 0 && 'bg-red-500/20 border-red-500 text-red-400'
                  )}
                >
                  {isDone ? (
                    <Check className="w-4 h-4" />
                  ) : isFail && i === 0 ? (
                    <X className="w-4 h-4" />
                  ) : (
                    stage.icon
                  )}
                </motion.div>
                <span
                  className={cn(
                    'text-xs font-medium whitespace-nowrap',
                    isDone && 'text-green-400',
                    isActive && 'text-indigo-400',
                    !isDone && !isActive && !isFail && 'text-white/20',
                    isFail && 'text-red-400'
                  )}
                >
                  {stage.label}
                </span>
              </div>
              {i < STAGES.length - 1 && (
                <div
                  className={cn(
                    'h-[1px] w-8 sm:w-14 mx-1 mt-[-18px] transition-all duration-500',
                    isDone ? 'bg-green-500/50' : 'bg-white/10'
                  )}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Progress Bar */}
      <Progress
        value={isFailed ? 100 : status.progress || 0}
        className={cn('h-2', isFailed ? '[&>div]:bg-red-500' : '[&>div]:bg-indigo-500')}
      />

      {isFailed && status.error && (
        <p className="mt-3 text-sm text-red-400 bg-red-500/10 rounded-lg p-3">
          Error: {status.error}
        </p>
      )}
    </motion.div>
  )
}
