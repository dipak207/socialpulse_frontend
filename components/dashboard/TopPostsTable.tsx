'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ExternalLink, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import type { TopPost } from '@/types/analytics'
import { formatNumber, formatDate, truncateText } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface TopPostsTableProps {
  posts: TopPost[]
  platform: string
}

type SortKey = 'views' | 'likes' | 'comments' | 'engagement_rate' | 'published_at'

const PAGE_SIZE = 5

export default function TopPostsTable({ posts, platform }: TopPostsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>('views')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(0)

  if (!posts || posts.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-sm font-semibold text-white/70 mb-4">Top Posts</h3>
        <p className="text-white/30 text-sm">No posts available</p>
      </div>
    )
  }

  const sorted = [...posts].sort((a, b) => {
    const av = a[sortKey] as number | string
    const bv = b[sortKey] as number | string
    if (typeof av === 'number' && typeof bv === 'number') {
      return sortDir === 'desc' ? bv - av : av - bv
    }
    return sortDir === 'desc'
      ? String(bv).localeCompare(String(av))
      : String(av).localeCompare(String(bv))
  })

  const totalPages = Math.ceil(sorted.length / PAGE_SIZE)
  const paginated = sorted.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'desc' ? 'asc' : 'desc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
    setPage(0)
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <ChevronUp className="w-3 h-3 opacity-20" />
    return sortDir === 'desc' ? (
      <ChevronDown className="w-3 h-3 text-indigo-400" />
    ) : (
      <ChevronUp className="w-3 h-3 text-indigo-400" />
    )
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-semibold text-white/70 mb-4">Top Posts</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-xs text-white/30 font-medium pb-3 pr-4">Post</th>
              {([
                ['views', 'Views'],
                ['likes', 'Likes'],
                ['comments', 'Comments'],
                ['engagement_rate', 'Eng. Rate'],
                ['published_at', 'Published'],
              ] as [SortKey, string][]).map(([key, label]) => (
                <th
                  key={key}
                  className="text-left text-xs text-white/30 font-medium pb-3 pr-3 cursor-pointer hover:text-white/60 transition-colors whitespace-nowrap"
                  onClick={() => toggleSort(key)}
                >
                  <div className="flex items-center gap-1">
                    {label}
                    <SortIcon col={key} />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((post, i) => (
              <tr
                key={i}
                className="border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors group"
              >
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg overflow-hidden bg-white/[0.06] flex-shrink-0">
                      {post.thumbnail_url ? (
                        <img
                          src={post.thumbnail_url}
                          alt={post.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-full h-full bg-indigo-500/20" />
                      )}
                    </div>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white/70 hover:text-white text-xs flex items-center gap-1 max-w-[200px] group-hover:text-indigo-300 transition-colors"
                    >
                      {truncateText(post.title, 40)}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 flex-shrink-0" />
                    </a>
                  </div>
                </td>
                <td className="py-3 pr-3 text-xs text-white/60 tabular-nums">
                  {formatNumber(post.views)}
                </td>
                <td className="py-3 pr-3 text-xs text-white/60 tabular-nums">
                  {formatNumber(post.likes)}
                </td>
                <td className="py-3 pr-3 text-xs text-white/60 tabular-nums">
                  {formatNumber(post.comments)}
                </td>
                <td className="py-3 pr-3">
                  <span
                    className={cn(
                      'text-xs font-medium px-2 py-0.5 rounded-full',
                      post.engagement_rate >= 5
                        ? 'bg-green-500/10 text-green-400'
                        : post.engagement_rate >= 2
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-red-500/10 text-red-400'
                    )}
                  >
                    {post.engagement_rate.toFixed(2)}%
                  </span>
                </td>
                <td className="py-3 pr-3 text-xs text-white/40 whitespace-nowrap">
                  {formatDate(post.published_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/[0.06]">
          <span className="text-xs text-white/30">
            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, sorted.length)} of {sorted.length}
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 0}
              className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page >= totalPages - 1}
              className="p-1.5 rounded-lg text-white/30 hover:text-white hover:bg-white/[0.05] disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
