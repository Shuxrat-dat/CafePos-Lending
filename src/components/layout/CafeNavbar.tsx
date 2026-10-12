'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { CafePOSLogo } from '@/components/icons/CafePOSLogo';
import { Emblem } from '@/components/brand/YurtoraMark';
import { Button } from '@/components/ui/Button';
import { useTranslation } from '@/i18n/useTranslation';
import { useActiveSection, useScrolledPast } from '@/lib/hooks';
import { springSoft } from '@/lib/motion';
import { LanguageSwitch } from './LanguageSwitch';

const SECTION_IDS = ['home', 'demo', 'features', 'venues', 'faq', 'contact'] as const;

function scrollToSection(id: string, smooth: boolean) {
  // The open mobile menu locks page scroll; release it before scrolling.
  document.body.style.overflow = '';
  window.setTimeout(() => {
    document.getElementById(id)?.scrollIntoView({ behavior: smooth ? 'smooth' : 'instant', block: 'start' });
    window.history.replaceState(null, '', `#${id}`);
  }, 0);
}

export function CafeNavbar() {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const scrolled = useScrolledPast(24);
  const active = useActiveSection(SECTION_IDS);
  const [mobileOpen, setMobileOpen] = useState(false);
  const yurtoraUrl = process.env.NEXT_PUBLIC_YURTORA_URL || 'http://localhost:3000';

  const navLinks = [
    { id: 'demo', label: t.nav.demo },
    { id: 'features', label: t.nav.features },
    { id: 'venues', label: t.nav.forWhom },
    { id: 'faq', label: t.nav.faq },
    { id: 'contact', label: t.nav.contacts },
  ];

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false);
    const onResize = () => window.innerWidth >= 1280 && setMobileOpen(false);
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [mobileOpen]);

  function onMobileNavigate(e: MouseEvent<HTMLAnchorElement>, id: string) {
    e.preventDefault();
    setMobileOpen(false);
    scrollToSection(id, !reduce);
  }

  const solid = scrolled || mobileOpen;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`absolute inset-0 border-b transition-[background-color,border-color,box-shadow] duration-500 ${
          solid
            ? 'border-paper/8 bg-[rgb(248_249_251/0.8)] shadow-[0_10px_30px_-24px_rgb(30_40_70/0.5)] backdrop-blur-xl backdrop-saturate-150'
            : 'border-transparent bg-transparent'
        }`}
        aria-hidden
      />

      <div className="relative mx-auto flex h-[var(--header-h)] max-w-[1360px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
        <div className="flex items-center gap-4">
          <a href="#home" className="rounded-xl transition-transform duration-300 ease-[var(--ease-out)] hover:-translate-y-px" aria-label={t.nav.toTop}>
            <CafePOSLogo />
          </a>
          <span className="hidden h-6 w-px bg-paper/10 lg:block" aria-hidden />
          <EcosystemMenu yurtoraUrl={yurtoraUrl} />
        </div>

        <nav aria-label={t.nav.mainLabel} className="hidden xl:block">
          <ul className="flex items-center gap-0.5 rounded-full border border-paper/8 bg-[rgb(255_255_255/0.55)] p-1 shadow-[0_8px_24px_-20px_rgb(30_40_70/0.5)] backdrop-blur">
            {navLinks.map((link) => {
              const isActive = active === link.id;
              return (
                <li key={link.id}>
                  <a
                    href={`#${link.id}`}
                    aria-current={isActive ? 'location' : undefined}
                    className={`relative isolate block whitespace-nowrap rounded-full px-3.5 py-2 text-[0.86rem] transition-colors duration-200 ${
                      isActive ? 'text-paper' : 'text-mist hover:text-paper'
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="cafe-nav-pill"
                        transition={reduce ? { duration: 0 } : springSoft}
                        className="absolute inset-0 -z-10 rounded-full bg-white shadow-[0_2px_10px_-2px_rgb(30_40_70/0.25),inset_0_0_0_1px_rgb(192_141_53/0.35)]"
                        aria-hidden
                      />
                    )}
                    {link.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5">
          <LanguageSwitch className="hidden sm:inline-flex" />
          <Button href="#contact" className="hidden min-h-11 px-5 text-[0.88rem] sm:inline-flex" arrow>
            {t.nav.requestDemo}
          </Button>
          <button
            type="button"
            className="relative grid size-11 place-items-center rounded-full border border-paper/12 bg-[rgb(255_255_255/0.6)] backdrop-blur active:scale-[0.96] xl:hidden"
            aria-expanded={mobileOpen}
            aria-controls="cafe-mobile-menu"
            aria-label={mobileOpen ? t.nav.closeMenu : t.nav.openMenu}
            onClick={() => setMobileOpen((o) => !o)}
          >
            <span className="relative block h-3 w-[18px]" aria-hidden>
              <span className={`absolute left-0 h-[1.5px] w-full rounded-full bg-paper transition-transform duration-300 ease-[var(--ease-out)] ${mobileOpen ? 'top-[5px] rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 h-[1.5px] w-full rounded-full bg-paper transition-transform duration-300 ease-[var(--ease-out)] ${mobileOpen ? 'top-[5px] -rotate-45' : 'top-[10px]'}`} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="cafe-mobile-menu"
            className="fixed inset-x-0 bottom-0 top-[var(--header-h)] overflow-y-auto bg-[rgb(248_249_251/0.97)] backdrop-blur-xl xl:hidden"
            initial={reduce ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 0 100% 0)' }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, clipPath: 'inset(0 0 0% 0)' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, clipPath: 'inset(0 0 100% 0)', transition: { duration: 0.25, ease: [0.23, 1, 0.32, 1] } }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
          >
            <div className="kerege pointer-events-none absolute inset-x-0 bottom-0 h-56 opacity-50 [mask-image:linear-gradient(to_top,black,transparent)]" />
            <nav aria-label={t.nav.mainLabel} className="relative px-4 pb-6 pt-4 sm:px-6">
              <ul>
                {navLinks.map((link, i) => (
                  <motion.li
                    key={link.id}
                    initial={reduce ? false : { opacity: 0, transform: 'translateY(12px)' }}
                    animate={{ opacity: 1, transform: 'translateY(0px)' }}
                    transition={{ duration: 0.4, delay: 0.08 + i * 0.045, ease: [0.23, 1, 0.32, 1] }}
                    className="border-b border-paper/8"
                  >
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => onMobileNavigate(e, link.id)}
                      aria-current={active === link.id ? 'location' : undefined}
                      className="flex min-h-15 items-center justify-between py-3 font-display text-[1.45rem] font-light text-paper"
                    >
                      {link.label}
                      {active === link.id && <span className="size-2 rounded-full bg-gold shadow-[0_0_12px_#c08d35]" aria-hidden />}
                    </a>
                  </motion.li>
                ))}
              </ul>
            </nav>
            <motion.div
              className="relative flex flex-col gap-4 px-4 pb-10 sm:px-6"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { href: yurtoraUrl, label: t.nav.backToYurtora },
                  { href: `${yurtoraUrl}/products`, label: t.nav.allProducts },
                ].map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    className="group flex min-h-12 items-center justify-between gap-3 rounded-2xl border border-paper/10 bg-white px-4 text-[0.92rem] text-paper shadow-[0_8px_24px_-20px_rgb(30_40_70/0.5)] hover:border-gold/45"
                  >
                    <span className="flex items-center gap-2.5">
                      <Emblem className="size-5" />
                      {l.label}
                    </span>
                    <ArrowUpRight className="size-4 text-gold" aria-hidden />
                  </a>
                ))}
              </div>
              <LanguageSwitch className="inline-flex self-start sm:hidden" />
              <Button href="#contact" size="lg" arrow className="w-full" onClick={(e) => onMobileNavigate(e as MouseEvent<HTMLAnchorElement>, 'contact')}>
                {t.nav.requestDemo}
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/** Compact "YURTORA ↓" menu: the way back to the company site. */
function EcosystemMenu({ yurtoraUrl }: { yurtoraUrl: string }) {
  const { t } = useTranslation();
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative hidden lg:block">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => setOpen((o) => !o)}
        className="group inline-flex min-h-10 items-center gap-2 rounded-full border border-paper/10 bg-[rgb(255_255_255/0.6)] py-1.5 pl-2 pr-3 text-[0.8rem] text-mist backdrop-blur transition-[border-color,color] duration-200 hover:border-gold/45 hover:text-paper active:scale-[0.97]"
      >
        <Emblem className="size-5" />
        <span className="hidden font-display tracking-[0.18em] text-gold-soft 2xl:inline">YURTORA</span>
        <ChevronDown className={`size-3.5 transition-transform duration-300 ease-[var(--ease-out)] ${open ? 'rotate-180' : ''}`} aria-hidden />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-6px) scale(0.97)' }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, transform: 'translateY(0px) scale(1)' }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, transform: 'translateY(-4px) scale(0.98)', transition: { duration: 0.14 } }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: 'top left' }}
            className="glass absolute left-0 top-[calc(100%+10px)] w-72 rounded-2xl p-2"
          >
            <p className="px-3 pb-1 pt-2 text-[0.72rem] text-mist">{t.nav.ecosystem}</p>
            {[
              { href: yurtoraUrl, label: t.nav.backToYurtora },
              { href: `${yurtoraUrl}/products`, label: t.nav.allProducts },
            ].map((l) => (
              <a key={l.href} href={l.href} className="group flex min-h-11 items-center justify-between rounded-xl px-3 text-[0.9rem] text-paper transition-colors duration-150 hover:bg-gold/10">
                {l.label}
                <ArrowUpRight className="size-4 text-gold transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
