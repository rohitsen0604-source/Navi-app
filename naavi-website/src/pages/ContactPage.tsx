import React, { useState } from 'react';
import { SEO } from '../components/common/SEO';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { submitContactTicket } from '../utils/api';
import type { ContactFormData, SupportTicketResult } from '../types';
import {
  MapPin,
  Clock,
  ShieldAlert,
  Send,
  CheckCircle2,
  AlertCircle,
  Ticket
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    category: 'GENERAL',
    bookingCode: '',
    message: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ContactFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<SupportTicketResult | null>(null);

  const validate = (): boolean => {
    const errs: Partial<Record<keyof ContactFormData, string>> = {};

    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    } else if (formData.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters.';
    }

    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please enter a valid email address.';
    }

    if (!formData.phone.trim()) {
      errs.phone = 'Contact phone number is required.';
    } else if (!/^[0-9+-\s]{8,15}$/.test(formData.phone)) {
      errs.phone = 'Please enter a valid phone number.';
    }

    if (!formData.message.trim()) {
      errs.message = 'Please provide details of your inquiry.';
    } else if (formData.message.trim().length < 10) {
      errs.message = 'Inquiry details should be at least 10 characters.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setResult(null);

    try {
      const res = await submitContactTicket(formData);
      setResult(res);
      if (res.success) {
        setFormData({
          name: '',
          email: '',
          phone: '',
          category: 'GENERAL',
          bookingCode: '',
          message: ''
        });
        setErrors({});
      }
    } catch {
      setResult({
        success: false,
        message: 'Could not connect to the Pier Support desk. Please call 1800-102-NAAVI directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative overflow-hidden py-12 sm:py-20 min-h-[85vh]">
      <SEO
        title="Contact & Pier Support Desks – Naavi"
        description="Get in touch with Naavi's Boat Operations Command, toll-free passenger helpline (1800-102-NAAVI), or station officers at river and lake pier terminals."
      />

      {/* Background Image Layer - High Visibility */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/contact_page_bg.jpg"
          alt="Modern riverfront terminal pavilion"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-slate-950/20" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 relative z-10">
        
        {/* Header in Frosted Glass White Blur Card */}
        <div className="bg-white/92 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-10 shadow-2xl shadow-slate-900/15 text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="accent" size="md">
            Direct Pier Assistance & Support
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Connect with Naavi Operations
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
            Whether inquiring about private boat bookings, lost items on the water, or driver partnership verification, our station officers are available to assist.
          </p>
        </div>

        {/* Contact Grid: Form Left, Verified Info Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
          
          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <Card className="p-6 sm:p-10 bg-white/92 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl shadow-slate-900/15">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Submit Support / Pier Ticket
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
                Directly submitted to our central boat dispatch queue.
              </p>

              {/* Success Result Banner */}
              {result && result.success && (
                <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 animate-fade-in">
                  <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Ticket Logged Successfully</span>
                  </div>
                  <p className="text-xs text-emerald-800">{result.message}</p>
                  {result.ticketId && (
                    <div className="flex items-center gap-2 pt-1 font-mono text-xs font-bold text-emerald-950">
                      <Ticket className="w-4 h-4 text-emerald-700" />
                      <span>Ticket Reference: <strong>{result.ticketId}</strong></span>
                    </div>
                  )}
                </div>
              )}

              {/* Error Result Banner */}
              {result && !result.success && (
                <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold block">Submission Error</strong>
                    <span>{result.message}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 text-left">
                {/* Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 min-h-[46px] bg-white/90 ${
                      errors.name ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-slate-900'
                    }`}
                  />
                  {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
                </div>

                {/* Email & Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 min-h-[46px] bg-white/90 ${
                        errors.email ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-slate-900'
                      }`}
                    />
                    {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 min-h-[46px] bg-white/90 ${
                        errors.phone ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-slate-900'
                      }`}
                    />
                    {errors.phone && <p className="text-[11px] text-rose-600 mt-1">{errors.phone}</p>}
                  </div>
                </div>

                {/* Category & Booking Code Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Inquiry Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white/90 text-slate-800 min-h-[46px]"
                    >
                      <option value="GENERAL">General Support & Inquiry</option>
                      <option value="PAYMENT_REFUND">Payment & Fare Question</option>
                      <option value="BOAT_DELAY">Boat Timing & Scheduling</option>
                      <option value="SAFETY_INQUIRY">Safety & Life Jacket Concern</option>
                      <option value="LOST_ITEM">Lost & Found on Water</option>
                      <option value="DRIVER_BEHAVIOR">Driver / Operator Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Booking Reference (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.bookingCode}
                      onChange={(e) => setFormData({ ...formData, bookingCode: e.target.value })}
                      placeholder="e.g. NV-9912"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 min-h-[46px] bg-white/90"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Message / Request Details *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details regarding your ride, preferred pier, group size, or query..."
                    className={`w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:ring-2 bg-white/90 ${
                      errors.message ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-slate-900'
                    }`}
                  />
                  {errors.message && <p className="text-[11px] text-rose-600 mt-1">{errors.message}</p>}
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    isLoading={isSubmitting}
                    icon={<Send className="w-4 h-4" />}
                    className="w-full min-h-[48px]"
                  >
                    Submit Ticket to Pier Desk
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Official Channels & Details Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Helplines Card */}
            <Card className="p-6 sm:p-7 bg-[#0B0F17]/95 backdrop-blur-xl text-white border border-slate-800 rounded-3xl shadow-2xl space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C5A059] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#C5A059]" />
                Official Hotlines
              </span>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">24/7 Toll-Free Passenger Support</span>
                  <a href="tel:180010262284" className="text-base sm:text-lg font-bold text-white hover:text-[#C5A059] block mt-0.5">
                    1800-102-NAAVI (62284)
                  </a>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <span className="text-rose-400 block text-[11px] font-bold">National Emergency & River Patrol</span>
                  <a href="tel:112" className="text-base font-bold text-rose-300 hover:text-white block mt-0.5">
                    112 / 1800-425-2424
                  </a>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <span className="text-slate-400 block text-[11px]">WhatsApp Operations Desk</span>
                  <a href="https://wa.me/919876500000" className="text-sm font-semibold text-emerald-400 hover:underline block mt-0.5">
                    +91 98765 00000
                  </a>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <span className="text-slate-400 block text-[11px]">Email Communications</span>
                  <a href="mailto:support@naavi.in" className="text-sm font-semibold text-slate-200 hover:underline block mt-0.5">
                    support@naavi.in
                  </a>
                </div>
              </div>
            </Card>

            {/* Operating Hours Card */}
            <Card className="p-6 sm:p-7 bg-white/92 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl shadow-slate-900/15 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Operating Timings</span>
              </div>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span>Passenger Boating Hours:</span>
                  <strong className="text-slate-900 font-bold">05:30 AM – 10:30 PM</strong>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span>Night Curfew:</span>
                  <span className="text-rose-600 font-bold">Concludes at 10:30 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Pier Assistance Desks:</span>
                  <span className="text-emerald-700 font-bold">24 Hours at Central River Pier</span>
                </div>
              </div>
            </Card>

            {/* Central Terminal Address */}
            <Card className="p-6 sm:p-7 bg-white/92 backdrop-blur-xl border border-white/80 rounded-3xl shadow-2xl shadow-slate-900/15 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <MapPin className="w-4 h-4 text-[#C5A059]" />
                <span>Central Operations Terminal</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-normal">
                Naavi Boat Operations Command, Central River Promenade Pier, Platform #1, Inland Waterways, India
              </p>
            </Card>

          </div>

        </div>

      </div>
    </div>
  );
};
