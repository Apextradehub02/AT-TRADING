import React, { useState } from 'react';
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Bell,
  Shield,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { STORE_INFO } from '../../data/mockData';
import { ProductCard } from '../ProductCard';
import { SavedAddress } from '../../types';

export const AccountView: React.FC = () => {
  const {
    orders,
    wishlist,
    products,
    addresses,
    addAddress,
    setDefaultAddress,
    deleteAddress,
    priceAlerts,
    deletePriceAlert,
    setTrackingOrderId,
    setCustomerTab,
    setSelectedProductId,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'orders' | 'wishlist' | 'addresses' | 'alerts' | 'security'
  >('dashboard');
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'delivered' | 'cancelled'>('all');

  // New Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newTitle, setNewTitle] = useState('Home');
  const [newName, setNewName] = useState('Subir Mondal');
  const [newPhone, setNewPhone] = useState(STORE_INFO.mobileNumber);
  const [newStreet, setNewStreet] = useState('Holding no 30103, Atghara, Majherpara');
  const [newLocality, setNewLocality] = useState('Ward no 12, Near Atghara Kali Mandir');
  const [newCity, setNewCity] = useState('Kolkata');
  const [newState, setNewState] = useState('West Bengal');
  const [newPincode, setNewPincode] = useState('700136');
  const [isDefaultAddr, setIsDefaultAddr] = useState(false);

  // Filter Orders
  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'pending') return o.status === 'New' || o.status === 'Processing' || o.status === 'Shipped';
    if (orderFilter === 'delivered') return o.status === 'Delivered';
    if (orderFilter === 'cancelled') return o.status === 'Cancelled' || o.status === 'Returned';
    return true;
  });

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress({
      title: newTitle,
      name: newName,
      phone: newPhone,
      street: newStreet,
      locality: newLocality,
      city: newCity,
      state: newState,
      pincode: newPincode,
      isDefault: isDefaultAddr,
    });
    setShowAddressModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-16">
      {/* Account Profile Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 font-display font-black text-2xl flex items-center justify-center shadow-md">
            AT
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-2xl font-bold text-slate-900">
                Customer Account
              </h1>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full uppercase">
                Verified Member
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Registered Phone: <span className="font-mono text-slate-800 font-semibold">{STORE_INFO.mobileNumber}</span> · Member since 2026
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Orders</p>
            <p className="font-mono font-bold text-slate-900 text-sm">{orders.length}</p>
          </div>
          <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Wishlist</p>
            <p className="font-mono font-bold text-slate-900 text-sm">{wishlist.length}</p>
          </div>
          <div className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-center">
            <p className="text-[10px] text-slate-400 uppercase font-semibold">Price Alerts</p>
            <p className="font-mono font-bold text-amber-600 text-sm">{priceAlerts.length}</p>
          </div>
        </div>
      </div>

      {/* Account Navigation Tabs */}
      <div className="flex overflow-x-auto gap-2 border-b border-slate-200 pb-2 text-xs font-semibold">
        {[
          { key: 'dashboard', label: 'Dashboard', icon: User },
          { key: 'orders', label: `My Orders (${orders.length})`, icon: Package },
          { key: 'wishlist', label: `Wishlist (${wishlist.length})`, icon: Heart },
          { key: 'addresses', label: `Saved Addresses (${addresses.length})`, icon: MapPin },
          { key: 'alerts', label: `Price Target Alerts (${priceAlerts.length})`, icon: Bell },
          { key: 'security', label: 'Profile & Security', icon: Shield },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === tab.key
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Dashboard Overview */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
              <span className="text-xs font-bold uppercase text-slate-400">Recent Order</span>
              {orders[0] ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-mono font-bold text-slate-900">#{orders[0].id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      {orders[0].status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Total: ₹{orders[0].total.toLocaleString('en-IN')} · {orders[0].items.length} items
                  </p>
                  <button
                    onClick={() => {
                      setTrackingOrderId(orders[0].id);
                      setCustomerTab('tracking');
                    }}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 pt-1"
                  >
                    Track Progress <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-500">No orders placed yet.</p>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
              <span className="text-xs font-bold uppercase text-slate-400">Default Delivery Address</span>
              {addresses[0] ? (
                <div className="space-y-1 text-xs">
                  <p className="font-bold text-slate-900">{addresses[0].title}</p>
                  <p className="text-slate-600 truncate">{addresses[0].street}, {addresses[0].locality}</p>
                  <p className="text-slate-600">{addresses[0].city} - {addresses[0].pincode}</p>
                  <button
                    onClick={() => setActiveTab('addresses')}
                    className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 pt-2"
                  >
                    Manage Addresses <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <p className="text-xs text-slate-500">No address saved.</p>
              )}
            </div>

            <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs">
              <span className="text-xs font-bold uppercase text-slate-400">Price Target Notifications</span>
              <p className="text-xs text-slate-600">
                You have <strong className="text-slate-900">{priceAlerts.length}</strong> active price target alerts set for assets &amp; products.
              </p>
              <button
                onClick={() => setActiveTab('alerts')}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 pt-1"
              >
                View Price Alerts <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: My Orders (Pending, Delivered, Cancelled) */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'pending', label: 'Pending / In Transit' },
              { id: 'delivered', label: 'Delivered' },
              { id: 'cancelled', label: 'Cancelled / Returned' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setOrderFilter(f.id as any)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                  orderFilter === f.id
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-sm text-slate-900">#{ord.id}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            ord.status === 'Delivered'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ord.status === 'Shipped'
                              ? 'bg-blue-100 text-blue-800'
                              : ord.status === 'Cancelled'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Date: {ord.orderDate} · Payment: {ord.paymentMethod} ({ord.paymentStatus})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setTrackingOrderId(ord.id);
                          setCustomerTab('tracking');
                        }}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                      >
                        <Package className="w-3.5 h-3.5" /> Track Order
                      </button>
                    </div>
                  </div>

                  {/* Items preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {ord.items.map((it, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 text-xs">
                        <img
                          src={it.product.image}
                          alt={it.product.name}
                          referrerPolicy="no-referrer"
                          className="w-12 h-12 object-cover rounded bg-white border border-slate-200 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-900 truncate">{it.product.name}</p>
                          <p className="text-[11px] text-slate-500">
                            Qty: {it.quantity} · ₹{it.product.price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                    <span className="text-slate-500">
                      Destination: {ord.customer.locality || ord.customer.city} ({ord.customer.pincode})
                    </span>
                    <span className="font-mono font-extrabold text-sm text-slate-950">
                      Total: ₹{ord.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <p className="text-xs text-slate-500">No orders matching this category.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Wishlist */}
      {activeTab === 'wishlist' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Your Saved Wishlist</h2>
            <span className="text-xs text-slate-500">{wishlistedProducts.length} items</span>
          </div>

          {wishlistedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {wishlistedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
              <Heart className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-xs text-slate-500">Your wishlist is currently empty.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Saved Delivery Addresses</h2>
            <button
              onClick={() => setShowAddressModal(true)}
              className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800"
            >
              <Plus className="w-3.5 h-3.5" /> Add New Address
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 space-y-3 shadow-xs relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-slate-900">{addr.title}</span>
                    {addr.isDefault && (
                      <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    {!addr.isDefault && (
                      <button
                        onClick={() => setDefaultAddress(addr.id)}
                        className="text-[11px] text-amber-600 hover:text-amber-700 font-semibold"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      onClick={() => deleteAddress(addr.id)}
                      className="p-1 text-slate-400 hover:text-rose-600 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-xs text-slate-600 space-y-0.5">
                  <p className="font-bold text-slate-900">{addr.name}</p>
                  <p>{addr.street}</p>
                  <p>{addr.locality}</p>
                  <p>{addr.city}, {addr.state} - <span className="font-mono font-bold">{addr.pincode}</span></p>
                  <p className="text-slate-900 font-mono mt-1">Phone: {addr.phone}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Add Address Modal */}
          {showAddressModal && (
            <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
              <form
                onSubmit={handleCreateAddress}
                className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl"
              >
                <h3 className="font-bold text-base text-slate-900">Add New Delivery Address</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Address Label</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="e.g. Home, Office"
                      className="w-full mt-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Phone</label>
                    <input
                      type="text"
                      required
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Pincode</label>
                    <input
                      type="text"
                      required
                      value={newPincode}
                      onChange={(e) => setNewPincode(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-600">Street &amp; Building</label>
                  <input
                    type="text"
                    required
                    value={newStreet}
                    onChange={(e) => setNewStreet(e.target.value)}
                    className="w-full mt-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">Locality</label>
                    <input
                      type="text"
                      required
                      value={newLocality}
                      onChange={(e) => setNewLocality(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600">City</label>
                    <input
                      type="text"
                      required
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      className="w-full mt-1 px-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                  <input
                    type="checkbox"
                    checked={isDefaultAddr}
                    onChange={(e) => setIsDefaultAddr(e.target.checked)}
                    className="accent-slate-900"
                  />
                  <span>Make this my default delivery address</span>
                </label>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowAddressModal(false)}
                    className="px-4 py-2 text-xs font-semibold border border-slate-300 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 text-xs font-semibold bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                  >
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Price Target Alerts (Requested feature: notification when specific asset price targets met) */}
      {activeTab === 'alerts' && (
        <div className="space-y-6">
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1">
            <p className="font-bold text-amber-900 flex items-center gap-1.5">
              <Bell className="w-4 h-4 text-amber-600" />
              Automated Asset &amp; Price Target Notification Engine
            </p>
            <p className="text-amber-800">
              When market prices or inventory wholesale discounts hit your registered target, our Baguiati server immediately queues an automated SMS and e-dispatch alert to:
            </p>
            <p className="font-mono text-slate-800 font-semibold mt-1">
              {STORE_INFO.registeredAddress} · Phone: {STORE_INFO.mobileNumber}
            </p>
          </div>

          <div className="space-y-4">
            {priceAlerts.length > 0 ? (
              priceAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`bg-white border rounded-2xl p-5 space-y-3 shadow-xs ${
                    alert.isTriggered ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{alert.productName}</span>
                        {alert.isTriggered ? (
                          <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Target Met
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full uppercase">
                            Monitoring
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Alert ID: {alert.id} · Created: {alert.createdAt}
                      </p>
                    </div>

                    <button
                      onClick={() => deletePriceAlert(alert.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                      title="Delete alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-slate-400 text-[11px]">Target Price:</span>
                      <p className="font-mono font-bold text-slate-900 text-sm">
                        ₹{alert.targetPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px]">Current Price:</span>
                      <p className="font-mono font-bold text-amber-700 text-sm">
                        ₹{alert.currentPrice.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px]">Alert Phone:</span>
                      <p className="font-mono font-bold text-slate-900">{alert.customerPhone}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[11px]">Dispatch Hub:</span>
                      <p className="font-medium text-slate-800">Baguiati 700136</p>
                    </div>
                  </div>

                  {alert.statusMessage && (
                    <p className="text-xs text-slate-700 font-medium bg-slate-100/70 p-2.5 rounded-lg">
                      💬 {alert.statusMessage}
                    </p>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200">
                <p className="text-xs text-slate-500">
                  No active price alerts. You can set an alert on any product detail page!
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 6: Profile & Security */}
      {activeTab === 'security' && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-6 shadow-xs max-w-2xl">
          <h2 className="text-lg font-bold text-slate-900">Profile &amp; Account Security</h2>

          <div className="space-y-4 text-xs">
            <div>
              <label className="text-[11px] font-semibold text-slate-600">Registered Mobile Number</label>
              <input
                type="text"
                disabled
                value={STORE_INFO.mobileNumber}
                className="w-full mt-1 px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg font-mono text-slate-700"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Verified with two-factor SMS OTP for order verification.
              </p>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-600">Registered Email</label>
              <input
                type="email"
                defaultValue="shopper@attrading.in"
                className="w-full mt-1 px-3 py-2 bg-white border border-slate-300 rounded-lg"
              />
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <span className="font-bold text-slate-900">Registered Kolkata Address:</span>
              <p className="text-slate-600">{STORE_INFO.registeredAddress}</p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert('Profile settings saved successfully.')}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
