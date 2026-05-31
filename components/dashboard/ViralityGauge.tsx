'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'

interface ViralityGaugeProps {
  score: number
}

function getColor(score: number): string {
  if (score < 30) return '#ef4444' // red
  if (score < 60) return '#f59e0b' // amber
  if (score < 80) return '#22c55e' // green
  return '#6366f1' // indigo for viral
}

function getLabel(score: number): string {
  if (score < 20) return 'Low'
  if (score < 40) return 'Below Average'
  if (score < 60) return 'Average'
  if (score < 80) return 'High'
  return 'Viral! 🔥'
}

function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const x1 = cx + r * Math.cos(toRad(startAngle))
  const y1 = cy + r * Math.sin(toRad(startAngle))
  const x2 = cx + r * Math.cos(toRad(endAngle))
  const y2 = cy + r * Math.sin(toRad(endAngle))
  const largeArc = endAngle - startAngle > 180 ? 1 : 0
  return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`
}

export default function ViralityGauge({ score }: ViralityGaugeProps) {
  const clampedScore = Math.min(100, Math.max(0, score))
  const color = getColor(clampedScore)
  const label = getLabel(clampedScore)

  // SVG params
  const cx = 100, cy = 95, r = 75
  const startAngle = 180
  const totalAngle = 180
  const endAngle = startAngle + (clampedScore / 100) * totalAngle

  const trackPath = describeArc(cx, cy, r, 180, 360)
  const fillPath = describeArc(cx, cy, r, 180, endAngle <= 180 ? 180.01 : endAngle)

  const motionScore = useMotionValue(0)
  const displayScore = useTransform(motionScore, (v) => Math.round(v))

  useEffect(() => {
    const controls = animate(motionScore, clampedScore, { duration: 1.5, ease: 'easeOut' })
    return controls.stop
  }, [clampedScore, motionScore])

  return (
    <div className="glass-card p-6 flex flex-col items-center">
      <h3 className="text-sm font-semibold text-white/70 mb-4">Virality Score</h3>
      <div className="relative">
        <svg width={200} height={120} viewBox="0 0 200 120">
          {/* Track */}
          <path
            d={trackPath}
            fill="none"
            stroke="rgba(255,255,255,0.06)"
            strokeWidth={14}
            strokeLinecap="round"
          />
          {/* Fill arc */}
          <motion.path
            d={fillPath}
            fill="none"
            stroke={color}
            strokeWidth={14}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            style={{
              filter: `drop-shadow(0 0 8px ${color}60)`,
            }}
          />
          {/* Score text */}
          <foreignObject x={50} y={50} width={100} height={60}>
            <div className="flex flex-col items-center justify-center h-full">
              <motion.span
                className="text-2xl font-bold text-white tabular-nums"
                style={{ color }}
              >
                {displayScore}
              </motion.span>
              <span className="text-xs text-white/30 mt-0.5">/100</span>
            </div>
          </foreignObject>
        </svg>
      </div>
      <div
        className="mt-2 px-3 py-1 rounded-full text-xs font-semibold"
        style={{ background: `${color}20`, color, border: `1px solid ${color}40` }}
      >
        {label}
      </div>
    </div>
  )
}
