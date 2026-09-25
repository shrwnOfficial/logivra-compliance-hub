import { useId } from "react";

type GreenUdyogLogoProps = {
  className?: string;
  showWordmark?: boolean;
};

/** Isometric leaf mark for GreenUdyog */
export function GreenUdyogLogo({
  className = "h-10 w-10",
  showWordmark = false,
}: GreenUdyogLogoProps) {
  const uid = useId().replace(/:/g, "");
  const bg = `gu-bg-${uid}`;
  const leafL = `gu-leafL-${uid}`;
  const leafR = `gu-leafR-${uid}`;
  const stem = `gu-stem-${uid}`;

  const mark = (
    <svg
      className={className}
      viewBox="0 0 80 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="GreenUdyog"
    >
      <defs>
        <linearGradient id={bg} x1="8" y1="72" x2="72" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#022c22" />
          <stop offset="0.5" stopColor="#0d9488" />
          <stop offset="1" stopColor="#5eead4" />
        </linearGradient>
        <linearGradient id={leafL} x1="18" y1="52" x2="42" y2="12" gradientUnits="userSpaceOnUse">
          <stop stopColor="#86efac" />
          <stop offset="1" stopColor="#16a34a" />
        </linearGradient>
        <linearGradient id={leafR} x1="38" y1="48" x2="62" y2="14" gradientUnits="userSpaceOnUse">
          <stop stopColor="#bbf7d0" />
          <stop offset="1" stopColor="#22c55e" />
        </linearGradient>
        <linearGradient id={stem} x1="36" y1="58" x2="44" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#14532d" />
          <stop offset="1" stopColor="#4ade80" />
        </linearGradient>
      </defs>
      <rect width="80" height="80" rx="20" fill={`url(#${bg})`} />
      {/* isometric ground tile */}
      <path
        d="M12 56 L40 68 L68 56 L40 44 Z"
        fill="#022c22"
        fillOpacity="0.35"
        stroke="#a7f3d0"
        strokeOpacity="0.25"
        strokeWidth="0.75"
      />
      <path d="M40 44 L68 56 L68 52 L40 40 Z" fill="#064e3b" fillOpacity="0.5" />
      <path d="M12 56 L40 68 L40 64 L12 52 Z" fill="#0f766e" fillOpacity="0.35" />
      {/* stem */}
      <path
        d="M38 58 L42 58 L44 32 L40 30 L36 32 Z"
        fill={`url(#${stem})`}
      />
      {/* left leaf face */}
      <path
        d="M40 30 C28 28 18 38 16 52 C22 48 32 42 40 38 Z"
        fill={`url(#${leafL})`}
      />
      {/* right leaf face */}
      <path
        d="M40 30 C52 26 64 36 66 50 C58 46 48 40 40 36 Z"
        fill={`url(#${leafR})`}
      />
      {/* leaf tip highlight */}
      <path
        d="M40 28 C44 20 48 16 40 14 C36 18 38 24 40 28 Z"
        fill="#ecfdf5"
        fillOpacity="0.85"
      />
      {/* vein lines */}
      <path
        d="M40 32 L40 54"
        stroke="#14532d"
        strokeOpacity="0.45"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M40 36 L28 48 M40 36 L52 46 M40 42 L24 52 M40 42 L56 50"
        stroke="#15803d"
        strokeOpacity="0.35"
        strokeWidth="0.9"
        strokeLinecap="round"
      />
    </svg>
  );

  if (!showWordmark) return mark;

  return (
    <span className="inline-flex items-center gap-2.5">
      {mark}
      <span className="leading-tight">
        <span className="block font-display text-base font-semibold tracking-tight text-foreground sm:text-lg">
          GreenUdyog
        </span>
        <span className="block text-[10px] font-medium text-muted-foreground sm:text-[11px]">
          Emissions clarity for small manufacturers
        </span>
      </span>
    </span>
  );
}
