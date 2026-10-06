import React from 'react';
import {
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  RotateCcw,
  LayoutDashboard,
  Heart,
} from 'lucide-react';
import { STORE_INFO } from '../data/mockData';
import { useStore } from '../context/StoreContext';
import { CategoryId } from '../types';

export const Footer: React.FC = () => {
  const { setCustomerTab, setSelectedCategory, setViewMode } = useStore();

  const handleCategoryClick = (cat: CategoryId) => {
    setSelectedCategory(cat);
    setCustomerTab('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNav = (tab: any) => {
    setCustomerTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800 text-xs">
      {/* Trust Pillar Badges */}
      <div className="border-b border-slate-800 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">100% Authentic Quality</p>
              <p className="text-slate-400 text-[11px]">Direct sourcing with verified manufacturer warranty</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Baguiati Express Dispatch</p>
              <p className="text-slate-400 text-[11px]">Priority Kolkata &amp; Bengal courier vans with tracking</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">7-Day Easy Returns &amp; COD</p>
              <p className="text-slate-400 text-[11px]">Cash on delivery and instant replacement assistance</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Column 1: Store & Registered Address */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-display text-2xl font-black text-white tracking-tight">
              AT TRADING
            </span>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Premier consumer wholesale and retail destination serving Kolkata and nationwide buyers with genuine fashion, electronics, gourmet groceries, and daily essentials.
            </p>

            <div className="space-y-2 pt-2 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Registered Address: </strong>
                  {STORE_INFO.registeredAddress}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Helpline: <strong className="font-mono text-white">+91 {STORE_INFO.mobileNumber}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Email: {STORE_INFO.supportEmail}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Departments */}
          <div className="space-y-3">
            <p className="font-bold uppercase tracking-wider text-white text-xs">Categories</p>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => handleCategoryClick('Electronics')} className="hover:text-white transition-colors">
                  Electronics
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Mobile & Accessories')} className="hover:text-white transition-colors">
                  Mobile &amp; Audio
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Fashion')} className="hover:text-white transition-colors">
                  Fashion &amp; Apparel
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Beauty')} className="hover:text-white transition-colors">
                  Beauty &amp; Fragrance
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Home & Kitchen')} className="hover:text-white transition-colors">
                  Home &amp; Kitchen
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Grocery')} className="hover:text-white transition-colors">
                  Grocery &amp; Dry Fruits
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Quick Links */}
          <div className="space-y-3">
            <p className="font-bold uppercase tracking-wider text-white text-xs">Customer Service</p>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={() => handleNav('tracking')} className="hover:text-white transition-colors">
                  Live Order Tracking
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('account')} className="hover:text-white transition-colors">
                  My Orders &amp; Account
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('coupons')} className="hover:text-white transition-colors">
                  Coupons &amp; Offers
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('support')} className="hover:text-white transition-colors">
                  Customer Support
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setViewMode('admin');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" /> Admin Dashboard
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Fulfillment Hub & Hours */}
          <div className="space-y-3">
            <p className="font-bold uppercase tracking-wider text-white text-xs">Baguiati Center</p>
            <div className="space-y-2 text-slate-400">
              <p>
                <strong className="text-white">Postal Area:</strong> 700136
              </p>
              <p>
                <strong className="text-white">Jurisdiction:</strong> Baguiati P.S., Dist: North 24 Parganas
              </p>
              <p>
                <strong className="text-white">Operating Hours:</strong> 9:00 AM - 9:00 PM IST
              </p>
              <div className="pt-2">
                <span className="inline-block px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded text-[11px] font-semibold">
                  ● Kolkata Dispatch Hub Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Legal & Payment Bar */}
      <div className="border-t border-slate-800/80 py-6 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} AT TRADING. All rights reserved. GSTIN: {STORE_INFO.gstin}
          </p>

          <div className="flex items-center gap-4 text-slate-400 font-mono text-[10px]">
            <span>UPI / GPay</span>
            <span>·</span>
            <span>PhonePe</span>
            <span>·</span>
            <span>RuPay</span>
            <span>·</span>
            <span>Visa / MasterCard</span>
            <span>·</span>
            <span>Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
