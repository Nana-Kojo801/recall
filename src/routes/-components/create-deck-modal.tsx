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
import { useHandleReturnToDeckSelector } from '@/stores/app-state-store'
import { useState } from 'react'
import db from '@/lib/db'

interface CreateDeckModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateDeckModal({ open, onOpenChange }: CreateDeckModalProps) {
  const handleReturnToDeckSelector = useHandleReturnToDeckSelector()

  const [name, setName] = useState('')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Create New Deck
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Give your new deck a name to get started.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          <div className="space-y-2">
            <Label htmlFor="deck-name" className="text-sm font-semibold">
              Deck Name
            </Label>
            <Input
              id="deck-name"
              type="text"
              placeholder="e.g., Spanish Vocabulary, Chemistry Facts..."
              className="w-full"
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Choose a descriptive name for your deck
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => {
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
              db.decks.add({ name })
              setName('')
              handleReturnToDeckSelector()
            }}
            className="min-w-[100px]"
          >
            Create Deck
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
