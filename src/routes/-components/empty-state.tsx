interface EmptyStateProps {
  onAddCardClick: () => void
}

export function EmptyState({ onAddCardClick }: EmptyStateProps) {
  return (
    <div className="flex-1 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-20">
      <div className="max-w-lg text-center space-y-6 sm:space-y-8 w-full">
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
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            Your deck is empty
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-sm sm:max-w-md mx-auto">
            Start building your knowledge base by creating your first flashcard.
            <span className="block mt-1 sm:mt-2 text-xs sm:text-sm italic">
              "Every expert was once a beginner."
            </span>
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <button
            onClick={onAddCardClick}
            className="group relative inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-xl bg-primary text-primary-foreground font-bold text-sm sm:text-base hover:shadow-2xl hover:shadow-primary/40 transition-all hover:-translate-y-1 hover:scale-105"
          >
            {/* Button glow */}
            <div className="absolute -inset-1.5 bg-primary/40 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />

            <span className="relative flex items-center gap-2 sm:gap-3">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 group-hover:rotate-90 transition-transform duration-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Create Your First Card
            </span>
          </button>

          {/* Secondary action */}
          <button className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors underline decoration-dotted underline-offset-4">
            or import from a file
          </button>
        </div>

        {/* Feature hints */}
        <div className="pt-6 sm:pt-8 grid grid-cols-3 gap-3 sm:gap-4 max-w-sm sm:max-w-md mx-auto">
          <div className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-lg bg-muted/30 border border-border/50">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-center">
              Fast Review
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-lg bg-muted/30 border border-border/50">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-center">
              Tags
            </span>
          </div>

          <div className="flex flex-col items-center gap-1.5 sm:gap-2 p-3 sm:p-4 rounded-lg bg-muted/30 border border-border/50">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <span className="text-[9px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-wider text-center">
              Progress
            </span>
          </div>
        </div>

        {/* Pro tip */}
        <p className="text-[10px] sm:text-xs text-muted-foreground/70 pt-2 sm:pt-4">
          💡 Pro tip: Use keyboard shortcuts for lightning-fast reviews
        </p>
      </div>
    </div>
  )
}
