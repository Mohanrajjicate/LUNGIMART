
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount, appliedCoupon, applyCoupon, removeCoupon, cartDiscount, cartFinalTotal } = useAppContext();
  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState({ text: '', isError: false });


  if (cart.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-xl shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h1 className="mt-4 text-2xl font-bold text-slate-900">Your Cart is Empty</h1>
        <p className="mt-2 text-slate-600">Looks like you haven't added anything to your cart yet.</p>
        <Link
          to="/shop"
          className="mt-6 inline-block bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }
  
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const result = applyCoupon(couponCode);
    setCouponMessage({ text: result.message, isError: !result.success });
    if (result.success) {
        setCouponCode('');
    }
    setTimeout(() => setCouponMessage({ text: '', isError: false }), 4000);
  };

  const handleRemoveCoupon = () => {
      removeCoupon();
      setCouponMessage({ text: 'Coupon removed.', isError: false });
      setTimeout(() => setCouponMessage({ text: '', isError: false }), 4000);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  }

  return (
    <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-md">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 text-center">Shopping Cart</h1>
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        <section className="lg:col-span-7">
          <ul className="divide-y divide-slate-200">
            {cart.map(item => (
              <li key={item.id} className="flex py-6">
                <div className="flex-shrink-0">
                  <img src={item.images[0]} alt={item.name} className="h-24 w-24 rounded-lg object-cover sm:h-32 sm:w-32"/>
                </div>
                <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                  <div>
                    <div className="flex justify-between">
                      <h3 className="text-base font-medium text-slate-800"><Link to={`/product/${item.slug}`}>{item.name}</Link></h3>
                       <p className="ml-4 text-base font-medium text-slate-900">₹{item.price.toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-slate-500">{item.category.name}</p>
                  </div>
                   <div className="flex flex-1 items-end justify-between text-sm">
                      <div className="flex items-center border border-slate-300 rounded-lg w-fit">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-lg text-slate-600 hover:bg-slate-100 rounded-l-lg">-</button>
                          <span className="px-4 py-1 font-semibold text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-lg text-slate-600 hover:bg-slate-100 rounded-r-lg">+</button>
                      </div>
                      <div className="flex">
                        <button onClick={() => removeFromCart(item.id)} type="button" className="font-medium text-primary hover:text-primary-dark">
                          Remove
                        </button>
                      </div>
                   </div>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Order summary */}
        <section className="mt-16 rounded-xl bg-slate-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 sticky top-28">
          <h2 className="text-lg font-medium text-slate-900">Order summary</h2>
          <dl className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <dt className="text-sm text-slate-600">Subtotal ({cartCount} items)</dt>
              <dd className="text-sm font-medium text-slate-900">₹{cartTotal.toFixed(2)}</dd>
            </div>
            {appliedCoupon && (
                <div className="flex items-center justify-between text-green-600">
                    <dt className="text-sm flex items-center gap-2">
                        <span>Discount</span>
                        <span className="font-bold bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">{appliedCoupon.code}</span>
                    </dt>
                    <dd className="text-sm font-medium">-₹{cartDiscount.toFixed(2)}</dd>
                </div>
            )}
            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <dt className="flex items-center text-sm text-slate-600"><span>Shipping</span></dt>
              <dd className="text-sm font-medium text-slate-900">₹50.00</dd>
            </div>
             <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <dt className="text-base font-medium text-slate-900">Order total</dt>
              <dd className="text-base font-medium text-slate-900">₹{(cartFinalTotal + 50).toFixed(2)}</dd>
            </div>
          </dl>
          
          <div className="mt-6 border-t border-slate-200 pt-6">
            {!appliedCoupon ? (
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <label htmlFor="coupon" className="text-sm font-medium text-slate-700">Have a coupon?</label>
                    <div className="flex gap-2">
                        <input
                            id="coupon"
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                            placeholder="Enter coupon code"
                            className="block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1 text-sm"
                        />
                        <button type="submit" className="bg-slate-800 text-white font-semibold text-sm px-4 rounded-lg hover:bg-slate-700 transition-colors">Apply</button>
                    </div>
                </form>
            ) : (
                <div className="text-center">
                    <p className="text-sm text-green-700 font-semibold">Coupon applied successfully!</p>
                     <button onClick={handleRemoveCoupon} className="text-xs text-slate-500 hover:text-red-500 hover:underline mt-1">Remove Coupon</button>
                </div>
            )}
             {couponMessage.text && (
                <p className={`mt-2 text-xs text-center ${couponMessage.isError ? 'text-red-500' : 'text-green-600'}`}>{couponMessage.text}</p>
            )}
          </div>

          <div className="mt-6">
            <button
              onClick={handleCheckout}
              className="w-full bg-primary border border-transparent rounded-lg shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 focus:ring-primary transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CartPage;
