import { Skeleton } from '@/components/ui/skeleton'

export function DeckSkeleton() {
  return (
    <div className="w-full p-3 sm:p-4 rounded-xl border border-border flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-3 flex-1">
        <Skeleton className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-4 w-[60%] sm:w-[140px]" />
          <Skeleton className="h-3 w-[40%] sm:w-[100px]" />
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Skeleton className="h-8 w-8 rounded-md" />
        <Skeleton className="h-8 w-8 rounded-md" />
      </div>
    </div>
  )
}
