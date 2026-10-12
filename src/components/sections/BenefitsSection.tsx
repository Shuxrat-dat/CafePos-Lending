'use client';

import { BarChart2, Building, Database, Eye, LayoutGrid, Menu, type LucideIcon } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';

const BENEFITS: { key: 'organized' | 'transparent' | 'centralized' | 'convenient' | 'controlled' | 'scalable'; icon: LucideIcon }[] = [
  { key: 'organized', icon: LayoutGrid },
  { key: 'transparent', icon: Eye },
  { key: 'centralized', icon: Database },
  { key: 'convenient', icon: Menu },
  { key: 'controlled', icon: BarChart2 },
  { key: 'scalable', icon: Building },
];

export function BenefitsSection() {
  const { t } = useTranslation();

  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
        <SectionHeader title={t.benefits.heading} />
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map(({ key, icon: Icon }, idx) => {
            const dark = idx === 0;
            return (
              <Reveal key={key} delay={idx * 70}>
                <article
                  className={`group flex h-full items-center gap-5 rounded-[24px] border p-6 transition-[transform,box-shadow] duration-500 ease-[var(--ease-out)] hover:-translate-y-1 ${
                    dark
                      ? 'theme-dark border-paper/10 bg-[linear-gradient(160deg,#152039_0%,#0a1020_75%)] shadow-[0_40px_80px_-40px_rgb(20_30_60/0.6)]'
                      : 'border-paper/8 bg-white shadow-[0_24px_50px_-38px_rgb(30_40_70/0.45)]'
                  }`}
                >
                  <span
                    className={`grid size-12 shrink-0 place-items-center rounded-2xl border transition-transform duration-500 ease-[var(--ease-out)] group-hover:-rotate-6 ${
                      dark ? 'border-gold/40 bg-gold/15 text-gold' : 'border-cafe/25 bg-cafe/8 text-cafe'
                    }`}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <h3 className="font-display text-lg font-medium leading-snug text-paper">{t.benefits[key]}</h3>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
