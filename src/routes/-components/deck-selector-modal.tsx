import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface DeckSelectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateDeckClick: () => void
  onEditDeck: (id: string) => void
  onDeleteDeck: (id: string) => void
}

export function DeckSelectorModal({
  open,
  onOpenChange,
  onCreateDeckClick,
  onEditDeck,
  onDeleteDeck,
}: DeckSelectorModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl font-bold">
            Your Decks
          </DialogTitle>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Switch between decks or create a new one
          </p>
        </DialogHeader>

        <div className="py-2 sm:py-4">
          <div className="max-h-[60vh] overflow-y-auto px-1">
            {/* Deck List */}
            <div className="space-y-2 mb-4 sm:mb-6">
              {/* Active Deck */}
              <div className="group w-full p-3 sm:p-4 rounded-xl bg-primary/10 border-2 border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10 flex items-center justify-between">
                <button
                  className="flex-1 flex items-center justify-between text-left"
                  onClick={() => onOpenChange(false)}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary shadow-lg shadow-primary/50" />
                    <div>
                      <div className="font-semibold text-sm sm:text-base text-foreground">
                        General
                      </div>
                      <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                        24 cards • 50% known
                      </div>
                    </div>
                  </div>
                </button>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      onEditDeck('general')
                    }}
                  >
                    <span className="sr-only">Edit</span>
                    <svg
                      className="w-4 h-4"
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
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteDeck('general')
                    }}
                  >
                    <span className="sr-only">Delete</span>
                    <svg
                      className="w-4 h-4"
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
                  </Button>
                </div>
              </div>

              {/* Other Decks (Mapped manually for now as per previous code) */}
              {[
                { name: 'French Vocabulary', stats: '48 cards • 35% known' },
                { name: 'History Facts', stats: '16 cards • 75% known' },
              ].map((deck, i) => (
                <div
                  key={i}
                  className="group w-full p-3 sm:p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-muted/30 transition-all flex items-center justify-between"
                >
                  <button
                    className="flex-1 flex items-center justify-between text-left"
                    onClick={() => onOpenChange(false)}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-muted-foreground/30" />
                      <div>
                        <div className="font-semibold text-sm sm:text-base text-foreground">
                          {deck.name}
                        </div>
                        <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                          {deck.stats}
                        </div>
                      </div>
                    </div>
                  </button>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground"
                      onClick={(e) => {
                        e.stopPropagation()
                        onEditDeck(deck.name)
                      }}
                    >
                      <span className="sr-only">Edit</span>
                      <svg
                        className="w-4 h-4"
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
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation()
                        onDeleteDeck(deck.name)
                      }}
                    >
                      <span className="sr-only">Delete</span>
                      <svg
                        className="w-4 h-4"
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
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Create New Deck */}
            <button
              onClick={onCreateDeckClick}
              className="group w-full p-3 sm:p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <div className="flex items-center justify-center gap-2 text-muted-foreground group-hover:text-primary transition-colors">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform duration-300"
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
                <span className="font-semibold text-xs sm:text-sm">
                  Create New Deck
                </span>
              </div>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
