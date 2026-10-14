import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X, Smartphone, Compass, Anchor } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { Button } from '../ui/Button';

interface NavbarProps {
  onOpenDownloadModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenDownloadModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Prevent background scroll when mobile drawer is open
  React.useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-shadow">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 group focus:outline-none shrink-0">
            <img
              src="/images/naavi_logo.png"
              alt="Naavi Logo"
              className="h-8 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-105"
            />
            <div className="flex flex-col">
              <span className="font-extrabold text-lg sm:text-2xl text-slate-900 tracking-tight flex items-center gap-1.5 leading-none">
                Naavi
                <span className="w-2 h-2 rounded-full bg-[#EB4D37] inline-block"></span>
              </span>
              <span className="text-[9px] sm:text-[11px] font-semibold text-slate-500 uppercase tracking-widest leading-normal hidden min-[360px]:inline-block">
                Varanasi Inland Waterways
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {siteConfig.navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 text-sm font-semibold rounded-xl transition-colors duration-150 ${
                    isActive
                      ? 'text-[#EB4D37] bg-[#FFF1EE]'
                      : 'text-slate-700 hover:text-[#EB4D37] hover:bg-slate-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Header Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              to="/services"
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#EB4D37] px-3.5 py-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              <Compass className="w-4 h-4 text-[#EB4D37]" />
              <span>Explore Ghats</span>
            </Link>

            <Button
              variant="primary"
              size="sm"
              icon={<Smartphone className="w-4 h-4" />}
              onClick={onOpenDownloadModal}
              className="shadow-sm"
            >
              Get App
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex xl:hidden items-center gap-1.5 sm:gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={onOpenDownloadModal}
              className="sm:hidden text-xs py-1 px-2.5 min-h-[36px]"
            >
              App
            </Button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 sm:p-2.5 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-xl text-slate-700 hover:text-[#EB4D37] hover:bg-slate-100 transition-colors focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-fadeIn max-h-[calc(100vh-4rem)] sm:max-h-[calc(100vh-5rem)] overflow-y-auto">
          <nav className="flex flex-col space-y-1">
            {siteConfig.navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 min-h-[44px] rounded-xl text-base font-semibold flex items-center justify-between ${
                    isActive
                      ? 'text-[#EB4D37] bg-[#FFF1EE]'
                      : 'text-slate-800 hover:bg-slate-50'
                  }`
                }
              >
                <span>{link.label}</span>
                <Anchor className="w-4 h-4 opacity-40 text-current" />
              </NavLink>
            ))}
          </nav>

          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col gap-2.5">
            <Button
              variant="primary"
              size="md"
              icon={<Smartphone className="w-4 h-4" />}
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenDownloadModal();
              }}
              className="w-full min-h-[44px]"
            >
              Download Naavi Mobile App
            </Button>
            <Button
              variant="outline"
              size="md"
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full min-h-[44px]"
            >
              24/7 Ghat Helpdesk Contact
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
