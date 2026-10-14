import React, { useState } from 'react';
import { SEO } from '../components/common/SEO';
import { zonesData, boardingPointsData } from '../data/zonesData';
import type { ZoneItem, BoardingPoint } from '../types';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { MapPin, Search, Anchor } from 'lucide-react';
import { GhatDesksSection } from '../components/sections/GhatDesksSection';

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
    <div className="py-12 sm:py-20 bg-[#FAFAFA]">
      <SEO
        title="15 Varanasi Ganges Zones & Boarding Points – Naavi"
        description="Comprehensive directory of Naavi's 15 continuous Varanasi river zones, from Assi Ghat and Tulsi Ghat to Dashashwamedh, Manikarnika, Rajghat, and Namo Ghat."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="primary" size="md">
            River Ganges Corridor Master Data
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            15 Continuous Ganges River Zones in Varanasi
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Spanning all 84 historic stone ghats from Assi Ghat in the south to the modern Namo Ghat terminal in the north. Our interconnected network enables seamless river transport and rapid boatman dispatch.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Ghat name (e.g. Dashashwamedh, Assi)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#EB4D37] focus:border-[#EB4D37] min-h-[46px]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* 15 Zones Grid */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-0">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">
              Showing {filteredZones.length} of 15 River Sectors
            </h2>
            <span className="text-xs text-slate-500">
              Sorted south to north along the Ganges crescent
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredZones.map((zone: ZoneItem) => (
              <Card
                key={zone.zoneNumber}
                className={`flex flex-col h-full cursor-pointer transition-all ${
                  selectedZone === zone.zoneNumber ? 'ring-2 ring-[#EB4D37] shadow-xl' : ''
                }`}
                onClick={() => setSelectedZone(selectedZone === zone.zoneNumber ? null : zone.zoneNumber)}
              >
                {/* Zone Image */}
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-900">
                  <img
                    src={zone.image}
                    alt={zone.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  
                  {/* Zone Code Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="font-mono text-xs font-black px-2.5 py-1 rounded-lg bg-[#EB4D37] text-white shadow-sm">
                      {zone.code}
                    </span>
                  </div>

                  {zone.isPopular && (
                    <div className="absolute top-3 right-3">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 shadow-sm">
                        High Demand
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="text-base font-bold leading-snug">{zone.name}</h3>
                    <div className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#EB4D37]" />
                      <span>Primary: <strong className="text-white">{zone.primaryGhat}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Zone Content */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {zone.description}
                    </p>

                    <div className="space-y-1.5 pt-1">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                        Included Ghats & Steps:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {zone.ghats.map((ghat: string, gIdx: number) => (
                          <span
                            key={gIdx}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200/60"
                          >
                            {ghat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span>Adjacent: {zone.adjacentZoneNumbers.map((n: number) => `Zone ${n}`).join(', ')}</span>
                    <span className="text-[#EB4D37] font-semibold">Active Sector</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>

        </div>

        {/* Boarding Points Master GPS Coordinates Table */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-10 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#EB4D37]">
              Verified Boarding Points
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Primary Pier Coordinates & Landmarks
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Exact GPS boarding locations used by the Naavi allocation engine for boat pickup precision.
            </p>
          </div>

          <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
            <table className="w-full min-w-[560px] text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase text-[11px] font-bold">
                  <th className="py-3 px-4">Boarding Pier</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4">GPS Coordinates</th>
                  <th className="py-3 px-4">Nearby Landmark</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {boardingPointsData.map((pt: BoardingPoint, idx: number) => (
                  <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                      <Anchor className="w-3.5 h-3.5 text-[#EB4D37]" />
                      <span>{pt.name}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-800">
                        Zone {pt.zoneNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-xs text-slate-600">
                      {pt.lat.toFixed(4)}° N, {pt.lng.toFixed(4)}° E
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {pt.nearbyLandmark || 'Riverfront steps'}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        Active Jetty
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Physical Assistance Desks Section */}
        <GhatDesksSection />

      </div>
    </div>
  );
};
