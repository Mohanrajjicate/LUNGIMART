
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { mockUsers } from '../services/mockData';
import { Address } from '../types';

declare var Razorpay: any;

// The user's provided Razorpay Key ID
const RAZORPAY_KEY_ID = 'rzp_test_R6kCJ5gvBdee0Y';

const CheckoutPage: React.FC = () => {
    const { 
        user, login, logout, cart, cartCount, cartTotal, 
        appliedCoupon, cartDiscount, cartFinalTotal,
        addOrder,
        clearCart
    } = useAppContext();
    const navigate = useNavigate();
    
    const [activeStep, setActiveStep] = useState(user ? 2 : 1);
    
    const [email, setEmail] = useState(user?.email || '');

    // State for address management
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
    const [newAddress, setNewAddress] = useState<Omit<Address, 'id' | 'isDefault'>>({ name: '', street: '', city: '', zip: '' });
    const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
    
    // State for success animation
    const [animationStep, setAnimationStep] = useState(0); // 0: packing, 1: shipping, 2: done
    const [showFinalSuccess, setShowFinalSuccess] = useState(false);
    
    // Set default selected address on load or user change
    useEffect(() => {
        if (user && user.addresses?.length > 0) {
            const defaultAddress = user.addresses.find(a => a.isDefault) || user.addresses[0];
            if (defaultAddress) {
                setSelectedAddressId(defaultAddress.id);
            }
        }
    }, [user]);

    useEffect(() => {
        // Redirect to cart page if it's empty, but not from the success step
        if (cart.length === 0 && activeStep !== 5) {
            navigate('/cart');
        }
    }, [cart, navigate, activeStep]);

    // Handle success page animation
    useEffect(() => {
        if (activeStep === 5) {
            const timer1 = setTimeout(() => setAnimationStep(1), 1500);
            const timer2 = setTimeout(() => setAnimationStep(2), 3000);
            const timer3 = setTimeout(() => setShowFinalSuccess(true), 4000);

            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
                clearTimeout(timer3);
            };
        }
    }, [activeStep]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login({ ...mockUsers[0], email: email });
        setActiveStep(2);
    };

    const handleSaveAddress = (e: React.FormEvent) => {
        e.preventDefault();
        if (user && newAddress.name && newAddress.street && newAddress.city && newAddress.zip) {
            const newId = Date.now();
            const addressToAdd: Address = { id: newId, ...newAddress };
            const updatedUser = {
                ...user,
                addresses: [...user.addresses, addressToAdd],
            };
            login(updatedUser); // Update user in context
            setSelectedAddressId(newId);
            setIsAddingNewAddress(false);
            setNewAddress({ name: '', street: '', city: '', zip: '' });
        }
    };

    const processOrderCompletion = () => {
        addOrder(cart, cartFinalTotal);
        clearCart();
        setActiveStep(5); // Go to success/confirmation step
    };
    
    const finalTotalWithShipping = cartFinalTotal + 50;

    const handlePlaceOrder = () => {
        if (!user || !selectedAddress) {
            alert('Please make sure you are logged in and have selected an address.');
            return;
        }

        const options = {
            key: RAZORPAY_KEY_ID,
            amount: Math.round(finalTotalWithShipping * 100), // amount in the smallest currency unit (paise)
            currency: "INR",
            name: "LungiMart.in",
            description: "Order Payment",
            image: "/favicon.svg",
            handler: function (response: any) {
                console.log('Payment successful:', response.razorpay_payment_id);
                // In a real app, you'd verify this on your backend. For now, we'll proceed.
                processOrderCompletion();
            },
            prefill: {
                name: user.name,
                email: user.email,
                contact: "9876543210" // Example contact
            },
            notes: {
                address: `${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.zip}`,
                order_id: `LM-ORDER-${Date.now()}`
            },
            theme: {
                color: "#2563EB" // Primary color
            },
            modal: {
                ondismiss: function() {
                    console.log('Razorpay modal closed');
                }
            }
        };

        try {
            const rzp = new Razorpay(options);
            
            rzp.on('payment.failed', function (response: any) {
                console.error('Payment Failed:', response.error);
                alert(`Payment Failed: ${response.error.description}\nCode: ${response.error.code}\nReason: ${response.error.reason}`);
            });

            rzp.open();
        } catch (error) {
            console.error("Error initializing Razorpay", error);
            alert("Could not load payment gateway. Please try again later.");
        }
    };

    const selectedAddress = user?.addresses.find(a => a.id === selectedAddressId);

    // --- Success Screen --- //
    if (activeStep === 5) {
        const animationSteps = [
            {
                name: 'Packing',
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
                statusText: "Packing your order..."
            },
            {
                name: 'Shipping',
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h2a1 1 0 001-1V7a1 1 0 00-1-1h-2" /></svg>,
                statusText: "Shipping to your address..."
            },
            {
                name: 'Done',
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                statusText: "Order Placed Successfully!"
            }
        ];

        return (
            <div className="bg-white rounded-xl shadow-md text-center py-12 px-4 sm:px-8 transition-all duration-500">
                {!showFinalSuccess ? (
                    <div className="max-w-md mx-auto">
                        <div className="flex justify-between items-start relative mb-4">
                            <div className="absolute top-6 left-0 w-full h-1 bg-slate-200 -z-10">
                                <div 
                                    className="h-full bg-primary transition-all duration-1000 ease-in-out"
                                    style={{ width: `${animationStep * 50}%` }}
                                />
                            </div>
                            {animationSteps.map((step, index) => (
                                <div key={step.name} className="flex flex-col items-center w-20 text-center z-10">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${animationStep >= index ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
                                        {animationStep > index ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            step.icon
                                        )}
                                    </div>
                                    <p className={`mt-2 text-xs sm:text-sm font-semibold transition-colors ${animationStep >= index ? 'text-primary' : 'text-slate-500'}`}>{step.name}</p>
                                </div>
                            ))}
                        </div>
                        <div className="mt-8 min-h-[2.5rem]">
                            <h2 className="text-xl font-bold text-slate-800">
                                {animationSteps[animationStep]?.statusText}
                            </h2>
                        </div>
                    </div>
                ) : (
                    <div className="animate-fade-in">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <h1 className="mt-4 text-3xl font-bold text-slate-900">Order Placed Successfully!</h1>
                        <p className="mt-2 text-slate-600">Thank you for shopping with LungiMart.in.</p>
                        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to="/" className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">Continue Shopping</Link>
                            <Link to="/profile" state={{ tab: 'orders' }} className="bg-slate-100 text-slate-800 font-bold py-3 px-6 rounded-lg hover:bg-slate-200 transition-colors">View Orders</Link>
                        </div>
                    </div>
                )}
            </div>
        )
    }
    
    // --- Price Details Sidebar --- //
    const PriceDetails = () => (
         <div className="bg-slate-50 rounded-xl shadow-sm p-6 md:sticky md:top-28">
            <h3 className="text-base font-bold uppercase text-slate-600 border-b border-slate-200 pb-3">Price Details</h3>
            <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-slate-600">Price ({cartCount} items)</dt><dd className="font-medium text-slate-800">₹{cartTotal.toFixed(2)}</dd></div>
                {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                        <dt>Discount ({appliedCoupon.code})</dt>
                        <dd className="font-medium">-₹{cartDiscount.toFixed(2)}</dd>
                    </div>
                )}
                <div className="flex justify-between"><dt className="text-slate-600">Delivery Charges</dt><dd className="font-medium text-slate-800">₹50.00</dd></div>
                <div className="flex justify-between font-bold text-base border-t-2 border-dashed border-slate-300 pt-4 mt-4">
                    <dt>Total Payable</dt>
                    <dd>₹{finalTotalWithShipping.toFixed(2)}</dd>
                </div>
            </dl>
         </div>
    );

    const StepHeader = ({ step, title }: { step: number, title: string}) => {
        const isActive = activeStep === step;
        const isDone = activeStep > step;
        return (
             <div className={`flex items-center p-4 text-lg font-semibold rounded-t-xl
                ${isActive ? 'bg-primary text-white' : ''}
                ${isDone ? 'bg-slate-50' : ''}
                ${!isActive && !isDone ? 'bg-slate-100 text-slate-400' : ''}
            `}>
                <span className={`w-8 h-8 flex items-center justify-center rounded-md mr-4 text-base font-bold
                    ${isActive ? 'bg-white/20 text-white' : 'bg-slate-300 text-slate-700'}
                    ${isDone ? 'bg-green-100 text-green-700' : ''}
                `}>{isDone ? '✓' : step}</span>
                <h2 className="uppercase tracking-wide">{title}</h2>
            </div>
        )
    };
    
    return (
        <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
                <div className="md:col-span-1 md:order-2">
                    <PriceDetails />
                </div>
                <div className="md:col-span-2 space-y-4 md:order-1">
                    {/* --- Step 1: Login --- */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <StepHeader step={1} title="Login or Signup" />
                         {activeStep === 1 && (
                            <div className="p-6 border-t border-slate-200">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                                    <form onSubmit={handleLogin} className="space-y-4">
                                        <div>
                                            <input type="email" placeholder="Enter Email" value={email} onChange={e => setEmail(e.target.value)} required className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1" />
                                        </div>
                                        <p className="text-xs text-slate-500">By continuing, you agree to LungiMart's <a href="#" className="text-primary font-semibold">Terms of Use</a> and <a href="#" className="text-primary font-semibold">Privacy Policy</a>.</p>
                                        <button type="submit" className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                                            CONTINUE
                                        </button>
                                    </form>
                                    <div className="text-sm text-slate-600">
                                        <p className="font-semibold mb-2">Advantages of our secure login</p>
                                        <ul className="space-y-2 list-none">
                                            <li className="flex items-center gap-2"><svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" /><path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v5.05a2.5 2.5 0 014.9 0H19a1 1 0 001-1V8a1 1 0 00-1-1h-5z" /></svg> Easily Track Orders</li>
                                            <li className="flex items-center gap-2"><svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 12.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" /></svg> Get Relevant Alerts</li>
                                            <li className="flex items-center gap-2"><svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> Wishlist & Reviews</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                         )}
                         {activeStep > 1 && (
                            <div className="p-4 border-t border-slate-200 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-slate-800">{user?.name}</p>
                                    <p className="text-sm text-slate-500">{user?.email}</p>
                                </div>
                                <button onClick={() => { logout(); setActiveStep(1); }} className="font-semibold text-primary text-sm hover:underline">Change</button>
                            </div>
                        )}
                    </div>

                    {/* --- Step 2: Delivery Address --- */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <StepHeader step={2} title="Delivery Address" />
                         {activeStep === 2 && (
                            <div className="p-6 border-t border-slate-200">
                                {!isAddingNewAddress ? (
                                    <div className="space-y-4">
                                        {user?.addresses.map(address => (
                                            <label key={address.id} className={`flex items-start p-4 border rounded-lg cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all ${selectedAddressId === address.id ? 'border-primary bg-primary/5' : 'border-slate-200'}`}>
                                                <input 
                                                    type="radio" 
                                                    name="address" 
                                                    value={address.id} 
                                                    checked={selectedAddressId === address.id} 
                                                    onChange={() => setSelectedAddressId(address.id)} 
                                                    className="h-5 w-5 mt-1 text-primary border-gray-300 focus:ring-primary/20"
                                                />
                                                <div className="ml-4 text-sm">
                                                    <p className="font-bold text-slate-800">{address.name}</p>
                                                    <p className="text-slate-600">{address.street}, {address.city} - {address.zip}</p>
                                                </div>
                                            </label>
                                        ))}
                                        <button 
                                            onClick={() => setIsAddingNewAddress(true)}
                                            className="text-primary font-bold hover:underline mt-4 text-sm"
                                        >
                                            + Add a new address
                                        </button>
                                        <div className="mt-6">
                                            <button 
                                                type="button" 
                                                onClick={() => setActiveStep(3)} 
                                                disabled={!selectedAddressId}
                                                className="bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-slate-300"
                                            >
                                                DELIVER HERE
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSaveAddress} className="space-y-4">
                                        <h3 className="font-semibold text-lg text-slate-800">Add a new address</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-slate-700">Name</label>
                                                <input value={newAddress.name} onChange={e => setNewAddress({...newAddress, name: e.target.value})} required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"/>
                                            </div>
                                             <div>
                                                <label className="text-sm font-medium text-slate-700">ZIP Code</label>
                                                <input value={newAddress.zip} onChange={e => setNewAddress({...newAddress, zip: e.target.value})} required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"/>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-700">Street Address</label>
                                            <input value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"/>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium text-slate-700">City</label>
                                            <input value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"/>
                                        </div>
                                        <div className="flex gap-4 pt-2">
                                            <button type="submit" className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">SAVE ADDRESS</button>
                                            <button type="button" onClick={() => setIsAddingNewAddress(false)} className="bg-slate-100 text-slate-800 font-bold py-3 px-6 rounded-lg hover:bg-slate-200 transition-colors">CANCEL</button>
                                        </div>
                                    </form>
                                )}
                            </div>
                         )}
                        {activeStep > 2 && (
                            <div className="p-4 border-t border-slate-200 flex justify-between items-center">
                                {selectedAddress ? (
                                    <div>
                                        <p className="font-semibold text-slate-800">{selectedAddress.name}</p>
                                        <p className="text-sm text-slate-500">{selectedAddress.street}, {selectedAddress.city}</p>
                                    </div>
                                ) : <p>No address selected.</p>}
                                <button onClick={() => setActiveStep(2)} className="font-semibold text-primary text-sm hover:underline">Change</button>
                            </div>
                        )}
                    </div>

                    {/* --- Step 3: Order Summary --- */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <StepHeader step={3} title="Order Summary" />
                         {activeStep === 3 && (
                            <div className="p-6 border-t border-slate-200">
                                <ul className="space-y-4">
                                    {cart.map(item => (
                                        <li key={item.id} className="flex">
                                            <img src={item.images[0]} alt={item.name} className="h-20 w-20 rounded-md object-cover"/>
                                            <div className="ml-4">
                                                <h3 className="font-medium text-slate-800">{item.name}</h3>
                                                <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                                                <p className="text-sm font-semibold">₹{item.price.toFixed(2)}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <button type="button" onClick={() => setActiveStep(4)} className="mt-6 bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors">
                                    CONTINUE
                                </button>
                            </div>
                         )}
                    </div>

                    {/* --- Step 4: Payment Options --- */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <StepHeader step={4} title="Payment Options" />
                         {activeStep === 4 && (
                            <div className="p-6 border-t border-slate-200">
                                <div className="space-y-4">
                                    {/* Disabled Cash on Delivery Option */}
                                    <div className="p-4 border border-slate-200 rounded-lg bg-slate-50 opacity-70">
                                        <label className="flex items-center cursor-not-allowed">
                                            <input 
                                                type="radio" 
                                                name="payment" 
                                                value="cod" 
                                                disabled 
                                                className="h-4 w-4 text-slate-400 border-slate-300 focus:ring-slate-400" 
                                            />
                                            <div className="ml-4">
                                                <span className="font-semibold text-slate-500">Cash on Delivery</span>
                                                <p className="text-xs text-slate-400">Not available for this order</p>
                                            </div>
                                        </label>
                                    </div>
                                    
                                    {/* Razorpay Option */}
                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                                        <input 
                                            type="radio" 
                                            name="payment" 
                                            value="razorpay" 
                                            onChange={e => setPaymentMethod(e.target.value)}
                                            checked={paymentMethod === 'razorpay'}
                                            className="h-4 w-4 text-primary border-gray-300 focus:ring-primary/20" 
                                        />
                                        <div className="ml-4">
                                            <span className="font-semibold text-slate-800">Razorpay</span>
                                            <p className="text-xs text-slate-500">Cards, UPI, Netbanking & more</p>
                                        </div>
                                    </label>
                                </div>
                                {paymentMethod === 'razorpay' && (
                                    <button 
                                        type="button" 
                                        onClick={handlePlaceOrder} 
                                        className="mt-6 w-full bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors"
                                    >
                                        PLACE ORDER (Pay ₹{finalTotalWithShipping.toFixed(2)})
                                    </button>
                                )}
                            </div>
                         )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
