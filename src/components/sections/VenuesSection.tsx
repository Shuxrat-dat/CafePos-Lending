'use client';

import { Coffee, Cookie, Truck, UtensilsCrossed, type LucideIcon } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';

const VENUES: { key: 'coffeeShop' | 'cafe' | 'restaurant' | 'fastFood'; icon: LucideIcon }[] = [
  { key: 'coffeeShop', icon: Coffee },
  { key: 'cafe', icon: Cookie },
  { key: 'restaurant', icon: UtensilsCrossed },
  { key: 'fastFood', icon: Truck },
];

export function VenuesSection() {
  const { t } = useTranslation();
  const modules = [t.features.orderManagement.title, t.features.tableManagement.title, t.features.kitchenDisplay.title];

  return (
    <section id="venues" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
        <SectionHeader title={t.venues.heading} lead={t.venues.lead} />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {VENUES.map(({ key, icon: Icon }, idx) => {
            const data = t.venues[key];
            return (
              <Reveal key={key} delay={idx * 80}>
                <article className="group flex h-full flex-col rounded-[24px] border border-paper/8 bg-white p-6 shadow-[0_24px_50px_-38px_rgb(30_40_70/0.45)] transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-out)] hover:-translate-y-1 hover:border-cafe/30 hover:shadow-[0_40px_70px_-40px_rgb(180_98_11/0.35)]">
                  <span className="theme-dark grid size-14 place-items-center rounded-2xl bg-[linear-gradient(180deg,#1a2440,#0b1222)] text-cafe transition-transform duration-500 ease-[var(--ease-out)] group-hover:-rotate-6 group-hover:scale-105">
                    <Icon className="size-7" aria-hidden />
                  </span>
                  <h3 className="mt-6 font-display text-xl font-medium text-paper">{data.title}</h3>
                  <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-mist">{data.description}</p>
                  <ul className="mt-5 grid gap-1.5 border-t border-paper/6 pt-4 text-[0.85rem] text-paper/80">
                    {modules.map((m) => (
                      <li key={m} className="flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-gold" aria-hidden />
                        {m}
                      </li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
