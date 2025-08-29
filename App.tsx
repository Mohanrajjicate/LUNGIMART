
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppProvider, useAppContext } from './contexts/AppContext';
import { ToastProvider } from './contexts/ToastContext';

import Layout from './components/Layout';
import HomePage from './pages/Home';
import ShopPage from './pages/Shop';
import ProductDetailPage from './pages/ProductDetail';
import CartPage from './pages/Cart';
import CheckoutPage from './pages/Checkout';
import ProfilePage from './pages/Profile';
import AboutPage from './pages/About';
import BulkOrderPage from './pages/BulkOrder';
import PoliticalPartyPage from './pages/PoliticalParty';
import QuietZonePage from './pages/QuietZone';
import ScrollToTop from './components/ScrollToTop';
import ContactPage from './pages/Contact';
import InvoicePage from './pages/Invoice';
import SearchPage from './pages/SearchPage';
import AdminApp from './AdminApp';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import SignupPage from './pages/SignupPage';
import FaqPage from './pages/Faq';
import ShippingReturnsPage from './pages/ShippingReturns';
import PrivacyPolicyPage from './pages/PrivacyPolicy';

const AppContent: React.FC = () => {
  const { isLoading, error } = useAppContext();

  if (isLoading) {
      return (
          <div className="flex justify-center items-center min-h-screen">
              <div className="text-center">
                  <p className="text-2xl font-bold tracking-tight text-slate-900">LungiMart.in</p>
                  <p className="mt-2 text-slate-600">Loading authentic weaves...</p>
              </div>
          </div>
      );
  }

  if(error) {
       return (
          <div className="flex justify-center items-center min-h-screen">
              <div className="text-center p-8 bg-red-50 rounded-lg">
                  <p className="text-xl font-bold text-red-700">Oops! Something went wrong.</p>
                  <p className="mt-2 text-red-600">{error}</p>
                   <p className="mt-4 text-sm text-slate-500">Please try refreshing the page.</p>
              </div>
          </div>
      );
  }

  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/*" element={
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/shop" element={<ShopPage />} />
              <Route path="/shop/:categorySlug" element={<ShopPage />} />
              <Route path="/product/:slug" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/bulk-order" element={<BulkOrderPage />} />
              <Route path="/political-party" element={<PoliticalPartyPage />} />
              <Route path="/quiet-zone" element={<QuietZonePage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/invoice/:orderId" element={<InvoicePage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/shipping-returns" element={<ShippingReturnsPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            </Routes>
          </Layout>
        } />
      </Routes>
    </HashRouter>
  );
};


const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ToastProvider>
  );
};

export default App;