/**
 * Shared motion language for YURTORA.
 * Entrances that must survive a JS failure use the CSS reveal system
 * (`<Reveal variant=…>` + globals.css). These variants are for UI that only
 * exists once JS runs: modals, tabs, form states, interactive panels.
 */
import type { Transition, Variants } from "motion/react";

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

export const springSoft: Transition = { type: "spring", duration: 0.5, bounce: 0.15 };

/** Fade up — the default entrance. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, transform: "translateY(10px)" },
  show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.45, ease: EASE_OUT } },
};

/** Parent that staggers its children's `fadeUp` (or any `hidden/show` variants). */
export const staggerChildren = (stagger = 0.05, delay = 0): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

/** Clip reveal from the bottom edge up. */
export const clipReveal: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0.4 },
  show: { clipPath: "inset(0 0 0% 0)", opacity: 1, transition: { duration: 0.7, ease: EASE_IN_OUT } },
};

/** Crossfade with a little blur to hide the seam between two states. */
export const softSwap: Variants = {
  hidden: { opacity: 0, filter: "blur(4px)", transform: "translateY(4px)" },
  show: { opacity: 1, filter: "blur(0px)", transform: "translateY(0px)", transition: { duration: 0.24, ease: EASE_OUT } },
  exit: { opacity: 0, filter: "blur(4px)", transition: { duration: 0.14, ease: EASE_OUT } },
};

/** Inline message (validation error, hint) appearing under a field. */
export const inlineMessage: Variants = {
  hidden: { opacity: 0, transform: "translateY(-4px)" },
  show: { opacity: 1, transform: "translateY(0px)", transition: { duration: 0.2, ease: EASE_OUT } },
  exit: { opacity: 0, transition: { duration: 0.12 } },
};

/** Draw an SVG path (use with `motion.path`). */
export const drawPath = (duration = 0.9, delay = 0): Variants => ({
  hidden: { pathLength: 0, opacity: 0 },
  show: { pathLength: 1, opacity: 1, transition: { duration, delay, ease: EASE_IN_OUT } },
});

/** Modal panel: centred scale on desktop, bottom sheet on phones. */
export const modalPanel = (desktop: boolean, reduce: boolean): Variants =>
  reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 }, exit: { opacity: 0 } }
    : desktop
      ? {
          hidden: { opacity: 0, transform: "translateY(14px) scale(0.96)" },
          show: { opacity: 1, transform: "translateY(0px) scale(1)", transition: { duration: 0.34, ease: EASE_OUT } },
          exit: { opacity: 0, transform: "translateY(8px) scale(0.98)", transition: { duration: 0.18, ease: EASE_OUT } },
        }
      : {
          hidden: { transform: "translateY(100%)" },
          show: { transform: "translateY(0%)", transition: { duration: 0.44, ease: EASE_DRAWER } },
          exit: { transform: "translateY(100%)", transition: { duration: 0.24, ease: EASE_OUT } },
        };

export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};
