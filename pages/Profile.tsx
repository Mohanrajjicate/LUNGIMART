
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Order } from '../types';
import ProductCard from '../components/ProductCard';

const mockOrders: Order[] = [
  { id: 'LM-1024', date: '2023-10-15', total: 1398, status: 'Delivered', items: [] },
  { id: 'LM-1021', date: '2023-09-28', total: 650, status: 'Delivered', items: [] },
];

const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="w-full max-w-sm mx-auto">
        <h2 className="text-2xl font-bold text-center text-secondary mb-2">Welcome Back!</h2>
        <p className="text-center text-gray-600 mb-6">Log in to manage your account.</p>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input type="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" defaultValue="customer@example.com" />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary" defaultValue="password" />
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-2 px-4 rounded-md hover:bg-primary-dark transition-colors">
                Log In
            </button>
            <p className="text-center text-sm text-gray-500">Don't have an account? <a href="#" className="font-medium text-primary hover:underline">Sign Up</a></p>
        </form>
    </div>
  );
};

const ProfilePage: React.FC = () => {
  const { user, login, logout, wishlist } = useAppContext();
  const [activeTab, setActiveTab] = useState('orders');

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoginPage onLogin={() => login({ id: 1, name: 'Suresh P.', email: 'suresh@example.com' })} />
      </div>
    );
  }

  return (
    <div>
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-secondary">Welcome, {user.name}</h1>
            <button onClick={logout} className="bg-secondary text-white font-semibold py-2 px-4 rounded-md hover:bg-secondary/90 transition-colors">
                Logout
            </button>
        </div>

        <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                <button onClick={() => setActiveTab('orders')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    Order History
                </button>
                <button onClick={() => setActiveTab('wishlist')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'wishlist' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    Wishlist ({wishlist.length})
                </button>
                <button onClick={() => setActiveTab('address')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'address' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                    Address Book
                </button>
            </nav>
        </div>

        <div className="mt-8">
            {activeTab === 'orders' && (
                <div className="space-y-4">
                    {mockOrders.map(order => (
                        <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border">
                            <div className="flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-secondary">Order ID: {order.id}</p>
                                    <p className="text-sm text-gray-500">Date: {order.date}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">₹{order.total.toFixed(2)}</p>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {activeTab === 'wishlist' && (
                <div>
                    {wishlist.length > 0 ? (
                         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {wishlist.map(product => <ProductCard key={product.id} product={product} />)}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-10">Your wishlist is empty.</p>
                    )}
                </div>
            )}
             {activeTab === 'address' && (
                <div className="bg-white p-6 rounded-lg shadow-sm border max-w-md">
                   <h3 className="text-lg font-bold text-secondary mb-4">Default Address</h3>
                   <div className="space-y-1 text-gray-700">
                        <p className="font-semibold">{user.name}</p>
                        <p>123, Weaver's Colony</p>
                        <p>Komarapalayam, Tamil Nadu</p>
                        <p>India, 638183</p>
                   </div>
                </div>
            )}
        </div>
    </div>
  );
};

export default ProfilePage;
