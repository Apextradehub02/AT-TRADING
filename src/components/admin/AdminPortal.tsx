import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Percent,
  Bell,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  Truck,
  RotateCcw,
  Ban,
  ArrowUpRight,
  TrendingUp,
  TrendingDown,
  MapPin,
  X,
  Search,
  Filter,
  DollarSign,
  AlertTriangle,
  ArrowRight,
  Save,
  Globe,
  Circle,
  Copy,
  Check,
  Activity,
  FileCheck,
  LogOut,
  Shield,
  UserCheck,
  CreditCard,
  ArrowDownRight,
  Eye,
  CheckCheck,
  Radio,
  Lock,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import {
  Product,
  CategoryId,
  OrderStatus,
  Coupon,
  AdminLoginRecord,
  LiveMarketAsset,
  AdminSystemNotification,
} from '../../types';
import {
  STORE_INFO,
  INITIAL_LOGIN_RECORDS,
  INITIAL_MARKET_ASSETS,
  INITIAL_SYSTEM_NOTIFICATIONS,
  INITIAL_KYC_RECORDS,
} from '../../data/mockData';
import { AdminLoginPage } from './AdminLoginPage';

const ALL_CATEGORIES: CategoryId[] = [
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

export const AdminPortal: React.FC = () => {
  const {
    adminTab,
    setAdminTab,
    setViewMode,
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    updateStock,
    orders,
    updateOrderStatus,
    coupons,
    addCoupon,
    toggleCouponStatus,
    priceAlerts,
    deletePriceAlert,
    showToast,
  } = useStore();

  // Authentication State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('att_admin_logged_in') === 'true';
  });
  const [adminUser, setAdminUser] = useState<string>(() => {
    return localStorage.getItem('att_admin_user') || 'admin@attrading.in';
  });

  // Notifications State
  const [notifications, setNotifications] = useState<AdminSystemNotification[]>(INITIAL_SYSTEM_NOTIFICATIONS);
  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);

  // Live Market State with Real-Time Price Simulation
  const [marketAssets, setMarketAssets] = useState<LiveMarketAsset[]>(INITIAL_MARKET_ASSETS);
  const [selectedAsset, setSelectedAsset] = useState<LiveMarketAsset>(INITIAL_MARKET_ASSETS[0]);

  // Login Activity Records
  const [loginRecords, setLoginRecords] = useState<AdminLoginRecord[]>(INITIAL_LOGIN_RECORDS);

  // KYC Records
  const [kycRecords, setKycRecords] = useState(INITIAL_KYC_RECORDS);

  // Sub-filters & States for Products/Orders
  const [productSearch, setProductSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'All'>('All');

  // Add Product Modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newBrand, setNewBrand] = useState('AT Exclusive');
  const [newCategory, setNewCategory] = useState<CategoryId>('Electronics');
  const [newPrice, setNewPrice] = useState(1499);
  const [newOriginalPrice, setNewOriginalPrice] = useState(2499);
  const [newStock, setNewStock] = useState(25);
  const [newDesc, setNewDesc] = useState('');

  // Edit Product Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Add Coupon Modal
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState<'percentage' | 'flat'>('percentage');
  const [newCouponValue, setNewCouponValue] = useState(15);
  const [newCouponMinOrder, setNewCouponMinOrder] = useState(999);
  const [newCouponDesc, setNewCouponDesc] = useState('');

  // Domain & Identifier Validator State
  const [domainTestInput, setDomainTestInput] = useState('attrading-kolkata');
  const [copiedDomain, setCopiedDomain] = useState<string | null>(null);

  const reservedTermsList = [
    'google', 'goog', 'gmail', 'android', 'youtube', 'chrome', 'flutter', 'firebase', 'gemini', 'bard',
    'admin', 'root', 'support', 'system', 'null', 'undefined', 'test', 'staging', 'prod', 'internal',
    'ssl', 'api', 'auth', 'corp', 'default', 'example',
  ];

  const trimmedDomain = domainTestInput.trim().toLowerCase();
  const ruleLen = trimmedDomain.length >= 6 && trimmedDomain.length <= 63;
  const ruleChars = /^[a-z0-9-]+$/.test(trimmedDomain);
  const ruleStartEnd = /^[a-z0-9].*[a-z0-9]$/.test(trimmedDomain) && trimmedDomain.length >= 2;
  const ruleNoConsecutiveHyphens = !/--/.test(trimmedDomain);
  const foundProhibitedTerm = reservedTermsList.find((term) => {
    const parts = trimmedDomain.split('-');
    return parts.includes(term) || trimmedDomain === term;
  });
  const ruleNoProhibited = !foundProhibitedTerm;
  const isDomainFullyValid = ruleLen && ruleChars && ruleStartEnd && ruleNoConsecutiveHyphens && ruleNoProhibited;

  // Real-time micro price tick simulation for Live Market
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketAssets((prev) =>
        prev.map((asset) => {
          const deltaFactor = (Math.random() - 0.49) * 0.004;
          const newPrice = Math.round(asset.price * (1 + deltaFactor));
          const newChange = Number((asset.change24h + deltaFactor * 10).toFixed(2));
          return {
            ...asset,
            price: newPrice,
            change24h: newChange,
            high24h: Math.max(asset.high24h, newPrice),
            low24h: Math.min(asset.low24h, newPrice),
          };
        })
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Handle Login & Logout
  const handleLoginSuccess = (user: string) => {
    setIsAdminLoggedIn(true);
    setAdminUser(user);
    localStorage.setItem('att_admin_logged_in', 'true');
    localStorage.setItem('att_admin_user', user);

    // Record login entry in session table
    const newRecord: AdminLoginRecord = {
      id: `log-${Date.now().toString().slice(-4)}`,
      adminId: user,
      ip: '103.212.144.18',
      device: navigator.userAgent.includes('Mac') ? 'macOS Safari' : 'Windows 11 / Chrome',
      location: 'Baguiati, Kolkata, IN',
      timestamp: 'Just now',
      status: '2FA Verified',
    };
    setLoginRecords((prev) => [newRecord, ...prev]);
    showToast('Admin logged in with 2FA authorization.', 'success');
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('att_admin_logged_in');
    showToast('Logged out of admin terminal.', 'info');
  };

  // If not logged in, render the login page!
  if (!isAdminLoggedIn) {
    return (
      <AdminLoginPage
        onSuccessLogin={handleLoginSuccess}
        onExitToStore={() => setViewMode('customer')}
      />
    );
  }

  // Dashboard Aggregates
  const totalRevenue = orders.reduce((sum, o) => (o.status !== 'Cancelled' ? sum + o.total : sum), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.status === 'New' || o.status === 'Processing').length;
  const lowStockProducts = products.filter((p) => p.stockCount <= 15);
  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  // Trading & Financial Metrics
  const totalUsersCount = 12840;
  const activeUsersCount = 1940;
  const pendingKycCount = kycRecords.filter((k) => k.status === 'Pending').length;
  const totalDeposits = 48250000;
  const totalWithdrawals = 32180000;
  const todayTradingVolume = 4890000;
  const todayExecutedOrders = 1420;
  const grossProfit = 842500;
  const profitMargin = 17.4;

  // Handle Add Product Submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const discount = Math.max(0, Math.round(((newOriginalPrice - newPrice) / newOriginalPrice) * 100));

    addProduct({
      name: newName,
      brand: newBrand,
      category: newCategory,
      description: newDesc || `${newName} available at AT TRADING direct wholesale pricing.`,
      price: Number(newPrice),
      originalPrice: Number(newOriginalPrice),
      discountPercent: discount,
      rating: 4.5,
      reviewCount: 1,
      inStock: newStock > 0,
      stockCount: Number(newStock),
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80',
    });

    setShowAddProductModal(false);
    setNewName('');
    setNewDesc('');
  };

  // Handle Update Product Submit
  const handleUpdateProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    const discount = Math.max(
      0,
      Math.round(((editingProduct.originalPrice - editingProduct.price) / editingProduct.originalPrice) * 100)
    );

    updateProduct(editingProduct.id, {
      ...editingProduct,
      discountPercent: discount,
      inStock: editingProduct.stockCount > 0,
    });

    setEditingProduct(null);
  };

  // Handle Create Coupon
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    addCoupon({
      code: newCouponCode.trim().toUpperCase(),
      discountType: newCouponType,
      value: Number(newCouponValue),
      minOrder: Number(newCouponMinOrder),
      description: newCouponDesc || `${newCouponType === 'flat' ? `Flat ₹${newCouponValue}` : `${newCouponValue}%`} off on orders above ₹${newCouponMinOrder}`,
      expiry: '2026-12-31',
      active: true,
    });

    setShowAddCouponModal(false);
    setNewCouponCode('');
    setNewCouponDesc('');
  };

  // Broadcast Alert Simulation
  const handleTriggerBroadcastAlert = () => {
    showToast(
      `Broadcast sent! Triggered notification to +91 ${STORE_INFO.mobileNumber} & registered customer targets in Baguiati, Kolkata-700136.`,
      'info'
    );
  };

  const handleApproveKyc = (id: string) => {
    setKycRecords((prev) =>
      prev.map((k) => (k.id === id ? { ...k, status: 'Verified' } : k))
    );
    showToast(`KYC #${id} approved successfully!`, 'success');
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setShowNotificationsDropdown(false);
  };

  const filteredAdminProducts = products.filter((p) => {
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  const filteredAdminOrders = orders.filter((o) => {
    if (orderStatusFilter === 'All') return true;
    return o.status === orderStatusFilter;
  });

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col -mx-4 -my-6 sm:-mx-6 sm:-my-8 px-4 sm:px-6 py-6">
      {/* Admin Top Navigation Bar */}
      <div className="max-w-7xl mx-auto w-full pb-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl font-black text-amber-400">
              AT TRADING
            </span>
            <span className="bg-amber-400/20 text-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full border border-amber-400/30 uppercase tracking-wider">
              Admin &amp; Trading Command
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            Operations: {STORE_INFO.hubLocation} (Ward 12, Kolkata-700136) · +91 {STORE_INFO.mobileNumber}
          </p>
        </div>

        {/* Top Header Actions & Session */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Notifications Trigger */}
          <div className="relative">
            <button
              onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 relative transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotificationsDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl z-50 p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-850">
                  <span className="font-bold text-xs text-white">System Notifications</span>
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    Mark All Read
                  </button>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto divide-y divide-slate-850">
                  {notifications.map((n) => (
                    <div key={n.id} className="pt-2 first:pt-0 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{n.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-slate-400">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Admin User Badge */}
          <div className="px-3 py-1.5 bg-slate-800/80 rounded-xl border border-slate-700 text-xs flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-mono text-slate-200 font-semibold truncate max-w-36">{adminUser}</span>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-1.5 py-0.2 rounded font-bold uppercase">
              2FA Active
            </span>
          </div>

          {/* Switch to Storefront */}
          <button
            onClick={() => setViewMode('customer')}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors"
          >
            <ShoppingCart className="w-3.5 h-3.5 text-amber-400" />
            <span>Storefront</span>
          </button>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Admin Main Layout: Sidebar & Content */}
      <div className="max-w-7xl mx-auto w-full pt-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Admin Navigation Sidebar */}
        <aside className="lg:col-span-3 space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500 px-3 py-1">
            Trading &amp; Admin Panel
          </p>
          {[
            { id: 'dashboard', label: 'Admin Dashboard', icon: LayoutDashboard },
            { id: 'live-market', label: 'Live Market Ticker', icon: Activity },
            { id: 'kyc', label: `Pending KYC (${pendingKycCount})`, icon: FileCheck },
            { id: 'products', label: `Products & Catalog (${products.length})`, icon: Package },
            { id: 'orders', label: `Orders Pipeline (${orders.length})`, icon: ShoppingCart },
            { id: 'customers', label: 'Customer Directory', icon: Users },
            { id: 'coupons', label: `Promo Coupons (${coupons.length})`, icon: Percent },
            { id: 'alerts', label: `Price Target Alerts (${priceAlerts.length})`, icon: Bell },
            { id: 'reports', label: 'Analytics & Reports', icon: BarChart3 },
            { id: 'domain-validator', label: 'Domain & URL Validator', icon: Globe },
          ].map((item) => {
            const Icon = item.icon;
            const active = adminTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setAdminTab(item.id as any)}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-3 transition-colors ${
                  active
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-4 mt-4 border-t border-slate-800 px-3 text-xs text-slate-500 space-y-1">
            <p className="font-bold text-slate-400">Headquarters Registered:</p>
            <p className="text-[11px] leading-relaxed">
              Holding no 30103, Atghara, Majherpara, Ward no 12, P.S: Baguiati, Kolkata-700136
            </p>
          </div>
        </aside>

        {/* Admin Content Area */}
        <main className="lg:col-span-9 space-y-6">
          {/* TAB 1: Complete Admin Dashboard */}
          {adminTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Header Title with Live Market Pulse */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950 p-5 rounded-2xl border border-slate-800">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <span>Admin Operations Command Center</span>
                    <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-0.5 rounded-full">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                      Live Feed
                    </span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Real-time monitoring of user accounts, KYC clearance, capital flows, live market assets, and login security.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setAdminTab('live-market')}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-xl border border-slate-700 flex items-center gap-1.5"
                  >
                    <Activity className="w-3.5 h-3.5 text-amber-400" />
                    <span>Live Market Board</span>
                  </button>
                </div>
              </div>

              {/* 1. Core Platform & User Metrics Grid (Requested: Total Users, Active Users, Pending KYC, Today's Trading Activity) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Users */}
                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase">Total Users</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-black font-mono text-white">
                    {totalUsersCount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" /> +8.5% growth this month
                  </p>
                </div>

                {/* Active Users */}
                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase">Active Users</span>
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-black font-mono text-white">
                    {activeUsersCount.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Online in Kolkata &amp; Bengal network
                  </p>
                </div>

                {/* Pending KYC */}
                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase">Pending KYC</span>
                    <FileCheck className="w-4 h-4 text-amber-400" />
                  </div>
                  <p className="text-2xl font-black font-mono text-amber-400">
                    {pendingKycCount}
                  </p>
                  <button
                    onClick={() => setAdminTab('kyc')}
                    className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                  >
                    Review Verifications <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                {/* Today's Trading Activity */}
                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase">Today Trading Activity</span>
                    <Activity className="w-4 h-4 text-purple-400" />
                  </div>
                  <p className="text-2xl font-black font-mono text-white">
                    ₹{(todayTradingVolume / 100000).toFixed(2)} L
                  </p>
                  <p className="text-[11px] text-purple-300">
                    {todayExecutedOrders} orders executed today
                  </p>
                </div>
              </div>

              {/* 2. Capital & P&L Overview (Requested: Total Deposits, Total Withdrawals, Profit/Loss Overview) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Total Deposits */}
                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase">Total Deposits</span>
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-black font-mono text-emerald-400">
                    ₹{(totalDeposits / 10000000).toFixed(2)} Cr
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Total inbound settlement capital
                  </p>
                </div>

                {/* Total Withdrawals */}
                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase">Total Withdrawals</span>
                    <ArrowDownRight className="w-4 h-4 text-rose-400" />
                  </div>
                  <p className="text-2xl font-black font-mono text-white">
                    ₹{(totalWithdrawals / 10000000).toFixed(2)} Cr
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Processed smoothly · 0 chargebacks
                  </p>
                </div>

                {/* Profit/Loss Overview */}
                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-xs font-bold uppercase">Profit / Loss Overview</span>
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </div>
                  <p className="text-2xl font-black font-mono text-emerald-400">
                    +₹{grossProfit.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-emerald-400">
                    Net Profit Margin: <strong className="text-white">{profitMargin}%</strong>
                  </p>
                </div>
              </div>

              {/* 3. Live Market Snapshot Widget */}
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <Activity className="w-4 h-4 text-amber-400" />
                      Live Market &amp; Wholesale Commodities Feed
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Real-time live pricing with target alert integration for Kolkata dispatch
                    </p>
                  </div>
                  <button
                    onClick={() => setAdminTab('live-market')}
                    className="text-xs text-amber-400 hover:underline flex items-center gap-1"
                  >
                    Open Live Terminal <ArrowRight className="w-3 h-3" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {marketAssets.slice(0, 6).map((asset) => (
                    <div
                      key={asset.symbol}
                      onClick={() => {
                        setSelectedAsset(asset);
                        setAdminTab('live-market');
                      }}
                      className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 hover:border-slate-700 cursor-pointer transition-all flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-xs text-white">{asset.symbol}</span>
                          <span className="text-[10px] text-slate-500 uppercase">{asset.category}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate max-w-36 mt-0.5">{asset.name}</p>
                      </div>

                      <div className="text-right">
                        <p className="font-mono font-bold text-sm text-white">
                          ₹{asset.price.toLocaleString('en-IN')}
                        </p>
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded font-mono ${
                            asset.change24h >= 0
                              ? 'text-emerald-400 bg-emerald-950/60'
                              : 'text-rose-400 bg-rose-950/60'
                          }`}
                        >
                          {asset.change24h >= 0 ? `+${asset.change24h}%` : `${asset.change24h}%`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Recent Login Activity & Security Table (Requested: Recent Login Activity) */}
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-sm text-white">Recent Login Activity &amp; Audit Trail</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">2FA Active</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[10px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">Admin Account</th>
                        <th className="py-2.5 px-3">IP Address</th>
                        <th className="py-2.5 px-3">Device / Client</th>
                        <th className="py-2.5 px-3">Location Hub</th>
                        <th className="py-2.5 px-3">Timestamp</th>
                        <th className="py-2.5 px-3 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-850 text-slate-300 font-medium">
                      {loginRecords.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-900/40">
                          <td className="py-2.5 px-3 font-mono font-bold text-white">{log.adminId}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-400">{log.ip}</td>
                          <td className="py-2.5 px-3 text-slate-300">{log.device}</td>
                          <td className="py-2.5 px-3 text-slate-400">{log.location}</td>
                          <td className="py-2.5 px-3 text-slate-500 font-mono">{log.timestamp}</td>
                          <td className="py-2.5 px-3 text-right">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                log.status === '2FA Verified'
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : log.status === 'Success'
                                  ? 'bg-blue-950 text-blue-400 border border-blue-800'
                                  : 'bg-rose-950 text-rose-400 border border-rose-800'
                              }`}
                            >
                              {log.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 5. Notifications & Alerts Feed (Requested: Notifications) */}
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-amber-400" />
                    <h3 className="font-bold text-sm text-white">Platform Notifications &amp; Price Triggers</h3>
                  </div>
                  <span className="text-xs text-slate-400">{notifications.length} Total Alerts</span>
                </div>

                <div className="space-y-2.5">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                        notif.type === 'alert'
                          ? 'bg-amber-950/20 border-amber-800/60 text-slate-200'
                          : notif.type === 'deposit'
                          ? 'bg-emerald-950/20 border-emerald-800/60 text-slate-200'
                          : notif.type === 'kyc'
                          ? 'bg-blue-950/20 border-blue-800/60 text-slate-200'
                          : 'bg-slate-900 border-slate-800 text-slate-200'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white">{notif.title}</span>
                          <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-black/40 text-slate-400">
                            {notif.type}
                          </span>
                        </div>
                        <p className="text-slate-300">{notif.message}</p>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono shrink-0">{notif.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: Live Market Interactive Terminal */}
          {adminTab === 'live-market' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-amber-400" />
                    Live Wholesale &amp; Asset Trading Terminal
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live rates feeding automated price alerts for +91 {STORE_INFO.mobileNumber}
                  </p>
                </div>
              </div>

              {/* Asset Selected Detailed View */}
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-850">
                  <div>
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded">
                      {selectedAsset.symbol} · {selectedAsset.category}
                    </span>
                    <h3 className="text-2xl font-bold text-white mt-1">{selectedAsset.name}</h3>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-3xl font-black font-mono text-white">
                      ₹{selectedAsset.price.toLocaleString('en-IN')}
                    </div>
                    <span
                      className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                        selectedAsset.change24h >= 0 ? 'text-emerald-400 bg-emerald-950' : 'text-rose-400 bg-rose-950'
                      }`}
                    >
                      {selectedAsset.change24h >= 0 ? `+${selectedAsset.change24h}%` : `${selectedAsset.change24h}%`} (24h)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-900 p-4 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-500 text-[11px]">24h High</span>
                    <p className="font-mono font-bold text-white mt-0.5">₹{selectedAsset.high24h.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">24h Low</span>
                    <p className="font-mono font-bold text-white mt-0.5">₹{selectedAsset.low24h.toLocaleString('en-IN')}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">24h Volume</span>
                    <p className="font-mono font-bold text-amber-400 mt-0.5">{selectedAsset.volume}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Settlement</span>
                    <p className="font-medium text-slate-300 mt-0.5">Kolkata Baguiati Hub</p>
                  </div>
                </div>
              </div>

              {/* Full Market Asset Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {marketAssets.map((asset) => (
                  <div
                    key={asset.symbol}
                    onClick={() => setSelectedAsset(asset)}
                    className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                      selectedAsset.symbol === asset.symbol
                        ? 'bg-slate-950 border-amber-500 ring-1 ring-amber-500'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono font-bold text-white">{asset.symbol}</span>
                      <span
                        className={`font-mono font-bold ${
                          asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {asset.change24h >= 0 ? `+${asset.change24h}%` : `${asset.change24h}%`}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-1">{asset.name}</p>
                    <p className="font-mono font-black text-xl text-white mt-3">
                      ₹{asset.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Pending KYC Document Management */}
          {adminTab === 'kyc' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-amber-400" />
                  Customer &amp; Trader KYC Verifications
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Review identity verification documents for wholesale trade clearance
                </p>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[10px]">
                    <tr>
                      <th className="py-3 px-4">Trader / Customer</th>
                      <th className="py-3 px-4">Contact Phone</th>
                      <th className="py-3 px-4">Account Type</th>
                      <th className="py-3 px-4">Document Provided</th>
                      <th className="py-3 px-4">Submitted Date</th>
                      <th className="py-3 px-4 text-center">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850 text-slate-300">
                    {kycRecords.map((kyc) => (
                      <tr key={kyc.id} className="hover:bg-slate-900/40">
                        <td className="py-3 px-4 font-bold text-white">{kyc.name}</td>
                        <td className="py-3 px-4 font-mono">{kyc.phone}</td>
                        <td className="py-3 px-4">{kyc.type}</td>
                        <td className="py-3 px-4 font-mono text-slate-400">{kyc.docType}</td>
                        <td className="py-3 px-4 font-mono text-slate-500">{kyc.submittedDate}</td>
                        <td className="py-3 px-4 text-center">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              kyc.status === 'Verified'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}
                          >
                            {kyc.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          {kyc.status === 'Pending' ? (
                            <button
                              onClick={() => handleApproveKyc(kyc.id)}
                              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                            >
                              Approve KYC
                            </button>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Cleared</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Products & Catalog Management */}
          {adminTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Product Catalog &amp; Inventory</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Add new products, adjust live selling prices, manage stock quantities
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={productSearch}
                      onChange={(e) => setProductSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 text-xs bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-2.5" />
                  </div>

                  <button
                    onClick={() => setShowAddProductModal(true)}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow"
                  >
                    <Plus className="w-4 h-4" /> Add Product
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-900 text-slate-400 uppercase tracking-wider font-semibold text-[11px]">
                      <tr>
                        <th className="py-3 px-4">Product Details</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4 text-right">Price (₹)</th>
                        <th className="py-3 px-4 text-right">Stock</th>
                        <th className="py-3 px-4 text-center">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 text-slate-300">
                      {filteredAdminProducts.map((p) => (
                        <tr key={p.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 object-cover rounded bg-slate-900 border border-slate-800 shrink-0"
                              />
                              <div className="min-w-0 max-w-xs">
                                <p className="font-semibold text-white truncate">{p.name}</p>
                                <p className="text-[11px] text-slate-500">{p.brand} · ID: {p.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium">{p.category}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-white">
                            ₹{p.price.toLocaleString('en-IN')}
                            {p.originalPrice > p.price && (
                              <span className="block text-[10px] text-slate-500 line-through">
                                ₹{p.originalPrice}
                              </span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => updateStock(p.id, Math.max(0, p.stockCount - 5))}
                                className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-[10px]"
                              >
                                -5
                              </button>
                              <span className="font-mono font-bold text-white min-w-8 text-center">
                                {p.stockCount}
                              </span>
                              <button
                                onClick={() => updateStock(p.id, p.stockCount + 10)}
                                className="px-1.5 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded font-mono text-[10px]"
                              >
                                +10
                              </button>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                p.inStock ? 'bg-emerald-900/60 text-emerald-300' : 'bg-rose-900/60 text-rose-300'
                              }`}
                            >
                              {p.inStock ? 'In Stock' : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800"
                                title="Edit product"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteProduct(p.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                                title="Delete product"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Orders Pipeline Management */}
          {adminTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">Fulfillment &amp; Orders Pipeline</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Update order transit statuses from Baguiati dispatch center to delivery
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  {['All', 'New', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st as any)}
                      className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                        orderStatusFilter === st
                          ? 'bg-amber-500 text-slate-950'
                          : 'bg-slate-950 text-slate-400 hover:bg-slate-900'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {filteredAdminOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-850 gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-sm">#{ord.id}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase bg-slate-900 text-amber-400">
                            {ord.status}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">AWB: {ord.trackingNumber}</span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Customer: <strong className="text-slate-200">{ord.customer.name}</strong> ({ord.customer.phone}) · {ord.customer.locality || ord.customer.city} ({ord.customer.pincode})
                        </p>
                      </div>

                      {/* Status Transition Action Buttons */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {ord.status === 'New' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'Processing', 'Packed at Baguiati Hub')}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold"
                          >
                            Mark Packed &amp; Processing
                          </button>
                        )}
                        {ord.status === 'Processing' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'Shipped', 'Dispatched with Kolkata Express Van')}
                            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-bold"
                          >
                            Dispatch with Courier
                          </button>
                        )}
                        {ord.status === 'Shipped' && (
                          <button
                            onClick={() => updateOrderStatus(ord.id, 'Delivered', 'Handed over to customer')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
                      <div>
                        <p className="text-[10px] font-bold uppercase text-slate-500">Destination Address:</p>
                        <p className="text-slate-300">{ord.customer.street}, {ord.customer.locality}</p>
                        <p className="text-slate-300">{ord.customer.city}, {ord.customer.state} - {ord.customer.pincode}</p>
                      </div>
                      <div className="text-right sm:text-right">
                        <p className="text-[10px] font-bold uppercase text-slate-500">Payment &amp; Total:</p>
                        <p className="text-slate-300">{ord.paymentMethod} ({ord.paymentStatus})</p>
                        <p className="font-mono font-bold text-white text-sm">₹{ord.total.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Customers Directory */}
          {adminTab === 'customers' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Registered Customer Profiles</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Customer database connected to Baguiati fulfillment center
                  </p>
                </div>
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-semibold text-[11px]">
                    <tr>
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">Contact Phone</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4 text-center">Orders</th>
                      <th className="py-3 px-4 text-right">Total Spent</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {[
                      { name: 'Ananya Mukherjee', phone: STORE_INFO.mobileNumber, location: 'Baguiati, Ward 12, Kolkata-700136', orders: 3, spend: 8940 },
                      { name: 'Subhashis Roy', phone: '9831998877', location: 'Salt Lake City, Sector 1, Kolkata', orders: 2, spend: 4790 },
                      { name: 'Debolina Ghosh', phone: '9830124567', location: 'VIP Road, Teghoria, Kolkata', orders: 1, spend: 3144 },
                    ].map((c, i) => (
                      <tr key={i} className="hover:bg-slate-900/50">
                        <td className="py-3 px-4 font-bold text-white">{c.name}</td>
                        <td className="py-3 px-4 font-mono">{c.phone}</td>
                        <td className="py-3 px-4">{c.location}</td>
                        <td className="py-3 px-4 text-center font-mono">{c.orders}</td>
                        <td className="py-3 px-4 text-right font-mono font-bold text-white">
                          ₹{c.spend.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: Promo Coupons Manager */}
          {adminTab === 'coupons' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Promotional Coupons &amp; Discounts</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Create promo codes to boost wholesale customer conversions
                  </p>
                </div>
                <button
                  onClick={() => setShowAddCouponModal(true)}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Create Coupon
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {coupons.map((c) => (
                  <div
                    key={c.code}
                    className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-lg text-amber-400 tracking-wider">
                        {c.code}
                      </span>
                      <button
                        onClick={() => toggleCouponStatus(c.code)}
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                          c.active ? 'bg-emerald-900/60 text-emerald-300' : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {c.active ? 'Active' : 'Inactive'}
                      </button>
                    </div>

                    <p className="text-xs text-slate-300">{c.description}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs text-slate-400">
                      <span>Min Order: ₹{c.minOrder}</span>
                      <span>Expires: {c.expiry}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Price Target Alerts & Notifications Engine */}
          {adminTab === 'alerts' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-white">
                    Asset Price Target Notification System
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Monitoring user targets and dispatching alerts to {STORE_INFO.registeredAddress}
                  </p>
                </div>

                <button
                  onClick={handleTriggerBroadcastAlert}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2"
                >
                  <Bell className="w-4 h-4" /> Broadcast Target Update
                </button>
              </div>

              <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Target Notification Configuration
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-500 text-[11px]">Primary Notification Contact:</span>
                    <p className="font-mono font-bold text-white mt-0.5">
                      +91 {STORE_INFO.mobileNumber}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px]">Registered Asset Address:</span>
                    <p className="text-slate-300 mt-0.5">
                      Holding no 30103, Atghara, Majherpara, Ward no 12, Baguiati, Kolkata-700136
                    </p>
                  </div>
                </div>
              </div>

              {/* Alerts List */}
              <div className="space-y-3">
                {priceAlerts.map((al) => (
                  <div
                    key={al.id}
                    className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white">{al.productName}</span>
                        {al.isTriggered ? (
                          <span className="bg-emerald-900 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-bold">
                            Target Hit!
                          </span>
                        ) : (
                          <span className="bg-amber-900 text-amber-300 text-[10px] px-2 py-0.5 rounded font-bold">
                            Watching
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 mt-1">
                        Target: <span className="font-mono text-white font-bold">₹{al.targetPrice}</span> · Current: <span className="font-mono text-amber-400 font-bold">₹{al.currentPrice}</span> · Registered Phone: <span className="font-mono text-white">{al.customerPhone}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deletePriceAlert(al.id)}
                        className="p-2 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-900"
                        title="Remove alert"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: Analytics & Reports */}
          {adminTab === 'reports' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-white">Sales &amp; Dispatch Performance</h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Aggregated commercial metrics for AT TRADING Kolkata
                  </p>
                </div>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold"
                >
                  Export Report PDF
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase">Gross Sales</p>
                  <p className="text-2xl font-black font-mono text-white">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-slate-500">Includes all delivered and in-transit orders</p>
                </div>

                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase">Average Order Value</p>
                  <p className="text-2xl font-black font-mono text-white">
                    ₹{Math.round(totalRevenue / Math.max(1, orders.length)).toLocaleString('en-IN')}
                  </p>
                  <p className="text-[11px] text-slate-500">High-retention wholesale basket size</p>
                </div>

                <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase">Fulfillment SLA</p>
                  <p className="text-2xl font-black font-mono text-emerald-400">99.2%</p>
                  <p className="text-[11px] text-slate-500">Same-day dispatch from Baguiati Hub</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: Domain & URL Identifier Validator */}
          {adminTab === 'domain-validator' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-amber-400" />
                  Domain &amp; Applet Identifier Validator
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Live verification checker for AI Studio, Cloud Run, and Google Cloud custom identifiers
                </p>
              </div>

              {/* Input Card */}
              <div className="p-6 bg-slate-950 rounded-2xl border border-slate-800 space-y-5">
                <div>
                  <label className="text-xs font-semibold text-slate-300">
                    Test Domain or Project Identifier
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      type="text"
                      value={domainTestInput}
                      onChange={(e) => setDomainTestInput(e.target.value.toLowerCase())}
                      placeholder="e.g. attrading-kolkata"
                      className="flex-1 px-4 py-2.5 text-sm bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(domainTestInput);
                        setCopiedDomain(domainTestInput);
                        showToast(`Copied "${domainTestInput}" to clipboard!`, 'success');
                        setTimeout(() => setCopiedDomain(null), 2000);
                      }}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700"
                    >
                      {copiedDomain === domainTestInput ? (
                        <>
                          <Check className="w-4 h-4 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Overall Status Banner */}
                <div
                  className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
                    isDomainFullyValid
                      ? 'bg-emerald-950/60 border-emerald-700 text-emerald-200'
                      : 'bg-amber-950/60 border-amber-700 text-amber-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 font-medium">
                    {isDomainFullyValid ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
                    )}
                    <span>
                      {isDomainFullyValid
                        ? 'SOLVED! All 5 requirements satisfied — 100% compliant and ready to use.'
                        : 'Action Needed: One or more naming criteria failed. Review details below.'}
                    </span>
                  </div>
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-black/40">
                    {trimmedDomain.length} Characters
                  </span>
                </div>

                {/* The 5 Validation Checklist Rules */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Validation Criteria Checklist
                  </p>

                  <div className="space-y-2 text-xs">
                    {/* Rule 1: 6-63 characters */}
                    <div
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        ruleLen
                          ? 'bg-slate-900 border-emerald-900/60 text-slate-200'
                          : 'bg-slate-900 border-rose-900/60 text-rose-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {ruleLen ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500" />
                        )}
                        <span className="font-semibold">6–63 characters</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">
                        Current: {trimmedDomain.length} chars {ruleLen ? '(Valid)' : '(Need 6-63)'}
                      </span>
                    </div>

                    {/* Rule 2: Only lowercase, numbers or hyphens */}
                    <div
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        ruleChars
                          ? 'bg-slate-900 border-emerald-900/60 text-slate-200'
                          : 'bg-slate-900 border-rose-900/60 text-rose-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {ruleChars ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500" />
                        )}
                        <span className="font-semibold">Only uses lowercase letters, numbers or hyphens</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">
                        [a-z0-9-]
                      </span>
                    </div>

                    {/* Rule 3: Starts and ends with letter or number */}
                    <div
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        ruleStartEnd
                          ? 'bg-slate-900 border-emerald-900/60 text-slate-200'
                          : 'bg-slate-900 border-rose-900/60 text-rose-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {ruleStartEnd ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500" />
                        )}
                        <span className="font-semibold">Starts and ends with a letter or number</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">
                        No leading or trailing hyphens
                      </span>
                    </div>

                    {/* Rule 4: No consecutive hyphens */}
                    <div
                      className={`p-3 rounded-xl border flex items-center justify-between ${
                        ruleNoConsecutiveHyphens
                          ? 'bg-slate-900 border-emerald-900/60 text-slate-200'
                          : 'bg-slate-900 border-rose-900/60 text-rose-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {ruleNoConsecutiveHyphens ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-slate-500" />
                        )}
                        <span className="font-semibold">No consecutive hyphens</span>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">
                        No &ldquo;--&rdquo;
                      </span>
                    </div>

                    {/* Rule 5: No reserved or prohibited terms */}
                    <div
                      className={`p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                        ruleNoProhibited
                          ? 'bg-slate-900 border-emerald-900/60 text-slate-200'
                          : 'bg-slate-900 border-rose-600 text-rose-300'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        {ruleNoProhibited ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Circle className="w-4 h-4 text-rose-500" />
                        )}
                        <span className="font-semibold">No reserved or prohibited terms</span>
                      </div>
                      <div>
                        {foundProhibitedTerm ? (
                          <span className="bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded text-[11px] font-bold">
                            Prohibited word found: &ldquo;{foundProhibitedTerm}&rdquo;
                          </span>
                        ) : (
                          <span className="text-[11px] text-emerald-400 font-medium">
                            ✓ No reserved terms found
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Explanation of Prohibited Terms */}
                <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-xs space-y-2">
                  <p className="font-bold text-amber-400">
                    Why does &ldquo;No reserved or prohibited terms&rdquo; trigger?
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    Cloud platforms (GCP, Cloud Run, Firebase) reserve infrastructure keywords to prevent DNS spoofing and system conflicts. Common prohibited terms include:
                  </p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['admin', 'support', 'google', 'api', 'auth', 'test', 'root', 'corp', 'ssl', 'staging', 'prod', 'internal', 'null', 'undefined', 'firebase'].map((term) => (
                      <span
                        key={term}
                        className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px]"
                      >
                        {term}
                      </span>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Avoid attaching these words to your domain (e.g. avoid <code>attrading-admin</code> or <code>attrading-support</code>).
                  </p>
                </div>

                {/* 100% Pre-Approved Valid Names for AT TRADING */}
                <div className="space-y-3 pt-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-white">
                    Pre-Approved Valid Names for AT TRADING (Click to Test &amp; Copy)
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {[
                      'attrading-kolkata',
                      'at-trading-store',
                      'attrading-hub',
                      'at-trading-retail',
                      'attrading-bengal',
                      'attrading-shop',
                      'attrading-baguiati',
                      'attrading-marketplace',
                      'attrading-online',
                      'attrading-india',
                    ].map((name) => (
                      <div
                        key={name}
                        onClick={() => setDomainTestInput(name)}
                        className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                          domainTestInput === name
                            ? 'bg-amber-500/10 border-amber-500 text-amber-300'
                            : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <span className="font-mono text-xs font-semibold">{name}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigator.clipboard.writeText(name);
                            setCopiedDomain(name);
                            showToast(`Copied "${name}" to clipboard!`, 'success');
                            setTimeout(() => setCopiedDomain(null), 2000);
                          }}
                          className="p-1 hover:text-white rounded"
                          title="Copy"
                        >
                          {copiedDomain === name ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-slate-500" />
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Product Modal */}
      {showAddProductModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <form
            onSubmit={handleAddProductSubmit}
            className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Add New Product to Catalog</h3>
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400">Product Name</label>
              <input
                type="text"
                required
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Premium Cotton Kurti / Wireless Soundbar"
                className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400">Brand Name</label>
                <input
                  type="text"
                  required
                  value={newBrand}
                  onChange={(e) => setNewBrand(e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as CategoryId)}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                >
                  {ALL_CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400">Selling Price (₹)</label>
                <input
                  type="number"
                  required
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg font-mono text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">MRP / List (₹)</label>
                <input
                  type="number"
                  required
                  value={newOriginalPrice}
                  onChange={(e) => setNewOriginalPrice(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg font-mono text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Initial Stock</label>
                <input
                  type="number"
                  required
                  value={newStock}
                  onChange={(e) => setNewStock(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg font-mono text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400">Description</label>
              <textarea
                rows={3}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Key specifications, fabric details, warranty, etc."
                className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="px-4 py-2 text-xs font-semibold border border-slate-700 rounded-lg text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <form
            onSubmit={handleUpdateProductSubmit}
            className="bg-slate-950 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl text-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Edit Product Details</h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400">Product Title</label>
              <input
                type="text"
                required
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400">Selling Price (₹)</label>
                <input
                  type="number"
                  required
                  value={editingProduct.price}
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg font-mono text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">MRP (₹)</label>
                <input
                  type="number"
                  required
                  value={editingProduct.originalPrice}
                  onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg font-mono text-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Stock Count</label>
                <input
                  type="number"
                  required
                  value={editingProduct.stockCount}
                  onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg font-mono text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2 text-xs font-semibold border border-slate-700 rounded-lg text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
              >
                Save Updates
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Add Coupon Modal */}
      {showAddCouponModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <form
            onSubmit={handleCreateCoupon}
            className="bg-slate-950 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-200"
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Create Promo Coupon</h3>
              <button
                type="button"
                onClick={() => setShowAddCouponModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400">Coupon Code</label>
              <input
                type="text"
                required
                placeholder="e.g. SPECIAL25"
                value={newCouponCode}
                onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg font-mono uppercase text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-400">Discount Type</label>
                <select
                  value={newCouponType}
                  onChange={(e) => setNewCouponType(e.target.value as any)}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (₹)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400">Value</label>
                <input
                  type="number"
                  required
                  value={newCouponValue}
                  onChange={(e) => setNewCouponValue(Number(e.target.value))}
                  className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg font-mono text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400">Min Order Requirement (₹)</label>
              <input
                type="number"
                required
                value={newCouponMinOrder}
                onChange={(e) => setNewCouponMinOrder(Number(e.target.value))}
                className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg font-mono text-white"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400">Description</label>
              <input
                type="text"
                placeholder="e.g. 25% off on orders above ₹999"
                value={newCouponDesc}
                onChange={(e) => setNewCouponDesc(e.target.value)}
                className="w-full mt-1 px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowAddCouponModal(false)}
                className="px-4 py-2 text-xs font-semibold border border-slate-700 rounded-lg text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
              >
                Create Code
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
