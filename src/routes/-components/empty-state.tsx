import {
  useSetIsDeckSelectorOpen,
} from '@/stores/app-state-store'
import { useLiveQuery } from 'dexie-react-hooks'
import db from '@/lib/db'

export function EmptyState() {
  const setIsDeckSelectorOpen = useSetIsDeckSelectorOpen()

  const decks = useLiveQuery(() => db.decks.toArray())
  const hasDecks = decks && decks.length > 0

  return (
    <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20 bg-background/50">
      <div className="max-w-lg text-center space-y-6 sm:space-y-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Animated Icon with Rings */}
        <div className="relative inline-flex items-center justify-center scale-90 sm:scale-100">
          {/* Animated pulsing rings */}
          <div className="absolute inset-0 w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-primary/5 animate-ping animation-delay-0" />
          <div className="absolute inset-4 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-primary/10 animate-pulse animation-delay-150" />
          <div className="absolute inset-8 w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-primary/15 animate-ping animation-delay-300" />

          {/* Icon container with gradient */}
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary/30 via-primary/15 to-transparent border-2 border-primary/30 flex items-center justify-center backdrop-blur-sm shadow-xl shadow-primary/20">
            <svg
              className="w-8 h-8 sm:w-10 sm:h-10 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
            No Deck Selected
          </h2>
          <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-sm sm:max-w-md mx-auto">
            {hasDecks
              ? 'Your learning journey is waiting. Choose an existing deck to continue or create something new.'
              : 'Ready to start learning? Create your first deck and begin your recall journey today.'}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 pt-2">
          {hasDecks && (
            <button
              onClick={() => setIsDeckSelectorOpen(true)}
              className="group relative w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.03] active:scale-95 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity" />
              <div className="relative flex items-center justify-center gap-2">
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                Select From Your Decks
              </div>
            </button>
          )}
        </div>

        {/* Pro tip */}
        <p className="text-[10px] sm:text-xs text-muted-foreground/50 pt-4 sm:pt-6 font-medium">
          💡 Pro tip: Use{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border inline-flex text-[9px]">
            Space
          </kbd>{' '}
          and{' '}
          <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border inline-flex text-[9px]">
            1-2
          </kbd>{' '}
          for faster reviews
        </p>
      </div>
    </div>
  )
}
