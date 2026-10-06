import React, { useState } from 'react';
import { Heart, Star, ShoppingCart, Zap, Eye, Bell } from 'lucide-react';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProductId,
    setCustomerTab,
  } = useStore();

  const [imgError, setImgError] = useState(false);
  const isWishlisted = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      onClick={() => setSelectedProductId(product.id)}
      className="group relative bg-white border border-slate-200/80 rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer flex flex-col"
    >
      {/* Visual Slot */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        {!imgError ? (
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className={`w-full h-full flex flex-col items-center justify-center p-4 bg-gradient-to-br ${
              product.fallbackGradient || 'from-slate-700 to-slate-900'
            } text-white text-center`}
          >
            <span className="text-xs uppercase tracking-wider font-semibold opacity-75">
              {product.brand}
            </span>
            <span className="text-sm font-bold mt-1 line-clamp-2">{product.name}</span>
          </div>
        )}

        {/* Subtle Discount / Deal Tag */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
          {product.discountPercent > 0 && (
            <span className="bg-amber-500 text-slate-950 text-[11px] font-extrabold px-2 py-0.5 rounded shadow-xs tracking-tight">
              {product.discountPercent}% OFF
            </span>
          )}
          {product.isDealOfTheDay && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-xs">
              <Zap className="w-2.5 h-2.5 fill-current" />
              Limited Deal
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          aria-label="Wishlist toggle"
          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-rose-600 shadow-xs transition-colors backdrop-blur-xs"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isWishlisted ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
        </button>

        {/* Quick View overlay hint */}
        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex justify-center">
          <span className="text-xs text-white font-medium flex items-center gap-1">
            <Eye className="w-3.5 h-3.5" /> Quick View
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Category */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="uppercase tracking-wider font-semibold text-[11px] text-slate-500">
              {product.brand}
            </span>
            <span>{product.category}</span>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-2">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold ml-1 text-slate-800">{product.rating}</span>
            </div>
            <span className="text-slate-400 text-xs">·</span>
            <span className="text-xs text-slate-500">({product.reviewCount})</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-bold text-slate-900 font-mono tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleQuickAdd}
              disabled={!product.inStock}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                product.inStock
                  ? 'bg-slate-900 hover:bg-slate-800 text-white'
                  : 'bg-slate-200 text-slate-500 cursor-not-allowed'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProductId(product.id);
              }}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
              title="View details & price alert"
            >
              <Bell className="w-3.5 h-3.5 text-amber-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
