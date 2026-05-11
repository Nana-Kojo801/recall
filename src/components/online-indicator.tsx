import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOffIcon } from "./icons";

export function OnlineIndicator() {
  const [online, setOnline] = useState(navigator.onLine);
  const [showBack, setShowBack] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setOnline(true);
      setShowBack(true);
      setTimeout(() => setShowBack(false), 3000);
    };
    const handleOffline = () => setOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <AnimatePresence>
      {(!online || showBack) && (
        <motion.div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-medium"
          style={{
            background: online
              ? "var(--color-success)"
              : "var(--color-bg-elevated)",
            color: online ? "#000" : "var(--color-text-secondary)",
            border: "1px solid var(--color-border)",
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
        >
          {!online && <WifiOffIcon size={14} />}
          {online ? "Back online" : "Offline — changes will sync"}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
