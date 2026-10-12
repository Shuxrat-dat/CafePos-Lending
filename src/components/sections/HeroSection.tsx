'use client';

import { Check, Play } from 'lucide-react';
import type { CSSProperties } from 'react';
import { useTranslation } from '@/i18n/useTranslation';
import { Emblem } from '@/components/brand/YurtoraMark';
import { Button } from '@/components/ui/Button';
import { Magnetic } from '@/components/motion/Magnetic';
import { HeroServiceScene } from './HeroServiceScene';

/*
 * Intro (CSS, runs without JS): eyebrow 150ms → headline words 300ms+ →
 * lead 900ms → points 1050ms → buttons 1200ms. The service scene loops while visible.
 */
export function HeroSection() {
  const { t } = useTranslation();
  const d = (ms: number) => ({ '--d': `${ms}ms` }) as CSSProperties;
  const lineA = t.hero.heading.split(' ');
  const lineB = t.hero.headingHighlight.split(' ');

  return (
    <section id="home" className="relative isolate overflow-hidden pb-20 pt-[calc(var(--header-h)+3rem)] lg:min-h-[100svh] lg:pb-16">
      <div className="pointer-events-none absolute inset-0 -z-30 bg-[radial-gradient(110%_80%_at_70%_35%,#ffffff_0%,#f6f7f9_45%,#eceff4_100%)]" />
      <div className="anim-drift breathe pointer-events-none absolute -right-[16%] -top-[22%] -z-20 h-[80vmax] w-[80vmax] rounded-full bg-[radial-gradient(closest-side,rgb(240_169_69/0.32),rgb(180_98_11/0.08)_45%,transparent_70%)]" />
      <div
        className="anim-drift pointer-events-none absolute -bottom-[40%] -left-[22%] -z-20 h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(closest-side,rgb(150_180_235/0.28),transparent_70%)]"
        style={{ animationDelay: '-12s', animationDuration: '44s' }}
      />
      <div className="kerege pointer-events-none absolute inset-x-0 bottom-0 -z-20 h-[28%] opacity-50 [mask-image:linear-gradient(to_top,black,transparent)]" />

      <div className="mx-auto grid max-w-[1360px] items-center gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:gap-8 lg:px-10">
        <div className="lg:col-span-6">
          <p className="anim-rise flex items-center gap-2.5 text-[0.95rem] font-medium text-gold-soft" style={d(150)}>
            <Emblem className="size-5" />
            {t.hero.superheading}
          </p>

          <h1 className="mt-6 font-display text-[clamp(2.2rem,5.4vw,4.3rem)] font-medium leading-[1.02] display-tight">
            {[lineA, lineB].map((words, line) => (
              <span key={line} className="block">
                {words.map((w, i) => (
                  <span key={`${w}-${i}`}>
                    <span className="rt-word">
                      <span
                        className={`hero-word ${line === 1 ? 'text-gold-gradient' : 'text-paper'}`}
                        style={{ '--d': '300ms', '--w': (line === 1 ? lineA.length + 1 : 0) + i } as CSSProperties}
                      >
                        {w}
                      </span>
                    </span>
                    {i < words.length - 1 ? ' ' : null}
                  </span>
                ))}
              </span>
            ))}
          </h1>

          <p className="anim-rise mt-7 max-w-[36rem] text-[1.06rem] leading-relaxed text-mist sm:text-lg" style={d(900)}>
            {t.hero.description}
          </p>

          <ul className="anim-rise mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[0.92rem] text-paper/85" style={d(1050)}>
            {t.hero.points.map((p) => (
              <li key={p} className="flex items-center gap-2">
                <span className="grid size-5 place-items-center rounded-full bg-cafe/12 text-cafe">
                  <Check className="size-3" aria-hidden />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <div className="anim-rise mt-9 flex flex-col gap-3 sm:flex-row sm:items-center" style={d(1200)}>
            <Magnetic className="max-sm:w-full">
              <Button href="#contact" size="lg" arrow className="max-sm:w-full">
                {t.hero.ctaPrimary}
              </Button>
            </Magnetic>
            <Button href="#demo" variant="ghost" size="lg">
              <Play className="size-4 fill-cafe/20 text-cafe" aria-hidden />
              {t.hero.ctaSecondary}
            </Button>
          </div>
        </div>

        <div className="anim-fade lg:col-span-6" style={d(350)}>
          <HeroServiceScene />
        </div>
      </div>
    </section>
  );
}
