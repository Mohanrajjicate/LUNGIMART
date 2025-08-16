
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { getRelatedProducts } from '../services/mockData';
import ProductCard from '../components/ProductCard';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, cartTotal } = useAppContext();
  
  const relatedProducts = getRelatedProducts(cart[0]?.slug || 'classy-light-coat');

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <h1 className="mt-4 text-2xl font-bold text-primary">Your Cart is Empty</h1>
        <p className="mt-2 text-secondary">Looks like you haven't added anything to your cart yet.</p>
        <Link
          to="/"
          className="mt-6 inline-block bg-accent text-white font-semibold py-3 px-8 uppercase tracking-wider hover:bg-accent-dark transition-colors rounded-md"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-16">
      <div className="lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12">
        {/* Product List */}
        <section className="lg:col-span-8">
            <h1 className="text-3xl font-bold text-primary mb-6">Your Cart</h1>
            <ul className="divide-y divide-light-border border-t border-b border-light-border">
              {cart.map(item => (
                <li key={`${item.id}-${item.size}-${item.color.name}`} className="flex py-6">
                  <div className="flex-shrink-0">
                    <img src={item.images[0]} alt={item.name} className="h-28 w-28 rounded-md object-cover object-center"/>
                  </div>
                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div>
                      <h3 className="text-lg font-medium text-primary"><Link to={`/product/${item.slug}`}>{item.name}</Link></h3>
                      <p className="mt-1 text-sm text-secondary">{item.color.name} / {item.size}</p>
                    </div>
                    <div className="flex items-end justify-between">
                       <p className="text-lg font-semibold text-primary">${item.price.toFixed(2)}</p>
                       <div className="flex items-center border border-light-border rounded-md">
                          <button onClick={() => updateQuantity(item.id, item.size, item.color.name, item.quantity - 1)} className="px-3 py-1 text-lg text-secondary hover:bg-surface rounded-l-md">-</button>
                          <span className="px-4 py-1 font-semibold text-sm">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.size, item.color.name, item.quantity + 1)} className="px-3 py-1 text-lg text-secondary hover:bg-surface rounded-r-md">+</button>
                       </div>
                    </div>
                  </div>
                   <div className="ml-4">
                      <button onClick={() => removeFromCart(item.id, item.size, item.color.name)} className="text-gray-400 hover:text-gray-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/" className="text-sm font-medium text-secondary hover:text-primary mt-4 inline-block">&larr; Continue Shopping</Link>
        </section>

        {/* Order Review */}
        <section className="mt-16 rounded-lg bg-surface px-4 py-6 sm:p-6 lg:col-span-4 lg:mt-0 lg:p-8">
          <h2 className="text-lg font-medium text-primary">Order summary</h2>
          
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm text-secondary">
              <p>Subtotal</p>
              <p className="font-medium text-primary">${cartTotal.toFixed(2)}</p>
            </div>
            <div className="flex items-center justify-between mt-2 text-sm text-secondary">
              <p>Shipping</p>
              <p className="font-medium text-primary">$5.00</p>
            </div>
             <div className="flex items-center justify-between mt-2 text-sm text-secondary">
              <p>Estimated Taxes</p>
              <p className="font-medium text-primary">${(cartTotal * 0.08).toFixed(2)}</p>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-between border-t border-light-border pt-4 text-base font-medium text-primary">
            <p>Total</p>
            <p>${(cartTotal + 5 + (cartTotal * 0.08)).toFixed(2)}</p>
          </div>
          
          <div className="mt-6">
            <Link
              to="/checkout"
              className="w-full text-center bg-accent border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-accent-dark transition-colors"
            >
              Checkout
            </Link>
          </div>
        </section>
      </div>

      {/* You May Also Like */}
       {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-center text-primary mb-8">You may also like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default CartPage;