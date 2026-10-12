'use client';

import { motion } from 'motion/react';
import { useId } from 'react';
import { locales } from '@/i18n/locales';
import { useTranslation } from '@/i18n/useTranslation';

/** RU / UZ segmented switch — swaps every string on the page. */
export function LanguageSwitch({ className }: { className?: string }) {
  const { locale, setLocale, t } = useTranslation();
  const layoutId = useId();

  return (
    <div role="group" aria-label={t.nav.language} className={`relative rounded-full border border-paper/12 bg-paper/[0.03] p-1 ${className ?? 'inline-flex'}`}>
      {locales.map((l) => {
        const active = l === locale;
        return (
          <button
            key={l}
            type="button"
            lang={l}
            onClick={() => setLocale(l)}
            aria-pressed={active}
            className={`relative z-10 min-h-8 min-w-10 rounded-full px-2.5 text-[0.76rem] font-semibold tracking-wider transition-colors duration-200 ${
              active ? 'text-[#1a1206]' : 'text-mist hover:text-paper'
            }`}
          >
            {active && (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-[#f3d9a0] to-[#e2b65c]"
                transition={{ type: 'spring', duration: 0.35, bounce: 0.15 }}
              />
            )}
            {l.toUpperCase()}
          </button>
        );
      })}
    </div>
  );
}
