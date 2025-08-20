
import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsListPage from './pages/admin/ProductsListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import OrdersPage from './pages/admin/OrdersPage';
import CustomersPage from './pages/admin/CustomersPage';
import ImageGalleryPage from './pages/admin/ImageGalleryPage';
import ReviewsPage from './pages/admin/ReviewsPage';
import AppearancePage from './pages/admin/AppearancePage';
import CouponsPage from './pages/admin/CouponsPage';
import CouponEditPage from './pages/admin/CouponEditPage';
import NotificationsPage from './pages/admin/NotificationsPage';

const AdminApp: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // This is a mock authentication check. In a real app, you'd verify a token.
    const loggedIn = localStorage.getItem('isAdminLoggedIn') === 'true';
    if (!loggedIn) {
      navigate('/admin/login', { replace: true });
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  if (!isAuthenticated) {
    // Render nothing while redirecting
    return null;
  }

  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="products" element={<ProductsListPage />} />
        <Route path="products/new" element={<ProductEditPage />} />
        <Route path="products/edit/:productId" element={<ProductEditPage />} />
        <Route path="orders" element={<OrdersPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="image-gallery" element={<ImageGalleryPage />} />
        <Route path="appearance" element={<AppearancePage />} />
        <Route path="coupons" element={<CouponsPage />} />
        <Route path="coupons/new" element={<CouponEditPage />} />
        <Route path="coupons/edit/:couponId" element={<CouponEditPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp;
