import React, { useState } from 'react';
import { Compass, ShieldCheck, Smartphone, MapPin, ArrowRight, Sparkles, Navigation, Calendar, Users, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeroSectionProps {
  onOpenDownloadModal: () => void;
}

type BookingRideType = 'motor' | 'row' | 'private' | 'electric';

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenDownloadModal }) => {
  const [activeTab, setActiveTab] = useState<BookingRideType>('motor');
  const [pickupPier, setPickupPier] = useState('Central River Pier (Platform 1)');
  const [dropoffPier, setDropoffPier] = useState('Sunset Lake Pier');
  const [passengers, setPassengers] = useState('2 Passengers');
  const [timeSlot, setTimeSlot] = useState('Immediate (Boat arriving in ~5 mins)');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const piers = [
    'Central River Pier (Platform 1)',
    'Central River Pier (Platform 2)',
    'Sunset Lake Pier',
    'Main Ferry Pier',
    'Old Town River Steps',
    'Green Lake Pier',
    'North River Point'
  ];

  // Pure boat ride configuration
  const rideConfig = {
    motor: {
      title: 'Fast Motor Boat',
      sub: 'Point-to-point swift river & lake boat ride',
      price: '₹350',
      duration: '15 mins',
      eta: 'Boat arriving at pier in 4 mins',
      capacity: 'Up to 8 passengers',
      image: '/images/boat_motor.jpg',
      badge: 'Most Popular'
    },
    row: {
      title: 'Traditional Row Boat',
      sub: 'Calm, peaceful handcrafted wooden boat glide',
      price: '₹250',
      duration: '30 mins',
      eta: 'Boat ready at steps',
      capacity: 'Up to 4 passengers',
      image: '/images/boat_row.jpg',
      badge: 'Peaceful'
    },
    private: {
      title: 'Private Family Boat',
      sub: 'Exclusive full-boat reservation for family & friends',
      price: '₹1,200',
      duration: '1 hr (Flexible)',
      eta: 'Dedicated boat reserved for your group',
      capacity: 'Up to 12 passengers',
      image: '/images/boat_premium.jpg',
      badge: 'Private Hire'
    },
    electric: {
      title: 'Solar Electric Boat',
      sub: 'Silent, zero-smoke green electric boat',
      price: '₹500',
      duration: '30 mins',
      eta: 'Departing from pier in 6 mins',
      capacity: 'Up to 10 passengers',
      image: '/images/boat_solar.jpg',
      badge: 'Eco Friendly'
    }
  };

  const currentRide = rideConfig[activeTab];

  const handleBookNow = (e: React.FormEvent) => {
    e.preventDefault();
    setBookingSuccess(true);
    setTimeout(() => {
      onOpenDownloadModal();
      setBookingSuccess(false);
    }, 1200);
  };

  return (
    <section className="relative overflow-hidden py-10 sm:py-14 lg:py-20 border-b border-slate-200/80">
      {/* Background Image Layer - High Visibility */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero_boat_bg.jpg"
          alt="River and lake boats"
          className="w-full h-full object-cover object-center"
        />
        {/* Subtle ambient tint so boats and scenery remain clearly visible */}
        <div className="absolute inset-0 bg-slate-950/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          
          {/* Left Column: Frosted Glass White Blur Panel */}
          <div className="lg:col-span-6 bg-white/90 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 lg:p-9 shadow-2xl shadow-slate-900/15 space-y-5 text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200 text-[#9E7D3B] text-xs font-bold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>On-Demand River & Lake Boat Booking App</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-[1.12]">
              Book a Boat in Seconds.{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] to-[#9E7D3B]">
                River & Lake Boat Rides.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal">
              Like Uber and Rapido for boats. Book fast motor boats, traditional row boats, private family boats, and electric boats with fixed upfront fares and 100% life-jacket safety.
            </p>

            {/* Quick CTAs */}
            <div className="pt-1 flex flex-wrap items-center gap-2.5">
              <Button
                variant="secondary"
                size="md"
                to="/services"
                icon={<Compass className="w-4 h-4" />}
                className="shadow-md shadow-[#C5A059]/25 font-semibold text-white"
              >
                View Boat Rides
              </Button>

              <Button
                variant="outline"
                size="md"
                to="/how-it-works"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
                className="border-slate-300 bg-white hover:bg-slate-50 text-slate-800 shadow-xs"
              >
                How It Works
              </Button>

              <Button
                variant="ghost"
                size="md"
                onClick={onOpenDownloadModal}
                icon={<Smartphone className="w-4 h-4 text-[#C5A059]" />}
                className="text-slate-700 hover:text-slate-950 hover:bg-slate-100"
              >
                Get App
              </Button>
            </div>

            {/* Trust Badges */}
            <div className="pt-4 border-t border-slate-200/90 grid grid-cols-3 gap-2 text-left">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>100% Safety</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Life jackets on pier</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                  <span>&lt; 5 Min</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Boat dispatch</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="text-[11px] font-bold text-slate-900 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                  <span>Live GPS</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5">Real-time arrival</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Boat Booking Card (Frosted White Glassmorphism) */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg bg-white/92 backdrop-blur-xl border border-white/80 rounded-3xl p-5 sm:p-7 shadow-2xl shadow-slate-900/15 text-slate-900">
              
              {/* Header inside Card */}
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                <div className="text-xs uppercase font-bold tracking-wider text-slate-500">
                  Book a Boat Ride
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-ping" />
                  <span>Boats Ready</span>
                </div>
              </div>

              {/* Boat Type Tabs */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200 mb-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('motor')}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'motor'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🚤 Motor
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('row')}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'row'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🛶 Row Boat
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('private')}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'private'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  🛥️ Private
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('electric')}
                  className={`py-2 px-1 text-center rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === 'electric'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  ⚡ Electric
                </button>
              </div>

              {/* Interactive Booking Form */}
              <form onSubmit={handleBookNow} className="space-y-3.5">
                {/* Pickup Pier */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Navigation className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Pickup Pier / Boarding Point</span>
                  </label>
                  <select
                    value={pickupPier}
                    onChange={(e) => setPickupPier(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors"
                  >
                    {piers.map((pier) => (
                      <option key={pier} value={pier}>
                        {pier}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Dropoff Pier */}
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>Destination Pier</span>
                  </label>
                  <select
                    value={dropoffPier}
                    onChange={(e) => setDropoffPier(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059] transition-colors"
                  >
                    {piers.filter(p => p !== pickupPier).map((pier) => (
                      <option key={pier} value={pier}>
                        {pier}
                      </option>
                    ))}
                    <option value="Roundtrip Scenic Loop">
                      Roundtrip Boat Ride (Return to same pier)
                    </option>
                  </select>
                </div>

                {/* Row: Passengers & Schedule */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-slate-500" />
                      <span>Passengers</span>
                    </label>
                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="1 Passenger">1 Passenger</option>
                      <option value="2 Passengers">2 Passengers</option>
                      <option value="4 Passengers">4 Passengers</option>
                      <option value="6 Passengers">6 Passengers</option>
                      <option value="10+ Group">10+ Group</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Time</span>
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value="Immediate (Boat arriving in ~5 mins)">Instant (~5 mins)</option>
                      <option value="Evening Boat Ride (05:30 PM)">Evening (05:30 PM)</option>
                      <option value="Morning Boat Ride (06:30 AM)">Morning (06:30 AM)</option>
                    </select>
                  </div>
                </div>

                {/* Live Fare Preview Banner */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 transition-all">
                  <div className="flex items-center gap-3">
                    <img
                      src={currentRide.image}
                      alt={currentRide.title}
                      className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{currentRide.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#FAF7F0] text-[#8B6B2B] border border-[#EADCB9] font-semibold">
                          {currentRide.badge}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{currentRide.eta}</div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-base font-extrabold text-slate-900">{currentRide.price}</div>
                    <div className="text-[10px] text-emerald-600 font-medium">Standard Fare</div>
                  </div>
                </div>

                {/* Submit Action Button */}
                <Button
                  type="submit"
                  variant="secondary"
                  size="lg"
                  className="w-full justify-center text-sm font-bold shadow-md shadow-[#C5A059]/25 text-white cursor-pointer"
                >
                  {bookingSuccess ? (
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-white" />
                      Matching Nearest Boat...
                    </span>
                  ) : (
                    <span>Request Boat Ride Now</span>
                  )}
                </Button>
              </form>

              {/* Bottom Card Footer: Driver Partner Link */}
              <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Own a boat or drive a boat?</span>
                <button
                  type="button"
                  onClick={onOpenDownloadModal}
                  className="text-[#9E7D3B] hover:text-[#7A5E22] font-semibold transition-colors cursor-pointer"
                >
                  Join as Naavi Boat Driver →
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
