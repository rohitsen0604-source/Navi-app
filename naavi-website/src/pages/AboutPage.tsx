import React from 'react';
import { SEO } from '../components/common/SEO';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Compass, HeartHandshake, MapPin, Anchor, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {


  return (
    <div className="py-12 sm:py-20 bg-[#FAFAFA]">
      <SEO
        title="About Naavi – River & Lake Boat Booking & Operations Platform"
        description="Learn about Naavi's mission: digitalizing inland waterway boat booking across 15 Varanasi Ganges zones with fair tariffs, verified traditional Manjhis, and 100% passenger safety compliance."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="primary" size="md">
            Our Purpose & Vision
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Bridging Sacred River Heritage with Modern Digital Reliability
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Naavi is an interconnected boat discovery, booking, and river operations dispatch platform built specifically for riverfront and lake waterways, with its flagship deployment along the holy River Ganges in Varanasi.
          </p>
        </div>

        {/* Vision & Problem Statement Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EB4D37]">
              The Challenge We Solve
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Transforming Traditional Riverfront Operations
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              For centuries, exploring the holy ghats of Varanasi by boat required intense manual bargaining, unmetered fluctuating prices, uncertainty about vessel safety standards, and inconsistent passenger life-jacket usage.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              At the same time, traditional boatmen (the hereditary <em>Manjhi</em> community) suffered from long idle waiting hours at the piers, dependence on aggressive touts, and unstable seasonal income.
            </p>
            <div className="p-4 rounded-2xl bg-[#FFF1EE] border border-[#FFD5CE] text-xs sm:text-sm text-[#EB4D37] font-semibold flex items-start gap-3">
              <Anchor className="w-5 h-5 shrink-0 mt-0.5" />
              <span>
                Naavi’s unified platform connects passengers, boatmen, and riverfront operations desks in real time, standardizing tariffs, enforcing safety gear, and guaranteeing verified dispatch.
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-lg border border-slate-200">
              <img
                src="/images/live_boat_cruise.jpg"
                alt="Naavi boat cruising on the Ganges Varanasi"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                <span className="font-bold text-amber-300">Preserving Living Heritage</span>
                <p className="text-slate-200 mt-0.5">Empowering traditional boatmen with direct digital earnings.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Comparison: Passengers vs Boatmen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Customer / Pilgrim Benefits */}
          <Card className="p-5 sm:p-8 space-y-5 bg-white border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF1EE] text-[#EB4D37] flex items-center justify-center shrink-0">
                <Compass className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#EB4D37]">For Pilgrims & Travelers</span>
                <h3 className="text-xl font-bold text-slate-900">Peaceful, Transparent Journeys</h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Travelers enjoy clarity and confidence from the moment they step onto the ghat steps:
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Government-Ratified Tariffs:</strong> Zero predatory bargaining or surprise cash surcharges.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>100% Life Jacket Protection:</strong> ISI / USCG certified vests inspected before every departure.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Water Police SOS Telemetry:</strong> One-tap live GPS rescue routing on both app and desk.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Multi-Class Fleet:</strong> Choose between quiet Hand-Row, modern Motor, Solar EV, or Royal Bajra.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Digital Invoices & Fair Refunds:</strong> Instant 100% refunds in case of weather advisories.</span>
              </li>
            </ul>
          </Card>

          {/* Boatmen / Manjhi Partner Benefits */}
          <Card className="p-5 sm:p-8 space-y-5 bg-white border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF4EB] text-[#FF7A00] flex items-center justify-center shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF7A00]">For Boatmen & Manjhis</span>
                <h3 className="text-xl font-bold text-slate-900">Dignity, Fair Income & Safety</h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              We empower traditional hereditary river communities with modern digital livelihood tools:
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Direct Digital Earnings:</strong> Eliminate middleman commissions with instant digital payouts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Nearby Pier Allocation:</strong> Central allocation engine prioritizes same-zone and adjacent-zone trips to save fuel.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>24/7 Ghat Station Desks:</strong> Physical station officers assist with passenger coordination and order.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Driver App with On/Off Duty:</strong> Boatmen control their availability with a simple toggle switch.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Transit Insurance & Verification:</strong> Legitimate standing recognized by local authorities and district police.</span>
              </li>
            </ul>
          </Card>

        </div>

        {/* Flagship Corridor: Varanasi */}
        <div className="bg-[#121418] rounded-3xl p-5 sm:p-12 text-white space-y-6">
          <div className="flex items-center gap-2 text-xs font-bold text-[#EB4D37] uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Flagship Inland Waterway Network</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            15 Continuous Ganges River Zones in Varanasi
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            From the southern waters of Assi Ghat and Tulsi Ghat, through the bustling Aarti epicenter of Dashashwamedh, past the sacred crematoria of Manikarnika, to the northern heritage piers of Rajghat and the modern Namo Ghat terminal.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Button
              variant="primary"
              size="md"
              to="/zones"
              className="w-full sm:w-auto min-h-[44px]"
            >
              Explore 15 Varanasi Zones
            </Button>
            <Button
              variant="outline"
              size="md"
              to="/safety"
              className="w-full sm:w-auto border-slate-700 text-white hover:bg-slate-800 min-h-[44px]"
            >
              Review Safety Protocols
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
