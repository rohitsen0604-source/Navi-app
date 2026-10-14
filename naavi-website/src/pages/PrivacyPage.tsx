import React from 'react';
import { SEO } from '../components/common/SEO';
import { privacyPolicyData } from '../data/legalData';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ShieldCheck } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-20 bg-[#FAFAFA]">
      <SEO
        title="Privacy Policy – Passenger Data & GPS Telemetry | Naavi"
        description="Official privacy policy of Naavi explaining how passenger contact data, live GPS river telemetry, and 256-bit payment encryption are managed."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <Badge variant="primary" size="md">
            Data Protection & Telemetry Standards
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: {privacyPolicyData.lastUpdated} • Compliant with Indian Digital Data Protection Principles
          </p>
        </div>

        {/* Legal Notice */}
        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold block">Passenger Data Commitment:</strong>
            <p className="leading-relaxed text-emerald-800">
              {privacyPolicyData.legalNotice}
            </p>
          </div>
        </div>

        {/* Privacy Sections */}
        <Card className="p-5 sm:p-12 bg-white border-slate-200 space-y-6 sm:space-y-8">
          {privacyPolicyData.sections.map((sec: { title: string; content: string }, idx: number) => (

            <div key={idx} className="space-y-2 pb-5 sm:pb-6 border-b border-slate-100 last:border-b-0 last:pb-0">
              <h2 className="text-base sm:text-xl font-bold text-slate-900">
                {sec.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {sec.content}
              </p>
            </div>
          ))}
        </Card>

        {/* Data Protection Contact */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-100 text-center text-xs text-slate-600">
          To exercise your rights under this policy or request data deletion, email our Data Privacy Officer at <a href="mailto:privacy@naavi.in" className="font-bold text-[#EB4D37] hover:underline">privacy@naavi.in</a>.
        </div>

      </div>
    </div>
  );
};
