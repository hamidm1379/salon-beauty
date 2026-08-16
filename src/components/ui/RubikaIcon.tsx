interface RubikaIconProps {
  className?: string;
}

export function RubikaIcon({ className }: RubikaIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      className={className}
    >
      <g transform="translate(50,50)">
        <path d="M 0,-40 L 34.6,-20 L 0,0 Z" fill="#8A3AB9" />
        <path d="M 34.6,-20 L 34.6,20 L 0,0 Z" fill="#E1306C" />
        <path d="M 34.6,20 L 0,40 L 0,0 Z" fill="#F77737" />
        <path d="M 0,40 L -34.6,20 L 0,0 Z" fill="#FCAF45" />
        <path d="M -34.6,20 L -34.6,-20 L 0,0 Z" fill="#405DE6" />
        <path d="M -34.6,-20 L 0,-40 L 0,0 Z" fill="#5851DB" />
      </g>
    </svg>
  );
}
