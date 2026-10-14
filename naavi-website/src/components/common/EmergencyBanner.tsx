import { PhoneCall, ShieldAlert, Clock, MapPin } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

export const EmergencyBanner: React.FC = () => {
  return (
    <div className="bg-[#121418] text-white border-b border-slate-800 text-[11px] sm:text-xs py-1.5 sm:py-2 px-3 sm:px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-3">
        {/* Left Side: Location & Official Directive */}
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#EB4D37] shrink-0" />
            <span className="truncate">Varanasi 15 Ganges Zones</span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Permitted Boating Hours: <strong className="text-white">05:00 AM – 09:30 PM</strong></span>
          </div>
        </div>

        {/* Right Side: Emergency & Helpline Numbers */}
        <div className="flex items-center gap-2.5 sm:gap-6 flex-wrap">
          <a
            href={`tel:${siteConfig.contact.hotlines.waterPolice.replace(/\s+/g, '')}`}
            className="flex items-center gap-1 text-rose-300 hover:text-white font-semibold transition-colors whitespace-nowrap"
            title="Varanasi Water Police Emergency Control"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-500 animate-pulse shrink-0" />
            <span>Police: {siteConfig.contact.hotlines.waterPolice}</span>
          </a>
          <a
            href={`tel:${siteConfig.contact.hotlines.tollFree.replace(/[^0-9]/g, '')}`}
            className="flex items-center gap-1 text-amber-300 hover:text-white font-medium transition-colors whitespace-nowrap"
            title="Naavi 24/7 Operations Helpline"
          >
            <PhoneCall className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">24/7 Helpline:</span>
            <span>1800-102-NAAVI</span>
          </a>
        </div>
      </div>
    </div>
  );
};
