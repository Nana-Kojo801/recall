interface HeaderProps {
  onDeckSelectorClick: () => void
}

export function Header({ onDeckSelectorClick }: HeaderProps) {
  return (
    <header className="relative border-b border-border/50 backdrop-blur-sm bg-background/80">
      <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between max-w-7xl mx-auto">
        {/* Logo with gradient */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-primary/20 via-primary/10 to-transparent border border-primary/20 flex items-center justify-center">
                <svg
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <div className="absolute inset-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/5 blur-md -z-10" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-semibold tracking-tight text-foreground">
                Recall
              </h1>
              <p className="text-[9px] sm:text-[10px] text-muted-foreground tracking-wide hidden sm:block">
                Focus on what matters
              </p>
            </div>
          </div>

          {/* Deck Selector - Compact Dropdown */}
          <div className="hidden md:flex items-center gap-2 ml-4 sm:ml-6 pl-4 sm:pl-6 border-l border-border/50">
            <button
              onClick={onDeckSelectorClick}
              className="group flex items-center gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg hover:bg-muted/50 transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary" />
                <span className="text-xs sm:text-sm font-medium text-foreground">
                  General
                </span>
              </div>
              <svg
                className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-muted-foreground group-hover:text-foreground transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Mobile deck selector */}
          <button
            onClick={onDeckSelectorClick}
            className="md:hidden w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-muted/50 transition-colors flex items-center justify-center group"
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-foreground transition-colors"
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
          </button>

          {/* Theme toggle */}
          <button className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg hover:bg-muted/50 transition-colors flex items-center justify-center group">
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-muted-foreground group-hover:text-foreground transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Subtle gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
    </header>
  )
}
