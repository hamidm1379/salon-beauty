export default function lineUnder() {
  return (
    <svg
      width="260"
      height="60"
      viewBox="0 0 260 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#E9D5FF" />
          <stop offset="50%" stopColor="#A78BFA" />
          <stop offset="100%" stopColor="#E9D5FF" />
        </linearGradient>

        <linearGradient id="flowerGradient" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#C4B5FD" />
          <stop offset="1" stopColor="#7C3AED" />
        </linearGradient>
      </defs>

      <path
        d="
          M15 30
          C35 30 38 20 55 20
          C70 20 75 30 95 30"
        stroke="url(#lineGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <path
        d="
M165 30
C185 30 190 20 205 20
C222 20 225 30 245 30"
        stroke="url(#lineGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      <g fill="url(#flowerGradient)">
        <ellipse cx="130" cy="17" rx="6" ry="9" />

        <ellipse cx="115" cy="30" rx="9" ry="6" />

        <ellipse cx="145" cy="30" rx="9" ry="6" />

        <ellipse cx="130" cy="43" rx="6" ry="9" />
      </g>

      <circle cx="130" cy="30" r="4" fill="#FFFFFF" />
      <circle cx="130" cy="30" r="2" fill="#8B5CF6" />

      <circle cx="98" cy="30" r="2" fill="#C4B5FD" />
      <circle cx="162" cy="30" r="2" fill="#C4B5FD" />
    </svg>
  );
}
