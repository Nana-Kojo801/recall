interface IconProps {
  size?: number;
  color?: string;
}

export function TrashIcon({ size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M10 11v5M14 11v5" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
