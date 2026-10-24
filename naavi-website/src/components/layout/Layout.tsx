import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { EmergencyBanner } from '../common/EmergencyBanner';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { Modal } from '../ui/Modal';
import { Smartphone, QrCode, AlertCircle, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../../config/siteConfig';
import { Button } from '../ui/Button';

export const Layout: React.FC = () => {
  const [downloadModalOpen, setDownloadModalOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on route navigation
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#0F172A]">
      <EmergencyBanner />
      <Navbar onOpenDownloadModal={() => setDownloadModalOpen(true)} />
      
      <main className="flex-1">
        <Outlet context={{ onOpenDownloadModal: () => setDownloadModalOpen(true) }} />
      </main>

      <Footer onOpenDownloadModal={() => setDownloadModalOpen(true)} />

      {/* App Store / Download Status Modal */}
      <Modal
        isOpen={downloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
        title="Get the Naavi Mobile App"
        maxWidth="md"
      >
        <div className="space-y-5 text-center">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 shadow-sm">
            <Smartphone className="w-8 h-8 text-[#C5A059]" />
          </div>

          <div>
            <h4 className="text-xl font-bold text-slate-900">
              Naavi Passenger & Captain App
            </h4>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed font-normal">
              Experience instant on-demand boat dispatch, GPS live ride tracking, live emergency SOS beacon, and transparent metered tariffs right from your phone.
            </p>
          </div>

          {/* QR Code / Demo Box */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center gap-3">
            <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-sm flex items-center justify-center">
              <QrCode className="w-28 h-28 text-slate-800" />
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Scan with your mobile camera to test the on-demand booking preview
            </div>
          </div>

          {/* Store Links Status */}
          <div className="space-y-3 text-left">
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block">Store Release Notice:</strong>
                {siteConfig.appStores.android.statusNotice}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Android</span>
                  <div className="text-sm font-bold text-slate-800 mt-0.5">Google Play Store</div>
                  <span className="text-[11px] text-amber-600 font-medium block mt-1">Pre-Release Pilot</span>
                </div>
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs min-h-[40px]"
                    onClick={() => alert('Naavi mobile app is currently in active pilot testing. Public store link will go live upon general release.')}
                  >
                    <span>Check Release</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <div className="p-3.5 rounded-xl border border-slate-200 bg-white shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">iOS</span>
                  <div className="text-sm font-bold text-slate-800 mt-0.5">Apple App Store</div>
                  <span className="text-[11px] text-slate-500 font-medium block mt-1">TestFlight Build</span>
                </div>
                <div className="mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs min-h-[40px] text-slate-600"
                    disabled
                  >
                    <span>Coming Soon</span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};
