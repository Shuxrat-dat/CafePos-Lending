"use client";

import { motion, useScroll, useTransform } from "motion/react";

/**
 * Fixed light behind the whole page. Three glows cross-fade (opacity only —
 * composited, no repaint) as the story moves: cool navy around products,
 * deep blue around the system demo, warm amber towards the finale.
 */
export function AmbientBackdrop() {
  const { scrollYProgress } = useScroll();
  const navy = useTransform(scrollYProgress, [0, 0.12, 0.4, 0.6], [0.4, 1, 0.8, 0.2]);
  const blue = useTransform(scrollYProgress, [0.25, 0.45, 0.7], [0, 1, 0.3]);
  const warm = useTransform(scrollYProgress, [0.55, 0.8, 1], [0, 0.7, 1]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-50 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(80%_60%_at_15%_30%,rgb(150_180_235/0.3),transparent_70%)]"
        style={{ opacity: navy }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(70%_60%_at_80%_55%,rgb(175_160_235/0.2),transparent_70%)]"
        style={{ opacity: blue }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_100%,rgb(240_200_120/0.32),transparent_70%)]"
        style={{ opacity: warm }}
      />
      <div className="noise absolute inset-0 opacity-[0.035]" />
    </div>
  );
}
