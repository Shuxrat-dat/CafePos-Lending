'use client';

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useSpring } from 'motion/react';
import { useRef, useState } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { SectionHeader } from '@/components/ui/SectionHeader';

const STEP_KEYS = ['step1', 'step2', 'step3', 'step4'] as const;

/** Four steps on a rail that fills as you scroll; each lights up when reached. */
export function OnboardingSection() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const [reached, setReached] = useState(reduce ? STEP_KEYS.length : 0);

  const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 75%', 'end 60%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    setReached(STEP_KEYS.reduce((n, _, i) => (v >= i / (STEP_KEYS.length - 1) - 0.02 ? i + 1 : n), 0));
  });

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
        <SectionHeader title={t.onboarding.heading} lead={t.onboarding.lead} align="split" />

        <ol ref={listRef} className="relative mt-16 grid gap-10 lg:grid-cols-4 lg:gap-6">
          <span className="absolute bottom-0 left-[27px] top-0 w-px bg-paper/10 lg:bottom-auto lg:left-[28px] lg:right-[28px] lg:top-[27px] lg:h-px lg:w-auto" aria-hidden />
          <motion.span className="absolute bottom-0 left-[27px] top-0 w-px origin-top bg-[linear-gradient(180deg,#d9ae5c,#a8741f)] lg:hidden" style={{ scaleY: reduce ? 1 : fill }} aria-hidden />
          <motion.span
            className="absolute left-[28px] right-[28px] top-[27px] hidden h-px origin-left bg-[linear-gradient(90deg,#d9ae5c,#a8741f)] lg:block"
            style={{ scaleX: reduce ? 1 : fill }}
            aria-hidden
          />
          {STEP_KEYS.map((key, i) => {
            const on = reached > i;
            return (
              <li key={key} className="relative grid grid-cols-[56px_1fr] gap-5 lg:grid-cols-1">
                <span
                  className={`relative z-10 grid size-14 place-items-center rounded-full border font-display text-sm tabular-nums transition-[background-color,border-color,color,box-shadow] duration-500 ${
                    on ? 'border-gold bg-gold text-[#1a1206] shadow-[0_0_0_6px_rgb(192_141_53/0.12),0_10px_30px_-6px_rgb(192_141_53/0.6)]' : 'border-paper/15 bg-ink text-mist'
                  }`}
                  aria-hidden
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className={`font-display text-[1.15rem] font-medium leading-snug text-paper transition-opacity duration-500 lg:pt-2 ${on ? 'opacity-100' : 'opacity-55'}`}>
                  <span className="sr-only">{i + 1}. </span>
                  {t.onboarding[key]}
                </h3>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
