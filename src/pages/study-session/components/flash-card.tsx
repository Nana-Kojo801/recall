import { useState } from "react";
import { motion } from "framer-motion";

interface FlashCardProps {
  front: string;
  back: string;
  onFlip: () => void;
}

function KStar({ size = 18, color = "#F4B400" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12 2 L14 10 L22 12 L14 14 L12 22 L10 14 L2 12 L10 10 Z" />
    </svg>
  );
}

export function FlashCard({ front, back, onFlip }: FlashCardProps) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    if (!flipped) {
      setFlipped(true);
      onFlip();
    }
  };

  return (
    <div
      className="perspective-1000 w-full cursor-pointer select-none"
      style={{ height: 320 }}
      onClick={handleFlip}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", damping: 20, stiffness: 180 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <div
          className="absolute inset-0 rounded-[20px] flex flex-col p-6"
          style={{
            backfaceVisibility: "hidden",
            background: "#fff",
            border: "2.5px solid #1C1917",
            boxShadow: "6px 6px 0 #1C1917",
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <span
              className="text-[10px] font-bold px-2 py-1 rounded"
              style={{
                fontFamily: "var(--font-mono)", background: "#1C1917",
                color: "#fff", letterSpacing: 1,
              }}
            >
              QUESTION
            </span>
            <KStar size={18} color="#F4B400" />
          </div>

          <p
            className="flex-1 flex items-center text-xl font-bold leading-snug text-center"
            style={{ fontFamily: "var(--font-serif)", color: "#1C1917" }}
          >
            {front}
          </p>

          <div
            className="flex items-center justify-center gap-1.5 mt-4"
            style={{ fontFamily: "var(--font-mono)", fontSize: 11, color: "#8A8278", fontWeight: 600 }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/>
            </svg>
            tap to reveal
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute inset-0 rounded-[20px] flex flex-col p-6"
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: "#fff",
            border: "2.5px solid #1C1917",
            boxShadow: "6px 6px 0 #1C1917",
          }}
        >
          <div className="flex justify-between items-start mb-4">
            <span
              className="text-[10px] font-bold px-2 py-1 rounded"
              style={{
                fontFamily: "var(--font-mono)", background: "#2B7A3E",
                color: "#fff", letterSpacing: 1,
              }}
            >
              ANSWER
            </span>
            <KStar size={18} color="#2B7A3E" />
          </div>

          <div
            className="w-full h-px my-1"
            style={{ background: "rgba(28,25,23,0.12)" }}
          />

          <p
            className="flex-1 flex items-center text-base leading-relaxed"
            style={{ color: "#1C1917" }}
          >
            {back}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
