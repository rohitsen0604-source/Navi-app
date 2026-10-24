import React from 'react';
import { SEO } from '../components/common/SEO';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Compass, HeartHandshake, MapPin, Anchor, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="relative overflow-hidden py-12 sm:py-20 min-h-[85vh]">
      <SEO
        title="About Naavi – On-Demand River & Lake Boat Booking App"
        description="Learn about Naavi's mission: digitalizing river and lake boat bookings with transparent fixed fares, verified boat drivers, and 100% passenger life jacket compliance."
      />

      {/* Background Image Layer - High Visibility */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/about_page_bg.jpg"
          alt="Cinematic river valley with passenger boats"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-slate-950/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 relative z-10">
        
        {/* Page Hero Header in Frosted Glass White Blur Card */}
        <div className="bg-white/92 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-900/15 text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="accent" size="md">
            Our Purpose & Vision
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Seamless River & Lake Boat Booking for Everyone
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Naavi is an on-demand boat booking app built to bring the simple convenience of modern ride-hailing (like Uber and Rapido) to river and lake boat travel.
          </p>
        </div>

        {/* Vision & Problem Statement Banner */}
        <div className="bg-white/92 backdrop-blur-xl rounded-3xl border border-white/80 p-6 sm:p-12 shadow-2xl shadow-slate-900/15 grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9E7D3B]">
              The Problem We Solve
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Making Boat Booking Simple & Transparent
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              For decades, taking a boat on India’s lakes and rivers required manual haggling, arbitrary cash pricing, uncertainty about boat condition, and inconsistent life jacket usage.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              At the same time, hardworking boat drivers suffered from long idle waiting hours at the piers, dependence on tout commissions, and erratic income.
            </p>
            <div className="p-4 rounded-2xl bg-white/80 border border-amber-200/80 text-xs sm:text-sm text-[#8B6B2B] font-semibold flex items-start gap-3 shadow-sm">
              <Anchor className="w-5 h-5 shrink-0 mt-0.5 text-[#C5A059]" />
              <span>
                Naavi’s simple app connects passengers, boat drivers, and pier helpdesks in real time—standardizing fares, enforcing life jackets, and guaranteeing verified boat dispatch.
              </span>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden aspect-[4/3] shadow-xl border border-white/80">
              <img
                src="/images/water_taxi_modern.jpg"
                alt="Naavi modern boat booking"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white text-xs">
                <span className="font-bold text-[#E5C378]">Simple Digital Boat Booking</span>
                <p className="text-slate-200 mt-0.5">Empowering boat drivers with fair, reliable digital earnings.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Comparison: Passengers vs Drivers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          
          {/* Customer / Rider Benefits */}
          <Card className="p-6 sm:p-8 space-y-5 bg-white/92 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl shadow-slate-900/15">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-900 flex items-center justify-center shrink-0">
                <Compass className="w-6 h-6 text-[#C5A059]" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#9E7D3B]">For Riders & Travelers</span>
                <h3 className="text-xl font-bold text-slate-900">Seamless, Transparent Journeys</h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Riders enjoy complete clarity and peace of mind from the moment they step onto the pier:
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Standardized Transparent Fares:</strong> Upfront pricing with zero haggling or surprise charges.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>100% Life Jacket Protection:</strong> ISI certified safety life jackets inspected before every ride.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Instant Emergency SOS Telemetry:</strong> One-tap live GPS emergency routing linked to rescue teams.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Multiple Boat Types:</strong> Choose between fast Motor Boats, Scenic Sunset Boats, Solar Electric Boats, and Private Boats.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Digital Boarding Passes:</strong> Instant OTP confirmation and 100% automated refund on adverse weather advisories.</span>
              </li>
            </ul>
          </Card>

          {/* Driver / Boat Partner Benefits */}
          <Card className="p-6 sm:p-8 space-y-5 bg-white/92 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl shadow-slate-900/15">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FAF7F0] text-[#C5A059] flex items-center justify-center shrink-0">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#9E7D3B]">For Drivers & Boat Owners</span>
                <h3 className="text-xl font-bold text-slate-900">Dignity, Fair Income & Respect</h3>
              </div>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              We empower boat drivers and boat operators with modern digital tools:
            </p>

            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Direct Digital Earnings:</strong> Eliminate middleman touts with transparent daily digital payouts.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Nearest Pier Dispatch:</strong> Smart algorithm sends trip requests to the closest boat, saving fuel.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>24/7 Pier Support Desks:</strong> Physical station officers assist with passenger boarding and queue management.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Driver Partner App:</strong> Complete control over on/off duty status with a simple tap.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span><strong>Transit Insurance & Safety Verification:</strong> Full standing under inland waterways guidelines.</span>
              </li>
            </ul>
          </Card>

        </div>

        {/* River & Lake Network Banner */}
        <div className="bg-[#0B0F17]/95 backdrop-blur-xl rounded-3xl p-6 sm:p-12 text-white space-y-6 border border-slate-800 shadow-2xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#C5A059] uppercase tracking-wider">
            <MapPin className="w-4 h-4" />
            <span>Pan-Waterway Transit Network</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Connecting Piers Across Rivers & Lakes
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed font-normal">
            From swift river commutes to peaceful lake boat rides and private family bookings, Naavi brings simple on-demand boat booking to every river and lake.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Button
              variant="secondary"
              size="md"
              to="/zones"
              className="w-full sm:w-auto min-h-[44px]"
            >
              Explore Piers & Routes
            </Button>
            <Button
              variant="outline"
              size="md"
              to="/safety"
              className="w-full sm:w-auto border-slate-700 text-white hover:bg-slate-800 min-h-[44px]"
            >
              Review Safety Standards
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
};
