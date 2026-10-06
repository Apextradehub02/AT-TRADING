import React, { useState } from 'react';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const CartView: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    cartSubtotal,
    cartDiscount,
    deliveryCharge,
    cartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    coupons,
    setCustomerTab,
    setSelectedProductId,
  } = useStore();

  const [inputCode, setInputCode] = useState('');
  const [couponMsg, setCouponMsg] = useState<{ text: string; success: boolean } | null>(null);

  const freeDeliveryThreshold = 499;
  const neededForFreeDelivery = Math.max(0, freeDeliveryThreshold - cartSubtotal);
  const deliveryProgress = Math.min(100, Math.round((cartSubtotal / freeDeliveryThreshold) * 100));

  const handleApplyCoupon = (code: string) => {
    const res = applyCoupon(code);
    setCouponMsg({ text: res.message, success: res.success });
    if (res.success) {
      setInputCode('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="py-16 text-center max-w-lg mx-auto bg-white rounded-2xl border border-slate-200 p-8 space-y-4 shadow-xs">
        <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto text-amber-700">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900">Your Shopping Cart is Empty</h2>
        <p className="text-xs sm:text-sm text-slate-500">
          Discover handpicked deals across fashion, electronics, gourmet groceries, and daily essentials.
        </p>
        <button
          onClick={() => setCustomerTab('products')}
          className="mt-4 px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold inline-flex items-center gap-2 shadow"
        >
          Explore Catalog Now <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
            Shopping Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)} items)
          </h1>
          <p className="text-xs text-slate-500 mt-1">Review your selections before fast checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      {/* Free Delivery Bar */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-semibold text-slate-800 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            {neededForFreeDelivery === 0
              ? '🎉 Congratulations! You have unlocked FREE Express Delivery.'
              : `Add ₹${neededForFreeDelivery.toLocaleString('en-IN')} more to get FREE Delivery!`}
          </span>
          <span className="font-mono font-bold text-slate-700">
            {deliveryProgress}%
          </span>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              neededForFreeDelivery === 0 ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${deliveryProgress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Itemized List */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100 overflow-hidden">
            {cart.map((item, idx) => (
              <div
                key={`${item.product.id}-${item.selectedVariant || idx}`}
                className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                <div
                  className="flex items-center gap-4 cursor-pointer"
                  onClick={() => setSelectedProductId(item.product.id)}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    referrerPolicy="no-referrer"
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-lg bg-slate-100 border border-slate-200 shrink-0"
                  />
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {item.product.brand} · {item.product.category}
                    </p>
                    <h3 className="text-sm font-semibold text-slate-900 hover:text-amber-600 line-clamp-2">
                      {item.product.name}
                    </h3>
                    {item.selectedVariant && (
                      <span className="inline-block text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        Variant: {item.selectedVariant}
                      </span>
                    )}
                    <p className="text-sm font-bold text-slate-900 font-mono tabular-nums sm:hidden">
                      ₹{item.product.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                    <button
                      onClick={() =>
                        updateCartQuantity(
                          item.product.id,
                          item.quantity - 1,
                          item.selectedVariant
                        )
                      }
                      className="p-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold font-mono">{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateCartQuantity(
                          item.product.id,
                          item.quantity + 1,
                          item.selectedVariant
                        )
                      }
                      className="p-1.5 text-slate-600 hover:bg-slate-100 transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right hidden sm:block min-w-24">
                    <p className="text-base font-bold text-slate-900 font-mono tabular-nums">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      ₹{item.product.price.toLocaleString('en-IN')} each
                    </p>
                  </div>

                  {/* Delete Button */}
                  <button
                    onClick={() => removeFromCart(item.product.id, item.selectedVariant)}
                    className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 px-1">
            <span>Dispatched in 3-ply eco-friendly safety carton from Baguiati Hub.</span>
            <button
              onClick={() => setCustomerTab('products')}
              className="font-semibold text-amber-600 hover:text-amber-700"
            >
              + Add More Items
            </button>
          </div>
        </div>

        {/* Checkout Summary Box & Coupon Section */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Code Section */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-500" /> Apply Promo Coupon
            </h3>

            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {appliedCoupon.code} Applied
                  </p>
                  <p className="text-[11px] text-emerald-600">{appliedCoupon.description}</p>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={inputCode}
                    onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                    className="flex-1 px-3 py-2 text-xs uppercase font-mono bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    onClick={() => handleApplyCoupon(inputCode)}
                    disabled={!inputCode.trim()}
                    className="px-4 py-2 bg-slate-900 disabled:opacity-50 text-white rounded-lg text-xs font-semibold hover:bg-slate-800"
                  >
                    Apply
                  </button>
                </div>

                {couponMsg && (
                  <p
                    className={`text-xs ${
                      couponMsg.success ? 'text-emerald-700 font-semibold' : 'text-rose-600'
                    }`}
                  >
                    {couponMsg.text}
                  </p>
                )}

                {/* Quick Recommended Coupons List */}
                <div className="pt-2 border-t border-slate-100 space-y-1.5">
                  <p className="text-[11px] font-semibold text-slate-500 uppercase">
                    Available Offers
                  </p>
                  {coupons
                    .filter((c) => c.active)
                    .slice(0, 3)
                    .map((c) => (
                      <div
                        key={c.code}
                        className="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-xs"
                      >
                        <div>
                          <span className="font-mono font-bold text-slate-900 bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded text-[10px]">
                            {c.code}
                          </span>
                          <span className="text-[11px] text-slate-600 ml-1.5">
                            Min: ₹{c.minOrder}
                          </span>
                        </div>
                        <button
                          onClick={() => handleApplyCoupon(c.code)}
                          className="text-[11px] font-bold text-amber-600 hover:text-amber-700"
                        >
                          Apply
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>

          {/* Pricing Calculation Summary */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Order Pricing Summary
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600 divide-y divide-slate-100">
              <div className="flex justify-between pt-1">
                <span>Items Subtotal</span>
                <span className="font-mono font-semibold text-slate-900">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>

              {cartDiscount > 0 && (
                <div className="flex justify-between pt-2.5 text-emerald-700 font-medium">
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span className="font-mono font-bold">
                    -₹{cartDiscount.toLocaleString('en-IN')}
                  </span>
                </div>
              )}

              <div className="flex justify-between pt-2.5">
                <span>Delivery &amp; Handling</span>
                <span className="font-mono font-semibold">
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase">FREE</span>
                  ) : (
                    `₹${deliveryCharge}`
                  )}
                </span>
              </div>

              <div className="flex justify-between pt-3 text-sm font-bold text-slate-900">
                <span>Total Amount</span>
                <span className="font-mono text-base font-extrabold text-slate-950">
                  ₹{cartTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <button
              onClick={() => setCustomerTab('checkout')}
              className="w-full py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-center gap-1.5 text-center">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Safe &amp; Secure 256-bit Encrypted Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
