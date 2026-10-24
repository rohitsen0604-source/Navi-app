import React from 'react';
import { PhoneCall, ShieldCheck, Clock, Anchor } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

export const EmergencyBanner: React.FC = () => {
  return (
    <div className="bg-[#0B0F17] text-white border-b border-slate-800 text-[11px] sm:text-xs py-2 px-3 sm:px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        {/* Left Side: Status & Operating Hours */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            <Anchor className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <span className="truncate">River & Lake Boat Booking Live</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Operating Hours: <strong className="text-white">05:30 AM – 10:30 PM</strong></span>
          </div>
        </div>

        {/* Right Side: Emergency & Helpline Numbers */}
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
          <div className="flex items-center gap-1.5 text-emerald-300 font-medium text-[11px] sm:text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>100% Life Jacket Safety</span>
          </div>
          <a
            href={`tel:${siteConfig.contact.hotlines.tollFree.replace(/[^0-9]/g, '')}`}
            className="flex items-center gap-1 text-[#E5C378] hover:text-white font-medium transition-colors whitespace-nowrap"
            title="Naavi 24/7 Operations Helpline"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
            <span className="hidden sm:inline">24/7 Toll-Free:</span>
            <span>1800-102-NAAVI</span>
          </a>
        </div>
      </div>
    </div>
  );
};
