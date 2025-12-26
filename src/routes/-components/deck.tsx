import { Button } from '@/components/ui/button'
import db from '@/lib/db'
import {
  useHandleDeleteDeck,
  useHandleEditDeck,
  useSelectedDeckId,
  useSetSelectedDeckId,
} from '@/stores/app-state-store'
import { useLiveQuery } from 'dexie-react-hooks'
import { type Deck } from '@/lib/db'

import { DeckSkeleton } from './deck-skeleton'

interface DeckProps {
  deck: Deck
  onOpenChange: (open: boolean) => void
}

export default function Deck({ deck, onOpenChange }: DeckProps) {
  const handleEditDeck = useHandleEditDeck()
  const handleDeleteDeck = useHandleDeleteDeck()
  const selectedDeckId = useSelectedDeckId()
  const setSelectedDeckId = useSetSelectedDeckId()
  const isSelected = selectedDeckId === deck.id

  const cards = useLiveQuery(() =>
    db.cards.where('deckId').equals(deck.id).toArray(),
  )

  if (cards === undefined) {
    return <DeckSkeleton />
  }

  const deckStats = {
    totalCards: cards.length,
    knownCards: cards.filter((c) => c.known).length,
  }

  if (isSelected) {
    return (
      <div className="group w-full p-3 sm:p-4 rounded-xl bg-primary/10 border-2 border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10 flex items-center justify-between">
        <button
          className="flex-1 flex items-center justify-between text-left"
          onClick={() => {
            setSelectedDeckId(deck.id)
            onOpenChange(false)
          }}
        >
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-primary shadow-lg shadow-primary/50" />
            <div>
              <div className="font-semibold text-sm sm:text-base text-foreground">
                {deck.name}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                {deckStats.totalCards} cards • {deckStats.knownCards}% known
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
              handleEditDeck(deck.id)
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
              handleDeleteDeck(deck.id)
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
    )
  }

  return (
    <div className="group w-full p-3 sm:p-4 rounded-xl bg-card border border-border hover:border-primary/30 hover:bg-muted/30 transition-all flex items-center justify-between">
      <button
        className="flex-1 flex items-center justify-between text-left"
        onClick={() => {
          setSelectedDeckId(deck.id)
          onOpenChange(false)
        }}
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-muted-foreground/30" />
          <div>
            <div className="font-semibold text-sm sm:text-base text-foreground">
              {deck.name}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
              {deckStats.totalCards} cards • {deckStats.knownCards}% known
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
            handleEditDeck(deck.id)
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
            handleDeleteDeck(deck.id)
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
  )
}
