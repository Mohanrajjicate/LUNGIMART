
import React from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';

import Layout from './components/Layout';
import HomePage from './pages/Home';
import ShopPage from './pages/Shop';
import ProductDetailPage from './pages/ProductDetail';
import CartPage from './pages/Cart';
import ProfilePage from './pages/Profile';
import AboutPage from './pages/About';

const App: React.FC = () => {
  return (
    <AppProvider>
      <HashRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/shop/:categorySlug" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AppProvider>
  );
};

export default App;