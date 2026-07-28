// components/home/LeafPattern.tsx

export function LeafPattern() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 w-full h-full"
      viewBox="0 0 680 500"
      preserveAspectRatio="xMidYMid slice"
      fill="none"
      aria-hidden="true"
    >
      <style>{`
        @keyframes leafTwinkle {
          0%, 100% { opacity: 0.18; }
          50%      { opacity: 0.5; }
        }
        .leaf-branch {
          animation: leafTwinkle 6.5s ease-in-out infinite;
        }
      `}</style>

      <defs>
        {/* یک برگ باریک با رگ‌برگ مرکزی + رگ‌برگ‌های فرعی مورب (حالت هنری) */}
        <g id="leafArt">
          <path
            d="M0,0 C7,-9 10,-20 6,-34 C3,-44 -3,-44 -6,-34 C-10,-20 -7,-9 0,0 Z"
            fill="var(--color-primary)"
            fillOpacity="0.55"
          />
          <path d="M0,-2 C1,-14 0,-26 0,-38" stroke="var(--color-primary)" strokeWidth="0.6" opacity="0.6" />
          <path d="M0,-10 C3,-14 5,-16 6,-20" stroke="var(--color-primary)" strokeWidth="0.4" opacity="0.45" />
          <path d="M0,-10 C-3,-14 -5,-16 -6,-20" stroke="var(--color-primary)" strokeWidth="0.4" opacity="0.45" />
          <path d="M0,-20 C2,-24 4,-26 5,-29" stroke="var(--color-primary)" strokeWidth="0.4" opacity="0.4" />
          <path d="M0,-20 C-2,-24 -4,-26 -5,-29" stroke="var(--color-primary)" strokeWidth="0.4" opacity="0.4" />
        </g>

        {/* یک شاخه‌ی کامل: پیچش پایه + ساقه + ۱۱ برگ کوچک‌شونده به سمت نوک */}
        <g id="branchArt">
          <path
            d="M60,470 C54,428 92,424 93,394 C94,370 63,363 56,384 C51,398 67,406 79,392"
            stroke="var(--color-primary)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.55"
          />
          <path
            d="M79,392 C104,347 78,298 112,252 C136,219 119,172 152,133 C170,110 160,80 182,55"
            stroke="var(--color-primary)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.55"
          />
          <use href="#leafArt" transform="translate(88,358) rotate(-40) scale(1.05)" />
          <use href="#leafArt" transform="translate(102,367) rotate(33) scale(0.85)" />
          <use href="#leafArt" transform="translate(103,300) rotate(-30) scale(1.15)" />
          <use href="#leafArt" transform="translate(118,309) rotate(38) scale(0.75)" />
          <use href="#leafArt" transform="translate(124,252) rotate(-35) scale(0.9)" />
          <use href="#leafArt" transform="translate(140,259) rotate(26) scale(1.1)" />
          <use href="#leafArt" transform="translate(143,198) rotate(-24) scale(1)" />
          <use href="#leafArt" transform="translate(158,206) rotate(34) scale(0.7)" />
          <use href="#leafArt" transform="translate(166,148) rotate(-30) scale(0.8)" />
          <use href="#leafArt" transform="translate(180,153) rotate(22) scale(0.95)" />
          <use href="#leafArt" transform="translate(178,100) rotate(-8) scale(0.6)" />
        </g>
      </defs>

      {/* شاخه: گوشه‌ی پایین-چپ، رو به بالا (شاخه‌ی بالا حذف شد، جایگزین با پروانه‌ها در Butterflies.tsx) */}
      <use href="#branchArt" className="leaf-branch" style={{ animationDelay: "0s" }} />
    </svg>
  );
}