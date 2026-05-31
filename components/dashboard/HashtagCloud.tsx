'use client'

import { motion } from 'framer-motion'
import { Hash } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HashtagCloudProps {
  hashtags: string[]
}

const COLORS = [
  'bg-indigo-500/10 text-indigo-300 border-indigo-500/20 hover:bg-indigo-500/20',
  'bg-cyan-500/10 text-cyan-300 border-cyan-500/20 hover:bg-cyan-500/20',
  'bg-purple-500/10 text-purple-300 border-purple-500/20 hover:bg-purple-500/20',
  'bg-pink-500/10 text-pink-300 border-pink-500/20 hover:bg-pink-500/20',
  'bg-blue-500/10 text-blue-300 border-blue-500/20 hover:bg-blue-500/20',
]

const SIZES = ['text-lg font-semibold', 'text-base font-semibold', 'text-sm font-medium', 'text-xs font-medium', 'text-xs']

export default function HashtagCloud({ hashtags }: HashtagCloudProps) {
  if (!hashtags || hashtags.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
          <Hash className="w-4 h-4 text-purple-400" />
          Hashtags
        </h3>
        <p className="text-white/30 text-sm">No hashtags found</p>
      </div>
    )
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white/70 mb-4 flex items-center gap-2">
        <Hash className="w-4 h-4 text-purple-400" />
        Hashtag Cloud
      </h3>
      <motion.div
        className="flex flex-wrap gap-2"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      >
        {hashtags.map((tag, i) => (
          <motion.span
            key={tag}
            variants={{
              hidden: { opacity: 0, scale: 0.8 },
              visible: { opacity: 1, scale: 1 },
            }}
            whileHover={{ scale: 1.05 }}
            className={cn(
              'px-3 py-1.5 rounded-full border cursor-default transition-all duration-200',
              COLORS[i % COLORS.length],
              SIZES[Math.min(i, SIZES.length - 1)]
            )}
          >
            #{tag.replace(/^#/, '')}
          </motion.span>
        ))}
      </motion.div>
    </div>
  )
}
