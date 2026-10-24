import React from 'react';
import { MapPin, Anchor, Navigation, ShieldCheck } from 'lucide-react';
import { Card } from '../ui/Card';

interface HowItWorksProps {
  className?: string;
  transparent?: boolean;
  hideHeader?: boolean;
}

export const HowItWorksSection: React.FC<HowItWorksProps> = ({
  className,
  transparent = false,
  hideHeader = false,
}) => {
  const steps = [
    {
      num: '01',
      title: 'Choose Departure & Arrival Pier',
      desc: 'Open the Naavi app or website. Enter your pickup pier, destination terminal, or select a scenic sunset tour with GPS precision.',
      icon: <MapPin className="w-5 h-5 text-[#C5A059]" />,
    },
    {
      num: '02',
      title: 'Select Boat Type & View Fare',
      desc: 'Pick your preferred ride: Fast Motor Boat, Scenic Sunset Boat, Private Boat, or Eco Electric Boat. See exact fixed fares upfront.',
      icon: <Anchor className="w-5 h-5 text-slate-800" />,
    },
    {
      num: '03',
      title: 'Instant Boat Driver Match',
      desc: 'Our dispatch matches the closest certified boat driver. Track boat arrival in real time with boat registration & driver credentials.',
      icon: <Navigation className="w-5 h-5 text-emerald-600" />,
    },
    {
      num: '04',
      title: 'Put On Life Jacket & Ride Safely',
      desc: 'Put on your certified safety life jacket, step aboard with pier assistance, and enjoy a peaceful, scenic ride backed by 24/7 emergency support.',
      icon: <ShieldCheck className="w-5 h-5 text-sky-600" />,
    },
  ];

  return (
    <section className={`${transparent ? 'bg-transparent py-0' : 'py-16 sm:py-24 bg-white border-t border-slate-200/80'} ${className || ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        {!hideHeader && (
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
              Simple & Transparent Journey
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              How Boat Booking Works on Naavi
            </h2>
            <p className="text-base text-slate-600">
              Frictionless on-demand boat booking. As straightforward as booking a cab, built for rivers and lakes.
            </p>
          </div>
        )}

        {/* Steps Grid */}
        <div className={`${hideHeader ? 'mt-0' : 'mt-10 sm:mt-14'} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`}>
          {steps.map((step, idx) => (
            <Card
              key={idx}
              className={`p-6 relative flex flex-col justify-between group hover:border-slate-400/80 transition-all ${
                transparent ? 'bg-white/92 backdrop-blur-xl border border-white/80 shadow-2xl shadow-slate-900/10' : ''
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center shrink-0 group-hover:bg-[#FAF7F0] transition-colors">
                    {step.icon}
                  </div>
                  <span className="font-mono text-xl font-extrabold text-slate-300 group-hover:text-[#C5A059] transition-colors">
                    {step.num}
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                  {step.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {step.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                <span>Step {step.num}</span>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
