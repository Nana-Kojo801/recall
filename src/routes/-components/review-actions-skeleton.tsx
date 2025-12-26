import { Skeleton } from '@/components/ui/skeleton'

export function ReviewActionsSkeleton() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {/* Still Learning Button Placeholder */}
        <Skeleton className="h-[90px] sm:h-[110px] flex-1 max-w-[140px] sm:max-w-[180px] rounded-lg sm:rounded-xl" />

        {/* Next Button Placeholder */}
        <Skeleton className="h-[90px] sm:h-[110px] flex-1 max-w-[100px] sm:max-w-[120px] rounded-lg sm:rounded-xl" />

        {/* Known Button Placeholder */}
        <Skeleton className="h-[90px] sm:h-[110px] flex-1 max-w-[140px] sm:max-w-[180px] rounded-lg sm:rounded-xl" />
      </div>

      {/* Keyboard Shortcuts Reference Placeholder */}
      <div className="mt-4 sm:mt-6 flex justify-center">
        <Skeleton className="h-10 w-64 sm:w-80 rounded-lg" />
      </div>

      {/* Session Stats Placeholder */}
      <div className="mt-4 sm:mt-5 flex justify-center gap-4">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  )
}
