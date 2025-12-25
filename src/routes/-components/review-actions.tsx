export function ReviewActions() {
  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 mt-6 sm:mt-8">
      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {/* Still Learning Button */}
        <button className="group relative flex-1 max-w-[140px] sm:max-w-[180px]">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-orange-500/30 to-orange-600/30 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm sm:blur-md" />

          <div className="relative px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border border-border sm:border-2 bg-card hover:bg-muted/30 transition-all group-hover:border-orange-500/40 group-hover:-translate-y-0.5 sm:group-hover:-translate-y-1 group-hover:shadow-lg sm:group-hover:shadow-xl group-hover:shadow-orange-500/10">
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-orange-500 transition-all group-hover:scale-110"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              <span className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-orange-500 transition-colors">
                Still Learning
              </span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Press 1
              </span>
            </div>
          </div>
        </button>

        {/* Next Button */}
        <button className="group relative flex-1 max-w-[100px] sm:max-w-[120px]">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/20 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm sm:blur-md" />

          <div className="relative px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl border border-border sm:border-2 bg-card hover:bg-muted/30 transition-all group-hover:border-primary/40 group-hover:-translate-y-0.5 sm:group-hover:-translate-y-1 group-hover:shadow-lg sm:group-hover:shadow-xl group-hover:shadow-primary/10">
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-0.5 sm:group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
              <span className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-primary transition-colors">
                Next
              </span>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                Press 2
              </span>
            </div>
          </div>
        </button>

        {/* Known Button - Primary Action */}
        <button className="group relative flex-1 max-w-[140px] sm:max-w-[180px]">
          <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-r from-primary/40 to-primary/40 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity blur-md sm:blur-lg" />

          <div className="relative px-3 sm:px-5 py-2.5 sm:py-3.5 rounded-lg sm:rounded-xl bg-primary text-primary-foreground transition-all group-hover:shadow-xl sm:group-hover:shadow-2xl group-hover:shadow-primary/30 group-hover:-translate-y-0.5 sm:group-hover:-translate-y-1 group-hover:scale-[1.02]">
            <div className="flex flex-col items-center gap-1 sm:gap-2">
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 group-hover:scale-110 sm:group-hover:scale-125 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span className="font-bold text-xs sm:text-sm">Known</span>
              <span className="text-[9px] sm:text-[10px] opacity-90 font-medium uppercase tracking-wider">
                Press 3
              </span>
            </div>
          </div>
        </button>
      </div>

      {/* Keyboard Shortcuts Reference - More compact on mobile */}
      <div className="mt-4 sm:mt-6 flex items-center justify-center gap-3 sm:gap-4 text-[10px] sm:text-xs">
        <div className="flex items-center gap-3 sm:gap-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex items-center gap-1.5 sm:gap-2 text-muted-foreground">
            <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-card border border-border font-mono text-[9px] sm:text-[10px] font-semibold shadow-sm">
              Space
            </kbd>
            <span className="font-medium hidden sm:inline">Flip card</span>
            <span className="font-medium sm:hidden">Flip</span>
          </div>

          <div className="w-px h-3 sm:h-4 bg-border" />

          <div className="flex items-center gap-1 sm:gap-2 text-muted-foreground">
            <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-card border border-border font-mono text-[9px] sm:text-[10px] font-semibold shadow-sm">
              ←
            </kbd>
            <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-card border border-border font-mono text-[9px] sm:text-[10px] font-semibold shadow-sm">
              →
            </kbd>
            <span className="font-medium hidden sm:inline">Navigate</span>
            <span className="font-medium sm:hidden">Nav</span>
          </div>
        </div>
      </div>

      {/* Session Stats - More compact */}
      <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-muted-foreground">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary animate-pulse" />
          <span>
            Session:{' '}
            <span className="font-semibold text-foreground">12 cards</span>
          </span>
        </div>
        <span className="hidden sm:inline">•</span>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <svg
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
          <span>
            Accuracy: <span className="font-semibold text-foreground">92%</span>
          </span>
        </div>
      </div>
    </div>
  )
}
