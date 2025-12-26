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
import { useSelectedCardId } from '@/stores/app-state-store'
import db from '@/lib/db'
import { useLiveQuery } from 'dexie-react-hooks'
import { useEffect } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const formSchema = z.object({
  question: z.string().min(2, {
    message: 'Question must be at least 2 characters.',
  }),
  answer: z.string().min(1, {
    message: 'Answer is required.',
  }),
})

interface EditCardModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EditCardModal({ open, onOpenChange }: EditCardModalProps) {
  const selectedCardId = useSelectedCardId()

  const card = useLiveQuery(
    () => (selectedCardId ? db.cards.get(selectedCardId) : undefined),
    [selectedCardId],
  )

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema as any),
    defaultValues: {
      question: '',
      answer: '',
    },
  })

  useEffect(() => {
    if (card) {
      form.reset({
        question: card.question,
        answer: card.answer,
      })
    }
  }, [card, form.reset])

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!selectedCardId) return

    db.cards.update(selectedCardId, {
      question: values.question,
      answer: values.answer,
    })

    onOpenChange(false)
  }

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

        {card === undefined ? (
          <div className="space-y-6 py-6 px-1">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-[120px] w-full rounded-lg" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-[120px] w-full rounded-lg" />
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Skeleton className="h-10 w-[100px] rounded-md" />
              <Skeleton className="h-10 w-[100px] rounded-md" />
            </div>
          </div>
        ) : (
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
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  )
}
