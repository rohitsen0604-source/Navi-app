import React from 'react';
import { Smartphone, MapPin, Anchor, CheckCircle2, Navigation, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Open the Naavi App',
      desc: 'Launch the customer app or visit a 24/7 Ghat Desk. Quick mobile OTP login connects you instantly to the river ecosystem.',
      icon: <Smartphone className="w-5 h-5 text-[#EB4D37]" />,
    },
    {
      num: '02',
      title: 'Choose Departure & Destination',
      desc: 'Pick your boarding ghat from the 15 Varanasi zones (e.g., Assi Ghat, Dashashwamedh, or Namo Ghat) with clear GPS landmarks.',
      icon: <MapPin className="w-5 h-5 text-[#FF7A00]" />,
    },
    {
      num: '03',
      title: 'Select Vessel & Trip Mode',
      desc: 'Choose your desired boat class: Traditional Row Boat, Motor Boat, Solar EV Catamaran, or Royal Bajra. Select 1-way, round trip, or Aarti cruise.',
      icon: <Anchor className="w-5 h-5 text-indigo-600" />,
    },
    {
      num: '04',
      title: 'Lock Transparent Tariff',
      desc: 'View the exact, government-ratified price before payment. Instant atomic reservation locks eliminate double booking risks.',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
    },
    {
      num: '05',
      title: 'Meet Your Verified Manjhi',
      desc: 'Follow live boatman arrival at your designated pier cleat. Check vessel registration (UP-65-NV) and boatman license on your phone.',
      icon: <Navigation className="w-5 h-5 text-sky-600" />,
    },
    {
      num: '06',
      title: 'Fasten Life Jacket & Glide',
      desc: 'Secure your inspected life vest, step aboard with boatman assistance, and enjoy peaceful cruising protected by real-time GPS telemetry.',
      icon: <ShieldCheck className="w-5 h-5 text-rose-600" />,
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#EB4D37]">
            Simple & Transparent Journey
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Boat Booking Works with Naavi
          </h2>
          <p className="text-base text-slate-600">
            A frictionless digital process designed specifically for Varanasi’s riverfront geography and pilgrim convenience.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, idx) => (
            <Card key={idx} className="p-5 sm:p-7 relative flex flex-col justify-between group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[#FFF1EE] transition-colors">
                    {step.icon}
                  </div>
                  <span className="font-mono text-2xl font-black text-slate-300 group-hover:text-[#EB4D37] transition-colors">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#EB4D37] transition-colors">
                  {step.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Phase {step.num}</span>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
