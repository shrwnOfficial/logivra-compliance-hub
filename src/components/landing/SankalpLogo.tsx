const BRAND_NAME = "Sankalp";
const TAGLINE = "Compliance mapped from your paperwork";

const LOGO_SRC = "/sankalp-logo.png";

type SankalpLogoProps = {
  className?: string;
  showWordmark?: boolean;
};

/** Globe cradled by leaves — brand mark from provided artwork */
export function SankalpLogo({ className = "h-10 w-10", showWordmark = false }: SankalpLogoProps) {
  const mark = (
    <img
      src={LOGO_SRC}
      alt={BRAND_NAME}
      width={80}
      height={80}
      className={`${className} rounded-[18%] object-contain`}
      decoding="async"
    />
  );

  if (!showWordmark) return mark;

  return (
    <span className="inline-flex items-center gap-2.5">
      {mark}
      <span className="leading-tight">
        <span
          className="block font-display text-base font-semibold tracking-tight text-brand-wordmark sm:text-lg"
        >
          {BRAND_NAME}
        </span>
        <span className="block text-[10px] font-medium text-brand-tagline sm:text-[11px]">
          {TAGLINE}
        </span>
      </span>
    </span>
  );
}

export const BRAND = { name: BRAND_NAME, tagline: TAGLINE };
