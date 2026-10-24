import React from 'react';
import { Smartphone, CheckCircle2, QrCode, Shield, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';

interface AppDownloadProps {
  onOpenDownloadModal: () => void;
}

export const AppDownloadSection: React.FC<AppDownloadProps> = ({ onOpenDownloadModal }) => {
  return (
    <section className="py-16 sm:py-24 bg-[#0B0F17] text-white relative overflow-hidden border-t border-slate-800">
      {/* Decorative Blur Ambient */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#C5A059]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-slate-800/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-700/80 text-[#E5C378] text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Available on Android & iOS</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Get the Naavi App.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E5C378] via-[#C5A059] to-[#D4AF37]">
                River & Lake Boat Booking in Your Pocket.
              </span>
            </h2>

            <p className="text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Skip crowded river steps and touts. Request boats on demand, track boat arrival in real time, view transparent fare receipts, and trigger one-tap emergency SOS whenever needed.
            </p>

            {/* Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300 max-w-lg mx-auto lg:mx-0 text-left">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Instant boat arrival under 5 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Transparent fixed pricing (no haggling)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>One-tap river safety SOS emergency button</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Digital boat ride receipt & QR boarding</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3.5">
              <Button
                variant="secondary"
                size="lg"
                onClick={onOpenDownloadModal}
                icon={<Smartphone className="w-5 h-5" />}
                className="w-full sm:w-auto shadow-lg shadow-[#C5A059]/20"
              >
                Download Passenger App
              </Button>

              <button
                onClick={onOpenDownloadModal}
                className="w-full sm:w-auto justify-center px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold border border-slate-700 transition-colors flex items-center gap-2 min-h-[44px] cursor-pointer"
              >
                <QrCode className="w-4 h-4 text-slate-400" />
                <span>Scan App QR</span>
              </button>
            </div>

            <div className="pt-2 text-xs text-slate-400 flex items-center justify-center lg:justify-start gap-2">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Verified boat drivers • 100% life-jacket safety</span>
            </div>
          </div>

          {/* Right Column: App Mockup Graphic */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-sm">
              
              {/* Phone Frame Mockup */}
              <div className="bg-slate-900 rounded-[38px] p-3.5 sm:p-4.5 border-4 border-slate-700 shadow-2xl shadow-black relative">
                {/* Speaker Notch */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-3.5 bg-slate-800 rounded-full" />
                
                {/* Phone Screen */}
                <div className="bg-white rounded-[28px] overflow-hidden text-slate-900 p-4 sm:p-5 space-y-3.5 pt-6">
                  {/* App Header Inside Phone */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <img src="/images/boat_circle_logo.png" alt="Naavi" className="w-7 h-7 object-contain" />
                      <span className="font-extrabold text-sm text-slate-900">Naavi Boat App</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live GPS
                    </span>
                  </div>

                  {/* Pickup / Destination Mockup */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="font-semibold truncate">Central River Pier (Platform 1)</span>
                    </div>
                    <div className="ml-1 w-0.5 h-2 bg-slate-300" />
                    <div className="flex items-center gap-2 text-slate-700">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C5A059] shrink-0" />
                      <span className="font-semibold truncate">Sunset Lake Pier</span>
                    </div>
                  </div>

                  {/* Matched Boat Mockup */}
                  <div className="p-3 rounded-xl bg-slate-900 text-white space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">Boat Driver Ankit M.</span>
                      <span className="text-amber-400 font-bold">★ 4.9</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">Fast Motor Boat</span>
                      <span className="text-[#E5C378] font-extrabold text-base">₹350</span>
                    </div>
                    <div className="text-[10px] text-emerald-400">
                      Boat arriving at Pier in 3 mins
                    </div>
                  </div>

                  {/* Action CTA inside phone */}
                  <button
                    onClick={onOpenDownloadModal}
                    className="w-full py-2.5 rounded-xl bg-[#0F172A] hover:bg-black text-white text-xs font-bold transition-colors cursor-pointer text-center"
                  >
                    Track Boat on Map
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
