import React, { useState } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  Truck,
  ArrowRight,
  MapPin,
  Clock,
  Banknote,
  Building,
  Printer,
  Package,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { CustomerInfo, Order } from '../../types';
import { STORE_INFO } from '../../data/mockData';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    cartDiscount,
    deliveryCharge,
    cartTotal,
    appliedCoupon,
    addresses,
    placeOrder,
    setCustomerTab,
    setTrackingOrderId,
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    addresses[0]?.id || 'custom'
  );

  // Address form fields
  const defaultAddr = addresses.find((a) => a.id === selectedAddressId) || addresses[0];
  const [customerName, setCustomerName] = useState(defaultAddr?.name || 'Debolina Ghosh');
  const [customerPhone, setCustomerPhone] = useState(defaultAddr?.phone || STORE_INFO.mobileNumber);
  const [customerEmail, setCustomerEmail] = useState('shopper@attrading.in');
  const [street, setStreet] = useState(defaultAddr?.street || 'Holding no 30103, Atghara, Majherpara, Ward no 12');
  const [locality, setLocality] = useState(defaultAddr?.locality || 'Near Atghara Kali Mandir, P.O: R-Gopalpur');
  const [landmark, setLandmark] = useState(defaultAddr?.landmark || 'Baguiati Police Station area');
  const [city, setCity] = useState(defaultAddr?.city || 'Kolkata');
  const [state, setState] = useState(defaultAddr?.state || 'West Bengal');
  const [pincode, setPincode] = useState(defaultAddr?.pincode || '700136');

  // Delivery Method
  const [deliveryMethod, setDeliveryMethod] = useState<'Standard' | 'Express'>('Express');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'NetBanking' | 'COD'>('UPI');
  const [upiId, setUpiId] = useState('shopper@oksbi');
  const [cardHolder, setCardHolder] = useState('Debolina Ghosh');
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');

  // Completed Order State
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (cart.length === 0 && !confirmedOrder) {
    return (
      <div className="py-16 text-center max-w-md mx-auto bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
        <p className="text-base font-bold text-slate-800">Your cart is empty</p>
        <button
          onClick={() => setCustomerTab('products')}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          Browse Catalog
        </button>
      </div>
    );
  }

  const handleSelectAddress = (id: string) => {
    setSelectedAddressId(id);
    const addr = addresses.find((a) => a.id === id);
    if (addr) {
      setCustomerName(addr.name);
      setCustomerPhone(addr.phone);
      setStreet(addr.street);
      setLocality(addr.locality);
      setLandmark(addr.landmark || '');
      setCity(addr.city);
      setState(addr.state);
      setPincode(addr.pincode);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const customer: CustomerInfo = {
      name: customerName,
      phone: customerPhone,
      email: customerEmail,
      street,
      locality,
      landmark,
      city,
      state,
      pincode,
    };

    setTimeout(() => {
      const order = placeOrder(customer, deliveryMethod, paymentMethod);
      setConfirmedOrder(order);
      setIsSubmitting(false);
      setStep(5); // Confirmation step
    }, 800);
  };

  // Step 5: Order Confirmation View
  if (confirmedOrder) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 pb-16 animate-in fade-in duration-300">
        {/* Success Banner */}
        <div className="p-6 sm:p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Payment &amp; Order Confirmed
          </span>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
            Thank you, {confirmedOrder.customer.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
            Your order <strong className="text-slate-900">#{confirmedOrder.id}</strong> has been received and scheduled for fast packing at AT TRADING Baguiati distribution center.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
            <button
              onClick={() => {
                setTrackingOrderId(confirmedOrder.id);
                setCustomerTab('tracking');
              }}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow"
            >
              <Package className="w-4 h-4" />
              Live Order Tracking
            </button>
            <button
              onClick={() => window.print()}
              className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              Print Tax Invoice
            </button>
          </div>
        </div>

        {/* Printable Tax Invoice Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between pb-6 border-b border-slate-200 gap-4">
            <div>
              <p className="font-display text-2xl font-black text-slate-900">AT TRADING</p>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">{STORE_INFO.registeredAddress}</p>
              <p className="text-xs text-slate-500">Phone: +91 {STORE_INFO.mobileNumber} · GSTIN: {STORE_INFO.gstin}</p>
            </div>
            <div className="text-left sm:text-right space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Official Invoice</span>
              <p className="font-mono font-bold text-slate-900 text-sm">Invoice #{confirmedOrder.id}</p>
              <p className="text-xs text-slate-500 font-mono">Date: {confirmedOrder.orderDate}</p>
              <p className="text-xs text-emerald-700 font-semibold">
                Status: {confirmedOrder.paymentStatus} via {confirmedOrder.paymentMethod}
              </p>
            </div>
          </div>

          {/* Shipping & Delivery Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <p className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">Deliver To:</p>
              <p className="font-bold text-slate-900 mt-1">{confirmedOrder.customer.name}</p>
              <p className="text-slate-600">{confirmedOrder.customer.street}</p>
              <p className="text-slate-600">{confirmedOrder.customer.locality}</p>
              <p className="text-slate-600">{confirmedOrder.customer.city}, {confirmedOrder.customer.state} - {confirmedOrder.customer.pincode}</p>
              <p className="text-slate-900 font-mono mt-1">Phone: {confirmedOrder.customer.phone}</p>
            </div>
            <div>
              <p className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">Shipping Details:</p>
              <p className="font-bold text-slate-900 mt-1">{confirmedOrder.deliveryType} Delivery</p>
              <p className="text-slate-600">Fulfillment Hub: {STORE_INFO.hubLocation}</p>
              <p className="text-slate-600">Expected: {confirmedOrder.expectedDelivery}</p>
              <p className="font-mono text-slate-900 mt-1 font-bold">AWB: {confirmedOrder.trackingNumber}</p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {confirmedOrder.items.map((it, i) => (
                  <tr key={i}>
                    <td className="py-3 px-3">
                      <p className="font-semibold text-slate-900">{it.product.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {it.product.brand} {it.selectedVariant ? `· ${it.selectedVariant}` : ''}
                      </p>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">{it.quantity}</td>
                    <td className="py-3 px-3 text-right font-mono">₹{it.product.price.toLocaleString('en-IN')}</td>
                    <td className="py-3 px-3 text-right font-mono font-bold">
                      ₹{(it.product.price * it.quantity).toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">₹{confirmedOrder.subtotal.toLocaleString('en-IN')}</span>
              </div>
              {confirmedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700 font-medium">
                  <span>Discount ({confirmedOrder.couponCode}):</span>
                  <span className="font-mono">-₹{confirmedOrder.discount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Shipping:</span>
                <span className="font-mono">{confirmedOrder.deliveryCharge === 0 ? 'FREE' : `₹${confirmedOrder.deliveryCharge}`}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total:</span>
                <span className="font-mono">₹{confirmedOrder.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Multi-step Checkout Flow Form
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Checkout Progress Stepper */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {[
            { num: 1, label: 'Address' },
            { num: 2, label: 'Delivery' },
            { num: 3, label: 'Payment' },
            { num: 4, label: 'Review' },
          ].map((s, idx) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <button
                  onClick={() => s.num < step && setStep(s.num as any)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                    step === s.num
                      ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100'
                      : step > s.num
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-400'
                  }`}
                >
                  {step > s.num ? '✓' : s.num}
                </button>
                <span className="text-[11px] font-semibold text-slate-700 mt-1.5">{s.label}</span>
              </div>
              {idx < 3 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    step > idx + 1 ? 'bg-slate-900' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Step Forms */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  Select Delivery Address
                </h2>
                <span className="text-xs text-slate-400">Step 1 of 4</span>
              </div>

              {/* Saved Address Cards */}
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    onClick={() => handleSelectAddress(addr.id)}
                    className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                      selectedAddressId === addr.id
                        ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => handleSelectAddress(addr.id)}
                          className="accent-slate-900"
                        />
                        <span className="font-bold text-xs text-slate-900">{addr.title}</span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-semibold bg-slate-900 text-white px-2 py-0.5 rounded">
                            Registered Office
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 font-mono">{addr.pincode}</span>
                    </div>
                    <p className="text-xs text-slate-700 mt-2 font-medium">
                      {addr.name} ({addr.phone})
                    </p>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {addr.street}, {addr.locality}, {addr.city}, {addr.state} - {addr.pincode}
                    </p>
                  </label>
                ))}
              </div>

              {/* Or Edit / Fill Details */}
              <div className="pt-3 border-t border-slate-100 space-y-3">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Confirm / Edit Delivery Details
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Full Name</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Contact Number</label>
                    <input
                      type="text"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Email (for e-receipt)</label>
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Postal Pincode</label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Address / House / Street</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Locality / Area</label>
                    <input
                      type="text"
                      required
                      value={locality}
                      onChange={(e) => setLocality(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">City / District</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  Continue to Delivery <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Delivery Method */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-amber-600" />
                  Choose Delivery Method
                </h2>
                <span className="text-xs text-slate-400">Step 2 of 4</span>
              </div>

              <div className="space-y-3">
                <label
                  onClick={() => setDeliveryMethod('Express')}
                  className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                    deliveryMethod === 'Express'
                      ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'Express'}
                        onChange={() => setDeliveryMethod('Express')}
                        className="accent-slate-900"
                      />
                      <div>
                        <p className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <span>⚡ Express Bengal Delivery (Baguiati Priority Van)</span>
                          <span className="bg-emerald-100 text-emerald-800 text-[10px] px-1.5 py-0.5 rounded font-bold">
                            Recommended
                          </span>
                        </p>
                        <p className="text-xs text-slate-600 mt-1">
                          Delivery by Tomorrow 4:00 PM directly dispatched from Baguiati center.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>
                </label>

                <label
                  onClick={() => setDeliveryMethod('Standard')}
                  className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                    deliveryMethod === 'Standard'
                      ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        checked={deliveryMethod === 'Standard'}
                        onChange={() => setDeliveryMethod('Standard')}
                        className="accent-slate-900"
                      />
                      <div>
                        <p className="font-bold text-xs text-slate-900">Standard Surface Delivery</p>
                        <p className="text-xs text-slate-600 mt-1">
                          Regular courier transit. Estimated 2 to 3 business days.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      {deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}
                    </span>
                  </div>
                </label>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  Continue to Payment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="font-display text-lg font-bold text-slate-900 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  Select Payment Option
                </h2>
                <span className="text-xs text-slate-400">Step 3 of 4</span>
              </div>

              <div className="space-y-3">
                {/* UPI */}
                <label
                  onClick={() => setPaymentMethod('UPI')}
                  className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'UPI'
                      ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'UPI'}
                        onChange={() => setPaymentMethod('UPI')}
                        className="accent-slate-900"
                      />
                      <div>
                        <p className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <QrCode className="w-4 h-4 text-emerald-600" />
                          UPI Instant (GPay / PhonePe / Paytm / BHIM)
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Zero transaction fee · Instant verification
                        </p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Fastest
                    </span>
                  </div>

                  {paymentMethod === 'UPI' && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80 flex flex-wrap gap-2 items-center">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="Enter your UPI ID (e.g. name@upi)"
                        className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg flex-1 font-mono"
                      />
                      <span className="text-[11px] text-slate-500">QR Code will be shown on verify</span>
                    </div>
                  )}
                </label>

                {/* Card */}
                <label
                  onClick={() => setPaymentMethod('Card')}
                  className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'Card'
                      ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'Card'}
                        onChange={() => setPaymentMethod('Card')}
                        className="accent-slate-900"
                      />
                      <div>
                        <p className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                          <CreditCard className="w-4 h-4 text-blue-600" />
                          Credit / Debit Card (Visa, MasterCard, RuPay)
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Supports domestic &amp; corporate cards
                        </p>
                      </div>
                    </div>
                  </div>

                  {paymentMethod === 'Card' && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80 space-y-2">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="Card Number"
                        className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={(e) => setCardHolder(e.target.value)}
                          placeholder="Cardholder Name"
                          className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg"
                        />
                        <input
                          type="text"
                          defaultValue="08/29"
                          placeholder="MM/YY"
                          className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                        />
                      </div>
                    </div>
                  )}
                </label>

                {/* NetBanking */}
                <label
                  onClick={() => setPaymentMethod('NetBanking')}
                  className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'NetBanking'
                      ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'NetBanking'}
                      onChange={() => setPaymentMethod('NetBanking')}
                      className="accent-slate-900"
                    />
                    <div>
                      <p className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <Building className="w-4 h-4 text-purple-600" />
                        NetBanking (SBI, HDFC, ICICI, Axis &amp; 50+ Banks)
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">Direct bank redirect authentication</p>
                    </div>
                  </div>
                </label>

                {/* Cash on Delivery */}
                <label
                  onClick={() => setPaymentMethod('COD')}
                  className={`block p-4 rounded-xl border cursor-pointer transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-500'
                      : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === 'COD'}
                      onChange={() => setPaymentMethod('COD')}
                      className="accent-slate-900"
                    />
                    <div>
                      <p className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <Banknote className="w-4 h-4 text-amber-600" />
                        Cash on Delivery (COD)
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Pay cash or UPI directly to our delivery courier associate at your doorstep.
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              <div className="flex justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
                >
                  Review Order <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Final Review & Confirmation */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h2 className="font-display text-lg font-bold text-slate-900">
                  Review &amp; Place Your Order
                </h2>
                <span className="text-xs text-slate-400">Step 4 of 4</span>
              </div>

              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold uppercase text-slate-500 text-[10px]">Delivery Address</span>
                    <button onClick={() => setStep(1)} className="text-amber-600 font-bold">Edit</button>
                  </div>
                  <p className="font-bold text-slate-900">{customerName}</p>
                  <p className="text-slate-600">{street}, {locality}</p>
                  <p className="text-slate-600">{city}, {state} - {pincode}</p>
                  <p className="text-slate-700 font-mono">Mobile: {customerPhone}</p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <div className="flex justify-between">
                    <span className="font-bold uppercase text-slate-500 text-[10px]">Payment &amp; Transit</span>
                    <button onClick={() => setStep(3)} className="text-amber-600 font-bold">Edit</button>
                  </div>
                  <p className="font-bold text-slate-900">Method: {paymentMethod}</p>
                  <p className="text-slate-600">Transit: {deliveryMethod} Dispatch</p>
                  <p className="text-slate-600">Fulfillment: Baguiati Distribution Hub</p>
                  <p className="text-slate-700 font-medium">Notification sent to {customerPhone}</p>
                </div>
              </div>

              {/* Items List Snapshot */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Order Items ({cart.length})
                </p>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                  {cart.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs bg-white">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 object-cover rounded bg-slate-100"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 line-clamp-1">{item.product.name}</p>
                          <p className="text-[11px] text-slate-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-slate-900">
                        ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleFinalSubmit}
                  className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
                >
                  {isSubmitting ? 'Confirming Order...' : `Place Order (₹${cartTotal.toLocaleString('en-IN')})`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Sidebar on Checkout */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
            Order Total Summary
          </h3>

          <div className="space-y-2 text-xs text-slate-600 divide-y divide-slate-100">
            <div className="flex justify-between pt-1">
              <span>Items Subtotal</span>
              <span className="font-mono font-semibold">₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>
            {cartDiscount > 0 && (
              <div className="flex justify-between pt-2 text-emerald-700 font-semibold">
                <span>Discount ({appliedCoupon?.code})</span>
                <span className="font-mono">-₹{cartDiscount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between pt-2">
              <span>Shipping Fee</span>
              <span className="font-mono">
                {deliveryCharge === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${deliveryCharge}`}
              </span>
            </div>
            <div className="flex justify-between pt-3 text-base font-extrabold text-slate-900">
              <span>Payable Amount</span>
              <span className="font-mono">₹{cartTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
            <p className="font-bold text-slate-800">Dispatch Location:</p>
            <p>AT TRADING Baguiati Hub, Holding no 30103, Ward 12, Kolkata-700136</p>
            <p className="font-mono text-slate-900">Support: +91 {STORE_INFO.mobileNumber}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
