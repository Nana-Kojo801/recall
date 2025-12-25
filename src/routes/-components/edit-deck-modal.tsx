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

interface EditDeckModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCancel?: () => void
  initialName?: string
}

export function EditDeckModal({
  open,
  onOpenChange,
  onCancel,
  initialName = '',
}: EditDeckModalProps) {
  const [name, setName] = useState(initialName)

  useEffect(() => {
    setName(initialName)
  }, [initialName, open])

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
              onOpenChange(false)
              onCancel?.()
            }}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)} className="min-w-[100px]">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
