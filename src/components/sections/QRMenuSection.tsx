'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, QrCode, ShoppingCart, Smartphone } from 'lucide-react';
import { useFormatNumber, useTranslation } from '@/i18n/useTranslation';
import { menuCategories, menuItems } from '@/data/menuData';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';

/** The guest's side: scan → browse → order, shown on a phone you can tap. */
export function QRMenuSection() {
  const { t, locale } = useTranslation();
  const fmt = useFormatNumber();
  const [selected, setSelected] = useState<string[]>([]);
  const toggle = (id: string) => setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));

  const steps = [
    { icon: QrCode, text: t.qrMenu.scanQR },
    { icon: Smartphone, text: t.qrMenu.browseMenu },
    { icon: ShoppingCart, text: t.qrMenu.placeOrder },
  ];

  return (
    <section className="relative overflow-hidden py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1360px] items-center gap-14 px-4 sm:px-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-6">
          <SectionHeader title={t.qrMenu.heading} lead={t.qrMenu.description} />
          <ol className="mt-10 grid gap-4">
            {steps.map(({ icon: Icon, text }, i) => (
              <Reveal as="li" key={i} delay={200 + i * 100} className="flex items-center gap-5 rounded-2xl border border-paper/8 bg-white p-4 shadow-[0_24px_50px_-40px_rgb(30_40_70/0.45)]">
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-gold/40 bg-gold/10 text-gold">
                  <Icon className="size-6" aria-hidden />
                </span>
                <span>
                  <span className="block text-[0.8rem] font-medium text-gold-soft">
                    {t.qrMenu.step} {i + 1}
                  </span>
                  <span className="block font-display text-lg font-medium text-paper">{text}</span>
                </span>
              </Reveal>
            ))}
          </ol>
        </div>

        <Reveal variant="scale" delay={150} className="relative lg:col-span-6">
          {/* QR card on the table */}
          <div className="absolute -left-2 top-[12%] z-10 hidden rounded-2xl border border-paper/8 bg-white p-3 shadow-[0_24px_40px_-20px_rgb(30_40_70/0.45)] sm:block [transform:rotate(-6deg)]" aria-hidden>
            <QrArt />
          </div>
          {/* Phone */}
          <div className="theme-dark relative mx-auto w-full max-w-[320px] rounded-[2.8rem] border border-paper/15 bg-[linear-gradient(180deg,#232d48,#0d1428)] p-3 shadow-[0_60px_120px_-50px_rgb(20_30_60/0.7)]">
            <div className="overflow-hidden rounded-[2.2rem] bg-[#070c18]">
              <div className="flex items-center justify-between px-6 py-3 text-xs text-mist">
                <span>12:45</span>
                <span className="h-4 w-16 rounded-full bg-black" aria-hidden />
                <span>5G</span>
              </div>
              <div className="h-[460px] space-y-4 overflow-y-auto px-4 pb-4">
                <div className="py-2 text-center">
                  <p className="font-display text-xl font-medium text-gold">{t.qrMenu.venue}</p>
                  <p className="mt-1 text-xs text-mist">{t.common.menu}</p>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
                  {menuCategories.map((cat) => (
                    <span key={cat.id} className="shrink-0 rounded-full border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs text-gold-soft">
                      {cat.name[locale]}
                    </span>
                  ))}
                </div>
                <ul className="space-y-2.5">
                  {menuItems.slice(0, 5).map((item) => {
                    const on = selected.includes(item.id);
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => toggle(item.id)}
                          aria-pressed={on}
                          className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left transition-[background-color,border-color,transform] duration-200 active:scale-[0.98] ${
                            on ? 'border-gold bg-gold/15' : 'border-paper/10 bg-paper/[0.04] hover:border-gold/40'
                          }`}
                        >
                          <span>
                            <span className="block text-sm font-medium text-paper">{item.name[locale]}</span>
                            <span className="block text-xs text-gold-soft">
                              {fmt(item.price)} {t.common.currency}
                            </span>
                          </span>
                          <span className={`grid size-7 place-items-center rounded-full transition-colors ${on ? 'bg-gold text-[#1a1206]' : 'border border-paper/15 text-mist'}`}>
                            {on ? <Check className="size-4" aria-hidden /> : <span aria-hidden>+</span>}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
                <AnimatePresence>
                  {selected.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, transform: 'translateY(16px)' }}
                      animate={{ opacity: 1, transform: 'translateY(0px)' }}
                      exit={{ opacity: 0, transform: 'translateY(16px)' }}
                      transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                      className="sticky bottom-0 pt-2"
                    >
                      <span className="flex min-h-12 w-full items-center justify-between rounded-2xl bg-[linear-gradient(180deg,#f3d9a0,#d9a64a)] px-4 text-sm font-semibold text-[#1a1206]">
                        {t.qrMenu.placeOrder}
                        <span className="rounded-full bg-black/10 px-2 py-0.5">
                          {t.qrMenu.added}: {selected.length}
                        </span>
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/** Decorative QR-like pattern (not a scannable code). */
function QrArt() {
  const cells = [
    1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1,
    0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1,
  ];
  return (
    <div className="grid size-20 grid-cols-9 gap-[2px]">
      {cells.map((on, i) => (
        <span key={i} className={on ? 'rounded-[1px] bg-[#0e1424]' : ''} />
      ))}
    </div>
  );
}
