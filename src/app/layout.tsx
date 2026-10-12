import type { Metadata, Viewport } from 'next';
import { Onest, Unbounded } from 'next/font/google';
import './globals.css';
import { LocaleProvider } from '@/i18n/useTranslation';
import { MotionProvider } from '@/components/motion/MotionProvider';
import { AmbientBackdrop } from '@/components/layout/AmbientBackdrop';
import { CafeNavbar } from '@/components/layout/CafeNavbar';
import { CafeFooter } from '@/components/layout/CafeFooter';

const unbounded = Unbounded({ variable: '--font-unbounded', subsets: ['latin', 'latin-ext', 'cyrillic'], weight: ['300', '400', '500'], display: 'swap' });
const onest = Onest({ variable: '--font-onest', subsets: ['latin', 'latin-ext', 'cyrillic'], display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL('https://cafepos.yurtora.uz'),
  title: 'CafePOS by YURTORA — автоматизация кафе и ресторанов',
  description: 'CafePOS помогает объединить работу зала, кассы и кухни в одной цифровой системе для кафе и ресторанов. Управление заказами, столами, меню и аналитикой.',
  keywords: 'CafePOS, автоматизация ресторана, POS система, управление кафе, кухонный экран, KDS, YURTORA',
  authors: [{ name: 'YURTORA' }],
  openGraph: {
    title: 'CafePOS by YURTORA — автоматизация кафе и ресторанов',
    description: 'Цифровая система управления кафе и рестораном. Каждый заказ под контролем.',
    url: 'https://cafepos.yurtora.uz',
    siteName: 'CafePOS',
    locale: 'ru_RU',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'CafePOS by YURTORA' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.png'] },
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: '#f4f5f7',
  colorScheme: 'light',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${onest.variable}`} suppressHydrationWarning>
      <body className="min-h-screen">
        <LocaleProvider>
          <MotionProvider>
            <AmbientBackdrop />
            <CafeNavbar />
            {children}
            <CafeFooter />
          </MotionProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
