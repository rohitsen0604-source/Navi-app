import React from 'react';
import { SEO } from '../components/common/SEO';
import { termsOfServiceData } from '../data/legalData';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AlertCircle } from 'lucide-react';

export const TermsPage: React.FC = () => {
  return (
    <div className="py-12 sm:py-20 bg-[#FAFAFA]">
      <SEO
        title="Terms of Service – Naavi Platform"
        description="Official terms of service for booking and operating on the Naavi on-demand river and lake boat booking app."
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <Badge variant="accent" size="md">
            Statutory Agreement
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Terms & Conditions of Service
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: {termsOfServiceData.lastUpdated} • Registered under Inland Waterways Regulations
          </p>
        </div>

        {/* Legal Review Notice Alert */}
        <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs sm:text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="font-bold block">Business & Legal Compliance Notice:</strong>
            <p className="leading-relaxed text-amber-800 font-normal">
              {termsOfServiceData.legalNotice}
            </p>
          </div>
        </div>

        {/* Terms Sections */}
        <Card className="p-6 sm:p-12 bg-white border-slate-200 space-y-6 sm:space-y-8">
          {termsOfServiceData.sections.map((sec: { title: string; content: string }, idx: number) => (
            <div key={idx} className="space-y-2 pb-5 sm:pb-6 border-b border-slate-100 last:border-b-0 last:pb-0">
              <h2 className="text-base sm:text-xl font-bold text-slate-900">
                {sec.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {sec.content}
              </p>
            </div>
          ))}
        </Card>

        {/* Contact point for legal queries */}
        <div className="p-5 sm:p-6 rounded-2xl bg-slate-100 text-center text-xs text-slate-600">
          For statutory inquiries or grievance filings, contact <a href="mailto:grievance@naavi.in" className="font-bold text-slate-900 hover:text-[#C5A059] underline">grievance@naavi.in</a> or visit any Naavi Pier Support Desk.
        </div>

      </div>
    </div>
  );
};
