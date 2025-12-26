import { Skeleton } from '@/components/ui/skeleton'

export function StatsBarSkeleton() {
  return (
    <div className="w-full border-b border-border/30 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          {/* Left: Deck Stats */}
          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto">
            {/* Total */}
            <div className="flex items-baseline gap-1.5">
              <Skeleton className="h-8 w-10 sm:h-9 sm:w-12" />
              <Skeleton className="h-3 w-8" />
            </div>

            <div className="w-px h-6 sm:h-8 bg-border/50" />

            {/* Known */}
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-1.5">
                <Skeleton className="h-8 w-10 sm:h-9 sm:w-12" />
                <Skeleton className="h-3 w-8" />
              </div>
              <Skeleton className="h-1 w-12 sm:w-14 rounded-full" />
            </div>

            <div className="w-px h-6 sm:h-8 bg-border/50" />

            {/* Learning */}
            <div className="flex flex-col gap-1">
              <div className="flex items-baseline gap-1.5">
                <Skeleton className="h-8 w-10 sm:h-9 sm:w-12" />
                <Skeleton className="h-3 w-12" />
              </div>
              <Skeleton className="h-1 w-12 sm:w-14 rounded-full" />
            </div>
          </div>

          {/* Right: Add Card Button Placeholder */}
          <Skeleton className="h-9 w-24 sm:h-10 sm:w-28 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
