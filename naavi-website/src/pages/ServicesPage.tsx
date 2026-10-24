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
    <div>
      <SEO
        title="On-Demand River & Lake Boat Rides – Naavi"
        description="Book on-demand motor boat rides, scenic evening boat rides, peaceful row boats, and private family boat bookings with Naavi."
      />

      {/* Hero Banner Section with Dedicated Background Image */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/services_page_bg.jpg"
            alt="River and lake boats"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle tint for crystal clarity */}
          <div className="absolute inset-0 bg-slate-950/30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Page Header in Frosted Glass White Blur Card */}
          <div className="bg-white/92 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-900/20 text-center max-w-3xl mx-auto space-y-3">
            <Badge variant="accent" size="md">
              River & Lake Boat Rides
            </Badge>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              On-Demand River & Lake Boat Rides
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Every service is operated by licensed professional boat drivers with regulated capacities, transparent upfront fares, and 100% life jacket compliance.
            </p>
          </div>
        </div>
      </section>

      {/* Main Page Content - Clean Background */}
      <div className="py-12 sm:py-16 bg-[#FAFAFA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Complete Services List Section */}
          <FeaturedServicesSection
            onOpenDownloadModal={onOpenDownloadModal}
            showAll={true}
            transparent={false}
            hideHeader={true}
          />

          {/* Custom Group Booking or Concierge Assisted Booking Card */}
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="text-xs font-bold text-[#9E7D3B] uppercase tracking-wider">
                  Custom Group & Private Boat Hire
                </span>
                <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900">
                  Planning a Private Boat Booking or Family Outing?
                </h2>
                <p className="text-xs sm:text-base text-slate-600 leading-relaxed font-normal">
                  We coordinate full-boat private hire for family outings, gatherings, sunset trips, and private travel. Dedicated boat allocation and priority boarding.
                </p>
                <div className="flex flex-wrap gap-3 sm:gap-4 text-xs font-semibold text-slate-700 pt-1">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" /> Certified life jackets included</span>
                  <span className="flex items-center gap-1.5"><Anchor className="w-4 h-4 text-[#C5A059] shrink-0" /> Inland Waterways licensed</span>
                  <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-600 shrink-0" /> Flexible scheduling (05:30 AM – 10:30 PM)</span>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col gap-3">
                <a
                  href="tel:180010262284"
                  className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-sm shadow-md transition-colors min-h-[46px]"
                >
                  Call Concierge: 1800-102-NAAVI
                </a>
                <button
                  onClick={onOpenDownloadModal}
                  className="w-full inline-flex items-center justify-center py-3.5 px-6 rounded-xl bg-white hover:bg-slate-50 text-slate-900 border border-slate-300 font-semibold text-sm transition-colors min-h-[46px] cursor-pointer shadow-xs"
                >
                  Book via Naavi App
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
