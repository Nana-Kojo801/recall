import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useAppStateStore } from '@/stores/app-state-store'
import db from '@/lib/db'

interface DeleteCardConfirmModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteCardConfirmModal({
  open,
  onOpenChange,
}: DeleteCardConfirmModalProps) {
  const selectedDeleteCardId = useAppStateStore(
    (state) => state.selectedDeleteCardId,
  )

  const handleDelete = async () => {
    if (selectedDeleteCardId) {
      await db.cards.delete(selectedDeleteCardId)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-destructive">
            Delete Flashcard
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Are you sure you want to delete this flashcard? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
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
