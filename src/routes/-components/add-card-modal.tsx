import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'

import { useSelectedDeckId } from '@/stores/app-state-store'
import db from '@/lib/db'

const formSchema = z.object({
  question: z.string().min(2, {
    message: 'Question must be at least 2 characters.',
  }),
  answer: z.string().min(1, {
    message: 'Answer is required.',
  }),
})

interface AddCardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddCardModal({ open, onOpenChange }: AddCardModalProps) {
  const selectedDeckId = useSelectedDeckId()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      question: '',
      answer: '',
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedDeckId) return

    db.cards.add({
      deckId: selectedDeckId,
      question: values.question,
      answer: values.answer,
      known: false,
    })

    form.reset()
    onOpenChange(false)
  }

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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="max-h-[60vh] overflow-y-auto px-1">
              <div className="space-y-6 py-6">
                <FormField
                  control={form.control}
                  name="question"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Question
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter your question here..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="answer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold">
                        Answer
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter the answer here..."
                          className="min-h-[120px] resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="min-w-[100px]"
              >
                Cancel
              </Button>
              <Button type="submit" className="min-w-[100px]">
                Save Card
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
