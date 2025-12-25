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

interface AddCardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCardModal({ open, onOpenChange }: AddCardModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Add New Flashcard
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Create a new flashcard to add to your current deck.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto px-1">
          <div className="space-y-6 py-6">
            {/* Question Field */}
            <div className="space-y-2">
              <Label htmlFor="question" className="text-sm font-semibold">
                Question
              </Label>
              <textarea
                id="question"
                className="w-full min-h-[120px] px-4 py-3 text-sm rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="Enter your question here..."
              />
            </div>

            {/* Answer Field */}
            <div className="space-y-2">
              <Label htmlFor="answer" className="text-sm font-semibold">
                Answer
              </Label>
              <textarea
                id="answer"
                className="w-full min-h-[120px] px-4 py-3 text-sm rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="Enter the answer here..."
              />
            </div>

            {/* Tags Field */}
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-semibold">
                Tags{' '}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <input
                id="tags"
                type="text"
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                placeholder="e.g., Vocabulary, French (comma-separated)"
              />
              <p className="text-xs text-muted-foreground">
                Separate multiple tags with commas
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="min-w-[100px]"
          >
            Cancel
          </Button>
          <Button onClick={() => onOpenChange(false)} className="min-w-[100px]">
            Save Card
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
