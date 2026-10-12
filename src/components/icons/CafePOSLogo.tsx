import { useId } from 'react';

/**
 * CafePOS mark: a dark squircle (the same device language as StoreGo POS)
 * holding a gold cup — rim, handle and two curls of steam.
 */
export function CafePOSIcon({ className = 'size-9' }: { className?: string }) {
  const id = useId().replace(/:/g, '');
  const gold = `cp-gold-${id}`;
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-hidden>
      <defs>
        <linearGradient id={gold} x1="14" y1="10" x2="52" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#F6DDA4" />
          <stop offset="0.5" stopColor="#E2B65C" />
          <stop offset="1" stopColor="#B07A2A" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="16" fill="#0E1424" />
      <rect x="4.75" y="4.75" width="54.5" height="54.5" rx="15.25" stroke={`url(#${gold})`} strokeOpacity="0.45" strokeWidth="1.5" />
      {/* Steam */}
      <path d="M26 14c-3 3 3 5 0 9M34 13c-3 3 3 5 0 9" stroke={`url(#${gold})`} strokeWidth="2.2" strokeLinecap="round" />
      {/* Cup */}
      <path d="M17 28h28v6c0 8-6.3 14-14 14s-14-6-14-14v-6Z" fill={`url(#${gold})`} />
      <path d="M45 31h2.5a5 5 0 0 1 0 10H43" stroke={`url(#${gold})`} strokeWidth="2.6" strokeLinecap="round" />
      {/* Saucer */}
      <path d="M14 51h34" stroke={`url(#${gold})`} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

export function CafePOSLogo({ className = '', iconClassName = 'size-9', showByline = true }: { className?: string; iconClassName?: string; showByline?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <CafePOSIcon className={iconClassName} />
      <span className="flex flex-col leading-none">
        <span className="flex items-center gap-1.5 font-display text-[1.08rem] font-semibold tracking-tight text-paper">
          <span>Cafe</span>
          <span className="rounded-md border border-gold/40 bg-gold/12 px-1.5 py-0.5 text-[0.6rem] font-semibold tracking-widest text-gold-soft">POS</span>
        </span>
        {showByline && <span className="mt-1 text-[0.6rem] font-medium tracking-[0.22em] text-mist">By YURTORA</span>}
      </span>
    </span>
  );
}
