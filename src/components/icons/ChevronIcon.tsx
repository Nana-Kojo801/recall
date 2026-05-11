interface IconProps {
  size?: number;
  color?: string;
  direction?: "right" | "left" | "down" | "up";
}

const rotations = { right: 0, down: 90, left: 180, up: 270 };

export function ChevronIcon({ size = 24, color = "currentColor", direction = "right" }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotations[direction]}deg)` }}
    >
      <path d="M9 6l6 6-6 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
