import React, { useState } from 'react';
import { zonesData } from '../../data/zonesData';

import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { MapPin, Navigation, ArrowRight, Anchor } from 'lucide-react';

export const ZonesPreviewSection: React.FC = () => {
  const [selectedZoneNum, setSelectedZoneNum] = useState<number>(5); // Dashashwamedh default

  const selectedZone = zonesData.find(z => z.zoneNumber === selectedZoneNum) || zonesData[4];

  // Pick prominent sample zones for quick tabs
  const highlightZones = [1, 2, 5, 7, 12, 13, 15];

  return (
    <section className="py-16 sm:py-24 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(#EB4D37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#EB4D37]">
              Continuous Waterway Network
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              15 Connected Ganges Zones in Varanasi
            </h2>
            <p className="text-sm sm:text-base text-slate-300">
              Spanning the entire holy river crescent. Seamless adjacent-zone dispatch allows boatmen to pick you up quickly regardless of which of the 84 ghats you are on.
            </p>
          </div>

          <Button
            variant="outline"
            size="md"
            to="/zones"
            className="border-slate-700 text-white hover:bg-slate-800 self-start md:self-auto"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Explore All 15 Zones
          </Button>
        </div>

        {/* Zone Selector Buttons */}
        <div className="mt-8 sm:mt-10 -mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none">
          {highlightZones.map(num => {
            const z = zonesData.find(item => item.zoneNumber === num);
            if (!z) return null;
            const isSelected = selectedZoneNum === num;
            return (
              <button
                key={num}
                onClick={() => setSelectedZoneNum(num)}
                className={`min-h-[44px] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#EB4D37] text-white border-[#EB4D37] shadow-lg shadow-[#EB4D37]/30 scale-105'
                    : 'bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="font-mono text-xs opacity-80">{z.code}</span>
                <span>{z.primaryGhat}</span>
              </button>
            );
          })}
        </div>

        {/* Active Zone Detail Showcase Card */}
        <div className="mt-6 sm:mt-8">
          <Card className="bg-slate-800/90 border-slate-700 text-white p-5 sm:p-10 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Zone Details Left */}
              <div className="lg:col-span-7 space-y-5">
                <div className="flex items-center gap-3 flex-wrap">
                  <Badge variant="primary" size="md">
                    {selectedZone.code}
                  </Badge>
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    River Ganges Corridor
                  </span>
                  {selectedZone.isPopular && (
                    <Badge variant="accent" size="sm">
                      Major Hub
                    </Badge>
                  )}
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {selectedZone.name}
                </h3>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                  {selectedZone.description}
                </p>

                {/* Ghats List */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#EB4D37]" /> Connected Ghats & Steps:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {selectedZone.ghats.map((ghat, gIdx) => (
                      <span
                        key={gIdx}
                        className="px-3 py-1 rounded-xl bg-slate-700/80 text-xs font-semibold text-slate-200 border border-slate-600"
                      >
                        {ghat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Anchor className="w-3.5 h-3.5 text-amber-400" /> Sector Highlights:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                    {selectedZone.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#EB4D37]" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex items-center gap-4">
                  <Button
                    variant="primary"
                    size="md"
                    to="/zones"
                    icon={<Navigation className="w-4 h-4" />}
                    className="w-full sm:w-auto"
                  >
                    View All Boarding Points
                  </Button>
                </div>
              </div>

              {/* Zone Image Right */}
              <div className="lg:col-span-5">
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-slate-700 shadow-xl bg-slate-950">
                  <img
                    src={selectedZone.image}
                    alt={selectedZone.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                  
                  <div className="absolute bottom-4 left-4 right-4 text-xs text-slate-300 flex items-center justify-between">
                    <span className="font-semibold text-white">Primary Boarding Pier</span>
                    <span className="text-amber-400 font-bold">{selectedZone.primaryGhat}</span>
                  </div>
                </div>
              </div>

            </div>
          </Card>
        </div>

      </div>
    </section>
  );
};
