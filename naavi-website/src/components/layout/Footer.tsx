import React from 'react';
import { Link } from 'react-router-dom';
import { PhoneCall, Mail, MapPin, ExternalLink, Smartphone, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onOpenDownloadModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDownloadModal }) => {
  return (
    <footer className="bg-[#0B0F17] text-slate-300 border-t border-slate-800">
      {/* Top Value Banner */}
      <div className="border-b border-slate-800/80 bg-[#111724] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-xs uppercase font-bold tracking-wider text-[#C5A059]">On-Demand Boat Booking</span>
              <p className="text-sm font-semibold text-white mt-1">Instant App & Pier Dispatch</p>
              <span className="text-xs text-slate-400 mt-0.5">Average boat arrival under 5 minutes</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-400">100% Life Jacket Safety</span>
              <p className="text-sm font-semibold text-white mt-1">Certified Flotation Gear</p>
              <span className="text-xs text-slate-400 mt-0.5">Checked at each boat departure</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-xs uppercase font-bold tracking-wider text-cyan-400">Zero Bargaining</span>
              <p className="text-sm font-semibold text-white mt-1">Standardized Tariffs</p>
              <span className="text-xs text-slate-400 mt-0.5">Transparent upfront boat fare</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-400">24/7 Pier Desks</span>
              <p className="text-sm font-semibold text-white mt-1">Staff on Duty</p>
              <span className="text-xs text-slate-400 mt-0.5">Assistance at all major boarding points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Navigation & Contact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <img
                src="/images/naavi_logo_white.png"
                alt="Naavi Logo"
                className="h-9 w-auto object-contain brightness-110"
              />
              <span className="font-bold text-xl text-white tracking-tight">Naavi</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The premier on-demand river and lake boat booking app. Bringing transparent fares, verified boat drivers, real-time GPS tracking, and certified life jackets to boat rides across India.
            </p>
            
            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>Naavi River Technologies, Riverfront Hub, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a href="mailto:support@naavi.in" className="hover:text-white transition-colors">support@naavi.in</a>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-slate-400 shrink-0" />
                <a href="tel:180010262284" className="hover:text-white transition-colors">1800-102-NAAVI (Toll-Free)</a>
              </div>
            </div>

            {/* Mobile App Download Trigger */}
            <div className="pt-3">
              <button
                onClick={onOpenDownloadModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-4.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 transition-colors min-h-[44px] cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-[#C5A059]" />
                <span>Download Naavi Boat App</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Boat Booking</h4>
            <ul className="space-y-1 sm:space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors py-1 inline-block">Home</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors py-1 inline-block">Boat Rides & Taxis</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors py-1 inline-block">How It Works</Link></li>
              <li><Link to="/zones" className="hover:text-white transition-colors py-1 inline-block">Boarding Points & Piers</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors py-1 inline-block">About Naavi</Link></li>
            </ul>
          </div>

          {/* Safety & Policies */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Safety & Policies</h4>
            <ul className="space-y-1 sm:space-y-2 text-sm">
              <li><Link to="/safety" className="hover:text-white transition-colors py-1 inline-block">Safety & Life Jackets</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors py-1 inline-block">FAQ</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors py-1 inline-block">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors py-1 inline-block">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors py-1 inline-block">Help & Contact</Link></li>
            </ul>
          </div>

          {/* Captain Partnership */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Partner With Us</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you a boat owner or boat driver? Partner with Naavi to get boat ride bookings directly on your phone and increase daily earnings.
            </p>
            <div className="pt-1">
              <button
                onClick={onOpenDownloadModal}
                className="w-full text-center px-3.5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              >
                Boat Driver Registration
              </button>
            </div>
            <div className="pt-2 flex items-center gap-2 text-slate-400 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified Boat Driver Guarantee</span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-10 mt-10 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 Naavi Technologies Ltd. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms</Link>
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Privacy</Link>
            <Link to="/safety" className="hover:text-slate-300 transition-colors">River Safety</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
