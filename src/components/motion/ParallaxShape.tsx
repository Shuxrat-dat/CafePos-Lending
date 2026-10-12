"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * A large decorative shape drifting slower/faster than the content while its
 * section scrolls past. Scroll-linked (not scroll-jacked); static with reduced motion.
 */
export function ParallaxShape({
  children,
  className,
  distance = 120,
  rotate = 0,
}: {
  children: ReactNode;
  className?: string;
  /** Total travel in px across the section's pass through the viewport. */
  distance?: number;
  /** Degrees of slow rotation across the same pass. */
  rotate?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const transform = useTransform(scrollYProgress, (p) =>
    reduce ? "none" : `translate3d(0, ${(0.5 - p) * distance}px, 0) rotate(${(p - 0.5) * rotate}deg)`,
  );

  return (
    <motion.div ref={ref} aria-hidden className={`pointer-events-none ${className ?? ""}`} style={{ transform }}>
      {children}
    </motion.div>
  );
}
