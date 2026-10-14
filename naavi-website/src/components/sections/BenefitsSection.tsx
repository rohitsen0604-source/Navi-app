import React from 'react';
import { DollarSign, ShieldCheck, Users, Radio, Map, Zap } from 'lucide-react';
import { Card } from '../ui/Card';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: <DollarSign className="w-6 h-6 text-[#EB4D37]" />,
      title: 'Zero Predatory Bargaining',
      desc: 'Transparent, government-ratified tariff charts across all 15 Varanasi zones. No surprises, no middleman commissions, and no aggressive haggling at the steps.',
      bg: 'bg-[#FFF1EE]',
      border: 'border-[#FFD5CE]'
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: '100% Life Jacket Enforcement',
      desc: 'Mandatory ISI / USCG certified flotation vests for every single traveler, including dedicated sizes for children. Vessels do not depart without gear fastened.',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200'
    },
    {
      icon: <Users className="w-6 h-6 text-[#FF7A00]" />,
      title: 'Verified Traditional Manjhis',
      desc: 'Hereditary boatmen with generational knowledge of Ganga currents, sandbars, and ritual history. Fully background-verified with UP Inland Vessels licenses.',
      bg: 'bg-[#FFF4EB]',
      border: 'border-orange-200'
    },
    {
      icon: <Radio className="w-6 h-6 text-rose-600" />,
      title: 'Water Police SOS Integration',
      desc: 'Every ride features real-time GPS telemetry routed to the Varanasi Water Police Control Desk (+91 542 2221234) and stationed river patrol speedboats.',
      bg: 'bg-rose-50',
      border: 'border-rose-200'
    },
    {
      icon: <Map className="w-6 h-6 text-sky-600" />,
      title: '15 Continuous River Zones',
      desc: 'From southern Assi Ghat (Zone 1) to northern Namo Ghat (Zone 13) and Sant Ravidas Smarak (Zone 15). Interconnected boarding points across all 84 ghats.',
      bg: 'bg-sky-50',
      border: 'border-sky-200'
    },
    {
      icon: <Zap className="w-6 h-6 text-indigo-600" />,
      title: 'Instant Lock & Advance Booking',
      desc: 'Book on-demand for instant pier dispatch or schedule rides up to T+2 hours in advance. Atomic reservation locks eliminate double bookings.',
      bg: 'bg-indigo-50',
      border: 'border-indigo-200'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#EB4D37]">
            Why Choose Naavi
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Transforming River Boating for Passengers & Boatmen
          </h2>
          <p className="text-base text-slate-600 leading-relaxed">
            We preserve Varanasi’s sacred river heritage while introducing modern digital reliability, fair compensation for traditional navigators, and uncompromising passenger safety.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((b, idx) => (
            <Card key={idx} className="p-5 sm:p-7 flex flex-col justify-between">
              <div className="space-y-4">
                <div className={`w-12 h-12 rounded-2xl ${b.bg} ${b.border} border flex items-center justify-center shrink-0`}>
                  {b.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{b.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{b.desc}</p>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
