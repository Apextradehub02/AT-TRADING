import React, { useState } from 'react';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  ShieldCheck,
  Package,
  Phone,
  LayoutDashboard,
  Percent,
  Menu,
  X,
  MapPin,
  ChevronRight,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { CategoryId } from '../types';
import { STORE_INFO } from '../data/mockData';

const CATEGORIES: CategoryId[] = [
  'Electronics',
  'Mobile & Accessories',
  'Fashion',
  'Beauty',
  'Home & Kitchen',
  'Grocery',
  'Sports',
  'Books',
  'Toys',
  'Other Products',
];

export const Header: React.FC = () => {
  const {
    viewMode,
    setViewMode,
    customerTab,
    setCustomerTab,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    cartCount,
    wishlist,
    products,
    setSelectedProductId,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // Filtered live search suggestions
  const searchResults = searchQuery.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase())
        )
        .slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSearchDropdown(false);
    setCustomerTab('products');
  };

  const handleCategoryClick = (cat: CategoryId | 'All') => {
    setSelectedCategory(cat);
    setCustomerTab('products');
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Notification Announcement Bar */}
      <div className="bg-slate-900 text-slate-100 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-medium text-amber-400">
              <MapPin className="w-3.5 h-3.5" />
              Baguiati Hub, Kolkata-700136
            </span>
            <span className="hidden md:inline text-slate-400">·</span>
            <span className="hidden md:inline text-slate-300">
              Next-day delivery available across Greater Kolkata &amp; Bengal
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-300">
            <a
              href={`tel:${STORE_INFO.mobileNumber}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-400" />
              <span>Call: {STORE_INFO.mobileNumber}</span>
            </a>
            <span className="text-slate-600">|</span>
            <button
              onClick={() => {
                if (viewMode === 'customer') {
                  setViewMode('admin');
                } else {
                  setViewMode('customer');
                }
              }}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors"
            >
              <LayoutDashboard className="w-3 h-3" />
              {viewMode === 'customer' ? 'Admin Panel' : 'Customer Store'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar: One-Row Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Wordmark Zone */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-md"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={() => {
                setViewMode('customer');
                setCustomerTab('home');
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="text-left group"
            >
              <span className="font-display text-2xl font-black tracking-tight text-slate-900 group-hover:text-amber-600 transition-colors">
                AT TRADING
              </span>
              <span className="hidden sm:block text-[10px] tracking-wider font-semibold text-slate-500 uppercase">
                Wholesale &amp; Retail Hub · Kolkata
              </span>
            </button>
          </div>

          {/* Search Bar Zone */}
          <div className="relative flex-1 max-w-xl hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search products, brands, electronics, fashion, groceries..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchDropdown(true);
                }}
                onFocus={() => setShowSearchDropdown(true)}
                className="w-full pl-10 pr-24 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-slate-900 placeholder-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-md transition-colors"
              >
                Search
              </button>
            </form>

            {/* Instant Search Dropdown */}
            {showSearchDropdown && searchResults.length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-xl overflow-hidden z-50 divide-y divide-slate-100"
                onMouseLeave={() => setShowSearchDropdown(false)}
              >
                <div className="px-3 py-1.5 bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex justify-between">
                  <span>Matching Products</span>
                  <span>{searchResults.length} Results</span>
                </div>
                {searchResults.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProductId(p.id);
                      setShowSearchDropdown(false);
                    }}
                    className="w-full px-3 py-2.5 text-left flex items-center gap-3 hover:bg-slate-50 transition-colors"
                  >
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-10 h-10 object-cover rounded bg-slate-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{p.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {p.category} · <span className="font-bold text-slate-900">₹{p.price.toLocaleString('en-IN')}</span>
                        {p.discountPercent > 0 && (
                          <span className="ml-1 text-emerald-600 font-semibold">{p.discountPercent}% off</span>
                        )}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Action Icons Zone */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Orders & Tracking shortcut */}
            <button
              onClick={() => {
                setViewMode('customer');
                setCustomerTab('tracking');
              }}
              className={`flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded-lg transition-colors ${
                customerTab === 'tracking' && viewMode === 'customer'
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              title="Track Order"
            >
              <Package className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline">Track Order</span>
            </button>

            {/* Coupons link */}
            <button
              onClick={() => {
                setViewMode('customer');
                setCustomerTab('coupons');
              }}
              className={`hidden sm:flex items-center gap-1.5 px-2.5 py-2 text-xs font-medium rounded-lg transition-colors ${
                customerTab === 'coupons' && viewMode === 'customer'
                  ? 'bg-amber-50 text-amber-700'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              title="Offers & Coupons"
            >
              <Percent className="w-4 h-4 text-amber-600" />
              <span>Offers</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => {
                setViewMode('customer');
                setCustomerTab('account');
              }}
              className="relative p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              onClick={() => {
                setViewMode('customer');
                setCustomerTab('cart');
              }}
              className={`relative flex items-center gap-2 px-3 py-2 rounded-lg font-semibold text-xs transition-colors ${
                customerTab === 'cart' && viewMode === 'customer'
                  ? 'bg-amber-500 text-slate-950'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
              }`}
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Cart</span>
            </button>

            {/* User Account */}
            <button
              onClick={() => {
                setViewMode('customer');
                setCustomerTab('account');
              }}
              className={`p-2 rounded-lg transition-colors ${
                customerTab === 'account' && viewMode === 'customer'
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-700 hover:bg-slate-100'
              }`}
              title="My Account"
            >
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Search input */}
        <div className="mt-2.5 sm:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-16 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-2.5 bg-slate-900 text-white text-[11px] font-semibold rounded"
            >
              Go
            </button>
          </form>
        </div>
      </div>

      {/* Category Horizontal Navigation Bar */}
      <div className="border-t border-slate-200 bg-slate-50 hidden lg:block overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1 py-1.5 text-xs font-medium text-slate-700">
          <button
            onClick={() => handleCategoryClick('All')}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
              selectedCategory === 'All' && customerTab === 'products'
                ? 'bg-slate-900 text-white font-semibold'
                : 'hover:bg-slate-200 text-slate-800'
            }`}
          >
            All Products
          </button>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryClick(cat)}
              className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
                selectedCategory === cat && customerTab === 'products'
                  ? 'bg-amber-500 text-slate-950 font-semibold'
                  : 'hover:bg-slate-200 text-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
          <div className="ml-auto flex items-center gap-3 text-xs text-slate-500">
            <button
              onClick={() => {
                setViewMode('customer');
                setCustomerTab('support');
              }}
              className="hover:text-slate-900 transition-colors whitespace-nowrap"
            >
              Customer Support
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/50 flex">
          <div className="w-72 bg-white h-full shadow-2xl flex flex-col p-4 overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-display text-lg font-bold text-slate-900">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 text-slate-500 hover:text-slate-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-3 space-y-1">
              <button
                onClick={() => {
                  setViewMode('customer');
                  setCustomerTab('home');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100"
              >
                🏠 Home
              </button>
              <button
                onClick={() => {
                  setViewMode('customer');
                  setCustomerTab('products');
                  setSelectedCategory('All');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100"
              >
                🛍️ All Products
              </button>
              <button
                onClick={() => {
                  setViewMode('customer');
                  setCustomerTab('categories');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100"
              >
                📂 Categories
              </button>
              <button
                onClick={() => {
                  setViewMode('customer');
                  setCustomerTab('tracking');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100"
              >
                📦 Track Order
              </button>
              <button
                onClick={() => {
                  setViewMode('customer');
                  setCustomerTab('coupons');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100"
              >
                🎟️ Coupons &amp; Offers
              </button>
              <button
                onClick={() => {
                  setViewMode('customer');
                  setCustomerTab('account');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100"
              >
                👤 My Account
              </button>
              <button
                onClick={() => {
                  setViewMode('customer');
                  setCustomerTab('support');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100"
              >
                📞 Customer Support
              </button>
            </div>

            <div className="pt-3 border-t border-slate-200">
              <p className="text-xs font-semibold text-slate-500 uppercase mb-2">Shop Categories</p>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => handleCategoryClick(cat)}
                    className="w-full text-left px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setViewMode(viewMode === 'customer' ? 'admin' : 'customer');
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Switch to {viewMode === 'customer' ? 'Admin Panel' : 'Customer Store'}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
