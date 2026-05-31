'use client'

import { PostAnalysisResult, ProfileAnalysisResult } from '@/types/analytics'
import KPICard from './KPICard'
import EngagementChart from './EngagementChart'
import ViralityGauge from './ViralityGauge'
import HashtagCloud from './HashtagCloud'
import { InsightsPanel } from './InsightsPanel'
import TopPostsTable from './TopPostsTable'
import MetricsBarChart from './MetricsBarChart'
import { PlatformBadge } from './PlatformBadge'
import {
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  Users,
  Activity,
} from 'lucide-react'

interface Props {
  result: PostAnalysisResult | ProfileAnalysisResult
  jobId?: string
}

function isPostResult(
  result: PostAnalysisResult | ProfileAnalysisResult
): result is PostAnalysisResult {
  return (
    'type' in result &&
    ['video', 'shorts', 'reel', 'post'].includes(result.type)
  )
}

export function AnalysisResults({ result }: Props) {
  const isPost = isPostResult(result)

  const thumbnail = isPost
    ? result.metadata?.thumbnail_url
    : result.avatar_url

  const title = isPost
    ? result.metadata?.title || 'Untitled Post'
    : result.display_name || result.username

  const subtitle = isPost
    ? result.metadata?.author || ''
    : result.username

  const chartData = isPost
    ? result.history || []
    : result.growth_history || []

  return (
    <div className="mt-8 space-y-8 animate-fade-in">
      {/* Header */}
      <div className="glass-card p-6 flex items-start gap-4">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt="thumbnail"
            className="w-20 h-20 rounded-xl object-cover"
          />
        ) : (
          <div className="w-20 h-20 rounded-xl bg-white/5 flex items-center justify-center">
            <span className="text-2xl">👤</span>
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <PlatformBadge platform={result.platform} />
            <span className="text-sm text-gray-400 capitalize">
              {isPost ? result.type : 'Profile'}
            </span>
          </div>

          <h2 className="text-xl font-bold">{title}</h2>

          {subtitle && (
            <p className="text-gray-400 text-sm mt-1">{subtitle}</p>
          )}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {isPost ? (
          <>
            <KPICard
              title="Views"
              value={result.metrics.views || 0}
              icon={<Eye />}
              color="cyan"
            />
            <KPICard
              title="Likes"
              value={result.metrics.likes || 0}
              icon={<Heart />}
              color="purple"
            />
            <KPICard
              title="Comments"
              value={result.metrics.comments || 0}
              icon={<MessageCircle />}
              color="indigo"
            />
            <KPICard
              title="Engagement Rate"
              value={result.metrics.engagement_rate || 0}
              unit="%"
              icon={<TrendingUp />}
              color="green"
            />
          </>
        ) : (
          <>
            <KPICard
              title="Followers"
              value={result.metrics.followers || 0}
              icon={<Users />}
              color="cyan"
            />
            <KPICard
              title="Avg Views"
              value={result.metrics.avg_views || 0}
              icon={<Eye />}
              color="purple"
            />
            <KPICard
              title="Avg Engagement"
              value={result.metrics.avg_engagement_rate || 0}
              unit="%"
              icon={<Heart />}
              color="indigo"
            />
            <KPICard
              title="Posts / Week"
              value={result.metrics.posting_frequency || 0}
              icon={<Activity />}
              color="green"
            />
          </>
        )}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="text-lg font-semibold mb-4">
            Engagement History
          </h3>

          <EngagementChart
            data={chartData}
            platform={result.platform}
          />
        </div>

        <div className="glass-card p-6 flex flex-col items-center justify-center">
          {isPost ? (
            <ViralityGauge
              score={result.metrics.virality_score || 0}
            />
          ) : (
            <div className="w-full h-full flex flex-col justify-center">
              <h3 className="text-lg font-semibold mb-4">
                Top Performance
              </h3>

              <MetricsBarChart
                posts={result.top_posts || []}
              />
            </div>
          )}
        </div>
      </div>

      {/* Tables & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {!isPost && result.top_posts?.length > 0 && (
            <div className="glass-card p-6">
              <h3 className="text-lg font-semibold mb-4">
                Top Performing Posts
              </h3>

              <TopPostsTable
                posts={result.top_posts}
                platform={result.platform}
              />
            </div>
          )}

          {isPost &&
            result.hashtags &&
            result.hashtags.length > 0 && (
              <div className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Hashtags
                </h3>

                <HashtagCloud
                  hashtags={result.hashtags}
                />
              </div>
            )}
        </div>

        <div className="lg:col-span-1">
          <InsightsPanel
            insights={result.insights || []}
            platform={result.platform}
          />
        </div>
      </div>
    </div>
  )
}