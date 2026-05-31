import { Platform } from '@/types/analytics'
import { Youtube, Instagram, Twitter, Linkedin, Video } from 'lucide-react'

export function PlatformBadge({ platform }: { platform: Platform }) {
  const config = {
    youtube: { icon: Youtube, className: 'platform-badge-youtube', label: 'YouTube' },
    instagram: { icon: Instagram, className: 'platform-badge-instagram', label: 'Instagram' },
    twitter: { icon: Twitter, className: 'platform-badge-twitter', label: 'Twitter' },
    tiktok: { icon: Video, className: 'platform-badge-tiktok', label: 'TikTok' },
    linkedin: { icon: Linkedin, className: 'platform-badge-linkedin', label: 'LinkedIn' },
  }
  
  const selected = config[platform] || { icon: Video, className: 'bg-gray-500/20 text-gray-400', label: platform }
  const Icon = selected.icon

  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${selected.className}`}>
      <Icon className="w-3.5 h-3.5" />
      {selected.label}
    </div>
  )
}
