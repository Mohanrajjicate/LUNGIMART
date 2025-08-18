
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const CheckoutPage: React.FC = () => {
    const { 
        user, login, logout, cart, cartCount, cartTotal, 
        appliedCoupon, cartDiscount, cartFinalTotal,
        clearCart
    } = useAppContext();
    const navigate = useNavigate();
    
    const [activeStep, setActiveStep] = useState(user ? 2 : 1);
    
    const [email, setEmail] = useState(user?.email || '');
    const [address] = useState({
        name: user?.name || 'Suresh P.',
        street: "123, Weaver's Colony",
        city: 'Komarapalayam, Tamil Nadu',
        zip: '638183'
    });
    const [paymentMethod, setPaymentMethod] = useState('');

    useEffect(() => {
        // Redirect to cart page if it's empty, but not from the success step
        if (cart.length === 0 && activeStep !== 5) {
            navigate('/cart');
        }
    }, [cart, navigate, activeStep]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        login({ id: 1, name: 'Suresh P.', email: email });
        setActiveStep(2);
    };

    const handlePlaceOrder = () => {
        // In a real app, you would process the payment here
        clearCart();
        setActiveStep(5); // Go to success/confirmation step
    };

    // --- Success Screen --- //
    if (activeStep === 5) {
        return (
            <div className="bg-white rounded-xl shadow-md text-center py-20">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                 <h1 className="mt-4 text-3xl font-bold text-slate-900">Order Placed Successfully!</h1>
                 <p className="mt-2 text-slate-600">Thank you for shopping with LungiMart.in.</p>
                 <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/" className="bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors">Continue Shopping</Link>
                    <Link to="/profile" state={{ tab: 'orders' }} className="bg-slate-100 text-slate-800 font-bold py-3 px-6 rounded-lg hover:bg-slate-200 transition-colors">View Orders</Link>
                 </div>
            </div>
        )
    }
    
    // --- Price Details Sidebar --- //
    const PriceDetails = () => (
         <div className="bg-slate-50 rounded-xl shadow-sm p-6 sticky top-28">
            <h3 className="text-base font-bold uppercase text-slate-600 border-b border-slate-200 pb-3">Price Details</h3>
            <dl className="mt-4 space-y-3 text-sm">
                <div className="flex justify-between"><dt className="text-slate-600">Price ({cartCount} items)</dt><dd className="font-medium text-slate-800">₹{cartTotal.toFixed(2)}</dd></div>
                {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                        <dt>Discount ({appliedCoupon.code})</dt>
                        <dd className="font-medium">-₹{cartDiscount.toFixed(2)}</dd>
                    </div>
                )}
                <div className="flex justify-between"><dt className="text-slate-600">Delivery Charges</dt><dd className="font-medium text-green-600">FREE</dd></div>
                <div className="flex justify-between font-bold text-base border-t-2 border-dashed border-slate-300 pt-4 mt-4">
                    <dt>Total Payable</dt>
                    <dd>₹{cartFinalTotal.toFixed(2)}</dd>
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
                <div className="md:col-span-2 space-y-4">
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
                                <div className="border-2 border-primary bg-primary/5 rounded-lg p-4 relative">
                                    <p className="font-bold">{address.name}</p>
                                    <p className="text-slate-600">{address.street}</p>
                                    <p className="text-slate-600">{address.city} - {address.zip}</p>
                                </div>
                                <button type="button" onClick={() => setActiveStep(3)} className="mt-4 bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors">
                                    SAVE AND DELIVER HERE
                                </button>
                            </div>
                         )}
                        {activeStep > 2 && (
                            <div className="p-4 border-t border-slate-200 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-slate-800">{address.name}</p>
                                    <p className="text-sm text-slate-500">{address.street}, {address.city}</p>
                                </div>
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
                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                                        <input type="radio" name="payment" value="cod" onChange={e => setPaymentMethod(e.target.value)} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary/20" />
                                        <span className="ml-4 font-semibold">Cash on Delivery</span>
                                    </label>
                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                                        <input type="radio" name="payment" value="card" onChange={e => setPaymentMethod(e.target.value)} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary/20" />
                                        <span className="ml-4 font-semibold">Credit / Debit Card</span>
                                    </label>
                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-primary has-[:checked]:border-primary has-[:checked]:bg-primary/5 transition-all">
                                        <input type="radio" name="payment" value="upi" onChange={e => setPaymentMethod(e.target.value)} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary/20" />
                                        <span className="ml-4 font-semibold">UPI</span>
                                    </label>
                                </div>
                                {paymentMethod && (
                                    <button type="button" onClick={handlePlaceOrder} className="mt-6 w-full bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors">
                                        PLACE ORDER (Pay ₹{cartFinalTotal.toFixed(2)})
                                    </button>
                                )}
                            </div>
                         )}
                    </div>
                </div>

                <div className="md:col-span-1">
                    <PriceDetails />
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
