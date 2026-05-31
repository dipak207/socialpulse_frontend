'use client'

import { ProfileAnalysisResult } from '@/types/analytics'
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts'

export function CompareCharts({ profiles, comparison }: { profiles: ProfileAnalysisResult[], comparison: Record<string, number[]> }) {
  const colors = ['#6366f1', '#06b6d4', '#a855f7', '#22c55e']

  const radarData = Object.keys(comparison).map(metric => {
    const item: any = { subject: metric.replace(/_/g, ' ').toUpperCase() }
    profiles.forEach((p, i) => {
      // Normalize values for radar
      const max = Math.max(...comparison[metric], 1)
      item[p.username] = (comparison[metric][i] / max) * 100
    })
    return item
  })

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Relative Strengths</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              {profiles.map((p, i) => (
                <Radar key={p.username} name={p.username} dataKey={p.username} stroke={colors[i%4]} fill={colors[i%4]} fillOpacity={0.3} />
              ))}
              <Legend />
              <Tooltip contentStyle={{ backgroundColor: '#0a0f1e', borderColor: 'rgba(255,255,255,0.1)' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4">Direct Metric Comparison</h3>
        <div className="h-[300px]">
          {/* Note: In a real app we'd map data differently for bar chart, keeping simple here */}
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={radarData}>
              <XAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <YAxis tick={{ fill: '#94a3b8' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0a0f1e', borderColor: 'rgba(255,255,255,0.1)' }} />
              <Legend />
              {profiles.map((p, i) => (
                <Bar key={p.username} dataKey={p.username} fill={colors[i%4]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
