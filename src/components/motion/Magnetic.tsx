"use client";

import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { useFinePointer } from "@/lib/hooks";

/**
 * Pulls its child a few pixels toward the cursor. Motion values only —
 * no React state on pointermove. Inert on touch and with reduced motion.
 */
export function Magnetic({ children, strength = 10, className }: { children: ReactNode; strength?: number; className?: string }) {
  const fine = useFinePointer();
  const reduce = useReducedMotion();
  const active = fine && !reduce;
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });
  const transform = useTransform([sx, sy], ([a, b]) => `translate3d(${a}px, ${b}px, 0)`);

  function onMove(e: PointerEvent<HTMLDivElement>) {
    if (!active) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - r.left) / r.width - 0.5) * strength * 2);
    y.set(((e.clientY - r.top) / r.height - 0.5) * strength);
  }
  function onLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div className={`inline-flex ${className ?? ""}`} style={{ transform }} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </motion.div>
  );
}
