interface InstagramIconProps {
  className?: string;
  size?: number;
}

export function InstagramIcon({ className, size = 28 }: InstagramIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect
        x="12"
        y="12"
        width="40"
        height="40"
        rx="13"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <circle
        cx="32"
        cy="32"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
      />
      <circle
        cx="43"
        cy="21"
        r="2.5"
        fill="currentColor"
      />
    </svg>
  );
}
