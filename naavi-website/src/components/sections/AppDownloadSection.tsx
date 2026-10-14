import React from 'react';
import { Smartphone, CheckCircle2, QrCode, Shield, Zap, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface AppDownloadProps {
  onOpenDownloadModal: () => void;
}

export const AppDownloadSection: React.FC<AppDownloadProps> = ({ onOpenDownloadModal }) => {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-br from-[#121418] via-[#1A1D24] to-[#121418] text-white relative overflow-hidden">
      {/* Decorative Blur Spheres */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#EB4D37]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#FF7A00]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EB4D37]/20 border border-[#EB4D37]/40 text-[#EB4D37] text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Available for Android & iOS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Get the Naavi App.<br />
              <span className="text-[#EB4D37]">Varanasi Boating at Your Fingertips.</span>
            </h2>

            <p className="text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Skip the chaos on the ghat steps. Book rides on-demand with instant boatman assignment, track arrival in real time, view official tariff receipts, and trigger one-tap Water Police SOS assistance whenever needed.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant Ghat dispatch in 15 zones</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Transparent metered pricing</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>One-tap Water Police SOS button</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Digital ticket & invoice download</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={onOpenDownloadModal}
                icon={<Smartphone className="w-5 h-5" />}
                className="w-full sm:w-auto"
              >
                Download Customer App
              </Button>

              <button
                onClick={onOpenDownloadModal}
                className="w-full sm:w-auto justify-center px-5 py-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold border border-slate-700 transition-colors flex items-center gap-2 min-h-[44px]"
              >
                <QrCode className="w-4 h-4 text-slate-400" />
                <span>Scan QR Code</span>
              </button>
            </div>

            <div className="pt-2 text-xs text-slate-400 flex items-center justify-center lg:justify-start gap-2">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pilot testing with verified Varanasi Ghat boatmen & travelers</span>
            </div>
          </div>

          {/* Right Column: App Mockup Graphic */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              
              {/* Phone Frame Mockup */}
              <div className="bg-slate-900 rounded-[36px] sm:rounded-[44px] p-3.5 sm:p-4.5 border-4 border-slate-700 shadow-2xl shadow-black/80 relative">
                {/* Speaker Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-3.5 sm:h-4 bg-slate-800 rounded-full" />
                
                {/* Phone Screen */}
                <div className="bg-white rounded-[26px] sm:rounded-[32px] overflow-hidden text-slate-900 p-4 sm:p-5 space-y-3 sm:space-y-4 pt-6">
                  {/* App Header Inside Phone */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <img src="/images/boat_circle_logo.png" alt="Naavi" className="w-7 h-7 object-contain" />
                      <span className="font-extrabold text-sm text-slate-900">Naavi App</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                      Live
                    </span>
                  </div>

                  {/* Booking Card Inside Phone */}
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-[#FFF1EE] border border-[#FFD5CE] space-y-2">
                    <div className="flex items-center justify-between text-[11px] sm:text-xs font-bold text-[#EB4D37]">
                      <span>Assi Ghat ➔ Dashashwamedh</span>
                      <span>Zone 1 to 5</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] sm:text-xs text-slate-700">
                      <span>Vessel: Motor Boat (10 Pax)</span>
                      <strong className="text-slate-900">₹1,200</strong>
                    </div>
                  </div>

                  {/* Driver Assign Card */}
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs shrink-0">
                        RM
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 truncate">Ram Manjhi (Driver)</div>
                        <div className="text-[11px] text-slate-500 font-mono truncate">UP-65-NV-2001 • 4.9★</div>
                      </div>
                    </div>
                    <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse shrink-0"></span>
                      <span className="truncate">Arriving at Assi Jetty #1 in 3 mins</span>
                    </div>
                  </div>

                  {/* Action Button inside phone */}
                  <div className="pt-1">
                    <div className="w-full py-2.5 rounded-xl bg-[#EB4D37] text-white text-xs font-bold text-center shadow-md">
                      Life Jackets Verified • Start Ride
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-3 sm:-bottom-4 left-2 sm:-left-6 bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-2 sm:gap-2.5 max-w-[calc(100%-1rem)]">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <div className="min-w-0">
                  <div className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wide">Emergency Safety</div>
                  <div className="text-[11px] sm:text-xs font-black text-rose-600 truncate">1-Tap Water Police SOS</div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
