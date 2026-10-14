import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { HowItWorksSection } from '../components/sections/HowItWorksSection';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Smartphone, Lock, Cpu, Radio } from 'lucide-react';


interface LayoutContextType {
  onOpenDownloadModal: () => void;
}

export const HowItWorksPage: React.FC = () => {
  const { onOpenDownloadModal } = useOutletContext<LayoutContextType>();

  return (
    <div className="py-12 sm:py-20 bg-[#FAFAFA]">
      <SEO
        title="How It Works – Booking & Allocation Engine | Naavi"
        description="Learn how Naavi's boat booking workflow and central allocation engine operate: multi-zone matching, duty verification, atomic reservation lock, and live boatman arrival tracking."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="primary" size="md">
            Customer Workflow & Technology
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            How Boat Booking Works on Naavi
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            A step-by-step walkthrough of how passengers book rides and how our central backend matches you with verified Varanasi boatmen.
          </p>
        </div>

        {/* Core Steps Section */}
        <HowItWorksSection />

        {/* Technology Behind the Scenes: Allocation Engine */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-12 shadow-sm space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EB4D37]">
              Engineered for Reliability
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              The Technology Powering Your Ride
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Behind the simple mobile interface lies Naavi’s robust inland waterways allocation engine, built to handle river currents, pier proximity, and vessel safety constraints.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5 sm:p-6 bg-slate-50 border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-[#FFF1EE] text-[#EB4D37] flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Multi-Zone Allocation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When you request a boat at Assi Ghat (Zone 1), the engine first matches active boatmen in Zone 1. If busy, it cascades to adjacent Zone 2 to minimize passenger waiting time.
              </p>
            </Card>

            <Card className="p-5 sm:p-6 bg-slate-50 border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Atomic Reservation Lock</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our booking engine uses atomic mutex reservation locks to prevent race conditions. Two passengers can never be booked on the same boatman or time slot simultaneously.
              </p>
            </Card>

            <Card className="p-5 sm:p-6 bg-slate-50 border-slate-200 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Live GPS & SOS Telemetry</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time WebSocket telemetry updates boat location every few seconds. In emergencies, GPS coordinates are directly routed to the Varanasi Water Police Control Desk.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA to get app */}
        <div className="bg-[#121418] rounded-3xl p-5 sm:p-12 text-white text-center max-w-4xl mx-auto space-y-5">
          <h3 className="text-xl sm:text-3xl font-extrabold text-white">
            Ready to Experience Transparent River Cruising?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
            Download the Naavi App or visit our Dashashwamedh, Assi, or Rajghat pier desks for instant assisted booking.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={onOpenDownloadModal}
              icon={<Smartphone className="w-5 h-5" />}
              className="w-full sm:w-auto min-h-[48px]"
            >
              Get Naavi App
            </Button>
            <Button
              variant="outline"
              size="lg"
              to="/services"
              className="w-full sm:w-auto border-slate-700 text-white hover:bg-slate-800 min-h-[48px]"
            >
              Explore Available Boats
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
