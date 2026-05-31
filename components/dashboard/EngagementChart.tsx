'use client'

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { format } from 'date-fns'
import { BarChart2 } from 'lucide-react'

interface DataPoint {
  date: string
  engagement_rate: number
  views: number
}

interface EngagementChartProps {
  data: DataPoint[]
  platform: string
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#0a0f1e] border border-white/10 rounded-xl p-3 shadow-xl">
      <p className="text-xs text-white/50 mb-2">{label}</p>
      {payload.map((entry: any) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-white/60 capitalize">{entry.name.replace('_', ' ')}:</span>
          <span className="text-white font-medium">
            {entry.name === 'engagement_rate'
              ? `${entry.value.toFixed(2)}%`
              : entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  )
}

export default function EngagementChart({ data, platform }: EngagementChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-indigo-400" />
          Engagement Over Time
        </h3>
        <div className="h-[300px] flex items-center justify-center">
          <div className="text-center">
            <BarChart2 className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No historical data available</p>
          </div>
        </div>
      </div>
    )
  }

  const formattedData = data.map((d) => ({
    ...d,
    date: (() => {
      try {
        return format(new Date(d.date), 'MMM d')
      } catch {
        return d.date
      }
    })(),
  }))

  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
        <BarChart2 className="w-4 h-4 text-indigo-400" />
        Engagement Over Time
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={formattedData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="gradientEngagement" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradientViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
            width={40}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tick={{ fill: '#64748b', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v)}
            width={50}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '12px', color: '#64748b', paddingTop: '12px' }}
          />
          <Area
            yAxisId="left"
            type="monotone"
            dataKey="engagement_rate"
            stroke="#6366f1"
            strokeWidth={2}
            fill="url(#gradientEngagement)"
            dot={false}
            activeDot={{ r: 4, fill: '#6366f1' }}
          />
          <Area
            yAxisId="right"
            type="monotone"
            dataKey="views"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#gradientViews)"
            dot={false}
            activeDot={{ r: 4, fill: '#06b6d4' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
