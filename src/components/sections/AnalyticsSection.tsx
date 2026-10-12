'use client';

import { motion } from 'motion/react';
import { ShoppingBag, TrendingUp, Users, Wallet, type LucideIcon } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { CountUp } from '@/components/motion/CountUp';

const WEEK = [65, 78, 72, 85, 92, 88, 95];
const POPULAR: { id: string; ru: string; uz: string; orders: number; pct: number }[] = [
  { id: 'pasta', ru: 'Паста Карбонара', uz: 'Karbonara pastasi', orders: 45, pct: 85 },
  { id: 'cappuccino', ru: 'Капучино', uz: 'Kapuchino', orders: 38, pct: 72 },
  { id: 'steak', ru: 'Стейк из говядины', uz: 'Mol go‘shti bifshteksi', orders: 32, pct: 60 },
  { id: 'caesar', ru: 'Салат Цезарь', uz: 'Sezar salati', orders: 28, pct: 53 },
];

/** Owner's dashboard — every number is demo data and marked as such. */
export function AnalyticsSection() {
  const { t, locale } = useTranslation();
  const a = t.analytics;
  const stats: { icon: LucideIcon; label: string; value: number; decimals?: number; change: string }[] = [
    { icon: ShoppingBag, label: a.ordersToday, value: 127, change: '+12%' },
    { icon: Wallet, label: a.revenue, value: 24, decimals: 1, change: '+18%' },
    { icon: Users, label: a.activeTables, value: 18, change: '+5' },
    { icon: TrendingUp, label: a.avgCheck, value: 89, change: '+8%' },
  ];

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
        <SectionHeader title={t.features.analytics.title} lead={a.lead} align="split" />

        <Reveal variant="clip" delay={150} className="mt-12">
          <div className="theme-dark rounded-[30px] border border-paper/12 bg-[linear-gradient(180deg,#141d35,#0a1122)] p-5 shadow-[0_60px_120px_-50px_rgb(20_30_60/0.7)] sm:p-7">
            <div className="flex items-center justify-between">
              <span className="text-sm text-paper">CafePOS</span>
              <span className="rounded-full border border-paper/10 px-2.5 py-1 text-[0.7rem] text-mist">{t.footer.demoMode}</span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
              {stats.map(({ icon: Icon, label, value, decimals, change }) => (
                <div key={label} className="rounded-2xl border border-paper/8 bg-paper/[0.04] p-4">
                  <span className="grid size-10 place-items-center rounded-xl bg-cafe/15 text-cafe">
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <p className="mt-3 font-display text-2xl font-medium text-paper sm:text-3xl">
                    {decimals ? (
                      <CountUp value={value} format={(n) => (n / 10).toFixed(1).replace('.', ',')} />
                    ) : (
                      <CountUp value={value} />
                    )}
                  </p>
                  <p className="mt-1 text-xs text-mist">{label}</p>
                  <p className="mt-1 text-xs font-semibold text-fresh">{change}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div className="rounded-2xl border border-paper/8 bg-paper/[0.04] p-5">
                <p className="text-sm text-paper">{a.weekly}</p>
                <div className="mt-5 flex h-52 items-end gap-3">
                  {WEEK.map((v, i) => (
                    <div key={i} className="group flex h-full flex-1 flex-col items-center justify-end gap-2">
                      <span className="text-[0.65rem] text-mist opacity-0 transition-opacity group-hover:opacity-100">
                        {v} {a.ordersUnit}
                      </span>
                      <motion.span
                        className="block w-full origin-bottom rounded-t-lg bg-[linear-gradient(180deg,#f3d9a0,#c98a2b)]"
                        style={{ height: `${v}%` }}
                        initial={{ transform: 'scaleY(0)' }}
                        whileInView={{ transform: 'scaleY(1)' }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 + i * 0.06, ease: [0.23, 1, 0.32, 1] }}
                      />
                      <span className="text-[0.7rem] text-mist">{a.days[i]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-paper/8 bg-paper/[0.04] p-5">
                <p className="text-sm text-paper">{a.popular}</p>
                <ul className="mt-5 space-y-4">
                  {POPULAR.map((p, i) => (
                    <li key={p.id}>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-paper/90">{locale === 'uz' ? p.uz : p.ru}</span>
                        <span className="font-semibold text-gold">{p.orders}</span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-paper/10">
                        <motion.div
                          className="h-full origin-left rounded-full bg-[linear-gradient(90deg,#c98a2b,#f3d9a0)]"
                          initial={{ transform: 'scaleX(0)' }}
                          whileInView={{ transform: `scaleX(${p.pct / 100})` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.9, delay: 0.3 + i * 0.08, ease: [0.23, 1, 0.32, 1] }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-cafe/30 bg-cafe/10 p-4">
                  <span className="mt-1.5 size-2 shrink-0 rounded-full bg-cafe" aria-hidden />
                  <div>
                    <p className="text-sm font-semibold text-cafe-soft">{t.features.inventory.title}</p>
                    <p className="mt-1 text-xs text-mist">{t.features.inventory.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
