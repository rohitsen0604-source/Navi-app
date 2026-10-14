import React from 'react';
import { safetyProtocols, passengerSafetyGuidelines } from '../../data/safetyData';
import { Card } from '../ui/Card';
import { ShieldCheck, Radio, Users, Clock, UserCheck, HeartHandshake, CheckCircle2, PhoneCall } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

export const SafetyTrustSection: React.FC = () => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'ShieldCheck': return <ShieldCheck className="w-6 h-6 text-[#EB4D37]" />;
      case 'Radio': return <Radio className="w-6 h-6 text-rose-600" />;
      case 'Users': return <Users className="w-6 h-6 text-[#FF7A00]" />;
      case 'Clock': return <Clock className="w-6 h-6 text-amber-500" />;
      case 'UserCheck': return <UserCheck className="w-6 h-6 text-emerald-600" />;
      case 'HeartHandshake': return <HeartHandshake className="w-6 h-6 text-indigo-600" />;
      default: return <ShieldCheck className="w-6 h-6 text-[#EB4D37]" />;
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FFF1EE]/30 border-t border-[#FFD5CE]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#EB4D37]">
            Safety Above Everything
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Institutional Safety & Inland Waterways Compliance
          </h2>
          <p className="text-base text-slate-600">
            Operating in direct alignment with the Uttar Pradesh Inland Vessels Act, Varanasi District Administration curfews, and the Varanasi Water Police Control Desk.
          </p>
        </div>

        {/* Protocols Grid */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {safetyProtocols.map(proto => (
            <Card key={proto.id} className="p-5 sm:p-7 flex flex-col justify-between bg-white">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shrink-0">
                  {getIcon(proto.icon)}
                </div>

                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">{proto.title}</h3>
                  <span className="text-xs font-semibold text-[#EB4D37] block">{proto.tagline}</span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {proto.description}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Enforcement Mechanism:
                </span>
                <p className="text-xs text-slate-700 italic">
                  {proto.enforcement}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Guidelines and Emergency Strip */}
        <div className="mt-8 sm:mt-12 bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0" />
              <span>Mandatory Passenger Conduct on Board</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {passengerSafetyGuidelines.map((guide, gIdx) => (
                <div key={gIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{guide}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 bg-[#121418] text-white p-5 sm:p-6 rounded-2xl space-y-3">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block">
              Direct Emergency Response
            </span>
            <div className="text-xl font-black text-white">
              {siteConfig.contact.hotlines.waterPolice}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Varanasi Water Police Patrol control desk is on standby for swift assistance. In addition, Naavi operates 24/7 Ghat Station desks.
            </p>
            <a
              href={`tel:${siteConfig.contact.hotlines.waterPolice.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors w-full justify-center min-h-[44px]"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Water Police Now</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
};
