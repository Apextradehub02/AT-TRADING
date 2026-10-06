import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  ArrowRight,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  Zap,
  ShoppingBag,
  Percent,
  MapPin,
  PhoneCall,
  Check,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../ProductCard';
import { heroBannerImg, STORE_INFO } from '../../data/mockData';
import { CategoryId } from '../../types';

const CATEGORY_ITEMS: { id: CategoryId; name: string; emoji: string; desc: string }[] = [
  { id: 'Electronics', name: 'Electronics', emoji: '⚡', desc: 'Smart TVs, audio & accessories' },
  { id: 'Mobile & Accessories', name: 'Mobile & Audio', emoji: '📱', desc: 'Wearables, ANC earphones' },
  { id: 'Fashion', name: 'Fashion & Apparel', emoji: '👗', desc: 'Ethnic kurti, western & denim' },
  { id: 'Beauty', name: 'Beauty & Fragrance', emoji: '💄', desc: 'Designer EDT & skin essentials' },
  { id: 'Home & Kitchen', name: 'Home & Kitchen', emoji: '🍳', desc: 'Art decor & kitchen storage' },
  { id: 'Grocery', name: 'Gourmet & Grocery', emoji: '🌾', desc: 'Dry fruits, cashews & nuts' },
  { id: 'Sports', name: 'Sports & Fitness', emoji: '👟', desc: 'Sneakers, yoga mats & gear' },
  { id: 'Books', name: 'Books & Exams', emoji: '📚', desc: 'UPSC & competitive guides' },
  { id: 'Toys', name: 'Toys & Robotics', emoji: '🧸', desc: 'STEM building blocks & sets' },
  { id: 'Other Products', name: 'Packaging & Supplies', emoji: '📦', desc: 'Corrugated cartons & retail' },
];

export const HomeView: React.FC = () => {
  const { products, setCustomerTab, setSelectedCategory } = useStore();

  // Live countdown timer for Deals of the Day (e.g. 10 hours 54 mins 25 sec as in user prompt)
  const [timeLeft, setTimeLeft] = useState({ hours: 10, minutes: 54, seconds: 25 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const dealProducts = products.filter((p) => p.isDealOfTheDay || p.discountPercent >= 50);
  const featuredProducts = products.filter((p) => p.isFeatured).slice(0, 8);

  const handleCategoryPick = (catId: CategoryId) => {
    setSelectedCategory(catId);
    setCustomerTab('products');
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Showcase Section */}
      <section className="relative rounded-2xl overflow-hidden bg-slate-950 text-white border border-slate-800 shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[440px]">
          {/* Hero Copy */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between z-10 space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Direct Wholesale Sourcing · Kolkata Fulfillment</span>
              </div>

              <h1 className="font-display text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
                Authentic Quality, Direct Factory Prices.
              </h1>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl leading-relaxed">
                Shop curated electronics, designer fashion, smart devices, and daily essentials backed by direct Kolkata dispatch from our Baguiati fulfillment center.
              </p>
            </div>

            {/* Quick Actions & Perks */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setCustomerTab('products');
                  }}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg transition-transform hover:-translate-y-0.5"
                >
                  <ShoppingBag className="w-4 h-4" />
                  Explore All Products
                </button>

                <button
                  onClick={() => setCustomerTab('coupons')}
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 flex items-center gap-2 backdrop-blur-xs transition-colors"
                >
                  <Percent className="w-4 h-4 text-amber-400" />
                  View Today's Coupons
                </button>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 pt-2 border-t border-slate-800/80">
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" /> 100% Original Products
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" /> Cash on Delivery (COD)
                </span>
                <span className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" /> Fast 24-48h Bengal Dispatch
                </span>
              </div>
            </div>
          </div>

          {/* Hero Banner Visual */}
          <div className="lg:col-span-5 relative min-h-[260px] lg:min-h-full overflow-hidden bg-slate-900">
            <img
              src={heroBannerImg}
              alt="AT TRADING Campaign Showcase"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent lg:bg-gradient-to-r lg:from-slate-950 lg:via-transparent lg:to-transparent" />
            
            <div className="absolute bottom-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3.5 py-2 rounded-xl text-xs text-white">
              <p className="font-bold text-amber-400">Hub Location: Baguiati, Ward 12</p>
              <p className="text-[11px] text-slate-300">P.O. R-Gopalpur, Kolkata-700136</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Navigation Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              Explore Product Categories
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Wholesale catalog curated for personal &amp; business shopping
            </p>
          </div>
          <button
            onClick={() => setCustomerTab('categories')}
            className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1"
          >
            All Categories <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CATEGORY_ITEMS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryPick(cat.id)}
              className="p-3.5 bg-white border border-slate-200 rounded-xl hover:border-amber-400 hover:shadow-md transition-all text-left group flex flex-col justify-between"
            >
              <div className="text-2xl mb-2">{cat.emoji}</div>
              <div>
                <p className="text-xs font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                  {cat.name}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">{cat.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Deals of the Day / Limited Time Offers (with countdown timer!) */}
      <section className="p-6 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-rose-500/10 border border-amber-200 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-xs">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-display text-xl sm:text-2xl font-black text-slate-900">
                  Deals for You · Flash Sale
                </h2>
                <span className="bg-rose-600 text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                  Up to 83% OFF
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                Authentic retail stock with exclusive wholesale markdown
              </p>
            </div>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-2 self-start sm:self-auto bg-white border border-amber-300 px-3.5 py-2 rounded-xl shadow-xs">
            <Clock className="w-4 h-4 text-rose-600 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700">Ends in:</span>
            <div className="flex items-center gap-1 font-mono font-bold text-xs text-slate-900">
              <span className="bg-slate-900 text-white px-1.5 py-0.5 rounded">
                {String(timeLeft.hours).padStart(2, '0')}h
              </span>
              <span>:</span>
              <span className="bg-slate-900 text-white px-1.5 py-0.5 rounded">
                {String(timeLeft.minutes).padStart(2, '0')}m
              </span>
              <span>:</span>
              <span className="bg-slate-900 text-white px-1.5 py-0.5 rounded">
                {String(timeLeft.seconds).padStart(2, '0')}s
              </span>
            </div>
          </div>
        </div>

        {/* Product Cards Row/Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {dealProducts.slice(0, 4).map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Featured Collection Grid */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-slate-900">
              Featured Trending Catalog
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Top selections across electronics, apparel, lifestyle &amp; daily staples
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setCustomerTab('products');
            }}
            className="text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
          >
            View Full Store ({products.length}) <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {featuredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* Registered Hub & Official Store Identity Card */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              <MapPin className="w-3.5 h-3.5" />
              <span>Official Registered Business &amp; Operations Center</span>
            </div>

            <h3 className="font-display text-2xl font-bold text-slate-900">
              AT TRADING Headquarters &amp; Distribution Center
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              <strong className="text-slate-900">Registered Address: </strong>
              {STORE_INFO.registeredAddress}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Customer Support Line</p>
                <a
                  href={`tel:${STORE_INFO.mobileNumber}`}
                  className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5 hover:text-amber-600"
                >
                  <PhoneCall className="w-3.5 h-3.5 text-amber-600" />
                  +91 {STORE_INFO.mobileNumber}
                </a>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Postal Code</p>
                <p className="text-sm font-bold text-slate-900 mt-1 font-mono">
                  700136 (Baguiati)
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <p className="text-[11px] font-semibold text-slate-500 uppercase">Fulfillment Window</p>
                <p className="text-sm font-bold text-slate-900 mt-1">
                  Same-Day Packing
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 bg-slate-900 text-white rounded-xl p-5 space-y-4">
            <h4 className="font-bold text-sm text-amber-400">Why Shop with AT TRADING?</h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <span>Zero counterfeit guarantee with official manufacturer warranty cards.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                <span>Express Baguiati dispatch courier vans covering all North 24 Parganas &amp; Kolkata.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <RotateCcw className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <span>Doorstep replacement and quick refund settlement.</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
