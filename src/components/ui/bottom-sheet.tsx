import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({ open, onOpenChange, title, children, className }: BottomSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                className="fixed inset-0 bg-[rgba(28,25,23,0.5)] z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className={cn(
                  "fixed bottom-0 left-0 right-0 z-50",
                  "bg-[var(--color-bg)] rounded-t-[20px]",
                  "border-t-2 border-x-2 border-[var(--color-ink)]",
                  "max-h-[90svh] overflow-y-auto",
                  className
                )}
                style={{ boxShadow: "0 -4px 0 #1C1917" }}
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
              >
                <div className="flex justify-center pt-3 pb-1">
                  <div
                    className="w-10 h-1 rounded-full"
                    style={{ background: "rgba(28,25,23,0.25)" }}
                  />
                </div>
                {title && (
                  <Dialog.Title
                    className="px-5 pt-2 pb-4 text-xl font-bold text-[var(--color-ink)]"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    {title}
                  </Dialog.Title>
                )}
                <div className="px-5 pb-8">{children}</div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
