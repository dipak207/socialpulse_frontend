'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatNumber } from '@/lib/utils'

type Color = 'indigo' | 'cyan' | 'purple' | 'green' | 'red'

interface KPICardProps {
  title: string
  value: number | string
  unit?: string
  change?: number
  icon: React.ReactNode
  color?: Color
  delay?: number
}

const colorMap: Record<Color, { bg: string; border: string; icon: string; glow: string }> = {
  indigo: {
    bg: 'bg-indigo-500/10',
    border: 'border-t-indigo-500',
    icon: 'bg-indigo-500/20 text-indigo-400',
    glow: 'shadow-[0_0_20px_rgba(99,102,241,0.15)]',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-t-cyan-500',
    icon: 'bg-cyan-500/20 text-cyan-400',
    glow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]',
  },
  purple: {
    bg: 'bg-purple-500/10',
    border: 'border-t-purple-500',
    icon: 'bg-purple-500/20 text-purple-400',
    glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]',
  },
  green: {
    bg: 'bg-green-500/10',
    border: 'border-t-green-500',
    icon: 'bg-green-500/20 text-green-400',
    glow: 'shadow-[0_0_20px_rgba(34,197,94,0.15)]',
  },
  red: {
    bg: 'bg-red-500/10',
    border: 'border-t-red-500',
    icon: 'bg-red-500/20 text-red-400',
    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
  },
}

function useCounter(target: number, duration = 1500) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(start))
      }
    }, 16)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

export default function KPICard({ title, value, unit, change, icon, color = 'indigo', delay = 0 }: KPICardProps) {
  const colors = colorMap[color]
  const isNumber = typeof value === 'number'
  const animatedValue = useCounter(isNumber ? value : 0)
  const displayValue = isNumber ? formatNumber(animatedValue) : value

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      whileHover={{ scale: 1.02, y: -2 }}
      className={cn(
        'glass-card p-5 border-t-2 transition-all duration-300',
        colors.border,
        colors.glow
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-white/50 uppercase tracking-wider">{title}</span>
        <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', colors.icon)}>
          {icon}
        </div>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-white tabular-nums">
          {displayValue}
        </span>
        {unit && <span className="text-sm text-white/40 mb-0.5">{unit}</span>}
      </div>

      {change !== undefined && (
        <div className={cn(
          'flex items-center gap-1 mt-2 text-xs font-medium',
          change > 0 ? 'text-green-400' : change < 0 ? 'text-red-400' : 'text-white/30'
        )}>
          {change > 0 ? (
            <TrendingUp className="w-3 h-3" />
          ) : change < 0 ? (
            <TrendingDown className="w-3 h-3" />
          ) : (
            <Minus className="w-3 h-3" />
          )}
          <span>{Math.abs(change)}% vs last period</span>
        </div>
      )}
    </motion.div>
  )
}
