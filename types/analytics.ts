export type Platform = 'youtube' | 'instagram' | 'twitter' | 'tiktok' | 'linkedin'
export type ContentType = 'video' | 'shorts' | 'reel' | 'post' | 'profile' | 'channel'
export type JobStatus = 'submitted' | 'fetching' | 'processing' | 'analyzing' | 'completed' | 'failed'

export interface PostMetrics {
  views: number
  likes: number
  comments: number
  shares: number
  engagement_rate: number
  virality_score: number
  trend_score: number
}

export interface PostMetadata {
  title: string
  author: string
  author_followers: number
  thumbnail_url: string
  published_at: string
  description: string
  tags: string[]
  hashtags: string[]
}

export interface PostAnalysisResult {
  platform: Platform
  type: ContentType
  url: string
  metadata: PostMetadata
  metrics: PostMetrics
  hashtags: string[]
  insights: string[]
  history: { date: string; engagement_rate: number; views: number }[]
  data_source: string
}

export interface ProfileMetrics {
  followers: number
  following: number | null
  posts_count: number
  avg_engagement_rate: number
  avg_views: number
  posting_frequency: number
  total_views: number
}

export interface TopPost {
  title: string
  url: string
  thumbnail_url: string
  views: number
  likes: number
  comments: number
  engagement_rate: number
  published_at: string
}

export interface ProfileAnalysisResult {
  platform: Platform
  username: string
  display_name: string
  avatar_url: string
  bio: string
  verified: boolean
  metrics: ProfileMetrics
  top_posts: TopPost[]
  insights: string[]
  hashtag_trends: { hashtag: string; count: number }[]
  growth_history: { date: string; followers: number }[]
  data_source: string
}

export interface JobStatusResponse {
  job_id: string
  status: JobStatus
  progress: number
  message: string
  result?: PostAnalysisResult | ProfileAnalysisResult | any
  error?: string
}

export interface TrendingData {
  hashtags: {
    hashtag: string
    count: number
    avg_engagement: number
    platform: Platform
  }[]
  viral_posts: {
    title: string
    url: string
    thumbnail_url: string
    platform: Platform
    virality_score: number
    views: number
    published_at: string
  }[]
}
