interface IconProps {
  size?: number;
  color?: string;
}

export function CalendarIcon({ size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="18" rx="3" stroke={color} strokeWidth="1.8"/>
      <path d="M3 9h18" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M8 2v3M16 2v3" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="8" cy="14" r="1" fill={color}/>
      <circle cx="12" cy="14" r="1" fill={color}/>
      <circle cx="16" cy="14" r="1" fill={color}/>
    </svg>
  );
}
