import React, { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, ArrowUpDown, X, Check } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from '../ProductCard';
import { CategoryId } from '../../types';

const CATEGORIES: (CategoryId | 'All')[] = [
  'All',
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

export const ProductsView: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useStore();

  const [sortBy, setSortBy] = useState<'featured' | 'priceAsc' | 'priceDesc' | 'rating' | 'discount'>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(70000);
  const [minRating, setMinRating] = useState<number>(0);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  // Filter and sort computation
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(query);
        const matchesBrand = p.brand.toLowerCase().includes(query);
        const matchesCat = p.category.toLowerCase().includes(query);
        if (!matchesName && !matchesBrand && !matchesCat) return false;
      }
      // Price filter
      if (p.price > maxPrice) return false;
      // Rating filter
      if (minRating > 0 && p.rating < minRating) return false;
      // Stock filter
      if (inStockOnly && !p.inStock) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      return 0; // featured default order
    });
  }, [products, selectedCategory, searchQuery, maxPrice, minRating, inStockOnly, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setMaxPrice(70000);
    setMinRating(0);
    setInStockOnly(false);
    setSortBy('featured');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Title & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
            {selectedCategory === 'All' ? 'All Products & Catalog' : selectedCategory}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> items
            {searchQuery && <span> for &ldquo;{searchQuery}&rdquo;</span>}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Mobile Filter Trigger */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg flex items-center gap-1.5 text-slate-700"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 text-xs font-semibold bg-white border border-slate-300 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            >
              <option value="featured">Featured / Relevant</option>
              <option value="priceAsc">Price: Low to High</option>
              <option value="priceDesc">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="discount">Biggest Discount %</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Layout Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-white p-5 rounded-xl border border-slate-200 space-y-6 sticky top-28">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" /> Filter Catalog
            </span>
            <button
              onClick={resetFilters}
              className="text-[11px] text-amber-600 hover:text-amber-700 font-semibold"
            >
              Reset All
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Categories</p>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-2.5 py-1.5 text-xs rounded-md transition-colors flex items-center justify-between ${
                    selectedCategory === cat
                      ? 'bg-amber-50 text-amber-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{cat}</span>
                  {selectedCategory === cat && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wider">Max Price</span>
              <span className="font-mono font-bold text-slate-900">
                ₹{maxPrice.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min={500}
              max={70000}
              step={500}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>₹500</span>
              <span>₹70,000</span>
            </div>
          </div>

          {/* Customer Rating Filter */}
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">Customer Rating</p>
            <div className="space-y-1">
              {[4, 3, 0].map((star) => (
                <button
                  key={star}
                  onClick={() => setMinRating(star)}
                  className={`w-full text-left px-2 py-1 text-xs rounded transition-colors flex items-center justify-between ${
                    minRating === star
                      ? 'bg-amber-50 text-amber-900 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{star === 0 ? 'All Ratings' : `${star}★ and Above`}</span>
                  {minRating === star && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* In Stock Only Checkbox */}
          <div className="pt-3 border-t border-slate-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded accent-slate-900"
              />
              <span>In-Stock Items Only</span>
            </label>
          </div>
        </aside>

        {/* Products Grid Content Area */}
        <main className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-white rounded-xl border border-dashed border-slate-300">
              <p className="text-base font-bold text-slate-800">No products match your current filters</p>
              <p className="text-xs text-slate-500 mt-1">
                Try loosening the price limit or searching for another term.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
              >
                Clear Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex lg:hidden">
          <div className="w-80 bg-white h-full ml-auto p-5 overflow-y-auto space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-bold text-sm text-slate-900">Filters</span>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 text-slate-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-800">Categories</p>
              <div className="space-y-1">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 text-xs rounded ${
                      selectedCategory === cat ? 'bg-amber-100 font-bold' : 'hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-slate-800">Max Price</span>
                <span className="font-mono font-bold">₹{maxPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min={500}
                max={70000}
                step={500}
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-amber-500"
              />
            </div>

            <div className="pt-4 border-t border-slate-200 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2 text-xs font-semibold border border-slate-300 rounded-lg text-slate-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
