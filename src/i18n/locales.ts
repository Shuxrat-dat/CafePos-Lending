export type Locale = 'ru' | 'uz';

export const locales: Locale[] = ['ru', 'uz'];

export const defaultLocale: Locale = 'ru';

export const localeNames: Record<Locale, string> = {
  ru: 'Русский',
  uz: 'O\'zbek',
};
