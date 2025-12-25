interface StatsBarProps {
  onAddCardClick: () => void
}

export function StatsBar({ onAddCardClick }: StatsBarProps) {
  return (
    <div className="w-full border-b border-border/30 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          {/* Left: Deck Stats */}
          <div className="flex items-center gap-3 sm:gap-4 overflow-x-auto">
            <div className="group">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl sm:text-2xl font-bold tabular-nums text-foreground group-hover:text-primary transition-colors">
                  24
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
                  12
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
                  12
                </span>
                <span className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                  Learning
                </span>
              </div>
              <div className="mt-1 w-12 sm:w-14 h-0.5 sm:h-1 bg-border rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-orange-500/70 rounded-full" />
              </div>
            </div>

            {/* Daily Progress (Compact, hidden on small mobile) */}
            <div className="hidden md:flex items-center gap-3 ml-4 px-3 py-1.5 rounded-lg bg-card border border-border/50">
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tabular-nums text-foreground">
                  18
                </span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                  Today
                </span>
              </div>
              <div className="w-px h-6 bg-border/50" />
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-bold tabular-nums text-primary">
                  89%
                </span>
                <span className="text-[9px] text-muted-foreground uppercase tracking-wider">
                  Acc
                </span>
              </div>
            </div>
          </div>

          {/* Right: Add Card Button */}
          <button
            onClick={onAddCardClick}
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

        {/* Motivational Message */}
        <div className="mt-2 flex items-center gap-1.5 text-[10px] sm:text-xs text-muted-foreground">
          <svg
            className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span className="font-medium truncate">
            Great progress! You're 50% through this deck.
          </span>
        </div>
      </div>
    </div>
  )
}
