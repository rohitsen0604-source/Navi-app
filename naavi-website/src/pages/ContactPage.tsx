import React, { useState } from 'react';
import { SEO } from '../components/common/SEO';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { submitContactTicket } from '../utils/api';
import type { ContactFormData, SupportTicketResult, GhatDesk } from '../types';
import { ghatDesksData } from '../data/zonesData';
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
    } catch (err) {
      setResult({
        success: false,
        message: 'Could not connect to the Ghat Support desk. Please call 1800-102-NAAVI directly.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 sm:py-20 bg-[#FAFAFA]">
      <SEO
        title="Contact & Ghat Assistance Desks – Naavi Varanasi"
        description="Get in touch with Naavi's Ghat Operations command, toll-free passenger helpline (1800-102-NAAVI), or station officers at Dashashwamedh, Assi, and Rajghat piers."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="primary" size="md">
            Direct Ghat Assistance & Inquiry Desk
          </Badge>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Connect with Naavi Operations
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            Whether inquiring about group Bajra charters, lost items on the river, or fair fare verification, our station officers are available round the clock.
          </p>
        </div>

        {/* Contact Grid: Form Left, Verified Info Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <Card className="p-5 sm:p-10 bg-white border-slate-200 shadow-sm">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Submit Support / Pier Ticket
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 mb-6">
                Connected directly to our backend support engine (<code className="text-[#EB4D37] font-mono">POST /api/support/tickets</code>).
              </p>

              {/* Success Result Banner */}
              {result && result.success && (
                <div className="mb-6 p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 animate-fadeIn">
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
                  {result.estimatedResponse && (
                    <div className="text-[11px] text-emerald-700">
                      Estimated review: {result.estimatedResponse}
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
                    className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm focus:outline-none focus:ring-2 min-h-[46px] ${
                      errors.name ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-[#EB4D37]'
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
                      className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm focus:outline-none focus:ring-2 min-h-[46px] ${
                        errors.email ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-[#EB4D37]'
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
                      placeholder="e.g. 98765 43210"
                      className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm focus:outline-none focus:ring-2 min-h-[46px] ${
                        errors.phone ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-[#EB4D37]'
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
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#EB4D37] bg-white text-slate-800 min-h-[46px]"
                    >
                      <option value="GENERAL">General Support & Inquiry</option>
                      <option value="PAYMENT_REFUND">Payment & Fair Fare Question</option>
                      <option value="BOAT_DELAY">Boat Timing & Scheduling</option>
                      <option value="SAFETY_INQUIRY">Safety & Life Jacket Concern</option>
                      <option value="LOST_ITEM">Lost & Found on River</option>
                      <option value="DRIVER_BEHAVIOR">Boatman / Sailor Grievance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Booking Code (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.bookingCode}
                      onChange={(e) => setFormData({ ...formData, bookingCode: e.target.value })}
                      placeholder="e.g. NV-9912"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#EB4D37] min-h-[46px]"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                    Message / Issue Details *
                  </label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Provide details regarding your ride, preferred ghat, group size, or query..."
                    className={`w-full px-4 py-3 rounded-xl border text-base sm:text-sm focus:outline-none focus:ring-2 ${
                      errors.message ? 'border-rose-300 focus:ring-rose-500' : 'border-slate-200 focus:ring-[#EB4D37]'
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
                    Submit Ticket to Support Desk
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Official Channels & Details Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Helplines Card */}
            <Card className="p-5 sm:p-7 bg-[#121418] text-white border-slate-800 space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-[#EB4D37] flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-[#EB4D37]" />
                Official Hotlines
              </span>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">24/7 Toll-Free Passenger Support</span>
                  <a href="tel:180010262284" className="text-base sm:text-lg font-extrabold text-white hover:text-amber-400 block mt-0.5">
                    1800-102-NAAVI (62284)
                  </a>
                </div>

                <div className="pt-3 border-t border-slate-800">
                  <span className="text-rose-400 block text-[11px] font-bold">Varanasi Water Police Emergency Control</span>
                  <a href="tel:05422221234" className="text-base font-extrabold text-rose-300 hover:text-white block mt-0.5">
                    +91 542 2221234
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
            <Card className="p-5 sm:p-7 bg-white border-slate-200 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Operating Timings</span>
              </div>
              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span>River Boating Permitted:</span>
                  <strong className="text-slate-900 font-bold">05:00 AM – 09:30 PM</strong>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span>Night Curfew:</span>
                  <span className="text-rose-600 font-bold">No boating after 09:30 PM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Physical Ghat Desks:</span>
                  <span className="text-emerald-700 font-bold">24 Hours at Dashashwamedh</span>
                </div>
              </div>
            </Card>

            {/* Central Terminal Address */}
            <Card className="p-5 sm:p-7 bg-white border-slate-200 space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                <MapPin className="w-4 h-4 text-[#EB4D37]" />
                <span>Central Operations Terminal</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">
                Naavi River Operations Command Center, Dashashwamedh Riverfront Terminal, Platform #2, Varanasi, Uttar Pradesh 221001
              </p>
            </Card>

          </div>

        </div>

        {/* Physical Assistance Desks Section */}
        <div className="pt-8">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-8">
            Physical Ghat Operations Stations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ghatDesksData.map((desk: GhatDesk) => (
              <Card key={desk.id} className="p-6 bg-white border-slate-200 space-y-3">
                <span className="font-mono text-xs font-bold text-[#EB4D37] block">{desk.zone}</span>
                <h3 className="text-base font-bold text-slate-900">{desk.ghatName}</h3>
                <p className="text-xs text-slate-600">{desk.location}</p>
                <div className="pt-2 border-t border-slate-100 text-xs text-slate-700 space-y-1">
                  <div>Officer: <strong>{desk.supervisor}</strong></div>
                  <div>Phone: <strong className="text-[#EB4D37]">{desk.phone}</strong></div>
                  <div>Hours: {desk.timing}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
