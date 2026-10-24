import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { HeroSection } from '../components/sections/HeroSection';
import { BenefitsSection } from '../components/sections/BenefitsSection';
import { FeaturedServicesSection } from '../components/sections/FeaturedServicesSection';
import { ZonesPreviewSection } from '../components/sections/ZonesPreviewSection';
import { HowItWorksSection } from '../components/sections/HowItWorksSection';
import { SafetyTrustSection } from '../components/sections/SafetyTrustSection';
import { AppDownloadSection } from '../components/sections/AppDownloadSection';

interface LayoutContextType {
  onOpenDownloadModal: () => void;
}

export const HomePage: React.FC = () => {
  const { onOpenDownloadModal } = useOutletContext<LayoutContextType>();

  return (
    <>
      <SEO
        title="Naavi – On-Demand River & Lake Boat Booking App"
        description="Book on-demand motor boats, row boats, private boats, and electric boats on rivers and lakes. 100% life-jacket verified with transparent metered tariffs like Uber and Rapido."
      />
      <HeroSection onOpenDownloadModal={onOpenDownloadModal} />
      <BenefitsSection />
      <FeaturedServicesSection onOpenDownloadModal={onOpenDownloadModal} showAll={false} />
      <ZonesPreviewSection />
      <HowItWorksSection />
      <SafetyTrustSection />
      <AppDownloadSection onOpenDownloadModal={onOpenDownloadModal} />
    </>
  );
};
