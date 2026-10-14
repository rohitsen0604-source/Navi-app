import React from 'react';
import { Compass, ShieldCheck, Smartphone, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';


interface HeroSectionProps {
  onOpenDownloadModal: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenDownloadModal }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FFF1EE]/40 via-white to-[#FAFAFA] pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Decorative Background Accents */}
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-[#EB4D37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-[#FF7A00]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading, Value Prop, CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF1EE] border border-[#FFD5CE] text-[#EB4D37] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Varanasi River & Lake Platform</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] sm:leading-[1.12]">
              Sacred Waters.{' '}
              <span className="text-[#EB4D37] relative inline-block">
                Modern Reliability.
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#EB4D37]/30" viewBox="0 0 100 12" preserveAspectRatio="none">
                  <path d="M0,10 Q50,0 100,10" fill="none" stroke="currentColor" strokeWidth="4" />
                </svg>
              </span>
              <br />
              Verified Boating in Varanasi.
            </h1>

            {/* Subheading */}
            <p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Discover and book verified motor boats, hand-row boats, solar EV catamarans, and luxury bajras across <strong>15 continuous Ganges zones</strong>. Fair government-ratified tariffs, 100% life-jacket compliance, and instant Manjhi dispatch.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-3.5">
              <Button
                variant="primary"
                size="lg"
                to="/services"
                icon={<Compass className="w-5 h-5" />}
                className="w-full sm:w-auto"
              >
                Explore Services
              </Button>

              <Button
                variant="outline"
                size="lg"
                to="/how-it-works"
                icon={<ArrowRight className="w-5 h-5" />}
                iconPosition="right"
                className="w-full sm:w-auto"
              >
                How It Works
              </Button>

              <Button
                variant="dark"
                size="lg"
                onClick={onOpenDownloadModal}
                icon={<Smartphone className="w-5 h-5 text-[#EB4D37]" />}
                className="w-full sm:w-auto"
              >
                Get App
              </Button>
            </div>

            {/* Trust Badges Bar */}
            <div className="pt-6 sm:pt-8 border-t border-slate-200/80 grid grid-cols-1 sm:grid-cols-3 gap-3.5 sm:gap-4 text-left max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">100% Life Jackets</div>
                  <div className="text-[11px] text-slate-500">Compulsory & Inspected</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-[#EB4D37]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">15 Continuous Zones</div>
                  <div className="text-[11px] text-slate-500">Assi to Namo Ghat</div>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <span className="font-mono text-xs font-black">SOS</span>
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">Water Police Linked</div>
                  <div className="text-[11px] text-slate-500">+91 542 2221234</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset Display */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Main Card with Real Sunrise Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[16/11] sm:aspect-[4/5] bg-slate-900">
                <img
                  src="/images/varanasi_sunrise_bg.jpg"
                  alt="Sunrise boat glide on River Ganga Varanasi"
                  className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />
                
                {/* Overlay Badge */}
                <div className="absolute top-4 left-4">
                  <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white text-xs font-bold flex items-center gap-1.5 border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                    <span>Live Ghat Operations Active</span>
                  </div>
                </div>

                {/* Bottom Caption on Image */}
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <div className="flex items-center justify-between text-xs text-amber-300 font-semibold">
                    <span>Dashashwamedh Aarti Corridor</span>
                    <span>Zone 5</span>
                  </div>
                  <h3 className="text-xl font-bold leading-snug">
                    Standardized tariffs. Verified Manjhis. Peaceful devotion.
                  </h3>
                  <p className="text-xs text-slate-300">
                    Departing regularly from Assi, Dashashwamedh, and Rajghat piers.
                  </p>
                </div>
              </div>

              {/* Floating Secondary Mini Card */}
              <div className="absolute -bottom-6 -left-6 sm:-left-8 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 max-w-[240px] hidden sm:block">
                <div className="flex items-center gap-3">
                  <img
                    src="/images/boat_circle_logo.png"
                    alt="Naavi boat crest"
                    className="w-10 h-10 object-contain rounded-xl bg-[#FFF1EE] p-1.5 border border-[#FFD5CE]"
                  />
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Fair Metered Fare</span>
                    <p className="text-sm font-extrabold text-slate-900">Zero Bargaining</p>
                  </div>
                </div>
              </div>

              {/* Floating Badge Top Right */}
              <div className="absolute -top-4 -right-4 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-2xl shadow-lg border border-slate-100 hidden sm:flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#EB4D37]" />
                <span className="text-xs font-bold text-slate-800">84 Sacred Ghats</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
