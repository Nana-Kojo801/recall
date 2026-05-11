interface IconProps {
  size?: number;
  color?: string;
}

export function BrainIcon({ size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9.5 2a4.5 4.5 0 0 0-4.5 4.5c0 .8.2 1.6.6 2.2A4 4 0 0 0 4 12a4 4 0 0 0 2.5 3.7V17a3 3 0 0 0 3 3h5a3 3 0 0 0 3-3v-1.3A4 4 0 0 0 20 12a4 4 0 0 0-1.6-3.2c.4-.7.6-1.4.6-2.2A4.5 4.5 0 0 0 14.5 2" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 2v18" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
      <path d="M9 8c0 1.1.9 2 2 2M15 8c0 1.1-.9 2-2 2" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}
