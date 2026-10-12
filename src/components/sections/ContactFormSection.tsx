'use client';

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { AlertCircle, ChevronDown, LoaderCircle, Send } from 'lucide-react';
import { useTranslation } from '@/i18n/useTranslation';
import { inlineMessage } from '@/lib/motion';
import { Reveal, RevealText } from '@/components/ui/Reveal';
import { Arches } from '@/components/brand/Arches';
import { CafePOSIcon } from '@/components/icons/CafePOSLogo';

type Fields = { name: string; phone: string; venueName: string; venueType: string; locations: string; comment: string };
type Status = 'idle' | 'submitting' | 'success' | 'not_configured' | 'error';
const EMPTY: Fields = { name: '', phone: '', venueName: '', venueType: '', locations: '', comment: '' };

const input =
  'block min-h-12 w-full rounded-2xl border bg-paper/[0.04] px-4 text-base text-paper outline-none transition-[border-color,background-color,box-shadow] duration-200 placeholder:text-mist/50 hover:border-paper/20 focus:bg-paper/[0.06] focus:shadow-[0_0_0_4px_rgb(226_182_92/0.14)] sm:text-sm';

/** The finale: dark, warm panel with the demo request. Posts to /api/lead — no fake success. */
export function ContactFormSection() {
  const { t } = useTranslation();
  const c = t.contact;
  const [form, setForm] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Partial<Record<keyof Fields, string>>>({});
  const [status, setStatus] = useState<Status>('idle');
  const [website, setWebsite] = useState(''); // honeypot

  const validate = () => {
    const e: Partial<Record<keyof Fields, string>> = {};
    if (!form.name.trim()) e.name = c.required;
    if (!form.phone.trim()) e.phone = c.required;
    else if (!/^[\d\s+()-]{7,}$/.test(form.phone.trim())) e.phone = c.invalidPhone;
    if (!form.venueName.trim()) e.venueName = c.required;
    if (!form.venueType) e.venueType = c.required;
    return e;
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name as keyof Fields]) setErrors((p) => ({ ...p, [name]: undefined }));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    const first = Object.keys(errs)[0];
    if (first) {
      document.getElementById(`cf-${first}`)?.focus();
      return;
    }
    setStatus('submitting');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, website }),
      });
      if (res.ok) {
        setStatus('success');
        setForm(EMPTY);
      } else setStatus(res.status === 501 ? 'not_configured' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const border = (k: keyof Fields) => (errors[k] ? 'border-[#ff8a6b]/70' : 'border-paper/10 focus:border-gold/70');

  return (
    <section id="contact" className="relative px-4 pb-20 pt-10 sm:px-6 sm:pb-28 lg:px-10">
      <Reveal
        variant="stage"
        className="theme-dark relative mx-auto max-w-[1360px] overflow-hidden rounded-[40px] border border-gold/20 bg-[linear-gradient(180deg,#1d1509_0%,#0e0b08_40%,#060810_100%)] px-5 py-14 sm:px-10 sm:py-20 lg:px-16"
      >
        <div className="rv rv-glow pointer-events-none absolute left-[30%] top-[-30%] size-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(243_217_160/0.22),rgb(201_138_43/0.08)_40%,transparent_70%)]" style={{ '--rv': '100ms' } as React.CSSProperties} aria-hidden />
        <div className="pointer-events-none absolute -left-[10%] bottom-0 top-[10%] w-[60%] opacity-60" aria-hidden>
          <Arches count={5} draw="reveal" opacity={0.6} className="size-full" />
        </div>

        <div className="relative grid gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <div className="rv rv-scale" style={{ '--rv': '300ms' } as React.CSSProperties}>
              <CafePOSIcon className="cta-emblem size-14" />
            </div>
            <RevealText text={c.heading} delay={400} className="mt-8 font-display text-[clamp(1.9rem,4vw,3.1rem)] font-medium leading-[1.08] text-paper display-tight" />
            <p className="rv mt-6 max-w-md text-lg leading-relaxed text-[#d6cbb4]" style={{ '--rv': '700ms' } as React.CSSProperties}>
              {c.description}
            </p>
            <p className="rv mt-8 max-w-sm text-[0.8rem] text-mist" style={{ '--rv': '800ms' } as React.CSSProperties}>
              {c.privacy}
            </p>
          </div>

          <div className="rv lg:col-span-7" style={{ '--rv': '500ms' } as React.CSSProperties}>
            <div className="glass rounded-[28px] p-5 sm:p-8">
              {status === 'success' ? (
                <motion.div initial={{ opacity: 0, transform: 'translateY(8px)' }} animate={{ opacity: 1, transform: 'translateY(0px)' }} className="flex flex-col items-center py-10 text-center" role="status">
                  <svg viewBox="0 0 64 64" className="size-16" aria-hidden>
                    <circle cx="32" cy="32" r="29" fill="rgb(226 182 92 / 0.12)" stroke="#E2B65C" strokeWidth="2" />
                    <motion.path d="M20 33l8 8 16-17" fill="none" stroke="#F3D9A0" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.15 }} />
                  </svg>
                  <h3 className="mt-5 font-display text-2xl text-paper">{c.successTitle}</h3>
                  <p className="mt-2 max-w-md text-mist">{c.success}</p>
                  <button type="button" onClick={() => setStatus('idle')} className="btn btn-gold mt-8 px-8">
                    <span className="btn-label">{c.done}</span>
                  </button>
                </motion.div>
              ) : (
                <form noValidate onSubmit={onSubmit} className="grid gap-5">
                  <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="name" label={c.name} required error={errors.name}>
                      <input id="cf-name" name="name" autoComplete="name" value={form.name} onChange={onChange} aria-invalid={!!errors.name} className={`${input} ${border('name')}`} />
                    </Field>
                    <Field id="phone" label={c.phone} required error={errors.phone}>
                      <input id="cf-phone" name="phone" type="tel" autoComplete="tel" value={form.phone} onChange={onChange} placeholder={c.phonePlaceholder} aria-invalid={!!errors.phone} className={`${input} ${border('phone')}`} />
                    </Field>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="venueName" label={c.venueName} required error={errors.venueName}>
                      <input id="cf-venueName" name="venueName" autoComplete="organization" value={form.venueName} onChange={onChange} aria-invalid={!!errors.venueName} className={`${input} ${border('venueName')}`} />
                    </Field>
                    <Field id="venueType" label={c.venueType} required error={errors.venueType}>
                      <div className="relative">
                        <select id="cf-venueType" name="venueType" value={form.venueType} onChange={onChange} aria-invalid={!!errors.venueType} className={`${input} appearance-none bg-[#0b1020] pr-11 ${border('venueType')}`}>
                          <option value="">{c.venueTypePlaceholder}</option>
                          {(['coffeeShop', 'cafe', 'restaurant', 'fastFood'] as const).map((v) => (
                            <option key={v} value={v}>
                              {c.venueTypes[v]}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-mist" aria-hidden />
                      </div>
                    </Field>
                  </div>
                  <div className="grid gap-5 sm:grid-cols-[1fr_2fr]">
                    <Field id="locations" label={c.locations} hint={c.optional}>
                      <input id="cf-locations" name="locations" inputMode="numeric" value={form.locations} onChange={onChange} placeholder="1" className={`${input} border-paper/10 focus:border-gold/70`} />
                    </Field>
                    <Field id="comment" label={c.comment} hint={c.optional}>
                      <input id="cf-comment" name="comment" value={form.comment} onChange={onChange} className={`${input} border-paper/10 focus:border-gold/70`} />
                    </Field>
                  </div>

                  <AnimatePresence initial={false}>
                    {(status === 'not_configured' || status === 'error') && (
                      <motion.div
                        key={status}
                        variants={inlineMessage}
                        initial="hidden"
                        animate="show"
                        exit="exit"
                        role="alert"
                        className={`flex items-start gap-2 rounded-2xl border p-4 text-[0.85rem] ${
                          status === 'not_configured' ? 'border-gold/30 bg-gold/10 text-gold-soft' : 'border-[#ff8a6b]/30 bg-[#ff8a6b]/10 text-[#ffc2b0]'
                        }`}
                      >
                        <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
                        {status === 'not_configured' ? c.notConfigured : c.error}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <button type="submit" disabled={status === 'submitting'} aria-busy={status === 'submitting'} className="btn btn-gold btn-lg w-full disabled:opacity-60">
                    <span className="btn-label">
                      {status === 'submitting' ? <LoaderCircle className="size-4 animate-spin [animation-duration:700ms]" aria-hidden /> : <Send className="size-4" aria-hidden />}
                      {status === 'submitting' ? c.submitting : status === 'error' ? c.retry : c.submit}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

function Field({ id, label, hint, required, error, children }: { id: string; label: string; hint?: string; required?: boolean; error?: string; children: ReactNode }) {
  return (
    <div className="grid gap-2">
      <label htmlFor={`cf-${id}`} className="text-sm font-medium text-paper/90">
        {label}
        {required && <span className="ml-1 text-gold">*</span>}
        {hint && <span className="ml-1.5 font-normal text-mist/70">({hint})</span>}
      </label>
      {children}
      <AnimatePresence initial={false}>
        {error && (
          <motion.p key={error} variants={inlineMessage} initial="hidden" animate="show" exit="exit" className="flex items-center gap-1.5 text-[0.82rem] text-[#ff9f85]">
            <AlertCircle className="size-3.5 shrink-0" aria-hidden />
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
