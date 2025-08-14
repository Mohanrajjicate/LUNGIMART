import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal, cartCount } = useAppContext();

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <h1 className="mt-4 text-2xl font-bold text-secondary">Your Cart is Empty</h1>
        <p className="mt-2 text-secondary-light">Looks like you haven't added anything to your cart yet.</p>
        <Link
          to="/shop"
          className="mt-6 inline-block bg-primary text-white font-bold py-3 px-8 rounded-md hover:bg-primary-dark transition-transform hover:scale-105"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  const handleCheckout = () => {
    alert("Animated payment process would start here! For now, thank you for your order.");
    // In a real app, this would navigate to a checkout page or open a payment modal.
  }

  return (
    <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
      <section className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-secondary mb-6">Shopping Cart ({cartCount})</h1>
        <ul className="divide-y divide-gray-200">
          {cart.map(item => (
            <li key={item.id} className="flex py-6">
              <div className="flex-shrink-0">
                <img src={item.images[0]} alt={item.name} className="h-24 w-24 rounded-md object-cover object-center sm:h-32 sm:w-32"/>
              </div>
              <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                  <div>
                    <h3 className="text-base font-medium text-secondary"><Link to={`/product/${item.slug}`}>{item.name}</Link></h3>
                    <p className="mt-1 text-sm font-medium text-secondary">₹{item.price}</p>
                  </div>
                  <div className="mt-4 sm:mt-0 sm:pr-9">
                    <div className="flex items-center border border-gray-300 rounded-md w-fit">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 rounded-l-md">-</button>
                        <span className="px-4 py-1 font-semibold text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-lg text-gray-600 hover:bg-gray-100 rounded-r-md">+</button>
                    </div>
                    <div className="absolute top-0 right-0">
                      <button onClick={() => removeFromCart(item.id)} className="-m-2 inline-flex p-2 text-gray-400 hover:text-gray-500">
                        <span className="sr-only">Remove</span>
                        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Order summary */}
      <section className="mt-16 rounded-lg bg-white px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 shadow-sm sticky top-24">
        <h2 className="text-lg font-medium text-secondary">Order summary</h2>
        <dl className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-secondary-light">Subtotal</dt>
            <dd className="text-sm font-medium text-secondary">₹{cartTotal.toFixed(2)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <dt className="flex items-center text-sm text-secondary-light"><span>Shipping</span></dt>
            <dd className="text-sm font-medium text-secondary">₹50.00</dd>
          </div>
           <div className="flex items-center justify-between border-t border-gray-200 pt-4">
            <dt className="text-base font-medium text-secondary">Order total</dt>
            <dd className="text-base font-medium text-secondary">₹{(cartTotal + 50).toFixed(2)}</dd>
          </div>
        </dl>
        <div className="mt-6">
          <button
            onClick={handleCheckout}
            className="w-full bg-primary border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-primary transition-transform hover:scale-105"
          >
            Proceed to Checkout
          </button>
        </div>
      </section>
    </div>
  );
};

export default CartPage;