import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, PhoneCall, Mail, MapPin, ExternalLink, Smartphone } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';

interface FooterProps {
  onOpenDownloadModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDownloadModal }) => {
  return (
    <footer className="bg-[#121418] text-slate-300 border-t border-slate-800">
      {/* Top Banner with Ghat Highlights */}
      <div className="border-b border-slate-800/80 bg-[#171A21] py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#EB4D37]">15 Continuous Zones</span>
              <p className="text-sm font-semibold text-white mt-1">Assi Ghat to Sant Ravidas Smarak</p>
              <span className="text-xs text-slate-400 mt-0.5">84 historic stone ghats interconnected</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-400">100% Life Jacket Compliance</span>
              <p className="text-sm font-semibold text-white mt-1">ISI / USCG Certified Gear</p>
              <span className="text-xs text-slate-400 mt-0.5">Inspected at each pier departure</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-xs uppercase font-extrabold tracking-wider text-emerald-400">Zero Predatory Bargaining</span>
              <p className="text-sm font-semibold text-white mt-1">Standard Government Tariffs</p>
              <span className="text-xs text-slate-400 mt-0.5">District Administration approved charts</span>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-xs uppercase font-extrabold tracking-wider text-cyan-400">24/7 Riverfront Desks</span>
              <p className="text-sm font-semibold text-white mt-1">Station Officers Stationed</p>
              <span className="text-xs text-slate-400 mt-0.5">Dashashwamedh, Assi & Rajghat piers</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Navigation & Contact */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center">
              <img
                src="/images/naavi_logo_white.png"
                alt="Naavi Logo"
                className="h-10 w-auto object-contain brightness-110"
              />
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              The official river and lake boat discovery and booking platform. Bridging sacred Varanasi traditions with modern safety, fair tariffs, verified Manjhis, and emergency water rescue telemetry.
            </p>
            
            <div className="pt-2 flex flex-col gap-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#EB4D37] shrink-0 mt-0.5" />
                <span>Dashashwamedh Riverfront Terminal, Varanasi, UP 221001</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <a href="mailto:support@naavi.in" className="hover:text-white transition-colors">support@naavi.in</a>
              </div>
            </div>

            {/* Mobile App Download Trigger */}
            <div className="pt-3">
              <button
                onClick={onOpenDownloadModal}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors min-h-[44px]"
              >
                <Smartphone className="w-4 h-4 text-[#EB4D37]" />
                <span>Download Naavi Customer App</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Explore Platform</h4>
            <ul className="space-y-1 sm:space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors py-1 inline-block">Home Overview</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors py-1 inline-block">About Naavi & Mission</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors py-1 inline-block">Boat Ride Services</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors py-1 inline-block">Booking Workflow</Link></li>
              <li><Link to="/zones" className="hover:text-white transition-colors py-1 inline-block">15 Varanasi Zones</Link></li>
              <li><Link to="/fleet" className="hover:text-white transition-colors py-1 inline-block">Vessel Fleet & Bajras</Link></li>
            </ul>
          </div>

          {/* Safety & Helpdesk */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Safety & Policies</h4>
            <ul className="space-y-1 sm:space-y-2 text-sm">
              <li><Link to="/safety" className="hover:text-white transition-colors py-1 inline-block">Safety Protocols & Gear</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors py-1 inline-block">Frequently Asked Questions</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors py-1 inline-block">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors py-1 inline-block">Privacy Policy</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors py-1 inline-block">Contact Station Officers</Link></li>
            </ul>
          </div>

          {/* Helplines Box */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Emergency Helplines</h4>
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3">
              <div>
                <span className="text-[11px] text-rose-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-rose-500" />
                  Water Police Dispatch
                </span>
                <a
                  href={`tel:${siteConfig.contact.hotlines.waterPolice.replace(/\s+/g, '')}`}
                  className="text-base font-extrabold text-white hover:text-rose-400 block mt-0.5"
                >
                  {siteConfig.contact.hotlines.waterPolice}
                </a>
              </div>
              <div className="pt-2 border-t border-slate-700/60">
                <span className="text-[11px] text-amber-300 font-bold uppercase tracking-wider flex items-center gap-1">
                  <PhoneCall className="w-3.5 h-3.5 text-amber-400" />
                  Toll-Free Naavi Support
                </span>
                <a
                  href="tel:180010262284"
                  className="text-sm font-bold text-white hover:text-amber-400 block mt-0.5"
                >
                  1800-102-NAAVI
                </a>
                <span className="text-[10px] text-slate-400 block mt-0.5">Open 24/7 for passenger assistance</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Statutory Notice */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center md:text-left">
          <p>
            © {new Date().getFullYear()} Naavi Technologies. All rights reserved. Registered under Uttar Pradesh Inland Vessels Framework.
          </p>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 sm:gap-6">
            <Link to="/terms" className="hover:text-slate-300 transition-colors py-1.5">Terms of Service</Link>
            <span className="text-slate-700">•</span>
            <Link to="/privacy" className="hover:text-slate-300 transition-colors py-1.5">Privacy Policy</Link>
            <span className="text-slate-700">•</span>
            <Link to="/contact" className="hover:text-slate-300 transition-colors py-1.5">Ghat Desks</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
