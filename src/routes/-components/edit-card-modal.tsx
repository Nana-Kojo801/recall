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

interface EditCardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCardModal({ open, onOpenChange }: EditCardModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            Edit Flashcard
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Modify the content of your flashcard.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto px-1">
          <div className="space-y-6 py-6">
            {/* Question Field */}
            <div className="space-y-2">
              <Label htmlFor="edit-question" className="text-sm font-semibold">
                Question
              </Label>
              <textarea
                id="edit-question"
                className="w-full min-h-[120px] px-4 py-3 text-sm rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                defaultValue='What is the French word for "remember"?'
              />
            </div>

            {/* Answer Field */}
            <div className="space-y-2">
              <Label htmlFor="edit-answer" className="text-sm font-semibold">
                Answer
              </Label>
              <textarea
                id="edit-answer"
                className="w-full min-h-[120px] px-4 py-3 text-sm rounded-lg border border-input bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                defaultValue="se souvenir"
              />
            </div>

            {/* Tags Field */}
            <div className="space-y-2">
              <Label htmlFor="edit-tags" className="text-sm font-semibold">
                Tags{' '}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </Label>
              <input
                id="edit-tags"
                type="text"
                className="w-full px-4 py-2.5 text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all"
                defaultValue="Vocabulary, French"
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
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
