interface IconProps {
  size?: number;
  color?: string;
}

export function UploadIcon({ size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 16V4M12 4l-4 4M12 4l4 4" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M4 20h16" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );
}
