import { useId, type CSSProperties } from "react";

/**
 * Nested architectural arches (portal / iwan silhouettes), drawn as thin gold
 * outlines. `draw` makes each outline trace itself (CSS, staggered by --i),
 * either on load (`draw="load"`) or when an ancestor `[data-reveal]` is shown.
 */
type Props = {
  className?: string;
  count?: number;
  draw?: "load" | "reveal" | false;
  /** Base delay for the load sequence, ms. */
  delay?: number;
  opacity?: number;
};

const W = 1000;
const H = 1000;

function archPath(inset: number) {
  const x0 = 120 + inset;
  const x1 = W - 120 - inset;
  const r = (x1 - x0) / 2;
  const top = 80 + inset * 1.15;
  return `M${x0} ${H}V${top + r}A${r} ${r} 0 0 1 ${x1} ${top + r}V${H}`;
}

export function Arches({ className, count = 4, draw = false, delay = 0, opacity = 1 }: Props) {
  const id = useId().replace(/:/g, "");
  const insets = Array.from({ length: count }, (_, i) => i * 70);

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className={className} fill="none" aria-hidden preserveAspectRatio="xMidYMax meet">
      <defs>
        <linearGradient id={`arch-${id}`} x1="0" y1="0" x2="0" y2={H} gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#C99A45" stopOpacity={0.9 * opacity} />
          <stop offset="0.55" stopColor="#C08D35" stopOpacity={0.4 * opacity} />
          <stop offset="1" stopColor="#C08D35" stopOpacity="0" />
        </linearGradient>
      </defs>
      <g stroke={`url(#arch-${id})`} strokeWidth="1.4" vectorEffect="non-scaling-stroke">
        {insets.map((inset, i) => (
          <path
            key={i}
            d={archPath(inset)}
            pathLength={1}
            className={draw === "load" ? "arch-draw-load" : draw === "reveal" ? "arch-draw" : undefined}
            style={{ "--i": i, "--d": `${delay}ms` } as CSSProperties}
          />
        ))}
      </g>
    </svg>
  );
}
