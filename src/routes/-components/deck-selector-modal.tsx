import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { useHandleCreateDeckClick } from '@/stores/app-state-store'
import { useLiveQuery } from 'dexie-react-hooks'
import { DeckListSkeleton } from './deck-list-skeleton'
import Deck from './deck'
import db from '@/lib/db'

interface DeckSelectorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeckSelectorModal({
  open,
  onOpenChange,
}: DeckSelectorModalProps) {
  const handleCreateDeckClick = useHandleCreateDeckClick()

  const decks = useLiveQuery(() => db.decks.toArray())

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
            {!decks ? (
              <DeckListSkeleton />
            ) : (
              <div className="space-y-2 mb-4 sm:mb-6">
                {decks.map((deck) => (
                  <Deck deck={deck} key={deck.id} onOpenChange={onOpenChange} />
                ))}
              </div>
            )}

            {/* Create New Deck */}
            <button
              onClick={handleCreateDeckClick}
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
