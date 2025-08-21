import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Address } from '../types';

declare var Razorpay: any;

// The user's provided Razorpay Key ID
const RAZORPAY_KEY_ID = 'rzp_test_R6kCJ5gvBdee0Y';

const CheckoutPage: React.FC = () => {
    const { 
        user, updateUser, cart, cartCount, cartTotal, 
        appliedCoupon, cartDiscount, cartFinalTotal,
        addOrder, clearCart
    } = useAppContext();
    const navigate = useNavigate();
    
    // State for address management
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
    const [newAddress, setNewAddress] = useState<Omit<Address, 'id' | 'isDefault'>>({ name: '', street: '', city: '', zip: '' });
    
    // State for success animation
    const [isOrderPlaced, setIsOrderPlaced] = useState(false);
    const [animationStep, setAnimationStep] = useState(0); // 0: packing, 1: shipping, 2: done
    const [showFinalSuccess, setShowFinalSuccess] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/profile', { state: { from: '/checkout' } });
            return;
        }
        if (cart.length === 0 && !isOrderPlaced) {
            navigate('/cart');
            return;
        }
        if (user && user.addresses?.length > 0) {
            const defaultAddress = user.addresses.find(a => a.isDefault) || user.addresses[0];
            setSelectedAddressId(defaultAddress?.id || null);
        } else {
            setIsAddingNewAddress(true);
        }
    }, [user, cart, isOrderPlaced, navigate]);
    
    useEffect(() => {
        if (isOrderPlaced) {
            const timer1 = setTimeout(() => setAnimationStep(1), 1500);
            const timer2 = setTimeout(() => setAnimationStep(2), 3000);
            const timer3 = setTimeout(() => setShowFinalSuccess(true), 4000);
            return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); };
        }
    }, [isOrderPlaced]);

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        if (user && newAddress.name && newAddress.street && newAddress.city && newAddress.zip) {
            const newId = Date.now();
            const addressToAdd: Address = { id: newId, ...newAddress, isDefault: user.addresses.length === 0 };
            const updatedUser = { ...user, addresses: [...user.addresses, addressToAdd] };
            await updateUser(updatedUser); // This now makes an API call
            setSelectedAddressId(newId);
            setIsAddingNewAddress(false);
            setNewAddress({ name: '', street: '', city: '', zip: '' });
        }
    };

    const processOrderCompletion = (address: Address) => {
        addOrder(cart, cartFinalTotal, address);
        // clearCart is now handled within the backend response for addOrder
        setIsOrderPlaced(true);
    };
    
    const finalTotalWithShipping = cartFinalTotal + 50;
    const selectedAddress = user?.addresses.find(a => a.id === selectedAddressId);

    const handlePlaceOrder = () => {
        if (!user || !selectedAddress) {
            alert('Please select a shipping address.');
            return;
        }

        const options = {
            key: RAZORPAY_KEY_ID, amount: Math.round(finalTotalWithShipping * 100), currency: "INR",
            name: "LungiMart.in", description: "Order Payment", image: "/favicon.svg",
            handler: () => processOrderCompletion(selectedAddress),
            prefill: { name: user.name, email: user.email, contact: user.phone },
            notes: { address: `${selectedAddress.street}, ${selectedAddress.city}` },
            theme: { color: "#2563EB" },
            modal: { ondismiss: () => console.log('Razorpay modal closed') }
        };

        try {
            const rzp = new Razorpay(options);
            rzp.on('payment.failed', (response: any) => {
                alert(`Payment Failed: ${response.error.description}`);
            });
            rzp.open();
        } catch (error) {
            alert("Payment gateway failed to load. Please try again.");
        }
    };
    
    if (!user || (cart.length === 0 && !isOrderPlaced)) {
        return <div className="text-center py-20">Loading...</div>;
    }
    
    if (isOrderPlaced) {
        const animationSteps = [
            { name: 'Packing', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>, statusText: "Packing your order..." },
            { name: 'Shipping', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h2a1 1 0 001-1V7a1 1 0 00-1-1h-2" /></svg>, statusText: "Shipping to your address..." },
            { name: 'Done', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>, statusText: "Order Placed Successfully!" }
        ];

        return (
            <div className="bg-white rounded-xl shadow-md text-center py-16 px-6">
                {!showFinalSuccess ? (
                     <div className="max-w-md mx-auto">
                        <div className="flex justify-between items-center relative mb-12">
                            {animationSteps.map((step, index) => (
                                <div key={index} className="flex flex-col items-center z-10">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-500 ${animationStep >= index ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
                                        {step.icon}
                                    </div>
                                </div>
                            ))}
                             <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 -translate-y-1/2">
                                <div className="h-full bg-primary transition-all duration-1000" style={{width: `${(animationStep / (animationSteps.length - 1)) * 100}%`}}></div>
                            </div>
                        </div>
                        <p className="text-xl font-semibold text-slate-800 animate-pulse">{animationSteps[animationStep].statusText}</p>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-20 w-20 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h1 className="mt-4 text-3xl font-bold text-slate-900">Thank You!</h1>
                        <p className="mt-2 text-slate-600">Your order has been placed successfully.</p>
                        <div className="mt-8 flex justify-center gap-4">
                            <button onClick={() => navigate('/profile', {state: {tab: 'orders'}})} className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">
                                View My Orders
                            </button>
                            <button onClick={() => navigate('/shop')} className="bg-slate-100 text-slate-800 font-bold py-3 px-6 rounded-lg hover:bg-slate-200 transition-colors">
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-md">
            <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Checkout</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
                
                {/* Left side - Shipping */}
                <div>
                    <h2 className="text-xl font-semibold text-slate-800 mb-4">Shipping Information</h2>
                    <div className="space-y-4">
                        {user.addresses.map(address => (
                             <div key={address.id} onClick={() => setSelectedAddressId(address.id)} className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAddressId === address.id ? 'border-primary ring-2 ring-primary/20 bg-primary/5' : 'border-slate-300 hover:border-primary/50'}`}>
                                <p className="font-semibold text-slate-800">{address.name} {address.isDefault && <span className="text-xs font-bold text-primary">(Default)</span>}</p>
                                <p className="text-sm text-slate-600">{address.street}, {address.city}, {address.zip}</p>
                            </div>
                        ))}
                         <button onClick={() => setIsAddingNewAddress(!isAddingNewAddress)} className="text-sm font-semibold text-primary hover:underline">
                            {isAddingNewAddress ? '- Cancel' : '+ Add a new address'}
                        </button>
                        {isAddingNewAddress && (
                            <form onSubmit={handleSaveAddress} className="space-y-4 p-4 bg-slate-50 rounded-lg border border-slate-200 animate-fade-in">
                                <input type="text" placeholder="Full Name" value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} required className="w-full rounded-lg border-slate-300" />
                                <input type="text" placeholder="Street Address" value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} required className="w-full rounded-lg border-slate-300" />
                                <input type="text" placeholder="City" value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} required className="w-full rounded-lg border-slate-300" />
                                <input type="text" placeholder="ZIP Code" value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} required className="w-full rounded-lg border-slate-300" />
                                <button type="submit" className="w-full bg-slate-800 text-white font-semibold py-2 rounded-lg hover:bg-slate-700">Save Address</button>
                            </form>
                        )}
                    </div>
                </div>
                
                {/* Right side - Order Summary */}
                <div className="lg:sticky lg:top-28 lg:self-start">
                    <div className="rounded-xl bg-slate-50 p-6">
                        <h2 className="text-xl font-semibold text-slate-800">Order Summary</h2>
                        <ul className="mt-6 divide-y divide-slate-200">
                        {cart.map(item => (
                            <li key={item.id} className="flex py-4">
                                <img src={item.images[0]} alt={item.name} className="h-20 w-20 flex-shrink-0 rounded-md object-cover" />
                                <div className="ml-4 flex flex-1 flex-col">
                                    <div>
                                        <h3 className="text-sm font-medium text-slate-800">{item.name}</h3>
                                        <p className="mt-1 text-sm text-slate-500">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="flex flex-1 items-end justify-between text-sm">
                                        <p className="text-slate-600">₹{item.price.toFixed(2)}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                        </ul>
                        <dl className="mt-6 space-y-4 border-t border-slate-200 pt-6 text-sm font-medium text-slate-600">
                             <div className="flex items-center justify-between">
                                <dt>Subtotal ({cartCount} items)</dt>
                                <dd className="text-slate-900">₹{cartTotal.toFixed(2)}</dd>
                            </div>
                            {appliedCoupon && (
                                <div className="flex items-center justify-between text-green-600">
                                    <dt>Discount ({appliedCoupon.code})</dt>
                                    <dd>-₹{cartDiscount.toFixed(2)}</dd>
                                </div>
                            )}
                             <div className="flex items-center justify-between">
                                <dt>Shipping</dt>
                                <dd className="text-slate-900">₹50.00</dd>
                            </div>
                            <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base text-slate-900">
                                <dt>Order total</dt>
                                <dd>₹{(finalTotalWithShipping).toFixed(2)}</dd>
                            </div>
                        </dl>
                        <div className="mt-8">
                            <button
                                onClick={handlePlaceOrder}
                                disabled={!selectedAddressId}
                                className="w-full bg-primary border border-transparent rounded-lg shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 focus:ring-primary transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
                            >
                                Place Order
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
