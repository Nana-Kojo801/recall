import { createFileRoute } from '@tanstack/react-router'
import { Header } from './-components/header'
import { StatsBar } from './-components/stats-bar'
import { FlashcardViewer } from './-components/flashcard-viewer'
import { EmptyState } from './-components/empty-state'
import { AddCardModal } from './-components/add-card-modal'
import { DeckSelectorModal } from './-components/deck-selector-modal'
import { CreateDeckModal } from './-components/create-deck-modal'
import { EditDeckModal } from './-components/edit-deck-modal'
import { EditCardModal } from './-components/edit-card-modal'
import { DeleteDeckConfirmModal } from './-components/delete-deck-confirm-modal'
import { DeleteCardConfirmModal } from './-components/delete-card-confirm-modal'
import db from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { StatsBarSkeleton } from './-components/stats-bar-skeleton'
import { FlashcardViewerSkeleton } from './-components/flashcard-viewer-skeleton'
import {
  useIsCreateDeckModalOpen,
  useSetIsCreateDeckModalOpen,
  useSelectedDeckId,
  useIsDeckSelectorOpen,
  useSetIsDeckSelectorOpen,
  useIsEditDeckModalOpen,
  useSetIsEditDeckModalOpen,
  useIsEditCardModalOpen,
  useSetIsEditCardModalOpen,
  useIsDeleteDeckConfirmModalOpen,
  useSetIsDeleteDeckConfirmModalOpen,
  useIsDeleteCardConfirmModalOpen,
  useSetIsDeleteCardConfirmModalOpen,
  useIsCardModalOpen,
  useSetIsCardModalOpen,
} from '@/stores/app-state-store'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  const setIsCreateDeckModalOpen = useSetIsCreateDeckModalOpen()
  const isCreateDeckModalOpen = useIsCreateDeckModalOpen()

  const isEditDeckModalOpen = useIsEditDeckModalOpen()
  const setIsEditDeckModalOpen = useSetIsEditDeckModalOpen()

  const isCardModalOpen = useIsCardModalOpen()
  const setIsCardModalOpen = useSetIsCardModalOpen()

  const isEditCardModalOpen = useIsEditCardModalOpen()
  const setIsEditCardModalOpen = useSetIsEditCardModalOpen()

  const isDeleteDeckConfirmModalOpen = useIsDeleteDeckConfirmModalOpen()
  const setIsDeleteDeckConfirmModalOpen = useSetIsDeleteDeckConfirmModalOpen()

  const isDeleteCardConfirmModalOpen = useIsDeleteCardConfirmModalOpen()
  const setIsDeleteCardConfirmModalOpen = useSetIsDeleteCardConfirmModalOpen()

  const selectedDeckId = useSelectedDeckId()
  const isDeckSelectorOpen = useIsDeckSelectorOpen()
  const setIsDeckSelectorOpen = useSetIsDeckSelectorOpen()

  const deck = useLiveQuery(() =>
    selectedDeckId ? db.decks.get(selectedDeckId) : undefined,
  [selectedDeckId])
  const cards = useLiveQuery(() =>
    selectedDeckId
      ? db.cards.where('deckId').equals(selectedDeckId).toArray()
      : [],
  [selectedDeckId])

  const isLoading =
    selectedDeckId && (deck === undefined || cards === undefined)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {selectedDeckId ? (
        isLoading ? (
          <>
            <StatsBarSkeleton />
            <main className="flex-1 flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 px-4">
              <FlashcardViewerSkeleton />
            </main>
          </>
        ) : (
          <>
            <StatsBar />

            <main className="flex-1 flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 px-4">
              <FlashcardViewer />
            </main>
          </>
        )
      ) : (
        <EmptyState />
      )}
      {/* --- Modals --- */}

      {/* Deck Management */}
      <DeckSelectorModal
        open={isDeckSelectorOpen}
        onOpenChange={setIsDeckSelectorOpen}
      />
      <CreateDeckModal
        open={isCreateDeckModalOpen}
        onOpenChange={setIsCreateDeckModalOpen}
      />
      <EditDeckModal
        open={isEditDeckModalOpen}
        onOpenChange={setIsEditDeckModalOpen}
      />
      <DeleteDeckConfirmModal
        open={isDeleteDeckConfirmModalOpen}
        onOpenChange={setIsDeleteDeckConfirmModalOpen}
      />

      {/* Card Management */}
      <AddCardModal open={isCardModalOpen} onOpenChange={setIsCardModalOpen} />
      <EditCardModal
        open={isEditCardModalOpen}
        onOpenChange={setIsEditCardModalOpen}
      />
      <DeleteCardConfirmModal
        open={isDeleteCardConfirmModalOpen}
        onOpenChange={setIsDeleteCardConfirmModalOpen}
      />
    </div>
  )
}
