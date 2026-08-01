interface InstagramIconProps {
  className?: string;
}

export function InstagramIcon({ className }: InstagramIconProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="7"
        y="7"
        width="52"
        height="52"
        rx="15"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle
        cx="32"
        cy="32"
        r="13"
        stroke="currentColor"
        strokeWidth="3"
      />
      <circle
        cx="45.5"
        cy="18.5"
        r="3.2"
        fill="currentColor"
      />
    </svg>
  );
}