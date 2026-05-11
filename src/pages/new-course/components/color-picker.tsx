import { motion } from "framer-motion";

const COLORS = [
  "#E8482C", // vermilion
  "#F4B400", // mustard
  "#2B7A3E", // forest green
  "#3B5BDB", // cobalt
  "#C93FA9", // magenta
  "#FF8A3D", // orange
  "#00A6A6", // teal
  "#6B4B9B", // purple
];

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {COLORS.map((color) => (
        <motion.button
          key={color}
          type="button"
          onClick={() => onChange(color)}
          className="w-10 h-10 rounded-[8px] relative flex items-center justify-center"
          style={{
            background: color,
            border: "2px solid #1C1917",
            boxShadow: value === color ? "0 0 0 3px #F4B400, 0 0 0 5px #1C1917" : "2px 2px 0 #1C1917",
          }}
          animate={{ scale: value === color ? 1.12 : 1 }}
          whileTap={{ scale: 0.9 }}
        >
          {value === color && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </motion.button>
      ))}
    </div>
  );
}
