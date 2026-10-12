'use client';

import { BarChart3, Building2, ChefHat, Menu as MenuIcon, Package, ShoppingCart, UserCog, Users, type LucideIcon } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import type { Translations } from '@/i18n/translations';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';

type FeatureKey = Exclude<keyof Translations['features'], 'heading' | 'lead'>;

const FEATURES: { key: FeatureKey; icon: LucideIcon; span: string }[] = [
  { key: 'orderManagement', icon: ShoppingCart, span: 'lg:col-span-6' },
  { key: 'kitchenDisplay', icon: ChefHat, span: 'lg:col-span-6' },
  { key: 'tableManagement', icon: Users, span: 'lg:col-span-4' },
  { key: 'digitalMenu', icon: MenuIcon, span: 'lg:col-span-4' },
  { key: 'analytics', icon: BarChart3, span: 'lg:col-span-4' },
  { key: 'inventory', icon: Package, span: 'lg:col-span-4' },
  { key: 'staff', icon: UserCog, span: 'lg:col-span-4' },
  { key: 'multiLocation', icon: Building2, span: 'lg:col-span-4' },
];

/** Bento of the eight modules; the two core ones are larger and carry a live mini-screen. */
export function FeaturesSection() {
  const { t } = useTranslation();

  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
        <SectionHeader title={t.features.heading} lead={t.features.lead} align="split" />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-12">
          {FEATURES.map(({ key, icon: Icon, span }, idx) => {
            const data = t.features[key];
            const lead = idx < 2;
            return (
              <Reveal key={key} delay={idx * 60} className={span}>
                <article
                  className={`group relative flex h-full flex-col overflow-hidden rounded-[26px] border bg-white p-6 shadow-[0_24px_50px_-38px_rgb(30_40_70/0.45)] transition-[transform,box-shadow,border-color] duration-500 ease-[var(--ease-out)] hover:-translate-y-1 hover:shadow-[0_40px_70px_-40px_rgb(30_40_70/0.5)] sm:p-7 ${
                    lead ? 'border-gold/30' : 'border-paper/8 hover:border-cafe/30'
                  }`}
                >
                  <span
                    className={`grid size-12 place-items-center rounded-2xl border transition-transform duration-500 ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:-rotate-6 ${
                      lead ? 'border-gold/40 bg-gold/10 text-gold' : 'border-cafe/25 bg-cafe/8 text-cafe'
                    }`}
                  >
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <h3 className="mt-6 font-display text-xl font-medium text-paper">{data.title}</h3>
                  <p className="mt-2 max-w-[48ch] text-[0.95rem] leading-relaxed text-mist">{data.description}</p>
                  {lead && <MiniScreen kind={key === 'kitchenDisplay' ? 'kds' : 'orders'} />}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** A tiny dark device screen that comes alive once the card is revealed. */
function MiniScreen({ kind }: { kind: 'orders' | 'kds' }) {
  return (
    <div className="theme-dark mt-6 overflow-hidden rounded-2xl border border-paper/10 bg-[linear-gradient(180deg,#141d35,#0a1122)] p-3" aria-hidden>
      {kind === 'orders' ? (
        <div className="grid gap-1.5">
          {[78, 62, 70].map((w, i) => (
            <div key={i} className="rv flex items-center gap-2 rounded-lg bg-paper/[0.05] px-2.5 py-2" style={{ '--rv': `${300 + i * 120}ms` } as React.CSSProperties}>
              <span className="size-1.5 rounded-full bg-cafe" />
              <span className="h-1.5 rounded-full bg-paper/25" style={{ width: `${w}%` }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-1.5">
          {['bg-cafe', 'bg-[#6b9bff]', 'bg-fresh'].map((c, i) => (
            <div key={c} className="rv rounded-lg bg-paper/[0.05] p-2" style={{ '--rv': `${300 + i * 120}ms` } as React.CSSProperties}>
              <span className="block h-1.5 w-2/3 rounded-full bg-paper/25" />
              <span className="mt-1.5 block h-1.5 w-1/2 rounded-full bg-paper/15" />
              <span className={`mt-2 block h-1 rounded-full ${c}`} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
