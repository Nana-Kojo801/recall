import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";

interface RightSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  children: React.ReactNode;
  width?: number | string;
  mobileFullWidth?: boolean;
}

export function RightSheet({ open, onOpenChange, title, children, width = 440, mobileFullWidth = false }: RightSheetProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && (
          <Dialog.Portal forceMount>
            {mobileFullWidth && (
              <style>{`@media (max-width: 767px) { .rsheet-mobile-full { width: 100vw !important; border-left: none !important; } }`}</style>
            )}
            <Dialog.Overlay asChild>
              <motion.div
                style={{ position: "fixed", inset: 0, zIndex: 50, background: "rgba(28,25,23,0.45)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                className={mobileFullWidth ? "rsheet-mobile-full" : undefined}
                style={{
                  position: "fixed",
                  top: 0, right: 0, bottom: 0,
                  width: `min(${typeof width === "number" ? width + "px" : width}, 100vw)`,
                  background: "var(--color-bg, #F5EFE2)",
                  borderLeft: "3px solid #1C1917",
                  boxShadow: "-8px 0 40px rgba(28,25,23,0.2)",
                  display: "flex",
                  flexDirection: "column",
                  zIndex: 51,
                }}
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
              >
                <div style={{
                  padding: "16px 20px",
                  borderBottom: "2px solid #1C1917",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  background: "#FBF6EA",
                  flexShrink: 0,
                }}>
                  {title ? (
                    <Dialog.Title style={{
                      fontFamily: "var(--font-serif)",
                      fontSize: 20,
                      fontWeight: 800,
                      color: "#1C1917",
                      margin: 0,
                    }}>
                      {title}
                    </Dialog.Title>
                  ) : <div />}
                  <Dialog.Close asChild>
                    <button
                      style={{
                        width: 32, height: 32, borderRadius: 8,
                        border: "2px solid #1C1917",
                        background: "#fff", cursor: "pointer",
                        boxShadow: "2px 2px 0 #1C1917",
                        display: "grid", placeItems: "center",
                        flexShrink: 0,
                      }}
                      aria-label="Close"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1C1917" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </Dialog.Close>
                </div>
                <div style={{ flex: 1, overflowY: "auto", padding: 20 }}>
                  {children}
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
