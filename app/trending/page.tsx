'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/shared/Navbar'
import { getTrending } from '@/lib/api'
import { PlatformBadge } from '@/components/dashboard/PlatformBadge'
import { TrendingUp, Hash, Flame, RefreshCw } from 'lucide-react'

export default function TrendingPage() {
  const [data, setData] = useState<{ hashtags: any[], viral_posts: any[] } | null>(null)
  const [loading, setLoading] = useState(true)
  const [platform, setPlatform] = useState<string>('')

  const fetchTrending = async () => {
    setLoading(true)
    try {
      const res = await getTrending(platform)
      setData(res)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTrending()
  }, [platform])

  return (
    <div className="min-h-screen bg-navy-900">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold gradient-text flex items-center gap-3">
              <Flame className="w-8 h-8 text-orange-500" /> Trending Insights
            </h1>
            <p className="text-muted-foreground mt-1">Discover viral content and trending topics across platforms</p>
          </div>
          <button onClick={fetchTrending} disabled={loading} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors disabled:opacity-50">
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Platform Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[{ id: '', label: 'All Platforms' }, { id: 'youtube', label: 'YouTube' }, { id: 'instagram', label: 'Instagram' }, { id: 'tiktok', label: 'TikTok' }, { id: 'twitter', label: 'Twitter' }].map(p => (
            <button
              key={p.id}
              onClick={() => setPlatform(p.id)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${platform === p.id ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {loading && !data ? (
          <div className="h-64 flex items-center justify-center text-gray-500">Loading trends...</div>
        ) : data ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Trending Hashtags */}
            <div className="lg:col-span-1">
              <div className="glass-card p-6 h-full">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <Hash className="w-5 h-5 text-indigo-400" /> Top Hashtags
                </h3>
                <div className="space-y-4">
                  {data.hashtags.map((tag, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5 hover:border-indigo-500/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-gray-500 font-mono w-4">{i + 1}</span>
                        <span className="font-semibold text-indigo-300">{tag.hashtag}</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium">{tag.count} posts</div>
                        <div className="text-xs text-green-400">{tag.avg_engagement.toFixed(1)}% ER</div>
                      </div>
                    </div>
                  ))}
                  {data.hashtags.length === 0 && <p className="text-gray-500 text-center py-4">No trending hashtags found.</p>}
                </div>
              </div>
            </div>

            {/* Viral Posts */}
            <div className="lg:col-span-2">
              <div className="glass-card p-6 h-full">
                <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-cyan-400" /> Viral Content
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.viral_posts.map((post, i) => (
                    <a key={i} href={post.url} target="_blank" rel="noreferrer" className="block group">
                      <div className="bg-black/20 rounded-xl border border-white/5 p-4 hover:border-cyan-500/30 transition-colors h-full flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                          <PlatformBadge platform={post.platform} />
                          <div className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2 py-1 rounded">
                            🔥 {post.virality_score}
                          </div>
                        </div>
                        <h4 className="font-medium text-gray-200 line-clamp-2 mb-3 group-hover:text-cyan-300 transition-colors">{post.title || 'Untitled Post'}</h4>
                        <div className="mt-auto text-sm text-gray-400">
                          {post.views.toLocaleString()} views
                        </div>
                      </div>
                    </a>
                  ))}
                  {data.viral_posts.length === 0 && <p className="text-gray-500 text-center py-4 col-span-2">No viral posts found in this timeframe.</p>}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
