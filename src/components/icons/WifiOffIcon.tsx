interface IconProps {
  size?: number;
  color?: string;
}

export function WifiOffIcon({ size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 2l20 20" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M8.5 16.5A5 5 0 0 1 12 15c1.1 0 2.1.3 3 .8M5 13a9 9 0 0 1 4-2.3M19 13a9 9 0 0 0-3.5-2" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <circle cx="12" cy="20" r="1" fill={color}/>
    </svg>
  );
}
