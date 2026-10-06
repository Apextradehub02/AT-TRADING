import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  Order,
  Coupon,
  SavedAddress,
  Review,
  PriceAlert,
  CategoryId,
  CustomerViewTab,
  AdminViewTab,
  OrderStatus,
  CustomerInfo,
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_COUPONS,
  INITIAL_ADDRESSES,
  INITIAL_ORDERS,
  INITIAL_REVIEWS,
  INITIAL_PRICE_ALERTS,
} from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'warning' | 'error';
}

interface StoreContextType {
  // Navigation & Modes
  viewMode: 'customer' | 'admin';
  setViewMode: (mode: 'customer' | 'admin') => void;
  customerTab: CustomerViewTab;
  setCustomerTab: (tab: CustomerViewTab) => void;
  adminTab: AdminViewTab;
  setAdminTab: (tab: AdminViewTab) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: CategoryId | 'All';
  setSelectedCategory: (cat: CategoryId | 'All') => void;
  trackingOrderId: string | null;
  setTrackingOrderId: (id: string | null) => void;

  // Products
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  updateStock: (id: string, count: number) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, variant?: string) => void;
  removeFromCart: (productId: string, variant?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  deliveryCharge: number;
  cartTotal: number;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  addCoupon: (coupon: Coupon) => void;
  toggleCouponStatus: (code: string) => void;

  // Orders & Tracking
  orders: Order[];
  placeOrder: (customer: CustomerInfo, deliveryType: 'Standard' | 'Express', paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD') => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, customNote?: string) => void;
  cancelOrder: (orderId: string, reason?: string) => void;

  // Addresses
  addresses: SavedAddress[];
  addAddress: (addr: Omit<SavedAddress, 'id'>) => void;
  setDefaultAddress: (id: string) => void;
  deleteAddress: (id: string) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'date'>) => void;

  // Price Target Alerts
  priceAlerts: PriceAlert[];
  createPriceAlert: (productId: string, targetPrice: number, email: string, phone: string) => void;
  deletePriceAlert: (id: string) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mode & Tabs
  const [viewMode, setViewMode] = useState<'customer' | 'admin'>('customer');
  const [customerTab, setCustomerTab] = useState<CustomerViewTab>('home');
  const [adminTab, setAdminTab] = useState<AdminViewTab>('dashboard');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'All'>('All');
  const [trackingOrderId, setTrackingOrderId] = useState<string | null>(null);

  // Entities with localStorage caching
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('att_products');
    if (!saved) return INITIAL_PRODUCTS;
    try {
      const parsed: Product[] = JSON.parse(saved);
      const existingIds = new Set(parsed.map((p) => p.id));
      const missing = INITIAL_PRODUCTS.filter((p) => !existingIds.has(p.id));
      return missing.length > 0 ? [...parsed, ...missing] : parsed;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('att_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('att_wishlist');
    return saved ? JSON.parse(saved) : ['prod-001', 'prod-002'];
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('att_coupons');
    return saved ? JSON.parse(saved) : INITIAL_COUPONS;
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('att_orders');
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
  });

  const [addresses, setAddresses] = useState<SavedAddress[]>(() => {
    const saved = localStorage.getItem('att_addresses');
    return saved ? JSON.parse(saved) : INITIAL_ADDRESSES;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('att_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>(() => {
    const saved = localStorage.getItem('att_price_alerts');
    return saved ? JSON.parse(saved) : INITIAL_PRICE_ALERTS;
  });

  const [toasts, setToasts] = useState<Toast[]>([]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('att_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('att_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('att_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('att_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('att_addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('att_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('att_price_alerts', JSON.stringify(priceAlerts));
  }, [priceAlerts]);

  useEffect(() => {
    localStorage.setItem('att_coupons', JSON.stringify(coupons));
  }, [coupons]);

  // Toast Helper
  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 4);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Products
  const addProduct = (prodData: Omit<Product, 'id'>) => {
    const newId = `prod-${Date.now().toString().slice(-4)}`;
    const newProd: Product = { ...prodData, id: newId };
    setProducts((prev) => [newProd, ...prev]);
    showToast(`Added product "${newProd.name}" to catalog!`, 'success');
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          // Check price alert triggers if price changed!
          if (updates.price && updates.price <= p.price) {
            checkPriceAlerts(id, updates.price, p.name);
          }
          return updated;
        }
        return p;
      })
    );
    showToast('Product details updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalog', 'info');
  };

  const updateStock = (id: string, count: number) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, stockCount: Math.max(0, count), inStock: count > 0 } : p))
    );
    showToast(`Inventory updated`, 'success');
  };

  // Check Price Alerts
  const checkPriceAlerts = (productId: string, newPrice: number, productName: string) => {
    setPriceAlerts((prev) =>
      prev.map((alert) => {
        if (alert.productId === productId && newPrice <= alert.targetPrice && !alert.isTriggered) {
          showToast(`🎯 Price Alert Triggered for ${productName}! Target ₹${alert.targetPrice} met.`, 'info');
          return {
            ...alert,
            currentPrice: newPrice,
            isTriggered: true,
            statusMessage: `TARGET REACHED! Now at ₹${newPrice.toLocaleString('en-IN')}. Notification sent to ${alert.customerPhone}.`,
          };
        }
        return alert;
      })
    );
  };

  // Cart operations
  const addToCart = (product: Product, quantity = 1, variant?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariant === variant
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex] = {
          ...next[existingIndex],
          quantity: next[existingIndex].quantity + quantity,
        };
        return next;
      }
      return [...prev, { product, quantity, selectedVariant: variant }];
    });
    showToast(`Added ${product.name.slice(0, 32)}... to cart!`, 'success');
  };

  const removeFromCart = (productId: string, variant?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && item.selectedVariant === variant))
    );
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, variant);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.product.id === productId && item.selectedVariant === variant) {
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  // Calculate discount based on applied coupon
  let cartDiscount = 0;
  if (appliedCoupon && cartSubtotal >= appliedCoupon.minOrder) {
    if (appliedCoupon.discountType === 'flat') {
      cartDiscount = appliedCoupon.value;
    } else {
      cartDiscount = Math.round((cartSubtotal * appliedCoupon.value) / 100);
    }
  }

  // Free delivery threshold ₹499
  const deliveryCharge = cartSubtotal === 0 || cartSubtotal >= 499 ? 0 : 49;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + deliveryCharge);

  // Wishlist operations
  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Added to wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  // Coupon Operations
  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    const found = coupons.find((c) => c.code === clean && c.active);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code' };
    }
    if (cartSubtotal < found.minOrder) {
      return {
        success: false,
        message: `Coupon requires a minimum order amount of ₹${found.minOrder.toLocaleString('en-IN')}`,
      };
    }
    setAppliedCoupon(found);
    showToast(`Coupon ${found.code} applied successfully!`, 'success');
    return { success: true, message: `Coupon applied: ${found.description}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const addCoupon = (coupon: Coupon) => {
    setCoupons((prev) => [coupon, ...prev]);
    showToast(`Created coupon ${coupon.code}`, 'success');
  };

  const toggleCouponStatus = (code: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.code === code ? { ...c, active: !c.active } : c))
    );
    showToast('Coupon status updated', 'info');
  };

  // Orders
  const placeOrder = (
    customer: CustomerInfo,
    deliveryType: 'Standard' | 'Express',
    paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'COD'
  ): Order => {
    const newOrderId = `ATT-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').slice(0, 16);
    const trackingNum = `ATWB-KOL-${Math.floor(100000 + Math.random() * 900000)}`;

    const newOrder: Order = {
      id: newOrderId,
      orderDate: dateStr,
      customer,
      items: [...cart],
      subtotal: cartSubtotal,
      discount: cartDiscount,
      deliveryCharge,
      total: cartTotal,
      couponCode: appliedCoupon?.code,
      status: 'New',
      paymentMethod,
      paymentStatus: paymentMethod === 'COD' ? 'Pending' : 'Paid',
      deliveryType,
      expectedDelivery:
        deliveryType === 'Express'
          ? 'Tomorrow by 4:00 PM (Express Kolkata Baguiati Hub)'
          : 'Within 2-3 Business Days',
      trackingNumber: trackingNum,
      trackingSteps: [
        {
          status: 'New',
          label: 'Order Confirmed',
          location: 'AT TRADING Central Store',
          timestamp: 'Just now',
          completed: true,
          current: true,
          description: `Order verified. Confirmation SMS and notification queued for ${customer.phone}.`,
        },
        {
          status: 'Processing',
          label: 'Packing at Baguiati Hub',
          location: 'Holding no 30103, Atghara, Kolkata-700136',
          timestamp: 'Estimated within 3 hours',
          completed: false,
          description: 'Quality check and packing in tamper-proof corrugated box.',
        },
        {
          status: 'Shipped',
          label: 'Dispatched with Courier',
          location: 'Kolkata North Hub',
          timestamp: 'Scheduled for dispatch',
          completed: false,
          description: `AWB assigned: ${trackingNum}.`,
        },
        {
          status: 'Out for Delivery',
          label: 'Out for Delivery',
          location: `Destination Local Hub (${customer.pincode})`,
          timestamp: 'On delivery day morning',
          completed: false,
          description: 'Delivery executive will verify customer contact before arrival.',
        },
        {
          status: 'Delivered',
          label: 'Delivered',
          location: customer.locality || customer.city,
          timestamp: 'Pending delivery completion',
          completed: false,
          description: 'Final contactless handover and digital invoice receipt.',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setTrackingOrderId(newOrderId);
    showToast(`Order #${newOrderId} placed successfully!`, 'success');
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, customNote?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const updatedSteps = order.trackingSteps.map((step) => {
            if (step.status === status) {
              return {
                ...step,
                completed: true,
                current: true,
                timestamp: `Updated ${nowStr}`,
                description: customNote || step.description,
              };
            }
            if (
              (status === 'Processing' && step.status === 'New') ||
              (status === 'Shipped' && (step.status === 'New' || step.status === 'Processing')) ||
              (status === 'Delivered')
            ) {
              return { ...step, completed: true, current: false };
            }
            return { ...step, current: false };
          });

          return {
            ...order,
            status,
            trackingSteps: updatedSteps,
            paymentStatus: status === 'Delivered' && order.paymentMethod === 'COD' ? 'Paid' : order.paymentStatus,
          };
        }
        return order;
      })
    );
    showToast(`Order ${orderId} marked as ${status}`, 'success');
  };

  const cancelOrder = (orderId: string, reason?: string) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'Cancelled',
            trackingSteps: [
              ...order.trackingSteps,
              {
                status: 'Cancelled',
                label: 'Order Cancelled',
                location: 'AT TRADING Operations',
                timestamp: 'Just now',
                completed: true,
                current: true,
                description: reason || 'Order cancelled per customer request.',
              },
            ],
          };
        }
        return order;
      })
    );
    showToast(`Order ${orderId} has been cancelled`, 'info');
  };

  // Addresses
  const addAddress = (addrData: Omit<SavedAddress, 'id'>) => {
    const newId = `addr-${Date.now().toString().slice(-4)}`;
    const newAddr: SavedAddress = { ...addrData, id: newId };
    setAddresses((prev) => {
      if (newAddr.isDefault) {
        return [newAddr, ...prev.map((a) => ({ ...a, isDefault: false }))];
      }
      return [...prev, newAddr];
    });
    showToast('New delivery address saved', 'success');
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((a) => ({ ...a, isDefault: a.id === id }))
    );
    showToast('Default address updated', 'info');
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => prev.filter((a) => a.id !== id));
    showToast('Address removed', 'info');
  };

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'date'>) => {
    const newReview: Review = {
      ...reviewData,
      id: `rev-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().slice(0, 10),
    };
    setReviews((prev) => [newReview, ...prev]);

    // Recalculate product rating & reviewCount
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === reviewData.productId) {
          const currentCount = p.reviewCount;
          const currentSum = p.rating * currentCount;
          const newCount = currentCount + 1;
          const newAvg = Number(((currentSum + reviewData.rating) / newCount).toFixed(1));
          return {
            ...p,
            rating: newAvg,
            reviewCount: newCount,
          };
        }
        return p;
      })
    );
    showToast('Review submitted! Thank you for your feedback.', 'success');
  };

  // Price Target Alerts (as explicitly highlighted by user)
  const createPriceAlert = (productId: string, targetPrice: number, email: string, phone: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;

    const newAlert: PriceAlert = {
      id: `alert-${Date.now().toString().slice(-4)}`,
      productId,
      productName: product.name,
      targetPrice,
      currentPrice: product.price,
      customerEmail: email,
      customerPhone: phone,
      createdAt: new Date().toISOString().slice(0, 10),
      isTriggered: product.price <= targetPrice,
      statusMessage:
        product.price <= targetPrice
          ? `Target price already reached! Notification sent to ${phone}.`
          : `Watching price. You will receive an SMS & notification when price drops to ₹${targetPrice.toLocaleString('en-IN')}.`,
    };

    setPriceAlerts((prev) => [newAlert, ...prev]);
    showToast(
      `Price alert set for ₹${targetPrice.toLocaleString('en-IN')}! Registered for ${phone}`,
      'success'
    );
  };

  const deletePriceAlert = (id: string) => {
    setPriceAlerts((prev) => prev.filter((a) => a.id !== id));
    showToast('Price target alert removed', 'info');
  };

  return (
    <StoreContext.Provider
      value={{
        viewMode,
        setViewMode,
        customerTab,
        setCustomerTab,
        adminTab,
        setAdminTab,
        selectedProductId,
        setSelectedProductId,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        trackingOrderId,
        setTrackingOrderId,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        updateStock,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        deliveryCharge,
        cartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        coupons,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        addCoupon,
        toggleCouponStatus,
        orders,
        placeOrder,
        updateOrderStatus,
        cancelOrder,
        addresses,
        addAddress,
        setDefaultAddress,
        deleteAddress,
        reviews,
        addReview,
        priceAlerts,
        createPriceAlert,
        deletePriceAlert,
        toasts,
        showToast,
        removeToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
