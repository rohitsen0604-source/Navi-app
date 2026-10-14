import React from 'react';
import { SEO } from '../components/common/SEO';
import { SafetyTrustSection } from '../components/sections/SafetyTrustSection';
import { GhatDesksSection } from '../components/sections/GhatDesksSection';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { AlertTriangle, CloudRain } from 'lucide-react';

export const SafetyPage: React.FC = () => {

  return (
    <div className="py-12 sm:py-20 bg-[#FAFAFA]">
      <SEO
        title="Safety First – Water Police & Life Jacket Protocols | Naavi"
        description="Comprehensive river safety standards for Naavi in Varanasi: 100% life-jacket compliance, Water Police direct SOS dispatch (+91 542 2221234), and weather curfew rules."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="primary" size="md">
            Passenger Safety & Emergency Infrastructure
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Safety Above Everything on Sacred Waters
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Every journey on Naavi is strictly regulated by institutional safety protocols, statutory inland waterways rules, and real-time emergency dispatch coordination.
          </p>
        </div>

        {/* Core Safety Protocols Section */}
        <SafetyTrustSection />

        {/* Weather Protocol & Night Curfew Banner */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <Card className="p-5 sm:p-8 bg-white border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <CloudRain className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Weather & Water Discharge Protocol
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              River current velocities and monsoon water discharge levels are monitored continuously by the Central Water Commission and Varanasi District Authorities. Whenever red or yellow alerts are issued, Naavi automatically suspends pier departures across affected corridors with 100% automatic passenger refunds.
            </p>
          </Card>

          <Card className="p-5 sm:p-8 bg-white border-slate-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              Official Ganges Boating Curfew: 09:30 PM
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Night boating on River Ganga is strictly illegal under the Varanasi Water Police & District Magistrate order. All passenger trips on Naavi must conclude by 09:30 PM. Bookings requested past curfew hours are blocked automatically.
            </p>
          </Card>
        </div>

        {/* Ghat Desks Section */}
        <GhatDesksSection />

      </div>
    </div>
  );
};
