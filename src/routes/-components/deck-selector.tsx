export function DeckSelector() {
  return (
    <div className="w-full max-w-md mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-foreground mb-1">Your Decks</h3>
        <p className="text-xs text-muted-foreground">
          Switch between decks or create a new one
        </p>
      </div>

      {/* Deck List */}
      <div className="space-y-2 mb-6">
        {/* Active Deck */}
        <button className="group w-full p-4 rounded-xl bg-primary/10 border-2 border-primary/30 hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50" />
              <div className="text-left">
                <div className="font-semibold text-foreground">General</div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  24 cards • 50% known
                </div>
              </div>
            </div>
            <svg
              className="w-5 h-5 text-primary"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          </div>
        </button>

        {/* Other Decks */}
        <button className="group w-full p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-muted/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
              <div className="text-left">
                <div className="font-semibold text-foreground">
                  French Vocabulary
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  48 cards • 35% known
                </div>
              </div>
            </div>
          </div>
        </button>

        <button className="group w-full p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-muted/30 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
              <div className="text-left">
                <div className="font-semibold text-foreground">
                  History Facts
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  16 cards • 75% known
                </div>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* Create New Deck */}
      <button className="group w-full p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all">
        <div className="flex items-center justify-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
          <svg
            className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300"
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
          <span className="font-semibold text-sm">Create New Deck</span>
        </div>
      </button>
    </div>
  )
}
