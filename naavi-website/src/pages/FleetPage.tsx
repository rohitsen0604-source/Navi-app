import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { SEO } from '../components/common/SEO';
import { fleetData } from '../data/fleetData';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';

import { Star, Users, Zap, Check } from 'lucide-react';
import type { BoatFleetItem } from '../types';

interface LayoutContextType {
  onOpenDownloadModal: () => void;
}

export const FleetPage: React.FC = () => {
  const { onOpenDownloadModal } = useOutletContext<LayoutContextType>();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const filterTabs = [
    { label: 'All Fleet Classes', value: 'ALL' },
    { label: 'Motor Boats', value: 'MOTOR_BOAT' },
    { label: 'Hand-Row Boats', value: 'MANUAL_ROW_BOAT' },
    { label: 'Luxury Bajras', value: 'LUXURY_BAJRA' },
    { label: 'Solar EV Eco', value: 'EV_BOAT' },
    { label: 'Speed Boats', value: 'SPEED_BOAT' },
  ];

  const filteredBoats = fleetData.filter((boat: BoatFleetItem) =>
    selectedCategory === 'ALL' ? true : boat.category === selectedCategory
  );


  return (
    <div className="py-12 sm:py-20 bg-[#FAFAFA]">
      <SEO
        title="Our Fleet – Verified Ganges Boats & Luxury Bajras | Naavi"
        description="Inspect Naavi's verified fleet of motor boats, hand-row boats, royal bajras, and solar EV catamarans. Licensed under UP Inland Vessels Rules with inspected safety gear."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="primary" size="md">
            Seaworthiness & Fleet Master Data
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our Verified River Fleet
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Every vessel on the Naavi platform carries a government-issued registration number (UP-65-NV series), verified seat capacity limits, and daily safety gear certifications.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {filterTabs.map(tab => (
            <button
              key={tab.value}
              onClick={() => setSelectedCategory(tab.value)}
              className={`min-h-[42px] px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
                selectedCategory === tab.value
                  ? 'bg-[#EB4D37] text-white shadow-md shadow-[#EB4D37]/25'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Fleet Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredBoats.map((boat: BoatFleetItem) => (
            <Card key={boat.id} className="flex flex-col h-full group bg-white">
              {/* Boat Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                <img
                  src={boat.image}
                  alt={boat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                {/* Government Registration Plate */}
                <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                  <span className="font-mono text-[11px] font-bold px-2.5 py-1 rounded-md bg-amber-400 text-slate-950 shadow-sm border border-amber-300">
                    {boat.regPrefix}
                  </span>
                </div>

                {/* Rating Badge */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{boat.rating.toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({boat.reviewCount})</span>
                  </div>
                </div>

                {/* Bottom Overlay Title */}
                <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 text-white">
                  <h3 className="text-base sm:text-lg font-bold leading-tight">{boat.name}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-300 mt-1">
                    <span>{boat.categoryLabel}</span>
                    <span className="text-amber-300 font-bold">{boat.pricePerTrip} / trip</span>
                  </div>
                </div>
              </div>

              {/* Boat Details */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {boat.description}
                  </p>

                  <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Users className="w-3.5 h-3.5 text-[#EB4D37]" /> Licensed Capacity:
                      </span>
                      <strong className="text-slate-900 font-bold">{boat.capacity} Passengers Max</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Zap className="w-3.5 h-3.5 text-amber-500" /> Propulsion:
                      </span>
                      <span className="font-medium text-slate-800">{boat.propulsion}</span>
                    </div>
                  </div>

                  {/* Amenities List */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                      Amenities & Flotation Gear:
                    </span>
                    {boat.amenities.map((amenity: string, aIdx: number) => (
                      <div key={aIdx} className="flex items-start gap-1.5 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-[11px] font-semibold text-slate-500 italic max-w-[150px] truncate">
                    {boat.recommendedFor}
                  </span>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onOpenDownloadModal}
                    className="min-h-[44px]"
                  >
                    Book on App
                  </Button>
                </div>

              </div>
            </Card>
          ))}
        </div>

        {/* Fleet Compliance Guarantee Box */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl text-center md:text-left">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Statutory Seaworthiness Standard
            </span>
            <h3 className="text-lg sm:text-xl font-bold">100% Life Jacket & Overcrowding Prohibition</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Under Uttar Pradesh Inland Vessels directives, no Naavi vessel is authorized to cast off from any pier with more passengers than its registered plate capacity or with passengers lacking secured life vests.
            </p>
          </div>
          <Button
            variant="outline"
            size="md"
            to="/safety"
            className="w-full md:w-auto border-slate-700 text-white hover:bg-slate-800 shrink-0 min-h-[44px]"
          >
            Read Safety Rules
          </Button>
        </div>

      </div>
    </div>
  );
};
