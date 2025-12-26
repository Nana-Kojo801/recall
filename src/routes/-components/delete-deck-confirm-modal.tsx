import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import {
  useAppStateStore,
  useHandleReturnToDeckSelector,
} from '@/stores/app-state-store'
import db from '@/lib/db'

interface DeleteDeckConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteDeckConfirmModal({
  open,
  onOpenChange,
}: DeleteDeckConfirmModalProps) {
  const selectedDeleteDeckId = useAppStateStore(
    (state) => state.selectedDeleteDeckId,
  )
  const selectedDeckId = useAppStateStore((state) => state.selectedDeckId)
  const setSelectedDeckId = useAppStateStore((state) => state.setSelectedDeckId)
  const handleReturnToDeckSelector = useHandleReturnToDeckSelector()

  const handleDelete = async () => {
    if (selectedDeleteDeckId) {
      // Clear the selection if we're deleting the active deck
      if (selectedDeleteDeckId === selectedDeckId) {
        setSelectedDeckId(null)
      }

      // Delete the deck and all its cards
      await db.decks.delete(selectedDeleteDeckId)
      await db.cards.where('deckId').equals(selectedDeleteDeckId).delete()
    }
    onOpenChange(false)
    handleReturnToDeckSelector()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-destructive">
            Delete Deck
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to delete this deck? This action cannot be
            undone and all cards inside will be lost.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false)
              handleReturnToDeckSelector()
            }}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex-1"
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
