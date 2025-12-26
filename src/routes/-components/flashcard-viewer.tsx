import db from '@/lib/db'
import {
  useHandleEditCard,
  useHandleDeleteCard,
  useSelectedDeckId,
  useSetIsCardModalOpen,
} from '@/stores/app-state-store'
import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect, useState } from 'react'
import { FlashcardViewerSkeleton } from './flashcard-viewer-skeleton'

export function FlashcardViewer() {
  const [isFlipped, setIsFlipped] = useState(false)
  const selectedDeckId = useSelectedDeckId()
  const setIsCardModalOpen = useSetIsCardModalOpen()

  const deck = useLiveQuery(() => db.decks.get(selectedDeckId!))

  const cards = useLiveQuery(
    () =>
      selectedDeckId
        ? db.cards.where('deckId').equals(selectedDeckId).toArray()
        : [],
    [selectedDeckId],
  )

  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  const handleEditCard = useHandleEditCard()
  const handleDeleteCard = useHandleDeleteCard()

  const deckStats = {
    totalCards: cards?.length,
    knownCards: cards?.filter((c) => c.known).length,
  }

  const currentCard = cards?.[currentCardIndex]

  const handleNext = () => {
    if (cards && currentCardIndex < cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1)
      setIsFlipped(false)
    }
  }

  const handlePrev = () => {
    if (cards && currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      setIsFlipped(false)
    }
  }

  const handleSetKnown = async (known: boolean) => {
    if (currentCard) {
      await db.cards.update(currentCard.id, { known })
    }
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return
      }

      switch (e.code) {
        case 'Space':
          e.preventDefault()
          setIsFlipped((prev) => !prev)
          break
        case 'ArrowLeft':
        case 'KeyA':
          handlePrev()
          break
        case 'ArrowRight':
        case 'KeyD':
          handleNext()
          break
        case 'Digit1':
          handleSetKnown(false)
          break
        case 'Digit2':
          handleSetKnown(true)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    currentCard,
    currentCardIndex,
    cards,
    handleNext,
    handlePrev,
    handleSetKnown,
  ])

  if (deck === undefined || cards === undefined) {
    return <FlashcardViewerSkeleton />
  }

  if (cards.length === 0) {
    return (
      <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
        <div className="relative bg-card border border-dashed border-border/60 rounded-xl sm:rounded-2xl p-12 text-center overflow-hidden">
          <div className="absolute -inset-8 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-3xl blur-2xl -z-10 opacity-60" />

          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary animate-pulse">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-foreground">
                No cards in this deck yet
              </h3>
              <p className="text-sm text-muted-foreground max-w-[280px] mx-auto">
                Ready to start learning? Add your first flashcard to begin your
                recall journey.
              </p>
            </div>

            <button
              onClick={() => setIsCardModalOpen(true)}
              className="mt-2 inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add First Card
            </button>
          </div>
        </div>
      </div>
    )
  }

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
          <div
            className={`relative w-full transition-all duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
          >
            {/* Front Side */}
            <div className="relative bg-card border border-border/50 rounded-xl sm:rounded-2xl overflow-hidden backface-hidden shadow-lg hover:border-border/80 transition-colors">
              <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
              <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-border/30 flex items-center justify-between relative z-10 font-medium">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    Question
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      if (currentCard) handleEditCard(currentCard.id)
                    }}
                    className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
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
                      if (currentCard) handleDeleteCard(currentCard.id)
                    }}
                    className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-destructive transition-colors"
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

              <div className="px-4 sm:px-6 py-12 sm:py-16 min-h-[280px] sm:min-h-[320px] flex items-center justify-center">
                <p className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground text-center leading-relaxed tracking-tight">
                  {currentCard?.question}
                </p>
              </div>

              <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-3 sm:pt-4 border-t border-border/30 bg-muted/5">
                <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-muted-foreground">
                  <svg
                    className="w-3 h-3 animate-bounce"
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
                  <span>Click or Space to flip</span>
                </div>
              </div>
            </div>

            {/* Back Side */}
            <div className="absolute inset-0 bg-card border border-primary/20 rounded-xl sm:rounded-2xl overflow-hidden backface-hidden rotate-y-180 shadow-xl shadow-primary/5">
              <div className="absolute top-0 left-0 right-0 h-0.5 sm:h-1 bg-gradient-to-r from-primary via-primary/60 to-transparent" />
              <div className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 sm:pb-4 border-b border-border/30 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
                    Answer
                  </span>
                </div>
                {/* Status indicator if currently known */}
                {currentCard?.known && (
                  <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 rounded-full border border-primary/20">
                    <div className="w-1 h-1 rounded-full bg-primary" />
                    <span className="text-[9px] font-bold text-primary uppercase tracking-tighter">
                      Known
                    </span>
                  </div>
                )}
              </div>

              <div className="px-4 sm:px-6 py-12 sm:py-16 min-h-[280px] sm:min-h-[320px] flex items-center justify-center">
                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground text-center leading-relaxed tracking-tight">
                  {currentCard?.answer}
                </p>
              </div>

              <div className="px-4 sm:px-6 pb-4 sm:pb-5 pt-3 sm:pt-4 border-t border-border/30 bg-primary/[0.02]">
                <div className="flex items-center justify-center gap-2 text-[10px] sm:text-xs text-primary/60">
                  <svg
                    className="w-3 h-3"
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
                  <span>Click to view question</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-4 sm:mt-6 flex items-center justify-center gap-2 sm:gap-3">
          {/* Visual progress dots */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {cards.map((_, i) => (
              <div
                key={i}
                className={`h-1 sm:h-1.5 rounded-full transition-all duration-300 ${
                  i === currentCardIndex
                    ? 'w-6 sm:w-8 bg-primary shadow-md sm:shadow-lg shadow-primary/30'
                    : i < currentCardIndex
                      ? 'w-1 sm:w-1.5 bg-primary/50'
                      : 'w-1 sm:w-1.5 bg-border hover:bg-border/70'
                }`}
              />
            ))}
          </div>

          {/* Numeric indicator */}
          <div className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-muted/50 border border-border/50">
            <span className="text-xs sm:text-sm font-bold tabular-nums text-foreground">
              {currentCardIndex + 1}
            </span>
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              /
            </span>
            <span className="text-xs sm:text-sm font-medium tabular-nums text-muted-foreground">
              {deckStats.totalCards}
            </span>
          </div>
        </div>

        {/* Review Actions */}
        <div className="mt-8 flex items-center justify-center gap-2 sm:gap-4 flex-wrap">
          {/* Still Learning */}
          <button
            onClick={() => handleSetKnown(false)}
            className="group relative flex-1 min-w-[140px] max-w-[180px]"
          >
            <div
              className={`absolute -inset-0.5 bg-orange-500/20 rounded-xl transition-opacity blur-md ${currentCard?.known === false ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            />
            <div
              className={`relative px-4 py-3 rounded-xl border transition-all flex flex-col items-center gap-1 ${
                currentCard?.known === false
                  ? 'bg-orange-500/10 border-orange-500/50 text-orange-600'
                  : 'bg-card border-border hover:bg-muted/30 group-hover:border-orange-500/40'
              }`}
            >
              <svg
                className={`w-5 h-5 transition-colors ${
                  currentCard?.known === false
                    ? 'text-orange-600'
                    : 'text-muted-foreground group-hover:text-orange-500'
                }`}
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
              <span className="text-sm font-semibold">Still Learning</span>
              <kbd
                className={`hidden sm:inline-block px-1.5 py-0.5 mt-1 rounded text-[10px] font-mono border-b-2 transition-colors ${
                  currentCard?.known === false
                    ? 'bg-orange-600/20 border-orange-600/40 text-orange-700'
                    : 'bg-muted border-muted-foreground/30 text-muted-foreground'
                }`}
              >
                1
              </kbd>
            </div>
          </button>

          {/* Navigation with overlap */}
          <div className="flex relative items-center flex-1 max-w-[140px] sm:max-w-[160px] h-[72px]">
            {currentCardIndex > 0 && (
              <button
                onClick={handlePrev}
                className="absolute left-0 z-0 px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted text-muted-foreground transition-all translate-x-[-15%] group"
                title="Previous Card (←)"
              >
                <svg
                  className="w-5 h-5 group-hover:-translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 17l-5-5m0 0l5-5m-5 5h12"
                  />
                </svg>
              </button>
            )}

            <button
              onClick={handleNext}
              disabled={currentCardIndex === cards.length - 1}
              className={`relative z-10 w-full px-4 py-3 rounded-xl border border-border bg-card hover:bg-muted shadow-sm transition-all group ${currentCardIndex === cards.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:translate-x-1'}`}
            >
              <div className="flex flex-col items-center gap-1">
                <svg
                  className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors"
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
                <span className="text-sm font-semibold">Next</span>
              </div>
            </button>
          </div>

          {/* Known */}
          <button
            onClick={() => handleSetKnown(true)}
            className="group relative flex-1 min-w-[140px] max-w-[180px]"
          >
            <div
              className={`absolute -inset-0.5 bg-primary/30 rounded-xl transition-opacity blur-md ${currentCard?.known === true ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
            />
            <div
              className={`relative px-4 py-3 rounded-xl transition-all flex flex-col items-center gap-1 ${
                currentCard?.known === true
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]'
                  : 'bg-card border border-border text-foreground hover:bg-muted/30 group-hover:border-primary/40'
              }`}
            >
              <svg
                className={`w-5 h-5 transition-transform ${
                  currentCard?.known === true
                    ? 'scale-125'
                    : 'group-hover:scale-125'
                }`}
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
              <span className="text-sm font-bold">Known</span>
              <kbd
                className={`hidden sm:inline-block px-1.5 py-0.5 mt-1 rounded text-[10px] font-mono border-b-2 transition-colors ${
                  currentCard?.known === true
                    ? 'bg-primary-foreground/20 border-primary-foreground/40'
                    : 'bg-muted border-muted-foreground/30 text-muted-foreground'
                }`}
              >
                2
              </kbd>
            </div>
          </button>
        </div>

        {/* Keyboard Shortcuts Reference */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground border-t border-border/50 pt-6">
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded bg-muted border border-border font-mono text-[10px] font-semibold">
              Space
            </kbd>
            <span>Flip card</span>
          </div>
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded bg-muted border border-border font-mono text-[10px] font-semibold">
              A / D or ← / →
            </kbd>
            <span>Navigate</span>
          </div>
        </div>
      </div>
    </div>
  )
}
