


import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Product, Address, Order } from '../types';
import ProductCard from '../components/ProductCard';
import ReviewModal from '../components/ReviewModal';
import OrderTrackingModal from '../components/OrderTrackingModal';
import { mockUsers, mockCoupons } from '../services/mockData';

// --- Authentication Components (for logged-out users) --- //
const AuthComponent: React.FC = () => {
    const { login } = useAppContext();
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

    const handleLogin = () => {
        // In a real app, you'd verify credentials. Here we just log in the mock user.
        login(mockUsers[0]);
    };
    
    const handleSignup = (name: string, email: string) => {
        // Create a new user and log them in
        const newUser = {
            id: Date.now(),
            name,
            email,
            addresses: [],
            birthday: '',
        };
        login(newUser);
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
            {authMode === 'login' ? (
                <div>
                    <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Welcome Back!</h2>
                    <p className="text-center text-slate-600 mb-6">Log in to manage your account.</p>
                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
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
                    </form>
                    <p className="text-center text-sm text-slate-500 mt-4">
                        Don't have an account?{' '}
                        <button onClick={() => setAuthMode('signup')} className="font-medium text-primary hover:underline">
                            Sign Up
                        </button>
                    </p>
                </div>
            ) : (
                <div>
                    <h2 className="text-2xl font-bold text-center text-slate-900 mb-2">Create an Account</h2>
                     <p className="text-center text-slate-600 mb-6">Join LungiMart for a seamless shopping experience.</p>
                    <form className="space-y-4" onSubmit={(e) => { 
                        e.preventDefault(); 
                        const formData = new FormData(e.currentTarget);
                        const name = formData.get('name') as string;
                        const email = formData.get('email') as string;
                        handleSignup(name, email);
                    }}>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Full Name</label>
                            <input type="text" name="name" required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email Address</label>
                            <input type="email" name="email" required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1" />
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700">Password</label>
                            <input type="password" required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1" />
                        </div>
                        <button type="submit" className="w-full bg-primary text-white font-bold py-2.5 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                            Create Account
                        </button>
                    </form>
                    <p className="text-center text-sm text-slate-500 mt-4">
                        Already have an account?{' '}
                        <button onClick={() => setAuthMode('login')} className="font-medium text-primary hover:underline">
                            Log In
                        </button>
                    </p>
                </div>
            )}
        </div>
    );
};


// --- Main Profile Page Component --- //
const ProfilePage: React.FC = () => {
  const { user, login, logout, wishlist, orders, addReview } = useAppContext();
  const location = useLocation();
  
  const defaultSection = location.state?.tab === 'wishlist' ? 'wishlist' : 'orders';
  const [activeSection, setActiveSection] = useState(defaultSection);
  
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [productToReview, setProductToReview] = useState<{product: Product, orderId: string} | null>(null);

  const [isTrackingModalOpen, setTrackingModalOpen] = useState(false);
  const [orderToTrack, setOrderToTrack] = useState<Order | null>(null);

  useEffect(() => {
     setActiveSection(location.state?.tab === 'wishlist' ? 'wishlist' : 'orders');
  }, [location.state]);

  const handleOpenReviewModal = (product: Product, orderId: string) => {
    setProductToReview({ product, orderId });
    setReviewModalOpen(true);
  };

  const handleCloseReviewModal = () => {
    setReviewModalOpen(false);
    setProductToReview(null);
  };

  const handleOpenTrackingModal = (order: Order) => {
    setOrderToTrack(order);
    setTrackingModalOpen(true);
  };

  const handleCloseTrackingModal = () => {
    setTrackingModalOpen(false);
    setOrderToTrack(null);
  };

  const handleReviewSubmit = (rating: number, comment: string) => {
    if (productToReview) {
      addReview(productToReview.product.id, productToReview.orderId, rating, comment);
    }
    handleCloseReviewModal();
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center py-12">
        <AuthComponent />
      </div>
    );
  }
  
  const sections = [
      { id: 'orders', label: 'My Orders', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> },
      { id: 'wishlist', label: 'Wishlist', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
      { id: 'coupons', label: 'Available Coupons', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 002 2h14a2 2 0 002-2V7a2 2 0 00-2-2H5z" /></svg> },
      { id: 'profile', label: 'Profile Information', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg> },
      { id: 'address', label: 'Address Manager', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'orders':
        return <OrdersSection orders={orders} onOpenReviewModal={handleOpenReviewModal} onOpenTrackingModal={handleOpenTrackingModal} />;
      case 'wishlist':
        return <WishlistSection wishlist={wishlist} />;
      case 'coupons':
        return <CouponsSection />;
      case 'profile':
        return <ProfileInfoSection />;
      case 'address':
        return <AddressManagerSection />;
      default: return null;
    }
  };

  return (
    <>
    {isReviewModalOpen && productToReview && (
      <ReviewModal
        productName={productToReview.product.name}
        onClose={handleCloseReviewModal}
        onSubmit={handleReviewSubmit}
      />
    )}
    {isTrackingModalOpen && orderToTrack && (
        <OrderTrackingModal
            order={orderToTrack}
            onClose={handleCloseTrackingModal}
        />
    )}
    <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
            <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                </div>
                <div>
                    <p className="text-sm text-slate-500">Welcome back,</p>
                    <h1 className="text-3xl font-bold text-slate-900">{user.name}</h1>
                </div>
            </div>
            <button onClick={logout} className="bg-slate-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-slate-700 transition-colors self-start sm:self-center">
                Logout
            </button>
        </div>

        <div className="md:grid md:grid-cols-12 md:gap-8">
            {/* Desktop Sidebar Nav */}
            <div className="hidden md:block md:col-span-3 lg:col-span-3">
                 <nav className="flex flex-col space-y-2" aria-label="Tabs">
                    {sections.map(section => (
                        <button 
                            key={section.id}
                            onClick={() => setActiveSection(section.id)} 
                            className={`flex items-center gap-3 text-left px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${activeSection === section.id ? 'bg-primary/10 text-primary' : 'text-slate-600 hover:bg-slate-100'}`}
                        >
                            {section.icon}
                            <span>{section.label}</span>
                        </button>
                    ))}
                </nav>
            </div>

            {/* Mobile Tabs */}
            <div className="md:hidden border-b border-slate-200 mb-6">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {sections.map(section => (
                        <button 
                            key={section.id}
                            onClick={() => setActiveSection(section.id)} 
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeSection === section.id ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                        >
                            {section.label}
                        </button>
                    ))}
                </nav>
            </div>
            
            {/* Content Area */}
            <div className="md:col-span-9 lg:col-span-9">
                {renderContent()}
            </div>
        </div>
    </div>
    </>
  );
};

// --- Section Components --- //

const Section: React.FC<{title: string, children: React.ReactNode}> = ({ title, children }) => (
    <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-6">{title}</h2>
        <div className="space-y-6">{children}</div>
    </div>
);

const OrdersSection: React.FC<{orders: any[], onOpenReviewModal: (product: Product, orderId: string) => void, onOpenTrackingModal: (order: Order) => void}> = ({ orders, onOpenReviewModal, onOpenTrackingModal }) => (
    <Section title="My Orders">
        {orders.length > 0 ? orders.map(order => (
            <div key={order.id} className="bg-white p-4 rounded-xl border border-slate-200">
                <div className="flex flex-wrap justify-between items-center gap-4 border-b border-slate-200 pb-4 mb-4">
                    <div>
                        <Link to={`/invoice/${btoa(order.id)}`} className="font-bold text-primary hover:underline block">
                            Order ID: {order.id}
                        </Link>
                         <p className="text-sm text-slate-500 truncate max-w-xs sm:max-w-sm">
                            {order.items[0]?.name}{order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}
                        </p>
                        <p className="text-sm text-slate-500">Date: {order.date}</p>
                    </div>
                    <div className="text-right flex items-center gap-4">
                        {order.trackingNumber && (
                             <button onClick={() => onOpenTrackingModal(order)} className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors text-sm">
                                Track Order
                            </button>
                        )}
                        <div>
                            <p className="font-semibold text-slate-800">₹{order.total.toFixed(2)}</p>
                            <span className={`mt-1 inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                order.status === 'Shipped' || order.status === 'Out for Delivery' ? 'bg-blue-100 text-blue-800' : 
                                'bg-yellow-100 text-yellow-800'}`}>
                                {order.status}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="space-y-4">
                  {order.items.map((item: Product & {quantity: number}) => (
                    <div key={item.id} className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <img src={item.images[0]} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                        <div>
                           <Link to={`/product/${item.slug}`} className="font-semibold text-slate-800 hover:text-primary">{item.name}</Link>
                           <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      {order.status === 'Delivered' && (
                        <div>
                          {order.reviewedProducts[item.id] ? (
                              <p className="text-sm font-medium text-green-600">✓ Reviewed</p>
                          ) : (
                            <button 
                                onClick={() => onOpenReviewModal(item, order.id)}
                                className="text-sm font-semibold text-primary hover:text-primary-dark transition-colors"
                            >
                                Write a Review
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
            </div>
        )) : <div className="bg-white text-center py-16 rounded-xl border border-slate-200"><p className="text-slate-500">You have not placed any orders yet.</p></div>}
    </Section>
);

const WishlistSection: React.FC<{wishlist: Product[]}> = ({ wishlist }) => (
    <Section title={`Wishlist (${wishlist.length})`}>
        {wishlist.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {wishlist.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
        ) : (
            <div className="bg-white text-center py-16 rounded-xl border border-slate-200">
                <p className="text-slate-500">Your wishlist is empty.</p>
            </div>
        )}
    </Section>
);

const CouponsSection: React.FC = () => {
    const [copiedCode, setCopiedCode] = useState<string | null>(null);
    const handleCopy = (code: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    return (
        <Section title="Available Coupons">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {mockCoupons.map(coupon => (
                    <div key={coupon.id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center">
                        <div>
                            <p className="font-bold text-slate-800">{coupon.code}</p>
                            <p className="text-sm text-slate-500">{coupon.description}</p>
                        </div>
                        <button 
                            onClick={() => handleCopy(coupon.code)}
                            className="bg-slate-100 text-slate-700 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors"
                        >
                            {copiedCode === coupon.code ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                ))}
            </div>
        </Section>
    );
};

const ProfileInfoSection: React.FC = () => {
    const { user, login } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        birthday: user?.birthday || ''
    });

    if (!user) return null;

    const handleSave = () => {
        const updatedUser = { ...user, ...formData };
        login(updatedUser);
        setIsEditing(false);
    };

    return (
        <Section title="Profile Information">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
                {!isEditing ? (
                    <div className="space-y-4">
                        <div><p className="text-sm text-slate-500">Full Name</p><p className="font-semibold text-slate-800">{user.name}</p></div>
                        <div><p className="text-sm text-slate-500">Email Address</p><p className="font-semibold text-slate-800">{user.email}</p></div>
                        <div><p className="text-sm text-slate-500">Birthday</p><p className="font-semibold text-slate-800">{user.birthday || 'Not set'}</p></div>
                        <button onClick={() => setIsEditing(true)} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors">Edit Profile</button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Full Name</label>
                            <input type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Email Address</label>
                            <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"/>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Birthday</label>
                            <input type="date" value={formData.birthday} onChange={(e) => setFormData({...formData, birthday: e.target.value})} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"/>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handleSave} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors">Save Changes</button>
                            <button onClick={() => setIsEditing(false)} className="bg-slate-100 text-slate-800 font-bold py-2 px-6 rounded-lg hover:bg-slate-200 transition-colors">Cancel</button>
                        </div>
                    </div>
                )}
            </div>
        </Section>
    );
};

const AddressManagerSection: React.FC = () => {
    const { user, login } = useAppContext();
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const emptyAddress = { id: 0, name: '', street: '', city: '', zip: '' };

    if (!user) return null;

    const handleSetDefault = (addressId: number) => {
        const updatedAddresses = user.addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === addressId
        }));
        login({ ...user, addresses: updatedAddresses });
    };

    const handleDelete = (addressId: number) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            const updatedAddresses = user.addresses.filter(addr => addr.id !== addressId);
            login({ ...user, addresses: updatedAddresses });
        }
    };

    const handleSaveAddress = (address: Omit<Address, 'id'>) => {
        if (editingAddress) { // Editing
            const updatedAddresses = user.addresses.map(addr => addr.id === editingAddress.id ? { ...addr, ...address } : addr);
            login({ ...user, addresses: updatedAddresses });
        } else { // Adding new
            const newAddress: Address = { ...address, id: Date.now(), isDefault: user.addresses.length === 0 };
            login({ ...user, addresses: [...user.addresses, newAddress] });
        }
        setIsFormVisible(false);
        setEditingAddress(null);
    };

    return (
        <Section title="Address Manager">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {user.addresses.map(address => (
                    <div key={address.id} className={`bg-white p-4 rounded-xl border ${address.isDefault ? 'border-primary' : 'border-slate-200'}`}>
                       <div className="space-y-1 text-slate-600">
                            <p className="font-semibold text-slate-800">{address.name} {address.isDefault && <span className="text-xs font-bold text-primary">(Default)</span>}</p>
                            <p>{address.street}</p>
                            <p>{address.city}, {address.zip}</p>
                       </div>
                       <div className="mt-4 pt-4 border-t border-slate-200 flex items-center gap-4 text-sm font-semibold">
                            {!address.isDefault && <button onClick={() => handleSetDefault(address.id)} className="text-primary hover:underline">Set as Default</button>}
                            <button onClick={() => { setEditingAddress(address); setIsFormVisible(true); }} className="text-slate-600 hover:text-primary">Edit</button>
                            <button onClick={() => handleDelete(address.id)} className="text-red-500 hover:underline">Delete</button>
                       </div>
                    </div>
                ))}
            </div>
            {!isFormVisible && <button onClick={() => { setEditingAddress(null); setIsFormVisible(true); }} className="mt-6 bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors">Add New Address</button>}
            
            {isFormVisible && (
                <div className="mt-6 bg-white p-6 rounded-xl border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">{editingAddress ? 'Edit Address' : 'Add New Address'}</h3>
                    <AddressForm 
                        address={editingAddress || emptyAddress} 
                        onSave={handleSaveAddress} 
                        onCancel={() => { setIsFormVisible(false); setEditingAddress(null); }} 
                    />
                </div>
            )}
        </Section>
    );
};

const AddressForm: React.FC<{ address: Omit<Address, 'id'> & {id?: number}, onSave: (address: Omit<Address, 'id'>) => void, onCancel: () => void}> = ({ address, onSave, onCancel }) => {
    const [formData, setFormData] = useState(address);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };
    
    return (
        <form onSubmit={(e) => { e.preventDefault(); onSave(formData); }} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="text-sm">Name</label><input name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full rounded-lg border-slate-300"/></div>
                <div><label className="text-sm">ZIP Code</label><input name="zip" value={formData.zip} onChange={handleChange} required className="mt-1 w-full rounded-lg border-slate-300"/></div>
            </div>
            <div><label className="text-sm">Street Address</label><input name="street" value={formData.street} onChange={handleChange} required className="mt-1 w-full rounded-lg border-slate-300"/></div>
            <div><label className="text-sm">City</label><input name="city" value={formData.city} onChange={handleChange} required className="mt-1 w-full rounded-lg border-slate-300"/></div>
            <div className="flex gap-4">
                <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-lg">Save</button>
                <button type="button" onClick={onCancel} className="bg-slate-100 font-bold py-2 px-6 rounded-lg">Cancel</button>
            </div>
        </form>
    );
};

export default ProfilePage;