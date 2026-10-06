import React, { useState } from 'react';
import { Tag, Copy, Check, Percent, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CouponsView: React.FC = () => {
  const { coupons, applyCoupon, setCustomerTab, cartCount } = useStore();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleApply = (code: string) => {
    applyCoupon(code);
    if (cartCount > 0) {
      setCustomerTab('cart');
    } else {
      setCustomerTab('products');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
            Coupons, Discounts &amp; Exclusive Offers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Apply active promotional promo codes for instant savings at checkout.
          </p>
        </div>
        <button
          onClick={() => setCustomerTab('cart')}
          className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800"
        >
          View Cart ({cartCount})
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon.code}
            className={`border rounded-2xl p-6 relative overflow-hidden flex flex-col justify-between transition-all bg-white ${
              coupon.active
                ? 'border-slate-200 hover:shadow-lg hover:border-amber-400'
                : 'border-slate-200 opacity-60 bg-slate-50'
            }`}
          >
            {/* Coupon Notch / Ticket Styling */}
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 border-r border-slate-200" />
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-slate-100 border-l border-slate-200" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                  <Percent className="w-3 h-3" />
                  {coupon.discountType === 'flat' ? `Flat ₹${coupon.value} OFF` : `${coupon.value}% Discount`}
                </span>
                <span className="text-[11px] text-slate-400 font-mono">
                  Expires: {coupon.expiry}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-mono font-black text-slate-900 tracking-wider">
                    {coupon.code}
                  </span>
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Copy promo code"
                  >
                    {copiedCode === coupon.code ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {coupon.description}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-dashed border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Min. order value: <strong className="text-slate-800 font-mono">₹{coupon.minOrder.toLocaleString('en-IN')}</strong>
              </span>

              <button
                onClick={() => handleApply(coupon.code)}
                disabled={!coupon.active}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Apply to Cart</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Kolkata Regional Offer Banner */}
      <div className="p-6 bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/10 border border-amber-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <p className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600" /> Kolkata &amp; North 24 Parganas Residents Special
          </p>
          <p className="text-xs text-slate-600">
            Enjoy priority same-day dispatch and zero delivery charge when shipping to Baguiati, Rajarhat, Salt Lake &amp; surrounding areas!
          </p>
        </div>
        <button
          onClick={() => handleApply('ATKOLKATA20')}
          className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold whitespace-nowrap shadow"
        >
          Use Code ATKOLKATA20
        </button>
      </div>
    </div>
  );
};
