
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Order } from '../types';
import ProductCard from '../components/ProductCard';

const mockOrders: Order[] = [
  { id: 'SS-1024', date: '2023-10-15', total: 139.80, status: 'Delivered', items: [] },
  { id: 'SS-1021', date: '2023-09-28', total: 65.00, status: 'Delivered', items: [] },
];

const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  return (
    <div className="w-full max-w-sm mx-auto bg-white p-8">
        <h2 className="text-2xl font-bold text-center text-primary mb-2">Sign In</h2>
        <p className="text-center text-secondary mb-6">Log in to manage your account.</p>
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <div>
                <label className="block text-sm font-medium text-primary">Email Address</label>
                <input type="email" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent" defaultValue="customer@example.com" />
            </div>
            <div>
                <label className="block text-sm font-medium text-primary">Password</label>
                <input type="password" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent" defaultValue="password" />
            </div>
            <button type="submit" className="w-full bg-accent text-white font-semibold py-2 px-4 rounded-md hover:bg-accent-dark transition-colors">
                Sign In
            </button>
            <p className="text-center text-sm text-secondary">Don't have an account? <a href="#" className="font-medium text-accent hover:underline">Create one</a></p>
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
            <h2 className="text-xl font-bold text-primary mb-4">Order History</h2>
            {mockOrders.map(order => (
                <div key={order.id} className="bg-surface p-4 rounded-lg border border-light-border">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                        <div>
                            <p className="font-bold text-primary">Order ID: {order.id}</p>
                            <p className="text-sm text-secondary">Date: {order.date}</p>
                        </div>
                        <div className="text-right">
                            <p className="font-semibold text-primary">${order.total.toFixed(2)}</p>
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
            <h2 className="text-xl font-bold text-primary mb-4">Wishlist ({wishlist.length})</h2>
            {wishlist.length > 0 ? (
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
            ) : (
                <div className="bg-surface text-center py-16 rounded-lg border border-light-border">
                    <p className="text-secondary">Your wishlist is empty.</p>
                </div>
            )}
          </div>
        );
      case 'address':
        return (
            <div className="bg-surface p-6 rounded-lg border border-light-border max-w-md">
               <h3 className="text-xl font-bold text-primary mb-4">Address Book</h3>
               <div className="space-y-1 text-secondary">
                    <p className="font-semibold text-primary">{user.name}</p>
                    <p>123 Fashion Ave</p>
                    <p>New York, NY</p>
                    <p>USA, 10001</p>
               </div>
            </div>
        );
      default: return null;
    }
  };

  return (
    <div>
        <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-primary">My Account</h1>
            <p className="text-secondary">Welcome, {user.name}</p>
             <button onClick={logout} className="mt-4 text-sm text-secondary hover:text-primary hover:underline">
                Logout
            </button>
        </div>
        
        <div className="md:grid md:grid-cols-12 md:gap-8">
            {/* Desktop Sidebar Nav */}
            <aside className="hidden md:block md:col-span-3 lg:col-span-2">
                 <nav className="flex flex-col space-y-1" aria-label="Tabs">
                    <button onClick={() => setActiveTab('orders')} className={`text-left px-4 py-2 rounded-md font-medium text-sm ${activeTab === 'orders' ? 'bg-surface text-primary' : 'text-secondary hover:bg-surface'}`}>Order History</button>
                    <button onClick={() => setActiveTab('wishlist')} className={`text-left px-4 py-2 rounded-md font-medium text-sm ${activeTab === 'wishlist' ? 'bg-surface text-primary' : 'text-secondary hover:bg-surface'}`}>Wishlist</button>
                    <button onClick={() => setActiveTab('address')} className={`text-left px-4 py-2 rounded-md font-medium text-sm ${activeTab === 'address' ? 'bg-surface text-primary' : 'text-secondary hover:bg-surface'}`}>Address Book</button>
                </nav>
            </aside>

            {/* Mobile Tabs */}
            <div className="md:hidden border-b border-light-border mb-6">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    <button onClick={() => setActiveTab('orders')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'orders' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-primary hover:border-gray-300'}`}>Orders</button>
                    <button onClick={() => setActiveTab('wishlist')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'wishlist' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-primary hover:border-gray-300'}`}>Wishlist</button>
                    <button onClick={() => setActiveTab('address')} className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'address' ? 'border-primary text-primary' : 'border-transparent text-secondary hover:text-primary hover:border-gray-300'}`}>Address</button>
                </nav>
            </div>
            
            {/* Content Area */}
            <main className="md:col-span-9 lg:col-span-10">
                {renderContent()}
            </main>
        </div>
    </div>
  );
};

export default ProfilePage;