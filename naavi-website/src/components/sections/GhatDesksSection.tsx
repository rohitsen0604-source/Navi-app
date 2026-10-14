import React from 'react';
import { ghatDesksData } from '../../data/zonesData';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { MapPin, Phone, Clock, User, CheckCircle2 } from 'lucide-react';

export const GhatDesksSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#EB4D37]">
            On-River Assistance
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            24/7 Physical Ghat Operations Desks
          </h2>
          <p className="text-base text-slate-600">
            Stationed harbor officers and supervisor desks across prime Varanasi Ghat transit points for passenger boarding assistance, life vest checks, and immediate dispute resolution.
          </p>
        </div>

        {/* Desks Grid */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {ghatDesksData.map(desk => (
            <Card key={desk.id} className="p-5 sm:p-7 flex flex-col justify-between h-full group">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Badge variant="primary" size="md">
                    {desk.zone}
                  </Badge>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block"></span>
                    Stationed
                  </span>
                </div>

                <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#EB4D37] transition-colors">
                  {desk.ghatName}
                </h3>

                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-[#EB4D37] shrink-0 mt-0.5" />
                    <span className="font-medium text-slate-800">{desk.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Officer: <strong className="text-slate-800">{desk.supervisor}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Duty Hours: <strong className="text-slate-800">{desk.timing}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <a href={`tel:${desk.phone.replace(/\s+/g, '')}`} className="font-bold text-[#EB4D37] hover:underline">
                      {desk.phone}
                    </a>
                  </div>
                </div>

                {/* Desk Services Checklist */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Available Pier Services:
                  </span>
                  {desk.availableServices.map((srv, sIdx) => (
                    <div key={sIdx} className="flex items-start gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{srv}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100">
                <a
                  href={`tel:${desk.phone.replace(/\s+/g, '')}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-[#FFF1EE] text-slate-800 hover:text-[#EB4D37] font-bold text-xs transition-colors min-h-[44px]"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Station Officer</span>
                </a>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
