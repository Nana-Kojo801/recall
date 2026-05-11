interface IconProps {
  size?: number;
  color?: string;
}

export function BookIcon({ size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 4.5C4 3.12 5.12 2 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round"/>
      <path d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M8 7h8M8 11h6" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
