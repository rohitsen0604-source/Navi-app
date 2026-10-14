import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { FeaturedServicesSection } from '../components/sections/FeaturedServicesSection';
import { Badge } from '../components/ui/Badge';
import { ShieldCheck, Anchor, Clock } from 'lucide-react';


interface LayoutContextType {
  onOpenDownloadModal: () => void;
}

export const ServicesPage: React.FC = () => {
  const { onOpenDownloadModal } = useOutletContext<LayoutContextType>();

  return (
    <div className="py-12 sm:py-20 bg-[#FAFAFA]">
      <SEO
        title="Services & Boating Experiences – Naavi Varanasi"
        description="Explore verified boat ride services across Varanasi: Evening Ganga Aarti Darshan, Subah-e-Banaras Sunrise Cruise, Royal Bajra private charters, and Eco Solar Catamarans."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="primary" size="md">
            Sacred Voyages & Ghat Ferries
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Curated River Experiences & Daily Commutes
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Every service is operated by verified traditional boatmen (Manjhis) with regulated capacity, metered government-ratified tariffs, and mandatory life-jacket compliance.
          </p>
        </div>

        {/* Complete Services List Section (showAll={true}) */}
        <FeaturedServicesSection onOpenDownloadModal={onOpenDownloadModal} showAll={true} />

        {/* Custom Group Charter or Call Center Assisted Booking Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-12 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold text-[#EB4D37] uppercase tracking-wider">
                Custom Events & Family Charters
              </span>
              <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900">
                Need a Special Bajra Charter for Rituals or Large Groups?
              </h2>
              <p className="text-xs sm:text-base text-slate-600 leading-relaxed">
                We coordinate multi-hour private charters for Pind Daan rituals, Vedic ceremonies, sunrise family gatherings, and documentary filming. Our 24/7 Ghat Station Desks ensure dedicated vessel allocation and priority boarding.
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4 text-xs font-semibold text-slate-700 pt-1">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" /> Life vests included</span>
                <span className="flex items-center gap-1.5"><Anchor className="w-4 h-4 text-[#EB4D37] shrink-0" /> UP Inland Vessels licensed</span>
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-500 shrink-0" /> Custom timing (05:00 AM – 09:30 PM)</span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col gap-3">
              <a
                href="tel:180010262284"
                className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-2xl bg-[#EB4D37] hover:bg-[#D63D27] text-white font-bold text-sm shadow-md transition-colors min-h-[46px]"
              >
                Call Operations Desk: 1800-102-NAAVI
              </a>
              <button
                onClick={onOpenDownloadModal}
                className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors min-h-[46px]"
              >
                Book via Naavi App
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
