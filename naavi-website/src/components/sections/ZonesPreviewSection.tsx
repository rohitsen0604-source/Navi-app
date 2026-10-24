import React, { useState } from 'react';
import { zonesData } from '../../data/zonesData';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MapPin, ArrowRight, Anchor } from 'lucide-react';

export const ZonesPreviewSection: React.FC = () => {
  const [selectedZoneNum, setSelectedZoneNum] = useState<number>(1);

  const selectedZone = zonesData.find(z => z.zoneNumber === selectedZoneNum) || zonesData[0];

  return (
    <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-200/80">
      {/* Background Image Layer - High Visibility */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/piers_boat_bg.jpg"
          alt="River and lake piers background"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle ambient tint so boats, pier and water are 100% visible */}
        <div className="absolute inset-0 bg-slate-950/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
        
        {/* Header inside Frosted Glass White Blur Card */}
        <div className="bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-slate-900/15 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-widest text-[#9E7D3B]">
              Connected River & Lake Points
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Boat Boarding Points & Piers
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-normal">
              Strategically placed piers and river steps. Nearest boat driver dispatch ensures quick boat arrival in under 5 minutes.
            </p>
          </div>

          <Button
            variant="outline"
            size="md"
            to="/zones"
            className="border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-xs self-start md:self-auto shrink-0"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Explore All Boarding Points
          </Button>
        </div>

        {/* Boat Point Selector Buttons */}
        <div className="-mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {zonesData.map(z => {
            const isSelected = selectedZoneNum === z.zoneNumber;
            return (
              <button
                key={z.zoneNumber}
                onClick={() => setSelectedZoneNum(z.zoneNumber)}
                className={`min-h-[44px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 flex items-center gap-2 border cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                    : 'bg-white/90 backdrop-blur-md text-slate-700 border-white/90 hover:bg-white hover:text-slate-900 shadow-md'
                }`}
              >
                <span className="font-mono text-xs text-[#9E7D3B] font-bold">{z.code}</span>
                <span>{z.primaryGhat}</span>
              </button>
            );
          })}
        </div>

        {/* Active Zone Detail Showcase Card */}
        <Card className="bg-white/92 backdrop-blur-xl border border-white/80 p-5 sm:p-8 shadow-2xl shadow-slate-900/15 text-slate-900">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Zone Details Left */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant="accent" size="md">
                  {selectedZone.code}
                </Badge>
                <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                  River & Lake Boarding Point
                </span>
                {selectedZone.isPopular && (
                  <Badge variant="success" size="sm">
                    Major Boat Hub
                  </Badge>
                )}
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {selectedZone.name}
              </h3>

              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                {selectedZone.description}
              </p>

              {/* Pier Details Subgrid */}
              <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 uppercase font-semibold tracking-wider text-[10px]">
                    Main Boarding Pier
                  </span>
                  <div className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <Anchor className="w-4 h-4 text-[#C5A059]" />
                    <span>{selectedZone.primaryGhat}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 uppercase font-semibold tracking-wider text-[10px]">
                    Connected Steps & Cleats
                  </span>
                  <div className="text-xs text-slate-700 font-medium">
                    {selectedZone.ghats.join(' • ')}
                  </div>
                </div>
              </div>

              {/* Key Highlights */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Pier Facilities:
                </span>
                <div className="flex flex-wrap gap-2">
                  {selectedZone.highlights.map((h, i) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs text-slate-700 font-medium">
                      ✓ {h}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Zone Image Right */}
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900">
                <img
                  src={selectedZone.image}
                  alt={selectedZone.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <MapPin className="w-4 h-4 text-[#C5A059]" />
                    {selectedZone.primaryGhat}
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                    Boats Active
                  </span>
                </div>
              </div>
            </div>

          </div>
        </Card>

      </div>
    </section>
  );
};
