export type CategoryId =
  | 'Electronics'
  | 'Mobile & Accessories'
  | 'Fashion'
  | 'Beauty'
  | 'Home & Kitchen'
  | 'Grocery'
  | 'Sports'
  | 'Books'
  | 'Toys'
  | 'Other Products';

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: CategoryId;
  description: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  inStock: boolean;
  stockCount: number;
  image: string;
  fallbackGradient?: string;
  features?: string[];
  specs?: Record<string, string>;
  isFeatured?: boolean;
  isDealOfTheDay?: boolean;
  dealEndsInHours?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedVariant?: string;
}

export type OrderStatus = 'New' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned';

export interface TrackingStep {
  status: OrderStatus | 'Packed' | 'Out for Delivery';
  label: string;
  location: string;
  timestamp: string;
  completed: boolean;
  current?: boolean;
  description: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  email: string;
  street: string;
  locality: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
}

export interface Order {
  id: string;
  orderDate: string;
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  couponCode?: string;
  status: OrderStatus;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD';
  paymentStatus: 'Paid' | 'Pending';
  deliveryType: 'Standard' | 'Express';
  expectedDelivery: string;
  trackingNumber: string;
  trackingSteps: TrackingStep[];
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'flat';
  value: number;
  minOrder: number;
  description: string;
  expiry: string;
  active: boolean;
}

export interface PriceAlert {
  id: string;
  productId: string;
  productName: string;
  targetPrice: number;
  currentPrice: number;
  customerEmail: string;
  customerPhone: string;
  createdAt: string;
  isTriggered: boolean;
  statusMessage?: string;
}

export interface SavedAddress {
  id: string;
  title: string; // e.g. "Home", "Office"
  name: string;
  phone: string;
  street: string;
  locality: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault: boolean;
}

export type CustomerViewTab =
  | 'home'
  | 'products'
  | 'categories'
  | 'deals'
  | 'cart'
  | 'checkout'
  | 'tracking'
  | 'account'
  | 'coupons'
  | 'support';

export type AdminViewTab =
  | 'dashboard'
  | 'live-market'
  | 'kyc'
  | 'products'
  | 'orders'
  | 'customers'
  | 'coupons'
  | 'alerts'
  | 'reports'
  | 'domain-validator';

export interface AdminLoginRecord {
  id: string;
  adminId: string;
  ip: string;
  device: string;
  location: string;
  timestamp: string;
  status: 'Success' | '2FA Verified' | 'Failed';
}

export interface LiveMarketAsset {
  symbol: string;
  name: string;
  category: 'Commodity' | 'Equity' | 'Forex' | 'Crypto' | 'Wholesale Asset';
  price: number;
  change24h: number;
  high24h: number;
  low24h: number;
  volume: string;
  sparkline: number[];
}

export interface AdminSystemNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'kyc' | 'deposit' | 'alert' | 'trade' | 'security';
  read: boolean;
}

