interface IconProps {
  size?: number;
  color?: string;
}

export function SpinnerIcon({ size = 24, color = "currentColor" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ animation: "spin 1s linear infinite" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" strokeOpacity="0.25"/>
      <path d="M21 12a9 9 0 0 0-9-9" stroke={color} strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
