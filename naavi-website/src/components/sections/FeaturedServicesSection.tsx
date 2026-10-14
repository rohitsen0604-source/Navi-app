import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { servicesData } from '../../data/servicesData';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Clock, Users, Anchor, CheckCircle2, ArrowRight } from 'lucide-react';
import type { ServiceCategory } from '../../types';


interface FeaturedServicesProps {
  onOpenDownloadModal?: () => void;
  showAll?: boolean;
}

export const FeaturedServicesSection: React.FC<FeaturedServicesProps> = ({
  onOpenDownloadModal,
  showAll = false
}) => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('ALL');

  const categories: { label: string; value: ServiceCategory }[] = [
    { label: 'All Services', value: 'ALL' },
    { label: 'Spiritual Aarti', value: 'SPIRITUAL_AARTI' },
    { label: 'Sunrise Glide', value: 'SUNRISE_CRUISE' },
    { label: 'Luxury Charters', value: 'PRIVATE_CHARTER' },
    { label: 'Eco Solar Green', value: 'ECO_SOLAR' },
  ];

  const filteredServices = servicesData.filter(s =>
    activeCategory === 'ALL' ? true : s.category === activeCategory
  );

  const displayedServices = showAll ? filteredServices : filteredServices.slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-[#FAFAFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-[#EB4D37]">
              Available Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Curated River Journeys & Daily Ghat Transits
            </h2>
            <p className="text-base text-slate-600">
              From the sacred nightly Dashashwamedh Aarti to silent sunrise glides and private family bajras.
            </p>
          </div>

          {!showAll && (
            <Button
              variant="outline"
              size="md"
              to="/services"
              icon={<ArrowRight className="w-4 h-4" />}
              iconPosition="right"
              className="self-start md:self-auto"
            >
              View All Services
            </Button>
          )}
        </div>

        {/* Category Filter Pills */}
        <div className="mt-8 -mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(c => (
            <button
              key={c.value}
              onClick={() => setActiveCategory(c.value)}
              className={`min-h-[42px] px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
                activeCategory === c.value
                  ? 'bg-[#EB4D37] text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Services Cards Grid */}
        <div className="mt-8 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {displayedServices.map(service => (
            <Card key={service.id} className="flex flex-col h-full group">
              {/* Card Image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-900">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/10" />
                
                {/* Badge Top Left */}
                {service.badge && (
                  <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                    <Badge variant="primary" size="md">
                      {service.badge}
                    </Badge>
                  </div>
                )}

                {/* Category Pill Top Right */}
                <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                  <span className="px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20">
                    {service.categoryLabel}
                  </span>
                </div>

                {/* Price Guide on Bottom Right */}
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4 text-right text-white">
                  <span className="text-[10px] sm:text-[11px] text-amber-300 font-semibold uppercase block">Tariff Guide</span>
                  <span className="text-sm sm:text-base font-extrabold">{service.estimatedPrice}</span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-5 sm:p-7 flex-1 flex flex-col justify-between space-y-4 sm:space-y-5">
                <div className="space-y-3">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-[#EB4D37] transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {service.description}
                  </p>

                  {/* Attributes Badges */}
                  <div className="pt-2 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-600">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 font-medium">
                      <Anchor className="w-3.5 h-3.5 text-[#EB4D37]" />
                      {service.vesselType}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 font-medium">
                      <Users className="w-3.5 h-3.5 text-[#EB4D37]" />
                      {service.capacity}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 font-medium">
                      <Clock className="w-3.5 h-3.5 text-[#EB4D37]" />
                      {service.duration}
                    </span>
                  </div>

                  {/* Key Features Bullet List */}
                  <div className="pt-2 space-y-1.5">
                    {service.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Link
                    to="/zones"
                    className="text-xs font-bold text-slate-700 hover:text-[#EB4D37] transition-colors py-2 min-h-[44px] flex items-center"
                  >
                    View Boarding Ghats →
                  </Link>

                  {onOpenDownloadModal ? (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={onOpenDownloadModal}
                      className="min-h-[44px]"
                    >
                      Book on App
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      to="/contact"
                      className="min-h-[44px]"
                    >
                      Reserve / Inquire
                    </Button>
                  )}
                </div>

              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
