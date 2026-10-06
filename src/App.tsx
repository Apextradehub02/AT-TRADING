import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HomeView } from './components/customer/HomeView';
import { ProductsView } from './components/customer/ProductsView';
import { CategoriesView } from './components/customer/CategoriesView';
import { CartView } from './components/customer/CartView';
import { CheckoutView } from './components/customer/CheckoutView';
import { OrderTrackingView } from './components/customer/OrderTrackingView';
import { AccountView } from './components/customer/AccountView';
import { CouponsView } from './components/customer/CouponsView';
import { SupportView } from './components/customer/SupportView';
import { AdminPortal } from './components/admin/AdminPortal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ToastContainer } from './components/ToastContainer';

const MainLayout: React.FC = () => {
  const { viewMode, customerTab } = useStore();

  if (viewMode === 'admin') {
    return (
      <div className="min-h-screen bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <AdminPortal />
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 pt-6 sm:pt-8">
        {customerTab === 'home' && <HomeView />}
        {customerTab === 'products' && <ProductsView />}
        {customerTab === 'categories' && <CategoriesView />}
        {customerTab === 'cart' && <CartView />}
        {customerTab === 'checkout' && <CheckoutView />}
        {customerTab === 'tracking' && <OrderTrackingView />}
        {customerTab === 'account' && <AccountView />}
        {customerTab === 'coupons' && <CouponsView />}
        {customerTab === 'support' && <SupportView />}
      </main>

      <Footer />
      <ProductDetailModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
