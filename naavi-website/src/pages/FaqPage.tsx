import React, { useState } from 'react';
import { SEO } from '../components/common/SEO';
import { faqData } from '../data/faqData';
import { Accordion } from '../components/ui/Accordion';
import type { AccordionItem } from '../components/ui/Accordion';
import type { FAQItem } from '../types';
import { Badge } from '../components/ui/Badge';
import { Search, HelpCircle, PhoneCall } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { label: 'All Questions', value: 'all' },
    { label: 'Booking & App', value: 'booking' },
    { label: 'Pricing & Tariffs', value: 'pricing' },
    { label: 'Safety & Life Jackets', value: 'safety' },
    { label: 'Ghats & Locations', value: 'ghats' },
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
        <p>{f.answer}</p>
        <span className="inline-block text-[11px] font-semibold text-[#EB4D37] uppercase tracking-wider">
          Category: {f.categoryLabel}
        </span>
      </div>
    )
  }));

  return (
    <div className="py-12 sm:py-20 bg-[#FAFAFA]">
      <SEO
        title="Frequently Asked Questions (FAQ) – Naavi Varanasi"
        description="Got questions about booking boats in Varanasi, fares, safety rules, cancellation refunds, or 15 Ganges Ghat zones? Find verified answers here."
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="primary" size="md">
            Help Center & Inquiries
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Everything you need to know about booking, standardized tariffs, life jacket compliance, and river navigation across Varanasi.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search questions (e.g. refund, life jacket)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-white border border-slate-200 shadow-sm text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#EB4D37] focus:border-[#EB4D37] min-h-[46px]"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 p-1"
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
              className={`min-h-[42px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors ${
                selectedCategory === cat.value
                  ? 'bg-[#EB4D37] text-white shadow-sm'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion Component */}
        {accordionItems.length > 0 ? (
          <Accordion items={accordionItems} allowMultiple={false} />
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700">No matching questions found</h3>
            <p className="text-xs text-slate-500">
              Try adjusting your search terms or contact our 24/7 Ghat Helpdesks directly.
            </p>
          </div>
        )}

        {/* Direct Helpline Support Callout */}
        <div className="p-5 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#FFF1EE] text-[#EB4D37] flex items-center justify-center mx-auto">
            <PhoneCall className="w-6 h-6" />
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900">
            Have a Specific River Journey Question?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            Our 24/7 Ghat Station Officers and support dispatchers are ready to assist with group bookings, accessibility questions, or custom Bajra charters.
          </p>
          <div className="pt-2">
            <a
              href="tel:180010262284"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-[#EB4D37] hover:bg-[#D63D27] text-white font-bold text-sm shadow-md transition-colors min-h-[46px]"
            >
              <span>Call Toll-Free: 1800-102-NAAVI</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
