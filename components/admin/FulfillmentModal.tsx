import React, { useState } from 'react';
import { Order, User } from '../../types';
import { useAppContext } from '../../contexts/AppContext';
import ShippingLabel from './ShippingLabel';

interface FulfillmentModalProps {
    order: Order;
    customer: User;
    onClose: () => void;
}

const FulfillmentModal: React.FC<FulfillmentModalProps> = ({ order, customer, onClose }) => {
    const { fulfillOrder } = useAppContext();
    const [isLabelVisible, setLabelVisible] = useState(false);
    const [trackingProvider, setTrackingProvider] = useState('');
    const [trackingNumber, setTrackingNumber] = useState('');

    const handleMarkAsShipped = () => {
        if (!trackingProvider || !trackingNumber) {
            alert('Please provide both a tracking provider and a tracking number.');
            return;
        }
        fulfillOrder(order.id, trackingProvider, trackingNumber);
        onClose();
    };
    
    const shippingAddress = customer.addresses.find(a => a.isDefault) || customer.addresses[0];

    return (
        <>
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-3xl bg-white rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-slate-900">Fulfill Order #{order.id}</h2>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-800" aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                
                {!isLabelVisible ? (
                    <div className="p-6">
                        {/* Order Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="font-semibold text-slate-800 mb-2">Shipping To</h3>
                                {shippingAddress ? (
                                    <address className="not-italic text-sm text-slate-600">
                                        <strong>{shippingAddress.name}</strong><br />
                                        {shippingAddress.street}<br />
                                        {shippingAddress.city}, {shippingAddress.zip}
                                    </address>
                                ) : <p className="text-sm text-red-500">No address found for this customer.</p>}
                            </div>
                             <div>
                                <h3 className="font-semibold text-slate-800 mb-2">Order Summary</h3>
                                <ul className="text-sm text-slate-600">
                                    {order.items.map(item => (
                                        <li key={item.id} className="flex justify-between">
                                            <span>{item.name} x {item.quantity}</span>
                                            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="font-bold text-right mt-2 text-slate-800">Total: ₹{order.total.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Fulfillment Form */}
                        <div className="mt-6 border-t pt-6">
                            <h3 className="font-semibold text-slate-800 mb-4">Shipping Details</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Tracking Provider</label>
                                    <input 
                                        type="text"
                                        value={trackingProvider}
                                        onChange={e => setTrackingProvider(e.target.value)}
                                        placeholder="e.g., Delhivery"
                                        className="mt-1 block w-full rounded-lg border-slate-300" 
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700">Tracking Number</label>
                                    <input 
                                        type="text"
                                        value={trackingNumber}
                                        onChange={e => setTrackingNumber(e.target.value)}
                                        placeholder="e.g., AWB12345678"
                                        className="mt-1 block w-full rounded-lg border-slate-300" 
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end gap-4">
                            <button onClick={() => setLabelVisible(true)} disabled={!shippingAddress} className="bg-slate-100 text-slate-800 font-bold py-2 px-6 rounded-lg hover:bg-slate-200 disabled:opacity-50">
                                View Shipping Label
                            </button>
                            <button onClick={handleMarkAsShipped} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark">
                                Mark as Shipped
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="p-6">
                         {shippingAddress ? <ShippingLabel order={order} shippingAddress={shippingAddress} /> : <p>No address available to generate label.</p>}
                         <div className="mt-4 flex justify-between no-print">
                             <button onClick={() => setLabelVisible(false)} className="text-sm font-semibold text-primary hover:underline">&larr; Back to Details</button>
                             <button onClick={() => window.print()} className="bg-slate-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-slate-600">
                                 Print Label
                             </button>
                         </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
};

export default FulfillmentModal;