'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Clipboard, Search, ChevronDown } from 'lucide-react'
import { detectPlatform } from '@/lib/api'
import { PlatformBadge } from './PlatformBadge'
import type { Platform } from '@/types/analytics'
import { cn } from '@/lib/utils'

const EXAMPLE_URLS = [
  { label: 'YouTube Video', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', platform: 'youtube' },
  { label: 'Instagram Reel', url: 'https://www.instagram.com/reel/example123/', platform: 'instagram' },
  { label: 'TikTok Video', url: 'https://www.tiktok.com/@user/video/123456789', platform: 'tiktok' },
  { label: 'Twitter Post', url: 'https://twitter.com/user/status/123456789', platform: 'twitter' },
]

const TIMEFRAMES = ['7d', '30d', '90d'] as const
type Timeframe = (typeof TIMEFRAMES)[number]

interface URLInputCardProps {
  onSubmit: (url: string, type: 'post' | 'profile', timeframe: string) => void
  isLoading: boolean
  lockedType?: 'post' | 'profile'
}

export default function URLInputCard({ onSubmit, isLoading, lockedType }: URLInputCardProps) {
  const [url, setUrl] = useState('')
  const [type, setType] = useState<'post' | 'profile'>(lockedType || 'post')
  const [timeframe, setTimeframe] = useState<Timeframe>('30d')
  const [detectedPlatform, setDetectedPlatform] = useState<Platform | null>(null)
  const [detecting, setDetecting] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (!url || url.length < 10) {
      setDetectedPlatform(null)
      return
    }
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setDetecting(true)
      try {
        const result = await detectPlatform(url)
        setDetectedPlatform(result.platform || null)
      } catch {
        setDetectedPlatform(null)
      } finally {
        setDetecting(false)
      }
    }, 600)
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [url])

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText()
      setUrl(text)
    } catch {
      // Clipboard not available
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim() || isLoading) return
    onSubmit(url.trim(), type, timeframe)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      {/* Gradient border glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-cyan-500/20 blur-xl" />
      <div className="relative glass-card p-6 border border-white/[0.1]">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-white mb-1">Analyze Social Media Content</h2>
          <p className="text-sm text-white/50">Paste any public URL to get deep analytics instantly</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* URL Input */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 focus-within:border-indigo-500/50 transition-all">
              <Search className="w-4 h-4 text-white/30 flex-shrink-0" />
              <input
                id="url-input"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... or Instagram, TikTok, Twitter URL"
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder:text-white/25"
              />
              <button
                type="button"
                onClick={handlePaste}
                className="flex items-center gap-1 text-xs text-white/30 hover:text-indigo-400 transition-colors px-2 py-1 rounded-lg hover:bg-white/[0.04]"
              >
                <Clipboard className="w-3 h-3" />
                Paste
              </button>
            </div>

            {/* Detected Platform Badge */}
            {(detectedPlatform || detecting) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute right-3 -bottom-3"
              >
                {detecting ? (
                  <span className="text-xs text-white/30 bg-[#0a0f1e] px-2 py-1 rounded-full border border-white/10">
                    Detecting...
                  </span>
                ) : detectedPlatform ? (
                  <div className="bg-[#0a0f1e] rounded-full px-1 py-0.5 border border-white/10">
                    <PlatformBadge platform={detectedPlatform} size="sm" />
                  </div>
                ) : null}
              </motion.div>
            )}
          </div>

          {/* Type Selector */}
          {!lockedType && (
            <div className="flex gap-2">
              {(['post', 'profile'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={cn(
                    'flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border',
                    type === t
                      ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-300'
                      : 'bg-white/[0.03] border-white/[0.06] text-white/40 hover:text-white/60 hover:bg-white/[0.05]'
                  )}
                >
                  {t === 'post' ? '📊 Analyze Post' : '👤 Analyze Profile'}
                </button>
              ))}
            </div>
          )}

          {/* Timeframe */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-white/40 whitespace-nowrap">Time range:</span>
            <div className="flex gap-1">
              {TIMEFRAMES.map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setTimeframe(tf)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    timeframe === tf
                      ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-white/30 hover:text-white/50 border border-transparent hover:border-white/10'
                  )}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!url.trim() || isLoading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Search className="w-4 h-4" />
                {type === 'post' ? 'Analyze Post' : 'Analyze Profile'}
              </>
            )}
          </button>
        </form>

        {/* Example URLs */}
        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <p className="text-xs text-white/30 mb-2">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLE_URLS.map((ex) => (
              <button
                key={ex.url}
                type="button"
                onClick={() => setUrl(ex.url)}
                className="text-xs px-3 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-white/40 hover:text-white/70 hover:bg-white/[0.07] transition-all flex items-center gap-1.5"
              >
                <span className={cn(
                  'w-1.5 h-1.5 rounded-full',
                  ex.platform === 'youtube' && 'bg-red-500',
                  ex.platform === 'instagram' && 'bg-pink-500',
                  ex.platform === 'tiktok' && 'bg-cyan-500',
                  ex.platform === 'twitter' && 'bg-blue-500',
                )} />
                {ex.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
