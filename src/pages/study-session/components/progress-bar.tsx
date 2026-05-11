interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="flex items-center gap-2 px-5 py-3">
      <div className="flex gap-1 flex-1">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="flex-1 h-2 rounded-sm transition-all duration-300"
            style={{
              background: i < current ? "#2B7A3E" : i === current ? "#E8482C" : "#F5EFE2",
              border: i <= current ? "1.5px solid #1C1917" : "1.5px solid rgba(28,25,23,0.15)",
            }}
          />
        ))}
      </div>
      <span
        className="text-[10px] font-bold shrink-0"
        style={{ fontFamily: "var(--font-mono)", color: "#8A8278" }}
      >
        {current}/{total}
      </span>
    </div>
  );
}
