import { DeckSkeleton } from './deck-skeleton'

export function DeckListSkeleton() {
  return (
    <div className="space-y-2 mb-4 sm:mb-6">
      {[1, 2, 3].map((i) => (
        <DeckSkeleton key={i} />
      ))}
    </div>
  )
}
