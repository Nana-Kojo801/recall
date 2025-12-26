import { Skeleton } from '@/components/ui/skeleton'

export function FlashcardViewerSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
      {/* Card Container with 3D perspective */}
      <div className="relative perspective-1000">
        {/* Ambient glow background */}
        <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-3xl blur-2xl sm:blur-3xl -z-10 opacity-60" />

        {/* Main Card Surface */}
        <div className="relative bg-card border border-border/50 rounded-xl sm:rounded-2xl overflow-hidden">
          {/* Status indicator bar */}
          <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />

          {/* Card Header */}
          <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-border/30 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Skeleton className="w-1.5 h-1.5 rounded-full" />
                <Skeleton className="h-3 w-16" />
              </div>
              <div className="flex items-center gap-1">
                <Skeleton className="h-7 w-7 rounded-md" />
                <Skeleton className="h-7 w-7 rounded-md" />
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="px-4 sm:px-6 py-12 sm:py-16 min-h-[280px] sm:min-h-[320px] flex flex-col items-center justify-center gap-4">
            <Skeleton className="h-8 w-[80%] max-w-[400px]" />
            <Skeleton className="h-8 w-[60%] max-w-[300px]" />
          </div>

          {/* Card Footer */}
          <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-3 sm:pt-4 border-t border-border/30">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-4 rounded-full" />
              <Skeleton className="h-4 w-40" />
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 sm:mt-6 flex flex-col items-center gap-4">
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton
                key={i}
                className={`h-1.5 rounded-full ${i === 1 ? 'w-8' : 'w-1.5'}`}
              />
            ))}
          </div>

          <Skeleton className="h-8 w-24 rounded-lg" />
        </div>

        {/* Queue info */}
        <div className="mt-3 sm:mt-4 flex justify-center">
          <Skeleton className="h-4 w-64" />
        </div>
      </div>
    </div>
  )
}
