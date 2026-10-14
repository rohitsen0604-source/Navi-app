import React from 'react';
import { SEO } from '../components/common/SEO';

import { Button } from '../components/ui/Button';
import { Compass, Anchor, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-20 sm:py-32 bg-[#FAFAFA] text-center">
      <SEO
        title="Page Not Found – Naavi River Platform"
        description="The requested page could not be located on the Naavi river transport platform."
      />

      <div className="max-w-md mx-auto px-4 space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-[#FFF1EE] text-[#EB4D37] flex items-center justify-center mx-auto shadow-sm">
          <Anchor className="w-10 h-10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <span className="font-mono text-xs font-black text-[#EB4D37] uppercase tracking-wider">
            Error 404 • Drifted Off-Course
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Ghat or Page Not Found
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            It looks like this waterway route doesn't exist. Let's navigate you back to the main ghat terminal.
          </p>
        </div>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Button
            variant="primary"
            size="md"
            to="/"
            icon={<Home className="w-4 h-4" />}
          >
            Return Home
          </Button>
          <Button
            variant="outline"
            size="md"
            to="/services"
            icon={<Compass className="w-4 h-4" />}
          >
            Explore Services
          </Button>
        </div>
      </div>
    </div>
  );
};
