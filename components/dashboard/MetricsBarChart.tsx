'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { TopPost } from '@/types/analytics'
import { BarChart2 } from 'lucide-react'
import { truncateText } from '@/lib/utils'

interface MetricsBarChartProps {
  posts: TopPost[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0a0f1e] border border-white/10 rounded-xl p-3 shadow-xl">
      <p className="text-xs text-white/50 mb-2 max-w-[200px] truncate">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.fill }} />
          <span className="text-white/60 capitalize">{entry.name}:</span>
          <span className="text-white font-medium">{entry.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  )
}

export default function MetricsBarChart({ posts }: MetricsBarChartProps) {
  if (!posts || posts.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-cyan-400" />
          Top Posts Metrics
        </h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-white/30 text-sm">No posts data available</p>
        </div>
      </div>
    )
  }

  const chartData = posts.slice(0, 6).map((p) => ({
    name: truncateText(p.title, 20),
    likes: p.likes,
    comments: p.comments,
    views: Math.round(p.views / 1000),
  }))

  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white/70 mb-1 flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-cyan-400" />
        Top Posts Metrics
      </h3>
      <p className="text-xs text-white/30 mb-4">Views shown in thousands (K)</p>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: '#64748b', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#64748b', paddingTop: '12px' }} />
          <Bar dataKey="likes" fill="#6366f1" radius={[4, 4, 0, 0]} />
          <Bar dataKey="comments" fill="#06b6d4" radius={[4, 4, 0, 0]} />
          <Bar dataKey="views" fill="#a855f7" radius={[4, 4, 0, 0]} name="views (K)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
