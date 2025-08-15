
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const SideCart: React.FC = () => {
  const { isCartOpen, closeCart, cart, cartTotal, cartCount, removeFromCart, updateQuantity } = useAppContext();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeCart}
      ></div>

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-xl transition-transform duration-300 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Your Bag ({cartCount})</h2>
            <button
              onClick={closeCart}
              className="p-2 text-gray-400 hover:text-gray-600"
              aria-label="Close cart"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Cart Items */}
          {cart.length > 0 ? (
            <div className="flex-1 overflow-y-auto p-6">
              <ul className="divide-y divide-gray-200 -my-6">
                {cart.map(item => (
                  <li key={`${item.id}-${item.size}-${item.color.name}`} className="flex py-6">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img src={item.images[0]} alt={item.name} className="h-full w-full object-cover object-center" />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3><Link to={`/product/${item.slug}`} onClick={closeCart}>{item.name}</Link></h3>
                          <p className="ml-4">₹{item.price}</p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">{item.color.name} / {item.size}</p>
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border border-gray-300 rounded">
                           <button onClick={() => updateQuantity(item.id, item.size, item.color.name, item.quantity - 1)} className="px-2 py-1 text-gray-600">-</button>
                           <span className="px-3 py-1">{item.quantity}</span>
                           <button onClick={() => updateQuantity(item.id, item.size, item.color.name, item.quantity + 1)} className="px-2 py-1 text-gray-600">+</button>
                        </div>
                        <div className="flex">
                          <button onClick={() => removeFromCart(item.id, item.size, item.color.name)} type="button" className="font-medium text-gray-600 hover:text-black">Remove</button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
              <p className="text-gray-500">Your bag is empty.</p>
            </div>
          )}
          
          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-between text-base font-medium text-gray-900">
                <p>Total</p>
                <p>₹{cartTotal.toFixed(2)}</p>
              </div>
              <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
              <div className="mt-6">
                <Link to="/cart" onClick={closeCart} className="w-full text-center block bg-gray-200 text-gray-800 px-6 py-3 rounded-md text-base font-medium hover:bg-gray-300">View cart</Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SideCart;