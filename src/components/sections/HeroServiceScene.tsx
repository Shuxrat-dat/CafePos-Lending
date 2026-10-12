'use client';

import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { Bell, Check, ChefHat, Coffee, Send } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { menuItems } from '@/data/menuData';
import { useFormatNumber, useTranslation } from '@/i18n/useTranslation';

/**
 * A looping service, told across two devices:
 *   waiter picks table 2 on the tablet → three dishes join the order →
 *   "To kitchen" → the ticket lands on the kitchen screen → New → Cooking
 *   (progress fills) → Ready, the bell rings → the cup is served.
 * Runs only while visible; with reduced motion it shows the finished service.
 * Dishes and sums are demo data.
 */

const BASKET = ['pasta-carbonara', 'cappuccino', 'caesar-salad'].map((id) => menuItems.find((m) => m.id === id)!);
const TABLE = 2;

type Stage = 'idle' | 'table' | 'sent' | 'new' | 'cooking' | 'ready' | 'served';
type Scene = { stage: Stage; items: number; cycle: number };

const START: Scene = { stage: 'idle', items: 0, cycle: 0 };
const DONE: Scene = { stage: 'served', items: 3, cycle: 0 };
const ORDER: Stage[] = ['idle', 'table', 'sent', 'new', 'cooking', 'ready', 'served'];
const atLeast = (s: Stage, min: Stage) => ORDER.indexOf(s) >= ORDER.indexOf(min);

export function HeroServiceScene() {
  const { t, locale } = useTranslation();
  const s = t.hero.scene;
  const fmt = useFormatNumber();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { margin: '-10% 0px -10% 0px' });
  const reduce = useReducedMotion();
  const [scene, setScene] = useState<Scene>(START);

  useEffect(() => {
    if (reduce || !inView) return;
    const timers: number[] = [];
    const at = (ms: number, fn: (p: Scene) => Scene) => timers.push(window.setTimeout(() => setScene(fn), ms));
    const run = () => {
      at(0, (p) => ({ ...START, cycle: p.cycle + 1 }));
      at(600, (p) => ({ ...p, stage: 'table' }));
      BASKET.forEach((_, i) => at(1300 + i * 650, (p) => ({ ...p, items: i + 1 })));
      at(3500, (p) => ({ ...p, stage: 'sent' }));
      at(4000, (p) => ({ ...p, stage: 'new' }));
      at(5100, (p) => ({ ...p, stage: 'cooking' }));
      at(7600, (p) => ({ ...p, stage: 'ready' }));
      at(8700, (p) => ({ ...p, stage: 'served' }));
    };
    run();
    const loop = window.setInterval(run, 11000);
    return () => {
      timers.forEach(clearTimeout);
      clearInterval(loop);
    };
  }, [inView, reduce]);

  const view = reduce ? DONE : scene;
  const items = BASKET.slice(0, view.items);
  const total = items.reduce((sum, m) => sum + m.price, 0);
  const onKitchen = atLeast(view.stage, 'new');
  const status = view.stage === 'ready' || view.stage === 'served' ? 'ready' : view.stage === 'cooking' ? 'cooking' : 'new';
  const tone = { new: 'bg-cafe/20 text-cafe-soft', cooking: 'bg-[#6b9bff]/20 text-[#a9c4ff]', ready: 'bg-fresh/20 text-fresh' }[status];

  return (
    <div ref={rootRef} className="relative mx-auto aspect-[10/9] w-full max-w-[620px]" aria-hidden>
      <div className="absolute inset-x-[4%] bottom-[2%] h-[14%] rounded-[50%] bg-[radial-gradient(closest-side,rgb(30_40_70/0.16),transparent)]" />

      {/* ---------------- Waiter tablet ---------------- */}
      <div className="absolute left-0 top-[3%] w-[58%] [transform:rotate(-3deg)]">
        <div className="theme-dark rounded-[22px] border border-paper/12 bg-[linear-gradient(180deg,#1a2440,#0b1222)] p-2 shadow-[0_40px_80px_-30px_rgb(20_30_60/0.6)]">
          <div className="overflow-hidden rounded-[15px] bg-[#070c18] text-[clamp(0.5rem,1.3vw,0.7rem)]">
            <div className="flex items-center justify-between border-b border-paper/8 px-3 py-2">
              <span className="text-paper">{s.waiter}</span>
              <span className="rounded-full bg-cafe/15 px-2 py-0.5 text-cafe-soft">
                {s.table} {TABLE}
              </span>
            </div>
            {/* Mini floor plan */}
            <div className="grid grid-cols-3 gap-1.5 px-3 pt-2.5">
              {[1, 2, 3, 4, 5, 6].map((n) => {
                const on = n === TABLE && atLeast(view.stage, 'table');
                return (
                  <span
                    key={n}
                    className={`grid h-[2.4em] place-items-center rounded-md border transition-colors duration-500 ${
                      on ? 'border-cafe bg-cafe/20 text-cafe-soft' : 'border-paper/10 bg-paper/[0.03] text-mist'
                    }`}
                  >
                    {n}
                  </span>
                );
              })}
            </div>
            {/* Order lines */}
            <div className="flex min-h-[7.6em] flex-col gap-1 px-3 py-2.5">
              <AnimatePresence initial={false}>
                {items.map((m) => (
                  <motion.div
                    key={`${view.cycle}-${m.id}`}
                    initial={{ opacity: 0, transform: 'translateY(6px)', backgroundColor: 'rgb(240 169 69 / 0.2)' }}
                    animate={{ opacity: 1, transform: 'translateY(0px)', backgroundColor: 'rgb(240 169 69 / 0)' }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1], backgroundColor: { duration: 1.1 } }}
                    className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1"
                  >
                    <span className="truncate text-paper">{m.name[locale]}</span>
                    <span className="shrink-0 tabular-nums text-mist">{fmt(m.price)}</span>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="flex items-center justify-between gap-2 border-t border-paper/8 px-3 py-2">
              <span className="font-display text-[1.25em] text-gold tabular-nums">
                {fmt(total)} <span className="text-[0.6em] text-mist">{t.common.currency}</span>
              </span>
              <motion.span
                animate={view.stage === 'sent' && !reduce ? { transform: ['scale(1)', 'scale(0.94)', 'scale(1)'] } : { transform: 'scale(1)' }}
                transition={{ duration: 0.3 }}
                className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium transition-colors duration-300 ${
                  atLeast(view.stage, 'sent') ? 'bg-fresh/20 text-fresh' : 'bg-[linear-gradient(180deg,#f3d9a0,#d9a64a)] text-[#1a1206]'
                }`}
              >
                {atLeast(view.stage, 'sent') ? <Check className="size-[1.1em]" /> : <Send className="size-[1.1em]" />}
                {atLeast(view.stage, 'sent') ? s.sent : s.sendToKitchen}
              </motion.span>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Kitchen display ---------------- */}
      <div className="absolute bottom-[6%] right-0 w-[56%] [transform:rotate(2deg)]">
        <div className="theme-dark rounded-[20px] border border-paper/12 bg-[linear-gradient(180deg,#232d48,#0d1428)] p-2 shadow-[0_40px_80px_-30px_rgb(20_30_60/0.6)]">
          <div className="overflow-hidden rounded-[13px] bg-[#070c18] text-[clamp(0.5rem,1.25vw,0.68rem)]">
            <div className="flex items-center justify-between border-b border-paper/8 px-3 py-2">
              <span className="flex items-center gap-1.5 text-paper">
                <ChefHat className="size-[1.2em] text-cafe" /> {s.kitchen}
              </span>
              <span className="rounded-full bg-paper/8 px-2 py-0.5 text-mist">KDS</span>
            </div>
            <div className="relative min-h-[11em] p-2.5">
              <AnimatePresence>
                {onKitchen && (
                  <motion.div
                    key={`ticket-${view.cycle}`}
                    initial={{ opacity: 0, transform: 'translateX(-60%) rotate(-6deg) scale(0.9)' }}
                    animate={{ opacity: 1, transform: 'translateX(0%) rotate(0deg) scale(1)' }}
                    exit={{ opacity: 0, transform: 'translateY(-20%)', transition: { duration: 0.3 } }}
                    transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
                    className="rounded-xl border border-paper/10 bg-paper/[0.04] p-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display text-paper">
                        #{240 + view.cycle} <span className="text-mist">{s.table} {TABLE}</span>
                      </span>
                      <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                          key={status}
                          initial={{ opacity: 0, transform: 'translateY(4px)' }}
                          animate={{ opacity: 1, transform: 'translateY(0px)' }}
                          exit={{ opacity: 0, transform: 'translateY(-4px)' }}
                          transition={{ duration: 0.2 }}
                          className={`rounded-full px-2 py-0.5 ${tone}`}
                        >
                          {t.demo.orderStatuses[status]}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                    <ul className="mt-2 space-y-0.5 text-mist">
                      {BASKET.map((m) => (
                        <li key={m.id} className="truncate">
                          {m.name[locale]} ×1
                        </li>
                      ))}
                    </ul>
                    {/* Cooking progress */}
                    <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-paper/10">
                      <motion.div
                        className={`h-full origin-left rounded-full ${status === 'ready' ? 'bg-fresh' : 'bg-cafe'}`}
                        initial={false}
                        animate={{ transform: `scaleX(${status === 'new' ? 0.04 : 1})` }}
                        transition={status === 'cooking' ? { duration: 2.4, ease: 'linear' } : { duration: 0.3 }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* Bell */}
              <div className="absolute bottom-2.5 right-2.5">
                <span
                  className={`relative grid size-[2.4em] place-items-center rounded-full transition-colors duration-300 ${
                    status === 'ready' && onKitchen ? 'bg-fresh/25 text-fresh' : 'bg-paper/8 text-mist'
                  }`}
                >
                  <Bell className="size-[1.2em]" />
                  {view.stage === 'ready' && !reduce && <span className="ping-ring absolute inset-0 rounded-full border-2 border-fresh" />}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Served cup ---------------- */}
      <AnimatePresence>
        {atLeast(view.stage, 'served') && (
          <motion.div
            key={`served-${view.cycle}`}
            initial={{ opacity: 0, transform: 'translateY(16px) scale(0.92)' }}
            animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.25 }}
            className="absolute bottom-[6%] left-[8%] flex items-center gap-3 rounded-2xl border border-paper/8 bg-white px-4 py-3 shadow-[0_24px_40px_-20px_rgb(30_40_70/0.45)]"
          >
            <span className="relative grid size-10 place-items-center rounded-xl bg-cafe/12 text-cafe">
              <Coffee className="size-5" />
              <span className="steam absolute -top-1 left-[38%] h-3 w-[2px] rounded-full bg-cafe/50" />
              <span className="steam absolute -top-1 left-[58%] h-3 w-[2px] rounded-full bg-cafe/50" style={{ '--d': '600ms' } as React.CSSProperties} />
            </span>
            <span className="text-[0.85rem]">
              <span className="block font-medium text-paper">{s.served}</span>
              <span className="block text-mist">
                {s.table} {TABLE}
              </span>
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="absolute -bottom-1 right-0 text-[0.7rem] text-mist">{s.demoNote}</p>
    </div>
  );
}
