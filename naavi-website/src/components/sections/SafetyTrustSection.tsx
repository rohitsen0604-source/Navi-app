import React from 'react';
import { safetyProtocols, passengerSafetyGuidelines } from '../../data/safetyData';
import { Card } from '../ui/Card';
import { ShieldCheck, Radio, Users, Clock, UserCheck, HeartHandshake, CheckCircle2, PhoneCall } from 'lucide-react';

interface SafetyTrustProps {
  className?: string;
  transparent?: boolean;
  hideHeader?: boolean;
}

export const SafetyTrustSection: React.FC<SafetyTrustProps> = ({
  className,
  transparent = false,
  hideHeader = false,
}) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck': return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'Radio': return <Radio className="w-5 h-5 text-rose-600" />;
      case 'Users': return <Users className="w-5 h-5 text-slate-800" />;
      case 'Clock': return <Clock className="w-5 h-5 text-amber-500" />;
      case 'UserCheck': return <UserCheck className="w-5 h-5 text-[#C5A059]" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-indigo-600" />;
      default: return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
    }
  };

  return (
    <section className={`${transparent ? 'bg-transparent py-0' : 'py-16 sm:py-24 bg-[#FAF7F0]/50 border-t border-slate-200/80'} ${className || ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        {!hideHeader && (
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
              Safety Above Everything
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Institutional Boat Safety Standards
            </h2>
            <p className="text-base text-slate-600">
              Operating under Inland Waterways Authority guidelines, strict boat passenger limits, and real-time emergency support.
            </p>
          </div>
        )}

        {/* Protocols Grid */}
        <div className={`${hideHeader ? 'mt-0' : 'mt-10 sm:mt-14'} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8`}>
          {safetyProtocols.map(proto => (
            <Card
              key={proto.id}
              className={`p-6 sm:p-7 flex flex-col justify-between hover:border-slate-400/80 transition-all ${
                transparent ? 'bg-white/92 backdrop-blur-xl border border-white/80 shadow-2xl shadow-slate-900/10' : 'bg-white'
              }`}
            >
              <div className="space-y-4">
                <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {getIcon(proto.icon)}
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">{proto.title}</h3>
                  <span className="text-xs font-medium text-[#C5A059] block">{proto.tagline}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {proto.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Enforcement Standard:
                </span>
                <p className="text-xs text-slate-700 italic">
                  {proto.enforcement}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Guidelines and Emergency Strip */}
        <div className={`mt-8 sm:mt-12 rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center ${
          transparent
            ? 'bg-white/92 backdrop-blur-xl border border-white/80 shadow-2xl shadow-slate-900/10'
            : 'bg-white rounded-3xl border border-slate-200/90 shadow-sm'
        }`}>
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Mandatory Passenger Safety Guidelines</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {passengerSafetyGuidelines.map((guide, gIdx) => (
                <div key={gIdx} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{guide}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#0B0F17] text-white p-5 sm:p-6 rounded-2xl space-y-3">
            <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">
              24/7 River & Lake Emergency Patrol
            </span>
            <div className="text-2xl font-black text-white">
              112 / 1800-425-2424
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              River patrol rescue boats are linked directly to platform emergency SOS beacons for immediate assistance.
            </p>
            <a
              href="tel:112"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors w-full justify-center min-h-[42px]"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Emergency SOS: 112</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
