import React from 'react';
import { SEO } from '../components/common/SEO';
import { SafetyTrustSection } from '../components/sections/SafetyTrustSection';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { AlertTriangle, CloudRain } from 'lucide-react';

export const SafetyPage: React.FC = () => {
  return (
    <div className="relative overflow-hidden py-12 sm:py-20 min-h-[85vh]">
      <SEO
        title="Safety First – Boat Safety Standards & Life Jacket Protocols | Naavi"
        description="Comprehensive boat safety standards on Naavi: 100% life jacket compliance, direct Emergency SOS dispatch (112), and real-time adverse weather trip holds."
      />

      {/* Background Image Layer - High Visibility */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/safety_page_bg.jpg"
          alt="River safety patrol and life jackets"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-slate-950/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 relative z-10">
        
        {/* Header in Frosted Glass White Blur Card */}
        <div className="bg-white/92 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-900/15 text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="accent" size="md">
            Boat Safety & Emergency Infrastructure
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Safety Above Everything on the Water
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Every journey on Naavi is strictly regulated by institutional safety protocols, statutory inland waterways rules, and real-time emergency dispatch coordination.
          </p>
        </div>

        {/* Core Safety Protocols Section */}
        <SafetyTrustSection transparent={true} hideHeader={true} />

        {/* Weather Protocol & Operating Curfew Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <Card className="p-6 sm:p-8 bg-white/92 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl shadow-slate-900/15 space-y-4 hover:border-slate-300 transition-all">
            <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <CloudRain className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Adverse Weather & High Current Protocol
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Water currents, squalls, and water levels are tracked continuously. Whenever severe weather alerts are issued by inland waterway authorities, Naavi automatically suspends pier departures across affected areas with 100% automated passenger refunds.
            </p>
          </Card>

          <Card className="p-6 sm:p-8 bg-white/92 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl shadow-slate-900/15 space-y-4 hover:border-slate-300 transition-all">
            <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6 text-[#C5A059]" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Permitted Operating Hours: 05:30 AM – 10:30 PM
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              Late-night unpermitted boating is strictly avoided for passenger safety under waterway safety guidelines. All scheduled passenger rides conclude by 10:30 PM. Bookings requested past operating hours are blocked automatically.
            </p>
          </Card>
        </div>

      </div>
    </div>
  );
};
