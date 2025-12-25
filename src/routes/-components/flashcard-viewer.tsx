import { useState } from 'react'

interface FlashcardViewerProps {
  onEditCard?: () => void
  onDeleteCard?: () => void
}

export function FlashcardViewer({
  onEditCard,
  onDeleteCard,
}: FlashcardViewerProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
      {/* Card Container with 3D perspective */}
      <div className="relative perspective-1000">
        {/* Ambient glow background - smaller on mobile */}
        <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-3xl blur-2xl sm:blur-3xl -z-10 opacity-60" />

        {/* Main Card */}
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="relative group cursor-pointer"
        >
          {/* Hover glow effect */}
          <div className="absolute -inset-0.5 sm:-inset-1 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-xl sm:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm sm:blur-lg" />

          {/* Card Surface */}
          <div className="relative bg-card border border-border/50 rounded-xl sm:rounded-2xl overflow-hidden transform-style-3d transition-all duration-500 hover:border-border group-hover:shadow-xl sm:group-hover:shadow-2xl group-hover:shadow-primary/10">
            {/* Status indicator bar */}
            <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />

            {/* Card Header */}
            <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-border/30 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    Question
                  </span>
                </div>

                {/* Edit/Delete Actions (Only visible on hover or if mobile?) - kept visible but subtle */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditCard?.()
                    }}
                    className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
                    title="Edit Card"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteCard?.()
                    }}
                    className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-destructive transition-colors"
                    title="Delete Card"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-1 sm:gap-1.5">
                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-primary/10 border border-primary/20 text-[8px] sm:text-[10px] font-semibold text-primary uppercase tracking-wide">
                  Vocabulary
                </span>
                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-muted border border-border text-[8px] sm:text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                  French
                </span>
              </div>
            </div>

            {/* Card Content */}
            <div className="px-4 sm:px-6 py-12 sm:py-16 min-h-[280px] sm:min-h-[320px] flex items-center justify-center">
              <div className="max-w-xl text-center space-y-3 sm:space-y-4">
                <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground leading-relaxed tracking-tight">
                  What is the French word for "remember"?
                </p>

                {/* Optional context hint */}
                <p className="text-xs sm:text-sm text-muted-foreground italic">
                  Hint: It starts with "se"
                </p>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-3 sm:pt-4 border-t border-border/30">
              <div className="flex items-center justify-between">
                {/* Flip Hint */}
                <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-muted-foreground">
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 animate-bounce"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                    />
                  </svg>
                  <span className="font-medium hidden sm:inline">
                    Click or press Space to flip
                  </span>
                  <span className="font-medium sm:hidden">Tap to flip</span>
                </div>

                {/* Card difficulty indicator */}
                <div className="flex items-center gap-0.5 sm:gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className={`w-0.5 sm:w-1 h-2 sm:h-3 rounded-full ${
                        i < 2 ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Decorative corner accents - smaller on mobile */}
            <div className="absolute top-0 left-0 w-12 h-12 sm:w-16 sm:h-16 border-l border-t sm:border-l-2 sm:border-t-2 border-primary/10 rounded-tl-xl sm:rounded-tl-2xl pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-16 sm:h-16 border-r border-b sm:border-r-2 sm:border-b-2 border-primary/10 rounded-br-xl sm:rounded-br-2xl pointer-events-none" />
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 sm:gap-3">
          {/* Visual progress dots */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                  i === 3
                    ? 'w-6 sm:w-8 bg-primary shadow-md sm:shadow-lg shadow-primary/30'
                    : i < 3
                      ? 'w-1 sm:w-1.5 bg-primary/50'
                      : 'w-1 sm:w-1.5 bg-border hover:bg-border/70'
                }`}
              />
            ))}
          </div>

          {/* Numeric indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-muted/50 border border-border/50">
            <span className="text-xs sm:text-sm font-bold tabular-nums text-foreground">
              4
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              /
            </span>
            <span className="text-xs sm:text-sm font-medium tabular-nums text-muted-foreground">
              24
            </span>
          </div>
        </div>

        {/* Queue info */}
        <div className="mt-3 sm:mt-4 text-center">
          <p className="text-[10px] sm:text-xs text-muted-foreground">
            <span className="font-semibold text-primary">8 learning</span> •{' '}
            <span className="font-semibold text-foreground">4 known</span> •{' '}
            <span>12 remaining</span>
          </p>
        </div>
      </div>
    </div>
  )
}
