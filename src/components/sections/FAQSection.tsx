'use client';

import { useId, useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { Reveal } from '@/components/ui/Reveal';
import { SectionHeader } from '@/components/ui/SectionHeader';

export function FAQSection() {
  const { t } = useTranslation();
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto grid max-w-[1360px] gap-12 px-4 sm:px-6 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
            <SectionHeader title={t.faq.heading} lead={t.faq.lead} />
          </div>
        </div>
        <Reveal className="lg:col-span-8">
          <ul className="divide-y divide-paper/8 rounded-[28px] border border-paper/8 bg-white px-5 shadow-[0_24px_50px_-38px_rgb(30_40_70/0.45)] sm:px-8">
            {t.faq.questions.map((item, idx) => {
              const isOpen = openIndex === idx;
              const panelId = `${baseId}-faq-${idx}`;
              return (
                <li key={item.question}>
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : idx)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="group flex w-full items-center justify-between gap-4 py-5 text-left font-display text-base font-medium text-paper transition-colors duration-200 hover:text-cafe sm:text-[1.08rem]"
                    >
                      <span>{item.question}</span>
                      <span
                        className={`grid size-9 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-300 ease-[var(--ease-out)] ${
                          isOpen ? 'rotate-45 border-gold bg-gold text-[#1a1206]' : 'border-paper/12 text-mist group-hover:border-cafe/40 group-hover:text-cafe'
                        }`}
                        aria-hidden
                      >
                        <Plus className="size-4" />
                      </span>
                    </button>
                  </h3>
                  <div id={panelId} className="disclosure" data-open={isOpen} aria-hidden={!isOpen}>
                    <div>
                      <p className="max-w-[65ch] pb-6 pr-10 leading-relaxed text-mist">{item.answer}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
