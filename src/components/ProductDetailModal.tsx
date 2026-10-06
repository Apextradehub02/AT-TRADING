import React, { useState } from 'react';
import {
  X,
  Star,
  ShoppingCart,
  Heart,
  Truck,
  ShieldCheck,
  RotateCcw,
  Bell,
  CheckCircle2,
  MapPin,
  Plus,
  Minus,
  Zap,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { STORE_INFO } from '../data/mockData';

export const ProductDetailModal: React.FC = () => {
  const {
    products,
    selectedProductId,
    setSelectedProductId,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setCustomerTab,
    reviews,
    addReview,
    createPriceAlert,
  } = useStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('Standard');
  const [pinCode, setPinCode] = useState('700136');
  const [pinChecked, setPinChecked] = useState(true);

  // Price Alert Form State
  const [showAlertForm, setShowAlertForm] = useState(false);
  const [alertTargetPrice, setAlertTargetPrice] = useState<number>(0);
  const [alertEmail, setAlertEmail] = useState('customer@example.com');
  const [alertPhone, setAlertPhone] = useState(STORE_INFO.mobileNumber);
  const [alertSuccess, setAlertSuccess] = useState(false);

  // Write Review State
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewName, setReviewName] = useState('Verified Shopper');

  if (!selectedProductId) return null;

  const product = products.find((p) => p.id === selectedProductId);
  if (!product) return null;

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const isWishlisted = isInWishlist(product.id);
  const savings = product.originalPrice - product.price;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant);
    setSelectedProductId(null);
    setCustomerTab('checkout');
  };

  const handleSetAlert = (e: React.FormEvent) => {
    e.preventDefault();
    if (alertTargetPrice <= 0) return;
    createPriceAlert(product.id, alertTargetPrice, alertEmail, alertPhone);
    setAlertSuccess(true);
    setTimeout(() => {
      setAlertSuccess(false);
      setShowAlertForm(false);
    }, 2000);
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;
    addReview({
      productId: product.id,
      userName: reviewName,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
      verifiedPurchase: true,
    });
    setReviewTitle('');
    setReviewComment('');
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
            <span className="text-xs text-slate-500">ID: {product.id}</span>
          </div>
          <button
            onClick={() => setSelectedProductId(null)}
            className="p-1.5 text-slate-400 hover:text-slate-800 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gallery Column */}
            <div className="space-y-4">
              <div className="aspect-4/3 sm:aspect-square w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center"
                />
                {product.discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 font-black text-xs px-2.5 py-1 rounded shadow">
                    {product.discountPercent}% OFF
                  </span>
                )}
                {product.isDealOfTheDay && (
                  <span className="absolute top-3 right-3 bg-rose-600 text-white font-bold text-xs px-2 py-1 rounded flex items-center gap-1 shadow">
                    <Zap className="w-3 h-3 fill-current" />
                    Deal of the Day
                  </span>
                )}
              </div>

              {/* Guarantees Box */}
              <div className="grid grid-cols-3 gap-2 text-center text-xs p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex flex-col items-center gap-1 p-1">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold text-slate-800">100% Genuine</span>
                  <span className="text-[10px] text-slate-500">Brand Warranty</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-1">
                  <Truck className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-800">Baguiati Hub</span>
                  <span className="text-[10px] text-slate-500">Fast Dispatch</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-1">
                  <RotateCcw className="w-4 h-4 text-amber-600" />
                  <span className="font-semibold text-slate-800">7-Day Return</span>
                  <span className="text-[10px] text-slate-500">Hassle-Free</span>
                </div>
              </div>
            </div>

            {/* Contiguous Purchase Module */}
            <div className="space-y-5 flex flex-col justify-between">
              <div>
                <p className="text-xs uppercase font-bold tracking-widest text-slate-500">
                  {product.brand}
                </p>
                <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 leading-snug">
                  {product.name}
                </h1>

                {/* Rating Bar */}
                <div className="flex items-center gap-3 mt-2.5">
                  <div className="flex items-center gap-1 bg-emerald-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                    <span>{product.rating}</span>
                    <Star className="w-3 h-3 fill-current" />
                  </div>
                  <span className="text-xs text-slate-600 font-medium">
                    {product.reviewCount} Ratings &amp; {productReviews.length} Reviews
                  </span>
                  <span className="text-slate-300">|</span>
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified In Stock
                  </span>
                </div>

                {/* Price Display */}
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-slate-900 font-mono tabular-nums">
                      ₹{product.price.toLocaleString('en-IN')}
                    </span>
                    {product.originalPrice > product.price && (
                      <span className="text-base text-slate-400 line-through font-mono tabular-nums">
                        ₹{product.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                    {savings > 0 && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        You Save ₹{savings.toLocaleString('en-IN')} ({product.discountPercent}%)
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">Inclusive of all taxes · Wholesale GST invoice available</p>
                </div>

                {/* Variants Selection */}
                <div className="mt-4 space-y-2">
                  <label className="text-xs font-semibold text-slate-700">Options / Sizes:</label>
                  <div className="flex flex-wrap gap-2">
                    {['Standard', 'Plus Variant', 'Value Pack'].map((v) => (
                      <button
                        key={v}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                          selectedVariant === v
                            ? 'bg-slate-900 text-white border-slate-900'
                            : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delivery Checker */}
                <div className="mt-4 p-3 bg-amber-50/60 rounded-xl border border-amber-200/80">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                    <MapPin className="w-3.5 h-3.5 text-amber-600" />
                    <span>Check Delivery Availability</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      value={pinCode}
                      onChange={(e) => setPinCode(e.target.value)}
                      placeholder="Enter 6-digit Pincode"
                      className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg w-36 font-mono"
                    />
                    <button
                      onClick={() => setPinChecked(true)}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                    >
                      Check
                    </button>
                  </div>
                  {pinChecked && (
                    <p className="text-[11px] text-slate-700 mt-2 font-medium">
                      🚀 Dispatching from <span className="font-bold">Baguiati Center (700136)</span>. Delivery expected in 24-48 hours. Cash on Delivery available!
                    </p>
                  )}
                </div>

                {/* Quantity */}
                <div className="mt-4 flex items-center gap-3">
                  <span className="text-xs font-semibold text-slate-700">Quantity:</span>
                  <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-4 py-1 text-xs font-bold font-mono">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 text-slate-600 hover:bg-slate-100"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">
                    Stock: {product.stockCount} units
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-2 pt-3 border-t border-slate-200">
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                    className="flex-1 py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={!product.inStock}
                    className="flex-1 py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Zap className="w-4 h-4 fill-current text-amber-400" />
                    Buy Now
                  </button>

                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700"
                    title="Wishlist"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        isWishlisted ? 'fill-rose-500 text-rose-500' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Target Price Notification Alert Toggle */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setShowAlertForm(!showAlertForm);
                      if (!alertTargetPrice) setAlertTargetPrice(Math.round(product.price * 0.85));
                    }}
                    className="w-full text-xs font-semibold py-2 px-3 rounded-lg border border-dashed border-amber-600 bg-amber-50/50 text-amber-900 hover:bg-amber-100 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Bell className="w-3.5 h-3.5 text-amber-600" />
                    {showAlertForm ? 'Close Price Target Alert' : '🔔 Set Price Drop Target Alert (Notify Me)'}
                  </button>

                  {showAlertForm && (
                    <form
                      onSubmit={handleSetAlert}
                      className="mt-3 p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
                    >
                      <div className="text-xs">
                        <p className="font-bold text-slate-800">
                          Asset Price Target Alert Notification
                        </p>
                        <p className="text-slate-500 text-[11px]">
                          Get instant SMS &amp; notification dispatched when the price hits your target.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600">Target Price (₹)</label>
                          <input
                            type="number"
                            required
                            value={alertTargetPrice}
                            onChange={(e) => setAlertTargetPrice(Number(e.target.value))}
                            className="w-full mt-1 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600">Mobile Phone</label>
                          <input
                            type="text"
                            required
                            value={alertPhone}
                            onChange={(e) => setAlertPhone(e.target.value)}
                            className="w-full mt-1 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-600">Email Address</label>
                          <input
                            type="email"
                            required
                            value={alertEmail}
                            onChange={(e) => setAlertEmail(e.target.value)}
                            className="w-full mt-1 px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-500">
                          Registered Dispatch Address: Atghara, Majherpara, Kolkata-700136
                        </span>
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-lg transition-colors"
                        >
                          Activate Alert
                        </button>
                      </div>

                      {alertSuccess && (
                        <p className="text-xs text-emerald-700 font-bold bg-emerald-50 p-2 rounded">
                          ✓ Alert active! You will be notified at {alertPhone} when price drops to ₹{alertTargetPrice}.
                        </p>
                      )}
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description & Specs Tabs */}
          <div className="pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Product Description &amp; Highlights
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">{product.description}</p>

              {product.features && (
                <div className="space-y-2 mt-4">
                  <p className="text-xs font-bold text-slate-800">Key Features:</p>
                  <ul className="space-y-1.5">
                    {product.features.map((feat, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                Specifications
              </h3>
              {product.specs ? (
                <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                  {Object.entries(product.specs).map(([k, v]) => (
                    <div key={k} className="grid grid-cols-2 p-2.5 bg-white even:bg-slate-50">
                      <span className="font-semibold text-slate-700">{k}</span>
                      <span className="text-slate-600 font-mono">{v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Standard specifications apply.</p>
              )}
            </div>
          </div>

          {/* Reviews & Feedback Section */}
          <div className="pt-6 border-t border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Customer Reviews &amp; Ratings
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Verified buyers from AT TRADING network
                </p>
              </div>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg transition-colors"
              >
                {showReviewForm ? 'Cancel' : 'Write a Review'}
              </button>
            </div>

            {/* Review Form */}
            {showReviewForm && (
              <form
                onSubmit={handleReviewSubmit}
                className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Your Name</label>
                    <input
                      type="text"
                      required
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700">Rating (1 to 5 Stars)</label>
                    <select
                      value={reviewRating}
                      onChange={(e) => setReviewRating(Number(e.target.value))}
                      className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5 - Excellent)</option>
                      <option value={4}>⭐⭐⭐⭐ (4 - Very Good)</option>
                      <option value={3}>⭐⭐⭐ (3 - Good)</option>
                      <option value={2}>⭐⭐ (2 - Average)</option>
                      <option value={1}>⭐ (1 - Poor)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Review Headline</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Great quality and fast delivery"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Detailed Feedback</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe your experience with this item..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}

            {/* Existing Reviews List */}
            <div className="space-y-3">
              {productReviews.length > 0 ? (
                productReviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 bg-slate-50/70 rounded-xl border border-slate-200/80">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-xs text-slate-900">{rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
                            ✓ Verified Buyer
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-400 font-mono">{rev.date}</span>
                    </div>

                    <div className="flex items-center gap-1 mt-1 text-amber-500">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={`w-3 h-3 ${
                            idx < rev.rating ? 'fill-current' : 'text-slate-300'
                          }`}
                        />
                      ))}
                      <span className="text-xs font-bold text-slate-800 ml-1">{rev.title}</span>
                    </div>

                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">{rev.comment}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No written reviews yet for this product. Be the first to share your thoughts!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
