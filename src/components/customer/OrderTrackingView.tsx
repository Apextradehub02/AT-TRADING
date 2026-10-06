import React, { useState } from 'react';
import {
  Package,
  Search,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  AlertCircle,
  Phone,
  RotateCcw,
  Ban,
  Calendar,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { STORE_INFO } from '../../data/mockData';

export const OrderTrackingView: React.FC = () => {
  const { orders, trackingOrderId, setTrackingOrderId, cancelOrder } = useStore();

  const [inputOrderId, setInputOrderId] = useState<string>(
    trackingOrderId || orders[0]?.id || ''
  );
  const [cancelReason, setCancelReason] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);

  const currentOrder =
    orders.find((o) => o.id.toLowerCase() === inputOrderId.trim().toLowerCase()) ||
    (orders.length > 0 ? orders[0] : null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputOrderId.trim()) return;
    setTrackingOrderId(inputOrderId.trim());
  };

  const handleCancel = () => {
    if (!currentOrder) return;
    cancelOrder(currentOrder.id, cancelReason);
    setShowCancelModal(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header & Lookup Bar */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4 shadow-xs">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
            Live Order Tracking
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Real-time fulfillment milestone updates from AT TRADING Baguiati Kolkata Hub
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-xl">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter Order ID (e.g. ATT-2026-9042)"
              value={inputOrderId}
              onChange={(e) => setInputOrderId(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm uppercase font-mono bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
          <button
            type="submit"
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors"
          >
            Track
          </button>
        </form>

        {/* Quick Recent Orders Chips */}
        {orders.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
            <span className="text-slate-400">Recent Orders:</span>
            {orders.slice(0, 4).map((ord) => (
              <button
                key={ord.id}
                onClick={() => {
                  setInputOrderId(ord.id);
                  setTrackingOrderId(ord.id);
                }}
                className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] font-semibold transition-colors ${
                  currentOrder?.id === ord.id
                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                #{ord.id} ({ord.status})
              </button>
            ))}
          </div>
        )}
      </div>

      {currentOrder ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Order Details Header Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900 font-mono">
                    Order #{currentOrder.id}
                  </h2>
                  <span
                    className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                      currentOrder.status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : currentOrder.status === 'Shipped'
                        ? 'bg-blue-100 text-blue-800'
                        : currentOrder.status === 'Cancelled'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {currentOrder.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Placed on {currentOrder.orderDate} · {currentOrder.items.length} Items · Total: ₹{currentOrder.total.toLocaleString('en-IN')}
                </p>
              </div>

              {/* Status Action */}
              <div className="flex items-center gap-2">
                {(currentOrder.status === 'New' || currentOrder.status === 'Processing') && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors flex items-center gap-1"
                  >
                    <Ban className="w-3.5 h-3.5" /> Cancel Order
                  </button>
                )}
                {currentOrder.status === 'Delivered' && (
                  <button
                    onClick={() => alert(`Return window active for Order #${currentOrder.id}. Baguiati pickup van scheduled!`)}
                    className="px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors flex items-center gap-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Request Return (7-Day)
                  </button>
                )}
              </div>
            </div>

            {/* Courier & AWB metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">Courier AWB Tracking</p>
                <p className="font-mono font-bold text-slate-900 mt-1">{currentOrder.trackingNumber}</p>
                <p className="text-[11px] text-slate-500">Express Kolkata Logistics</p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">Fulfillment Hub</p>
                <p className="font-semibold text-slate-900 mt-1">{STORE_INFO.hubLocation}</p>
                <p className="text-[11px] text-slate-500">Holding no 30103, Ward 12, Baguiati</p>
              </div>

              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase">Expected Delivery</p>
                <p className="font-bold text-amber-600 mt-1">{currentOrder.expectedDelivery}</p>
                <p className="text-[11px] text-slate-500">Contact: +91 {STORE_INFO.mobileNumber}</p>
              </div>
            </div>
          </div>

          {/* Visual Tracking Progress Timeline */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xs space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-600" /> Shipment Milestone Progression
            </h3>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {currentOrder.trackingSteps.map((step, idx) => (
                <div key={idx} className="relative group">
                  {/* Indicator Dot */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-0.5 w-6 h-6 rounded-full flex items-center justify-center text-white ring-4 ring-white ${
                      step.completed
                        ? 'bg-emerald-600'
                        : step.current
                        ? 'bg-amber-500 animate-pulse'
                        : 'bg-slate-300'
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                  </div>

                  {/* Step Content */}
                  <div className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span>{step.label}</span>
                        {step.current && (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase">
                            Current Stage
                          </span>
                        )}
                      </p>
                      <span className="text-xs text-slate-400 font-mono">{step.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      <span>{step.location}</span>
                    </p>

                    <p className="text-xs text-slate-600 pt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Purchased Items in this Order */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Items in This Package ({currentOrder.items.length})
            </h3>

            <div className="divide-y divide-slate-100">
              {currentOrder.items.map((it, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <img
                      src={it.product.image}
                      alt={it.product.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 object-cover rounded-lg bg-slate-100 border border-slate-200"
                    />
                    <div>
                      <p className="font-semibold text-slate-900">{it.product.name}</p>
                      <p className="text-[11px] text-slate-500">
                        {it.product.brand} · Qty: {it.quantity} {it.selectedVariant ? `· ${it.selectedVariant}` : ''}
                      </p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-slate-900">
                    ₹{(it.product.price * it.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">Order Not Found</h3>
          <p className="text-xs text-slate-500">
            Please verify the order ID or check your recent orders list above.
          </p>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      {showCancelModal && currentOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-900">Cancel Order #{currentOrder.id}</h3>
            <p className="text-xs text-slate-600">
              Are you sure you wish to cancel this order? It has not yet been dispatched from the Baguiati hub.
            </p>
            <div>
              <label className="text-xs font-semibold text-slate-700">Reason for cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="Changed delivery address">Changed delivery address</option>
                <option value="Found alternative item">Found alternative item</option>
                <option value="Delivery time delay">Delivery time delay</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 text-xs font-semibold border border-slate-300 rounded-lg"
              >
                Keep Order
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-xs font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700"
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
