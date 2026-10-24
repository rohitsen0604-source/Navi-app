import React, { useState } from 'react';
import { servicesData } from '../../data/servicesData';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Clock, Users, Anchor, CheckCircle2, ArrowRight } from 'lucide-react';
import type { ServiceCategory } from '../../types';

interface FeaturedServicesProps {
  onOpenDownloadModal?: () => void;
  showAll?: boolean;
  className?: string;
  transparent?: boolean;
  hideHeader?: boolean;
}

export const FeaturedServicesSection: React.FC<FeaturedServicesProps> = ({
  onOpenDownloadModal,
  showAll = false,
  className,
  transparent = false,
  hideHeader = false,
}) => {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('ALL');

  const categories: { label: string; value: ServiceCategory }[] = [
    { label: 'All Boat Rides', value: 'ALL' },
    { label: 'Motor Boat', value: 'DAILY_TRANSIT' },
    { label: 'Scenic Boat Ride', value: 'SCENIC_RIDE' },
    { label: 'Private Boat Hire', value: 'PRIVATE_CHARTER' },
    { label: 'Electric Boat', value: 'ECO_SOLAR' },
  ];

  const filteredServices = servicesData.filter(s =>
    activeCategory === 'ALL' ? true : s.category === activeCategory
  );

  const displayedServices = showAll ? filteredServices : filteredServices.slice(0, 4);

  return (
    <section className={`${transparent ? 'bg-transparent py-0' : 'py-12 sm:py-20 bg-[#FAFAFA]'} ${className || ''}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        {!hideHeader && (
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C5A059]">
                Available Boat Rides
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                On-Demand River & Lake Boat Rides
              </h2>
              <p className="text-base text-slate-600">
                From fast point-to-point motor boat rides to scenic evening boat rides, peaceful row boats, and private family boat bookings.
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
                View All Boat Rides
              </Button>
            )}
          </div>
        )}

        {/* Category Filter Pills */}
        <div className="mt-8 -mx-4 px-4 sm:mx-0 sm:px-0 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(c => (
            <button
              key={c.value}
              onClick={() => setActiveCategory(c.value)}
              className={`min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === c.value
                  ? 'bg-slate-900 text-white shadow-sm'
                  : transparent
                  ? 'bg-white/85 text-slate-700 border border-white/80 hover:bg-white backdrop-blur-md'
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
            <Card
              key={service.id}
              className={`flex flex-col h-full group hover:border-slate-400/80 transition-all ${
                transparent ? 'bg-white/92 backdrop-blur-xl border border-white/80 shadow-2xl shadow-slate-900/10' : ''
              }`}
            >
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
                    <Badge variant="accent" size="sm">
                      {service.badge}
                    </Badge>
                  </div>
                )}

                {/* Price Tag Bottom Right */}
                <div className="absolute bottom-3 sm:bottom-4 right-3 sm:right-4">
                  <div className="px-3.5 py-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white border border-white/20 text-xs sm:text-sm font-bold shadow-md">
                    {service.estimatedPrice}
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#C5A059]">
                    <Anchor className="w-3.5 h-3.5" />
                    <span>{service.vesselType}</span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed font-normal">
                    {service.description}
                  </p>

                  {/* Highlights Grid */}
                  <ul className="space-y-2 pt-2 border-t border-slate-100">
                    {service.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Meta & CTA */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {service.duration}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {service.capacity}
                    </span>
                  </div>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={onOpenDownloadModal}
                    className="shrink-0"
                  >
                    Book Boat
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </section>
  );
};
