import React, { useState } from 'react';
import { SEO } from '../components/common/SEO';
import { faqData } from '../data/faqData';
import { Accordion } from '../components/ui/Accordion';
import type { AccordionItem } from '../components/ui/Accordion';
import type { FAQItem } from '../types';
import { Badge } from '../components/ui/Badge';
import { Search, PhoneCall } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { label: 'All Questions', value: 'all' },
    { label: 'Booking & App', value: 'booking' },
    { label: 'Pricing & Tariffs', value: 'pricing' },
    { label: 'Safety & Life Jackets', value: 'safety' },
    { label: 'Piers & Locations', value: 'ghats' },
    { label: 'Cancellations & Policies', value: 'policy' },
  ];

  const filteredFaqs = faqData.filter((faq: FAQItem) => {
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const accordionItems: AccordionItem[] = filteredFaqs.map((f: FAQItem) => ({
    id: f.id,
    title: f.question,
    content: (
      <div className="space-y-2">
        <p className="text-slate-600 font-normal leading-relaxed">{f.answer}</p>
        <span className="inline-block text-[11px] font-semibold text-[#C5A059] uppercase tracking-wider">
          Topic: {f.categoryLabel}
        </span>
      </div>
    )
  }));

  return (
    <div className="relative overflow-hidden py-12 sm:py-20 min-h-[85vh]">
      <SEO
        title="Frequently Asked Questions (FAQ) – Naavi"
        description="Got questions about booking boat rides on Naavi, fares, safety rules, cancellation refunds, or river & lake piers? Find verified answers here."
      />

      {/* Background Image Layer - High Visibility */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/faq_page_bg.jpg"
          alt="Handcrafted wooden boats moored at misty lake boardwalk"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-slate-950/20" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12 relative z-10">
        
        {/* Header in Frosted Glass White Blur Card */}
        <div className="bg-white/92 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-900/15 text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="accent" size="md">
            Help Center & Inquiries
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Everything you need to know about booking, transparent fares, life jacket compliance, and boat rides on Naavi.
          </p>
        </div>

        {/* Search Bar in Frosted Glass Container */}
        <div className="max-w-xl mx-auto">
          <div className="relative bg-white/92 backdrop-blur-xl border border-white/80 rounded-2xl shadow-xl shadow-slate-900/10 p-1.5">
            <Search className="w-5 h-5 text-slate-400 absolute left-5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions (e.g. refund, life jacket, fares)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3 rounded-xl bg-transparent border-none text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-0 min-h-[44px]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-1"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map(cat => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`min-h-[40px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer backdrop-blur-md ${
                selectedCategory === cat.value
                  ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20'
                  : 'bg-white/85 text-slate-700 border border-white/80 hover:bg-white shadow-sm'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List in Frosted Glass White Blur Card */}
        <div className="bg-white/92 backdrop-blur-xl rounded-3xl border border-white/80 p-6 sm:p-10 shadow-2xl shadow-slate-900/15">
          {accordionItems.length > 0 ? (
            <Accordion items={accordionItems} />
          ) : (
            <div className="text-center py-12 space-y-3">
              <p className="text-slate-500 text-sm">
                No matching questions found for "{searchTerm}".
              </p>
              <button
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                className="text-xs text-[#9E7D3B] font-bold hover:underline"
              >
                Reset Search Filters
              </button>
            </div>
          )}
        </div>

        {/* Direct Concierge Helpline */}
        <div className="bg-[#0B0F17]/95 backdrop-blur-xl rounded-3xl p-6 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-800 shadow-2xl">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold">Still have a question?</h3>
            <p className="text-xs sm:text-sm text-slate-300 font-normal">
              Our 24/7 Pier Concierge and support dispatchers are ready to assist with group bookings, accessibility, or private boat bookings.
            </p>
          </div>
          <a
            href="tel:180010262284"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#C5A059] hover:bg-[#B38F46] text-white font-semibold text-xs transition-colors shrink-0 shadow-sm"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 1800-102-NAAVI</span>
          </a>
        </div>

      </div>
    </div>
  );
};
