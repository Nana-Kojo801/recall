import { motion } from "framer-motion";
import type { Rating } from "@/lib/spaced-repetition/sm2";

interface RatingButtonsProps {
  onRate: (rating: Rating) => void;
  visible: boolean;
}

const RATINGS: { value: Rating; label: string; sub: string; bg: string; fg: string }[] = [
  { value: "hard", label: "Hard",  sub: "< 10 min", bg: "#E8482C", fg: "#fff" },
  { value: "okay", label: "Okay",  sub: "~ 1 day",  bg: "#F4B400", fg: "#1C1917" },
  { value: "easy", label: "Easy",  sub: "1+ day",   bg: "#2B7A3E", fg: "#fff" },
];

export function RatingButtons({ onRate, visible }: RatingButtonsProps) {
  return (
    <motion.div
      className="flex gap-3 px-5"
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 28 }}
      transition={{ type: "spring", damping: 22 }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
    >
      {RATINGS.map((r, i) => (
        <motion.button
          key={r.value}
          onClick={() => onRate(r.value)}
          className="flex-1 flex flex-col items-center gap-1 py-4 rounded-[12px] font-black text-lg transition-all duration-100"
          style={{
            background: r.bg, color: r.fg,
            border: "2.5px solid #1C1917",
            boxShadow: "4px 4px 0 #1C1917",
          }}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : 16 }}
          transition={{ delay: i * 0.06 }}
          whileTap={{ scale: 0.95, x: 2, y: 2 }}
          onTap={() => {
            const el = document.activeElement as HTMLElement;
            el?.blur();
          }}
        >
          <span style={{ fontFamily: "var(--font-serif)" }}>{r.label}</span>
          <span
            style={{
              fontFamily: "var(--font-mono)", fontSize: 10, fontWeight: 600,
              opacity: 0.85,
            }}
          >
            {r.sub}
          </span>
        </motion.button>
      ))}
    </motion.div>
  );
}
