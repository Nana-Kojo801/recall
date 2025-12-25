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

interface CreateDeckModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCancel?: () => void
}

export function CreateDeckModal({
  open,
  onOpenChange,
  onCancel,
}: CreateDeckModalProps) {
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
              onCancel?.()
            }}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)} className="min-w-[100px]">
            Create Deck
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
