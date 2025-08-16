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
    <div className="w-full max-w-sm mx-auto bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Welcome Back!</h2>
        <p className="text-center text-slate-600 mb-6">Log in to manage your account.</p>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div>
                <label className="block text-sm font-medium text-slate-700">Email Address</label>
                <input type="email" required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1" defaultValue="customer@example.com" />
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input type="password" required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1" defaultValue="password" />
            </div>
            <button type="submit" className="w-full bg-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                Log In
            </button>
            <p className="text-center text-sm text-slate-500">Don't have an account? <a href="#" className="font-medium text-primary hover:underline">Sign Up</a></p>
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
  
  const renderContent = () => {
    switch (activeTab) {
      case 'orders':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Order History</h2>
            {mockOrders.map(order => (
                <div key={order.id} className="bg-white p-4 rounded-xl border border-slate-200">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <p className="font-bold text-primary">Order ID: {order.id}</p>
                            <p className="text-sm text-slate-500">Date: {order.date}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-slate-800">₹{order.total.toFixed(2)}</p>
                            <span className={`mt-1 inline-block px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {order.status}
                            </span>
                        </div>
                    </div>
                </div>
            ))}
          </div>
        );
      case 'wishlist':
        return (
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-4">Wishlist ({wishlist.length})</h2>
            {wishlist.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
            ) : (
                <div className="bg-white text-center py-16 rounded-xl border border-slate-200">
                    <p className="text-slate-500">Your wishlist is empty.</p>
                </div>
            )}
          </div>
        );
      case 'address':
        return (
            <div className="bg-white p-6 rounded-xl border border-slate-200 max-w-md">
               <h3 className="text-xl font-bold text-slate-900 mb-4">Address Book</h3>
               <div className="space-y-1 text-slate-600">
                    <p className="font-semibold text-slate-800">{user.name}</p>
                    <p>123, Weaver's Colony</p>
                    <p>Komarapalayam, Tamil Nadu</p>
                    <p>India, 638183</p>
               </div>
            </div>
        );
      default: return null;
    }
  };

  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
            <h1 className="text-3xl font-bold text-slate-900">Welcome, {user.name}</h1>
            <button onClick={logout} className="bg-slate-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-slate-700 transition-colors self-start sm:self-center">
                Logout
            </button>
        </div>

        <div className="md:grid md:grid-cols-12 md:gap-8">
            {/* Desktop Sidebar Nav */}
            <div className="hidden md:block md:col-span-3 lg:col-span-2">
                 <nav className="flex flex-col space-y-2" aria-label="Tabs">
                    <button onClick={() => setActiveTab('orders')} className={`text-left px-4 py-2 rounded-lg font-medium text-sm ${activeTab === 'orders' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100'}`}>Order History</button>
                    <button onClick={() => setActiveTab('wishlist')} className={`text-left px-4 py-2 rounded-lg font-medium text-sm ${activeTab === 'wishlist' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100'}`}>Wishlist</button>
                    <button onClick={() => setActiveTab('address')} className={`text-left px-4 py-2 rounded-lg font-medium text-sm ${activeTab === 'address' ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100'}`}>Address Book</button>
                </nav>
            </div>

            {/* Mobile Tabs */}
            <div className="md:hidden border-b border-slate-200 mb-6">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    <button onClick={() => setActiveTab('orders')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Order History</button>
                    <button onClick={() => setActiveTab('wishlist')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'wishlist' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Wishlist</button>
                    <button onClick={() => setActiveTab('address')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'address' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}>Address Book</button>
                </nav>
            </div>
            
            {/* Content Area */}
            <div className="md:col-span-9 lg:col-span-10">
                {renderContent()}
            </div>
        </div>
    </div>
  );
};

export default ProfilePage;