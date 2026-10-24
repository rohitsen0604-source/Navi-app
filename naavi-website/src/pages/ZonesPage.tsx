import React, { useState } from 'react';
import { SEO } from '../components/common/SEO';
import { zonesData, boardingPointsData } from '../data/zonesData';
import type { ZoneItem, BoardingPoint } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { MapPin, Search, Anchor } from 'lucide-react';

export const ZonesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedZone, setSelectedZone] = useState<number | null>(null);

  const filteredZones = zonesData.filter((zone: ZoneItem) => {
    const matchesName = zone.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGhat = zone.ghats.some((g: string) => g.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCode = zone.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesName || matchesGhat || matchesCode;
  });

  return (
    <div className="relative overflow-hidden py-12 sm:py-20 min-h-[85vh]">
      <SEO
        title="River & Lake Boarding Piers – Naavi"
        description="Directory of Naavi's connected river and lake boat boarding piers and passenger docks."
      />

      {/* Background Image Layer - High Visibility */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/zones_page_bg.jpg"
          alt="River and lake boat piers"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-slate-950/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 relative z-10">
        
        {/* Header in Frosted Glass White Blur Card */}
        <div className="bg-white/92 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-900/15 text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="accent" size="md">
            River & Lake Pier Directory
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            River & Lake Boat Boarding Piers
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            An interconnected network of designated boat piers, steps, and docks enabling rapid on-demand boat dispatch and seamless passenger boarding.
          </p>
        </div>

        {/* Search Bar in Frosted Glass Container */}
        <div className="max-w-xl mx-auto">
          <div className="relative bg-white/92 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-slate-900/10 p-1.5">
            <Search className="w-5 h-5 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Pier or Dock name (e.g. Central River, Sunset Promenade)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3 rounded-xl bg-transparent border-none text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 min-h-[44px]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Corridors Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white/85 backdrop-blur-xl px-6 py-4 rounded-2xl border border-white/80 shadow-lg">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Showing {filteredZones.length} River & Lake Zones
            </h2>
            <span className="text-xs text-slate-600 font-medium">
              Interconnected boarding points with smart proximity dispatch
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredZones.map((zone: ZoneItem) => (
              <Card
                key={zone.zoneNumber}
                className={`flex flex-col h-full cursor-pointer transition-all bg-white/92 backdrop-blur-xl border border-white/80 shadow-xl hover:shadow-2xl hover:border-slate-400/80 ${
                  selectedZone === zone.zoneNumber ? 'ring-2 ring-slate-900 shadow-2xl' : ''
                }`}
                onClick={() => setSelectedZone(selectedZone === zone.zoneNumber ? null : zone.zoneNumber)}
              >
                {/* Zone Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900 rounded-t-2xl">
                  <img
                    src={zone.image}
                    alt={zone.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Zone Code Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-900/90 text-white border border-slate-700 shadow-sm backdrop-blur-sm">
                      {zone.code}
                    </span>
                  </div>

                  {zone.isPopular && (
                    <div className="absolute top-3 right-3">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500 text-white">
                        High Demand Point
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-4 right-4 text-white">
                    <h3 className="text-lg font-bold leading-tight">{zone.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-300 mt-1">
                      <Anchor className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>{zone.primaryGhat}</span>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {zone.description}
                    </p>

                    {/* Pier Cleats Pill */}
                    <div className="space-y-1.5 pt-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Designated Boarding Cleats & Docks:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {zone.ghats.map((ghat: string, gIdx: number) => (
                          <span
                            key={gIdx}
                            className="px-2 py-1 rounded-md bg-slate-100/90 text-slate-700 text-[11px] font-medium border border-slate-200/60"
                          >
                            {ghat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Adjacent: {zone.adjacentZoneNumbers.map(n => `Zone ${n}`).join(', ')}</span>
                    <span className="text-[#9E7D3B] font-semibold">Active Dispatch</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Boarding Points Quick Reference */}
        <div className="bg-white/92 backdrop-blur-xl rounded-3xl border border-white/80 p-6 sm:p-10 shadow-2xl shadow-slate-900/15 space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#9E7D3B]">
              Boarding Point Coordinates
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Verified Waterfront Boarding Points
            </h2>
            <p className="text-sm text-slate-600 font-normal">
              Direct turn-by-turn walking guidance to each designated boarding pier is available in the Naavi mobile app.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boardingPointsData.map((point: BoardingPoint, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/80 backdrop-blur-md border border-slate-200/80 flex items-start gap-3 text-xs shadow-sm"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4 text-slate-700" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-slate-900 truncate">{point.name}</div>
                  <div className="text-[11px] text-slate-500">Near {point.nearbyLandmark}</div>
                  <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">Zone {point.zoneNumber}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
