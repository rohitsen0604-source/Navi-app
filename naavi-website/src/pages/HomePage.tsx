import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { HeroSection } from '../components/sections/HeroSection';
import { BenefitsSection } from '../components/sections/BenefitsSection';
import { FeaturedServicesSection } from '../components/sections/FeaturedServicesSection';
import { ZonesPreviewSection } from '../components/sections/ZonesPreviewSection';
import { FleetHighlightsSection } from '../components/sections/FleetHighlightsSection';
import { HowItWorksSection } from '../components/sections/HowItWorksSection';
import { SafetyTrustSection } from '../components/sections/SafetyTrustSection';
import { GhatDesksSection } from '../components/sections/GhatDesksSection';
import { AppDownloadSection } from '../components/sections/AppDownloadSection';

interface LayoutContextType {
  onOpenDownloadModal: () => void;
}

export const HomePage: React.FC = () => {
  const { onOpenDownloadModal } = useOutletContext<LayoutContextType>();

  return (
    <>
      <SEO
        title="Naavi – River & Lake Boat Booking & Operations Platform | Varanasi"
        description="Official Naavi Information Website. Book verified motor boats, luxury bajras, row boats, and solar EV catamarans across 15 continuous Varanasi Ganges Ghat zones. 100% life-jacket compliance and metered government tariffs."
      />
      <HeroSection onOpenDownloadModal={onOpenDownloadModal} />
      <BenefitsSection />
      <FeaturedServicesSection onOpenDownloadModal={onOpenDownloadModal} showAll={false} />
      <ZonesPreviewSection />
      <FleetHighlightsSection />
      <HowItWorksSection />
      <SafetyTrustSection />
      <GhatDesksSection />
      <AppDownloadSection onOpenDownloadModal={onOpenDownloadModal} />
    </>
  );
};
