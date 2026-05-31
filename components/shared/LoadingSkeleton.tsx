import { cn } from '@/lib/utils'

function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-white/[0.06] rounded-xl', className)} />
}

export function KPICardSkeleton() {
  return (
    <div className="glass-card p-5 space-y-3">
      <div className="flex justify-between">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-8 w-8 rounded-lg" />
      </div>
      <SkeletonBlock className="h-8 w-32" />
      <SkeletonBlock className="h-3 w-16" />
    </div>
  )
}

export function ChartSkeleton() {
  return (
    <div className="glass-card p-6 space-y-4">
      <SkeletonBlock className="h-5 w-40" />
      <SkeletonBlock className="h-[300px] w-full rounded-xl" />
    </div>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="glass-card p-6 space-y-3">
      <SkeletonBlock className="h-5 w-40 mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <SkeletonBlock className="h-8 w-8 rounded-lg flex-shrink-0" />
          <SkeletonBlock className="h-8 flex-1" />
          <SkeletonBlock className="h-8 w-16" />
          <SkeletonBlock className="h-8 w-16" />
          <SkeletonBlock className="h-8 w-16" />
        </div>
      ))}
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="glass-card p-6">
      <div className="flex items-start gap-6">
        <SkeletonBlock className="h-20 w-20 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-3">
          <SkeletonBlock className="h-6 w-48" />
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-16 w-full" />
          <div className="flex gap-4">
            <SkeletonBlock className="h-8 w-24" />
            <SkeletonBlock className="h-8 w-24" />
            <SkeletonBlock className="h-8 w-24" />
          </div>
        </div>
      </div>
    </div>
  )
}
