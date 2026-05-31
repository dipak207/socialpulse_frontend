'use client'

import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, TrendingDown, AlertCircle, Info } from 'lucide-react'

export function InsightsPanel({ insights, platform }: { insights: string[], platform: string }) {
  const getIcon = (text: string) => {
    if (text.includes('🔥') || text.includes('🚀') || text.includes('high') || text.includes('Exceptional')) return <TrendingUp className="w-5 h-5 text-green-400" />
    if (text.includes('⚠️') || text.includes('📉') || text.includes('Low')) return <TrendingDown className="w-5 h-5 text-red-400" />
    if (text.includes('💬') || text.includes('community')) return <Info className="w-5 h-5 text-blue-400" />
    return <Sparkles className="w-5 h-5 text-purple-400" />
  }

  return (
    <div className="glass-card p-6 bg-gradient-to-br from-purple-500/5 to-transparent">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h3 className="text-lg font-semibold gradient-text">AI Insights</h3>
      </div>
      <div className="space-y-3">
        {insights.map((insight, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-3 bg-black/20 p-3 rounded-lg border border-white/5"
          >
            <div className="shrink-0 mt-0.5">{getIcon(insight)}</div>
            <p className="text-sm text-gray-300 leading-relaxed">{insight.replace(/^[🔥✅📊⚠️🚀📈📉💬🎯⭐📣🌱🔍📅🏆]+ /, '')}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
