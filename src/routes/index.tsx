import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Header } from './-components/header'
import { StatsBar } from './-components/stats-bar'
import { FlashcardViewer } from './-components/flashcard-viewer'
import { ReviewActions } from './-components/review-actions'
import { EmptyState } from './-components/empty-state'
import { Footer } from './-components/footer'
import { AddCardModal } from './-components/add-card-modal'
import { DeckSelectorModal } from './-components/deck-selector-modal'
import { CreateDeckModal } from './-components/create-deck-modal'
import { EditDeckModal } from './-components/edit-deck-modal'
import { EditCardModal } from './-components/edit-card-modal'
import { DeleteConfirmModal } from './-components/delete-confirm-modal'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  // UI State - bare minimum for modal interactions
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false)
  const [isDeckSelectorOpen, setIsDeckSelectorOpen] = useState(false)

  // Deck Actions State
  const [isCreateDeckModalOpen, setIsCreateDeckModalOpen] = useState(false)
  const [isEditDeckModalOpen, setIsEditDeckModalOpen] = useState(false)
  const [isDeleteDeckConfirmOpen, setIsDeleteDeckConfirmOpen] = useState(false)
  const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null)

  // Card Actions State
  const [isEditCardModalOpen, setIsEditCardModalOpen] = useState(false)
  const [isDeleteCardConfirmOpen, setIsDeleteCardConfirmOpen] = useState(false)

  // Toggle between empty state and flashcard view for demo
  // Set to false to see empty state, true to see flashcard interface
  const hasCards = true

  // Deck Action Handlers
  const handleCreateDeckClick = () => {
    setIsDeckSelectorOpen(false)
    setIsCreateDeckModalOpen(true)
  }

  const handleEditDeck = (id: string) => {
    setSelectedDeckId(id)
    setIsDeckSelectorOpen(false)
    setIsEditDeckModalOpen(true)
  }

  const handleDeleteDeck = (id: string) => {
    setSelectedDeckId(id)
    setIsDeckSelectorOpen(false) // Optionally keep it open and overlay, but closing is cleaner for now
    setIsDeleteDeckConfirmOpen(true)
  }

  const handleReturnToDeckSelector = () => {
    setIsDeckSelectorOpen(true)
  }

  // Card Action Handlers
  const handleEditCard = () => {
    setIsEditCardModalOpen(true)
  }

  const handleDeleteCard = () => {
    setIsDeleteCardConfirmOpen(true)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onDeckSelectorClick={() => setIsDeckSelectorOpen(true)} />

      {hasCards ? (
        <>
          <StatsBar onAddCardClick={() => setIsAddCardModalOpen(true)} />

          <main className="flex-1 flex flex-col items-center justify-center py-8 sm:py-12 md:py-16 px-4">
            <FlashcardViewer
              onEditCard={handleEditCard}
              onDeleteCard={handleDeleteCard}
            />
            <ReviewActions />
          </main>
        </>
      ) : (
        <EmptyState onAddCardClick={() => setIsAddCardModalOpen(true)} />
      )}

      <Footer />

      {/* --- Modals --- */}

      {/* Deck Management */}
      <DeckSelectorModal
        open={isDeckSelectorOpen}
        onOpenChange={setIsDeckSelectorOpen}
        onCreateDeckClick={handleCreateDeckClick}
        onEditDeck={handleEditDeck}
        onDeleteDeck={handleDeleteDeck}
      />
      <CreateDeckModal
        open={isCreateDeckModalOpen}
        onOpenChange={setIsCreateDeckModalOpen}
        onCancel={handleReturnToDeckSelector}
      />
      <EditDeckModal
        open={isEditDeckModalOpen}
        onOpenChange={setIsEditDeckModalOpen}
        onCancel={handleReturnToDeckSelector}
        initialName="General" // Mock data
      />
      <DeleteConfirmModal
        open={isDeleteDeckConfirmOpen}
        onOpenChange={setIsDeleteDeckConfirmOpen}
        title="Delete Deck"
        description="Are you sure you want to delete this deck? This action cannot be undone and all cards inside will be lost."
        onConfirm={handleReturnToDeckSelector} // Return to list after delete
        onCancel={handleReturnToDeckSelector} // Return to list if cancelled
      />

      {/* Card Management */}
      <AddCardModal
        open={isAddCardModalOpen}
        onOpenChange={setIsAddCardModalOpen}
      />
      <EditCardModal
        open={isEditCardModalOpen}
        onOpenChange={setIsEditCardModalOpen}
      />
      <DeleteConfirmModal
        open={isDeleteCardConfirmOpen}
        onOpenChange={setIsDeleteCardConfirmOpen}
        title="Delete Flashcard"
        description="Are you sure you want to delete this flashcard? This action cannot be undone."
        onConfirm={() => {}} // No-op for UI demo
      />
    </div>
  )
}
