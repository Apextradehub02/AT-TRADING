import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Send,
  HelpCircle,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
} from 'lucide-react';
import { STORE_INFO } from '../../data/mockData';
import { useStore } from '../../context/StoreContext';

export const SupportView: React.FC = () => {
  const { showToast } = useStore();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState(STORE_INFO.mobileNumber);
  const [subject, setSubject] = useState('Order & Delivery Inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    showToast('Your message has been sent to AT TRADING support team.', 'success');
    setTimeout(() => {
      setName('');
      setMessage('');
      setSubmitted(false);
    }, 3000);
  };

  const faqs = [
    {
      q: 'Where is AT TRADING physically located and dispatched from?',
      a: 'All our orders are fulfilled directly from our central facility located at: Holding no 30103, Atghara, Majherpara, Ward no 12, Near Atghara Kali Mandir, P.O: R-Gopalpur, P.S: Baguiati, Dist: North 24 Parganas, Kolkata-700136.',
    },
    {
      q: 'How fast is delivery to Kolkata and North 24 Parganas?',
      a: 'Orders placed before 2:00 PM are processed and dispatched on the same day. Express Kolkata delivery typically arrives within 24 hours.',
    },
    {
      q: 'Do you offer Cash on Delivery (COD)?',
      a: 'Yes, Cash on Delivery is available across all serviceable pincodes. You can inspect the package condition and pay via Cash or UPI QR at your doorstep.',
    },
    {
      q: 'How does the Asset / Product Price Target Notification work?',
      a: 'Whenever a product reaches your desired target price through sales or wholesale markdowns, our automated engine sends an instant notification to your registered phone number (e.g. 9876543210).',
    },
    {
      q: 'What is your return & replacement policy?',
      a: 'We offer an easy 7-day hassle-free return and replacement guarantee on all genuine apparel, electronics, and home items.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-16">
      {/* Title */}
      <div className="border-b border-slate-200 pb-4">
        <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
          Customer Support &amp; Help Desk
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Direct assistance from our registered Kolkata distribution headquarters.
        </p>
      </div>

      {/* Official Address & Contact Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Official Registered Address */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-sm text-slate-900">Registered Office &amp; Hub</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {STORE_INFO.registeredAddress}
          </p>
          <div className="pt-2 text-[11px] font-mono font-bold text-slate-900">
            PINCODE: 700136 (Baguiati)
          </div>
        </div>

        {/* Card 2: Direct Phone Hotline */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
            <Phone className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-sm text-slate-900">Official Mobile Helpline</h2>
          <p className="text-xs text-slate-600">
            Call our support desk for instant order queries, wholesale inquiries, or delivery updates.
          </p>
          <a
            href={`tel:${STORE_INFO.mobileNumber}`}
            className="inline-flex items-center gap-2 text-sm font-black font-mono text-slate-900 hover:text-amber-600 pt-2"
          >
            <PhoneCall className="w-4 h-4 text-emerald-600" />
            +91 {STORE_INFO.mobileNumber}
          </a>
        </div>

        {/* Card 3: Working Hours & Email */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h2 className="font-bold text-sm text-slate-900">Operational Hours</h2>
          <p className="text-xs text-slate-600">
            {STORE_INFO.workingHours}
          </p>
          <div className="pt-2">
            <a
              href={`mailto:${STORE_INFO.supportEmail}`}
              className="text-xs font-semibold text-amber-700 hover:underline flex items-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              {STORE_INFO.supportEmail}
            </a>
          </div>
        </div>
      </div>

      {/* Contact Form and Location Map Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Support Request Form */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div>
            <h2 className="font-display text-xl font-bold text-slate-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-600" />
              Send Us a Message
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              We respond to inquiries within 2 business hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700">Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700">Phone Number</label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl font-mono focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Inquiry Subject</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full mt-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl"
              >
                <option value="Order & Delivery Inquiry">Order &amp; Delivery Inquiry</option>
                <option value="Asset Price Target Notification">Asset Price Target Notification</option>
                <option value="Product Return or Replacement">Product Return or Replacement</option>
                <option value="Wholesale Bulk Purchase Quote">Wholesale Bulk Purchase Quote</option>
                <option value="Baguiati Hub Pickup">Baguiati Hub Pickup Inquiry</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700">Your Message</label>
              <textarea
                required
                rows={4}
                placeholder="Please describe how we can assist you..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full mt-1 px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow transition-colors"
            >
              <Send className="w-4 h-4" />
              Submit Inquiry
            </button>

            {submitted && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Message received. Our Baguiati support representative will call {phone} shortly.
              </div>
            )}
          </form>
        </div>

        {/* Location & Hub Verification Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 text-white rounded-2xl p-6 space-y-4 shadow-md">
            <h3 className="font-display text-lg font-bold text-amber-400">
              Regional Fulfillment Zone
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Situated in Baguiati near Atghara Kali Mandir, AT TRADING is strategically positioned for rapid dispatch across North 24 Parganas, New Town, Salt Lake, and Kolkata central.
            </p>

            <div className="p-4 bg-slate-800/80 rounded-xl space-y-2 border border-slate-700 text-xs">
              <div className="flex items-center gap-2 font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Verified Business Registration</span>
              </div>
              <p className="text-slate-400 text-[11px]">
                Holding no 30103, Atghara, Majherpara, Ward no 12, P.O: R-Gopalpur, P.S: Baguiati, Kolkata-700136.
              </p>
              <p className="text-[11px] font-mono text-amber-400">
                Contact: +91 {STORE_INFO.mobileNumber}
              </p>
            </div>
          </div>

          {/* Quick FAQs */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              Frequently Asked Questions
            </h3>

            <div className="space-y-3 divide-y divide-slate-100 text-xs">
              {faqs.map((faq, idx) => (
                <div key={idx} className="pt-2.5 first:pt-0">
                  <p className="font-bold text-slate-900">{faq.q}</p>
                  <p className="text-slate-600 mt-1 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
