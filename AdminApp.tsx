import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './components/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import ProductsListPage from './pages/admin/ProductsListPage';
import ProductEditPage from './pages/admin/ProductEditPage';
import OrdersPage from './pages/admin/OrdersPage';
import CustomersPage from './pages/admin/CustomersPage';

const AdminApp: React.FC = () => {
  // In a real app, you'd have an auth check here to protect admin routes.
  // For this mock app, we'll assume the user is an admin.

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
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp;
