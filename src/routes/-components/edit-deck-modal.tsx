import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import {
  useHandleReturnToDeckSelector,
  useSelectedEditDeckId,
  useSetSelectedEditDeckId,
} from '@/stores/app-state-store'
import db from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'

interface EditDeckModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditDeckModal({ open, onOpenChange }: EditDeckModalProps) {
  const handleReturnToDeckSelector = useHandleReturnToDeckSelector()
  const selectedEditDeckId = useSelectedEditDeckId()
  const setSelectedEditDeckId = useSetSelectedEditDeckId()

 const selectedDeck = useLiveQuery(
    () => selectedEditDeckId ? db.decks.get(selectedEditDeckId) : undefined,
    [selectedEditDeckId],
  )

  const [name, setName] = useState(selectedDeck?.name || '')

  useEffect(() => {
    setName(selectedDeck?.name || '')
  }, [selectedDeck?.name])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Edit Deck</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Rename your deck.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="space-y-2">
            <Label htmlFor="edit-deck-name" className="text-sm font-semibold">
              Deck Name
            </Label>
            <Input
              id="edit-deck-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Spanish Vocabulary..."
              className="w-full"
              autoFocus
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
              setSelectedEditDeckId(null)
              onOpenChange(false)
              handleReturnToDeckSelector()
            }}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false)
              db.decks.update(selectedEditDeckId!, { name })
              handleReturnToDeckSelector()
            }}
            className="min-w-[100px]"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
