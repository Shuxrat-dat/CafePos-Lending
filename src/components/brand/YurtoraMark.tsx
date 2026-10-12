import { useId, type CSSProperties } from "react";

/**
 * YURTORA mark: two wings meeting in a single point — a "Y" — inside a ring.
 * Geometry is shared with the hero scene, favicon and OG image.
 */
export const LOGO = {
  ring: { cx: 32, cy: 29, r: 24.5 },
  wingMain: "M8.5 9.5L13 4.5C25 6.5 33.6 16 32 46.5C28 31 17 25 8.5 9.5Z",
  wingLow: "M15.5 26.5L18.5 24C26 26.5 31 35 31.6 47.4C26.6 40 20 35.4 15.5 26.5Z",
  wingRight: "M53 14.5L57.5 10C46 10 35.6 20 33.6 46C37.4 31 46.6 24.6 53 14.5Z",
  /** Light catching the fold of the main wing. */
  fold: "M11 7.2C24 8.6 31.8 18 31.8 41",
} as const;

type EmblemProps = {
  className?: string;
  /** Accessible name. Omit when the mark is decorative (e.g. next to the wordmark). */
  title?: string;
  /** Hide the ring (e.g. very small sizes). */
  ringless?: boolean;
};

export function Emblem({ className, title, ringless }: EmblemProps) {
  const id = useId().replace(/:/g, "");
  const metal = `metal-${id}`;
  const ring = `ring-${id}`;

  return (
    <svg
      viewBox="0 0 64 58"
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      fill="none"
    >
      <defs>
        <linearGradient id={metal} x1="10" y1="4" x2="40" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F2DCA8" />
          <stop offset="0.38" stopColor="#D2A253" />
          <stop offset="0.7" stopColor="#A87424" />
          <stop offset="1" stopColor="#E3BE74" />
        </linearGradient>
        <linearGradient id={ring} x1="8" y1="50" x2="58" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#B8862F" stopOpacity="0.35" />
          <stop offset="0.6" stopColor="#D9AE5C" />
          <stop offset="1" stopColor="#F2D9A2" />
        </linearGradient>
      </defs>
      {!ringless && <circle cx={LOGO.ring.cx} cy={LOGO.ring.cy} r={LOGO.ring.r} stroke={`url(#${ring})`} strokeWidth="1.5" />}
      <path d={LOGO.wingLow} fill={`url(#${metal})`} opacity="0.85" />
      <path d={LOGO.wingMain} fill={`url(#${metal})`} />
      <path d={LOGO.wingRight} fill={`url(#${metal})`} />
      <path d={LOGO.fold} stroke="#FFF4D8" strokeOpacity="0.7" strokeWidth="0.6" strokeLinecap="round" />
    </svg>
  );
}

/** The "A" of the wordmark: an open chevron with a four-point star. */
function LogoA() {
  return (
    <svg viewBox="0 0 12 13" className="ml-[0.06em] inline-block h-[0.74em] w-auto" aria-hidden fill="none">
      <path d="M0.9 12.6L6 0.9L11.1 12.6" stroke="currentColor" strokeWidth="1.55" />
      <path d="M6 8.1L6.45 9.55L7.9 10L6.45 10.45L6 11.9L5.55 10.45L4.1 10L5.55 9.55Z" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <span className={`inline-flex items-center font-display font-normal leading-none tracking-[0.2em] ${className ?? ""}`} style={style}>
      YURTOR
      <LogoA />
    </span>
  );
}

export function Logo({
  className,
  emblemClassName = "size-9",
  tagline,
}: {
  className?: string;
  emblemClassName?: string;
  /** Adds "Business Beyond Borders" under the wordmark. */
  tagline?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-3 ${className ?? ""}`}>
      <Emblem className={emblemClassName} />
      <span className="flex flex-col">
        <Wordmark className="text-[0.95rem] text-gold-soft" />
        {tagline && <span className="mt-1.5 text-[0.56rem] tracking-[0.32em] text-mist">BUSINESS BEYOND BORDERS</span>}
      </span>
    </span>
  );
}
