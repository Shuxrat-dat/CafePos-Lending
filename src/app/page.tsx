import { HeroSection } from '@/components/sections/HeroSection';
import { InteractiveDemoSection } from '@/components/sections/InteractiveDemoSection';
import { FeaturesSection } from '@/components/sections/FeaturesSection';
import { QRMenuSection } from '@/components/sections/QRMenuSection';
import { VenuesSection } from '@/components/sections/VenuesSection';
import { AnalyticsSection } from '@/components/sections/AnalyticsSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { OnboardingSection } from '@/components/sections/OnboardingSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { ContactFormSection } from '@/components/sections/ContactFormSection';

export default function HomePage() {
  return (
    <main id="main">
      <HeroSection />
      <InteractiveDemoSection />
      <FeaturesSection />
      <QRMenuSection />
      <VenuesSection />
      <AnalyticsSection />
      <BenefitsSection />
      <OnboardingSection />
      <FAQSection />
      <ContactFormSection />
    </main>
  );
}
