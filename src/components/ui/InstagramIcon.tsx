interface InstagramIconProps {
  className?: string;
}

export function InstagramIcon({ className }: InstagramIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <rect
        x="1"
        y="1"
        width="22"
        height="22"
        rx="6"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle
        cx="12"
        cy="12"
        r="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="17.2" cy="6.9" r="1.2" fill="currentColor" />
    </svg>
  );
}
