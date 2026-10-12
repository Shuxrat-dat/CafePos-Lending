"use client";

import { animate, useInView, useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";

type Props = {
  value: number;
  /** Where the first count starts (defaults to 0). */
  from?: number;
  /** Formats the in-between numbers too, so keep it cheap. */
  format?: (n: number) => string;
  duration?: number;
  className?: string;
};

const defaultFormat = (n: number) => Math.round(n).toLocaleString("ru-RU").replace(/ |,/g, " ");

/**
 * Number transition. Counts up once when first seen; afterwards animates
 * from the previously shown value when `value` changes. Writes to the DOM
 * directly, so the count never re-renders React.
 */
export function CountUp({ value, from = 0, format = defaultFormat, duration = 0.9, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(from);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    if (reduce) {
      el.textContent = format(value);
      shown.current = value;
      return;
    }
    const controls = animate(shown.current, value, {
      duration,
      ease: [0.23, 1, 0.32, 1],
      onUpdate: (v) => {
        el.textContent = format(v);
        shown.current = v;
      },
    });
    return () => controls.stop();
  }, [inView, value, duration, format, reduce]);

  // Server and no-JS render the final value; the count only starts once seen.
  return (
    <span ref={ref} className={`tabular-nums ${className ?? ""}`}>
      {format(value)}
    </span>
  );
}
