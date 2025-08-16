
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const CheckoutPage: React.FC = () => {
  const { cart, cartTotal, clearCart } = useAppContext();
  const navigate = useNavigate();

  const handlePayNow = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment success
    alert('Successful Payment!');
    clearCart();
    navigate('/');
  };

  if (cart.length === 0) {
    // Redirect to home if cart is empty
    navigate('/');
    return null;
  }
  
  const shippingCost = 5.00;
  const taxCost = cartTotal * 0.08;
  const finalTotal = cartTotal + shippingCost + taxCost;

  return (
    <div className="lg:grid lg:grid-cols-2 lg:gap-x-12">
      {/* Left side: Forms */}
      <main className="px-4 pt-8 pb-16 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-primary mb-8">Checkout</h1>

        <form onSubmit={handlePayNow}>
          {/* Contact Information */}
          <section>
            <h2 className="text-lg font-medium text-primary">Contact information</h2>
            <div className="mt-4">
              <label htmlFor="email-address" className="block text-sm font-medium text-primary">Email address</label>
              <div className="mt-1">
                <input type="email" id="email-address" name="email-address" autoComplete="email" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm" required />
              </div>
            </div>
          </section>

          {/* Shipping Information */}
          <section className="mt-10">
            <h2 className="text-lg font-medium text-primary">Shipping information</h2>
            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <label htmlFor="first-name" className="block text-sm font-medium text-primary">First name</label>
                <input type="text" id="first-name" name="first-name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm" required />
              </div>
              <div>
                <label htmlFor="last-name" className="block text-sm font-medium text-primary">Last name</label>
                <input type="text" id="last-name" name="last-name" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm" required />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="address" className="block text-sm font-medium text-primary">Address</label>
                <input type="text" id="address" name="address" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm" required />
              </div>
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-primary">City</label>
                <input type="text" id="city" name="city" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm" required />
              </div>
              <div>
                <label htmlFor="postal-code" className="block text-sm font-medium text-primary">Postal code</label>
                <input type="text" id="postal-code" name="postal-code" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm" required />
              </div>
            </div>
          </section>

          {/* Payment */}
          <section className="mt-10 border-t border-light-border pt-10">
            <h2 className="text-lg font-medium text-primary">Payment</h2>
            <fieldset className="mt-4">
              <legend className="sr-only">Payment type</legend>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input id="credit-card" name="payment-type" type="radio" defaultChecked className="h-4 w-4 border-gray-300 text-accent focus:ring-accent" />
                  <label htmlFor="credit-card" className="ml-3 block text-sm font-medium text-primary">Credit card</label>
                </div>
              </div>
            </fieldset>

            <div className="mt-6 grid grid-cols-4 gap-y-6 gap-x-4">
              <div className="col-span-4">
                <label htmlFor="card-number" className="block text-sm font-medium text-primary">Card number</label>
                <input type="text" id="card-number" name="card-number" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm" required />
              </div>
              <div className="col-span-4">
                <label htmlFor="name-on-card" className="block text-sm font-medium text-primary">Name on card</label>
                <input type="text" id="name-on-card" name="name-on-card" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm" required />
              </div>
              <div className="col-span-3">
                <label htmlFor="expiration-date" className="block text-sm font-medium text-primary">Expiration date (MM/YY)</label>
                <input type="text" id="expiration-date" name="expiration-date" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm" required />
              </div>
              <div>
                <label htmlFor="cvc" className="block text-sm font-medium text-primary">CVC</label>
                <input type="text" id="cvc" name="cvc" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-accent focus:ring-accent sm:text-sm" required />
              </div>
            </div>
          </section>
          
          <div className="mt-10 pt-6 border-t border-light-border">
            <button type="submit" className="w-full bg-accent border border-transparent rounded-md shadow-sm py-3 px-4 text-base font-medium text-white hover:bg-accent-dark transition-colors">
                Pay now
            </button>
          </div>
        </form>
      </main>

      {/* Right side: Order Summary */}
      <aside className="hidden bg-surface px-4 pt-16 pb-24 sm:px-6 lg:block lg:px-8">
        <h2 className="text-lg font-medium text-primary">Order summary</h2>
        <ul className="divide-y divide-light-border mt-6">
          {cart.map(item => (
            <li key={`${item.id}-${item.size}-${item.color.name}`} className="flex space-x-6 py-6">
              <img src={item.images[0]} alt={item.name} className="h-24 w-24 flex-none rounded-md bg-gray-100 object-cover object-center" />
              <div className="flex flex-col justify-between space-y-4">
                <div className="space-y-1 text-sm font-medium">
                  <h3 className="text-primary">{item.name}</h3>
                  <p className="text-primary">${item.price.toFixed(2)}</p>
                  <p className="text-secondary">{item.color.name} / {item.size}</p>
                  <p className="text-secondary">Qty: {item.quantity}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <dl className="space-y-6 border-t border-light-border pt-6 text-sm font-medium text-secondary">
            <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="text-primary">${cartTotal.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
                <dt>Shipping</dt>
                <dd className="text-primary">${shippingCost.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
                <dt>Taxes</dt>
                <dd className="text-primary">${taxCost.toFixed(2)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-light-border pt-6 text-base text-primary">
                <dt>Total</dt>
                <dd>${finalTotal.toFixed(2)}</dd>
            </div>
        </dl>
      </aside>
    </div>
  );
};

export default CheckoutPage;