import {
  useSelectedDeckId,
  useSetIsCardModalOpen,
} from '@/stores/app-state-store'
import db from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { StatsBarSkeleton } from './stats-bar-skeleton'

export function StatsBar() {
  const setIsCardModalOpen = useSetIsCardModalOpen()
  const selectedDeckId = useSelectedDeckId()

  const deck = useLiveQuery(() => db.decks.get(selectedDeckId!))
  const cards = useLiveQuery(
    () =>
      db.cards
        .where('deckId')
        .equals(selectedDeckId || '')
        .toArray(),
    [selectedDeckId],
  )

  if (deck === undefined || cards === undefined) {
    return <StatsBarSkeleton />
  }

  const deckStats = {
    totalCards: cards.length,
    knownCards: cards.filter((c) => c.known).length,
  }
  return (
    <div className="w-full border-b border-border/30 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          {/* Left: Deck Stats */}
          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto">
            <div className="group">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tabular-nums text-foreground group-hover:text-primary transition-colors">
                  {deckStats.totalCards}
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Total
                </span>
              </div>
            </div>

            <div className="w-px h-6 sm:h-8 bg-border/50" />

            <div className="group">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tabular-nums text-foreground group-hover:text-primary transition-colors">
                  {deckStats.knownCards}
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Known
                </span>
              </div>
              <div className="mt-1 w-12 sm:w-14 h-0.5 sm:h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-primary rounded-full" />
              </div>
            </div>

            <div className="w-px h-6 sm:h-8 bg-border/50" />

            <div className="group">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tabular-nums text-foreground group-hover:text-primary transition-colors">
                  {deckStats.totalCards - deckStats.knownCards}
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Learning
                </span>
              </div>
              <div className="mt-1 w-12 sm:w-14 h-0.5 sm:h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-orange-500/70 rounded-full" />
              </div>
            </div>
          </div>

          {/* Right: Add Card Button */}
          <button
            onClick={() => setIsCardModalOpen(true)}
            className="group relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-primary text-primary-foreground font-semibold text-xs sm:text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5 self-start sm:self-auto whitespace-nowrap"
          >
            <div className="absolute -inset-0.5 bg-primary/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity blur-md -z-10" />
            <span className="flex items-center gap-1.5">
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:rotate-90 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Card
            </span>
          </button>
        </div>
      </div>
    </div>
  )
}
