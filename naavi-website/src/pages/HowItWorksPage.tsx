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
    <div className="relative overflow-hidden py-12 sm:py-20 min-h-[85vh]">
      <SEO
        title="How It Works – Smart Boat Dispatch & Booking | Naavi"
        description="Learn how Naavi's on-demand boat booking workflow and smart dispatch engine operate: nearest pier matching, atomic reservation locks, and live boat tracking."
      />

      {/* Background Image Layer - High Visibility */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/howitworks_page_bg.jpg"
          alt="Modern boat boarding pier"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-slate-950/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 relative z-10">
        
        {/* Header in Frosted Glass White Blur Card */}
        <div className="bg-white/92 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-900/15 text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="accent" size="md">
            Customer Workflow & Technology
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            How Boat Booking Works on Naavi
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            A step-by-step walkthrough of how riders book trips and how our system matches you with verified licensed boat drivers in seconds.
          </p>
        </div>

        {/* Core Steps Section */}
        <HowItWorksSection transparent={true} hideHeader={true} />

        {/* Technology Behind the Scenes: Dispatch Engine */}
        <div className="bg-white/92 backdrop-blur-xl rounded-3xl border border-white/80 p-6 sm:p-12 shadow-2xl shadow-slate-900/15 space-y-8">
          <div className="max-w-3xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9E7D3B]">
              Engineered for Speed & Safety
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              The Technology Powering Your Ride
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              Behind the simple mobile interface lies Naavi’s smart boat booking and allocation engine, built to handle pier berths, water currents, and certified safety limits.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-white/80 backdrop-blur-md border-slate-200/90 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
                <Cpu className="w-5 h-5 text-[#C5A059]" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Smart Pier Dispatch</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When you request a boat, the engine first dispatches active boats docked at your exact pier. If all slips are busy, it routes adjacent pier docks to keep wait times under 5 minutes.
              </p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-md border-slate-200/90 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Atomic Reservation Lock</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our booking engine uses atomic reservation locks to prevent overbooking. Two riders can never be assigned the same boat or reserved seats simultaneously.
              </p>
            </Card>

            <Card className="p-6 bg-white/80 backdrop-blur-md border-slate-200/90 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Live GPS & SOS Telemetry</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Real-time telemetry updates boat location every few seconds. In emergencies, GPS coordinates are immediately broadcast to river rescue patrol boats.
              </p>
            </Card>
          </div>
        </div>

        {/* CTA to get app */}
        <div className="bg-[#0B0F17]/95 backdrop-blur-xl rounded-3xl p-6 sm:p-12 text-white text-center max-w-4xl mx-auto space-y-5 border border-slate-800 shadow-2xl">
          <h3 className="text-xl sm:text-3xl font-extrabold text-white">
            Ready to Experience On-Demand Boat Booking?
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto font-normal">
            Download the Naavi App or book online for immediate pier dispatch across all supported river and lake piers.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
            <Button
              variant="secondary"
              size="lg"
              onClick={onOpenDownloadModal}
              icon={<Smartphone className="w-5 h-5" />}
              className="w-full sm:w-auto"
            >
              Download Naavi App
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
