'use client';

import { ArrowUpRight } from 'lucide-react';
import { CafePOSLogo } from '@/components/icons/CafePOSLogo';
import { Emblem, Wordmark } from '@/components/brand/YurtoraMark';
import { useTranslation } from '@/i18n/useTranslation';
import { LanguageSwitch } from './LanguageSwitch';

export function CafeFooter() {
  const { t } = useTranslation();
  const yurtoraUrl = process.env.NEXT_PUBLIC_YURTORA_URL || 'http://localhost:3000';

  const links = [
    { href: '#demo', label: t.nav.demo },
    { href: '#features', label: t.nav.features },
    { href: '#venues', label: t.nav.forWhom },
    { href: '#faq', label: t.nav.faq },
    { href: '#contact', label: t.nav.contacts },
  ];

  return (
    <footer className="relative border-t border-paper/8 bg-night pb-12 pt-16">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
        <div className="grid gap-10 border-b border-paper/8 pb-12 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <CafePOSLogo />
            <p className="mt-4 max-w-sm text-[0.95rem] leading-relaxed text-mist">{t.footer.tagline}</p>
            <LanguageSwitch className="mt-6 inline-flex" />
          </div>

          <nav aria-label={t.nav.mainLabel} className="lg:col-span-3">
            <h2 className="text-sm font-medium text-paper">{t.footer.navTitle}</h2>
            <ul className="mt-4 grid gap-1 text-[0.95rem] text-mist">
              {links.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="inline-flex min-h-9 items-center transition-colors hover:text-paper">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <Emblem className="size-9" />
              <div className="flex flex-col">
                <Wordmark className="text-[0.95rem] text-gold-soft" />
                <span className="mt-1.5 text-[0.56rem] tracking-[0.32em] text-mist">BUSINESS BEYOND BORDERS</span>
              </div>
            </div>
            <p className="mt-4 text-[0.92rem] leading-relaxed text-mist">{t.footer.ecosystemText}</p>
            <div className="mt-5 flex flex-wrap gap-2.5">
              {[
                { href: yurtoraUrl, label: t.footer.yurtoraLink },
                { href: `${yurtoraUrl}/products`, label: t.footer.otherProducts },
              ].map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="group inline-flex min-h-10 items-center gap-1.5 rounded-full border border-paper/10 bg-white px-4 text-[0.85rem] text-paper transition-[border-color] duration-200 hover:border-gold/45"
                >
                  {l.label}
                  <ArrowUpRight className="size-3.5 text-gold transition-transform duration-200 ease-[var(--ease-out)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 text-[0.8rem] text-mist sm:flex-row">
          <p>© 2026 CafePOS by YURTORA. {t.footer.allRightsReserved}.</p>
          <p className="flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-fresh" aria-hidden />
            {t.footer.demoMode}
          </p>
        </div>
      </div>
    </footer>
  );
}
