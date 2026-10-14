import React from 'react';
import { fleetData } from '../../data/fleetData';
import { Card } from '../ui/Card';
import { Star, Users, Zap, Check } from 'lucide-react';


export const FleetHighlightsSection: React.FC = () => {
  return (
    <section className="py-16 sm:py-24 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#EB4D37]">
            Verified Fleet Master Data
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Seaworthy Vessels for Every Sacred Voyage
          </h2>
          <p className="text-base text-slate-600">
            Every boat is registered under the UP Inland Vessels Rules with government registration numbers, rigorous capacity limits, and daily safety gear inspections.
          </p>
        </div>

        {/* Fleet Grid */}
        <div className="mt-10 sm:mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {fleetData.map(boat => (
            <Card key={boat.id} className="flex flex-col h-full group">
              {/* Boat Image */}
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                <img
                  src={boat.image}
                  alt={boat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                {/* Registration Plate Tag */}
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

              {/* Boat Content */}
              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {boat.description}
                  </p>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Users className="w-3.5 h-3.5 text-[#EB4D37]" /> Capacity:
                      </span>
                      <strong className="text-slate-900 font-bold">{boat.capacity} Passengers Max</strong>
                    </div>
                    <div className="flex items-center justify-between text-slate-700">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <Zap className="w-3.5 h-3.5 text-amber-500" /> Propulsion:
                      </span>
                      <span className="font-medium text-slate-800 truncate max-w-[170px]">{boat.propulsion}</span>
                    </div>
                  </div>

                  {/* Amenities List */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Features & Safety:</span>
                    {boat.amenities.slice(0, 3).map((amenity, aIdx) => (
                      <div key={aIdx} className="flex items-start gap-1.5 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500 italic">
                    Best for: {boat.recommendedFor}
                  </span>
                </div>

              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
