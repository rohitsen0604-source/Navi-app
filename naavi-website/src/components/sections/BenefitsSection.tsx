import React from 'react';
import { DollarSign, ShieldCheck, Users, Radio, MapPin, Zap } from 'lucide-react';
import { Card } from '../ui/Card';

export const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      icon: <DollarSign className="w-5 h-5 text-[#C5A059]" />,
      title: 'Zero Haggling or Overcharging',
      desc: 'Transparent, upfront fares calculated on distance and boat type. Know exactly what you pay before booking with zero cash surcharges.',
      bg: 'bg-[#FAF7F0]',
      border: 'border-[#EADCB9]'
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      title: '100% Certified Life Jackets',
      desc: 'Mandatory certified life vests for every single passenger, including specialized child sizes. Boats do not depart without gear fastened.',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200'
    },
    {
      icon: <Users className="w-5 h-5 text-slate-800" />,
      title: 'Verified & Licensed Boat Drivers',
      desc: 'All boat drivers are verified operators with valid boat licenses, background checks, and river safety training.',
      bg: 'bg-slate-100',
      border: 'border-slate-200'
    },
    {
      icon: <Radio className="w-5 h-5 text-rose-600" />,
      title: 'Real-Time SOS & GPS Tracking',
      desc: 'Continuous GPS tracking synchronizes your boat ride with our 24/7 River Helpdesk and rescue patrol boats for rapid emergency support.',
      bg: 'bg-rose-50',
      border: 'border-rose-200'
    },
    {
      icon: <MapPin className="w-5 h-5 text-sky-600" />,
      title: 'Designated Boarding Piers',
      desc: 'Board from authorized piers and river steps with clear directions directly inside the Naavi passenger app.',
      bg: 'bg-sky-50',
      border: 'border-sky-200'
    },
    {
      icon: <Zap className="w-5 h-5 text-amber-600" />,
      title: 'Instant Dispatch or Advance Booking',
      desc: 'Request an immediate boat ride in seconds (average arrival under 5 minutes) or reserve private boats in advance.',
      bg: 'bg-amber-50',
      border: 'border-amber-200'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
            The Naavi Standard
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Simple, Safe & Reliable River Boat Booking
          </h2>
          <p className="text-base text-slate-600 leading-relaxed font-normal">
            Eliminating haggling and uncertainty at the riverbank. Enjoy on-demand river and lake boat rides with complete peace of mind.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {benefits.map((b, idx) => (
            <Card key={idx} className="p-6 sm:p-7 flex flex-col justify-between hover:border-slate-400/80 transition-all">
              <div className="space-y-3.5">
                <div className={`w-11 h-11 rounded-xl ${b.bg} ${b.border} border flex items-center justify-center shrink-0`}>
                  {b.icon}
                </div>
                <h3 className="text-lg font-bold text-slate-900">{b.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">{b.desc}</p>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
