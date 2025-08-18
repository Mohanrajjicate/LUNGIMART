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

                <div className="p-6 max-h-[70vh] overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-800">Order Summary</h3>
                        <ul className="space-y-2 text-sm">
                            {order.items.map(item => (
                                <li key={item.id} className="flex justify-between">
                                    <span className="text-slate-600">{item.name} (x{item.quantity})</span>
                                    <span className="font-medium text-slate-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                                </li>
                            ))}
                        </ul>
                         <div className="font-bold text-lg flex justify-between border-t pt-2">
                             <span>Total</span>
                             <span>₹{order.total.toFixed(2)}</span>
                         </div>
                         <div className="flex flex-wrap items-center gap-3 pt-4">
                             <button onClick={() => setLabelVisible(true)} className="text-sm font-semibold py-2 px-4 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300">Generate Shipping Label</button>
                             <a href={`/#/invoice/${btoa(order.id)}`} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold py-2 px-4 rounded-lg bg-slate-200 text-slate-800 hover:bg-slate-300">View Invoice</a>
                        </div>
                    </div>
                    {/* Right Column */}
                    <div className="space-y-4">
                         <h3 className="font-semibold text-slate-800">Shipping & Tracking</h3>
                         {shippingAddress ? (
                            <address className="not-italic text-sm text-slate-600 bg-slate-50 p-3 rounded-md">
                                <strong>{shippingAddress.name}</strong><br />
                                {shippingAddress.street}<br />
                                {shippingAddress.city}, {shippingAddress.zip}
                            </address>
                         ) : <p className="text-sm text-red-500">No address found for this user.</p>}
                         
                         <div>
                            <label className="block text-sm font-medium text-slate-700">Tracking Provider</label>
                            <input type="text" value={trackingProvider} onChange={e => setTrackingProvider(e.target.value)} placeholder="e.g., Delhivery" className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1 text-sm" />
                         </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700">Tracking Number</label>
                            <input type="text" value={trackingNumber} onChange={e => setTrackingNumber(e.target.value)} placeholder="e.g., AWB123456789" className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1 text-sm" />
                         </div>
                    </div>
                </div>

                <div className="p-6 bg-slate-50 border-t flex flex-wrap justify-end items-center gap-4">
                    <button onClick={handleMarkAsShipped} disabled={!trackingProvider || !trackingNumber} className="bg-primary text-white font-bold py-2.5 px-6 rounded-lg hover:bg-primary-dark disabled:bg-slate-400 disabled:cursor-not-allowed">
                        Mark as Shipped
                    </button>
                </div>
            </div>
        </div>

        {isLabelVisible && shippingAddress && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setLabelVisible(false)}>
                 <div className="relative bg-white" onClick={e => e.stopPropagation()}>
                    <ShippingLabel order={order} shippingAddress={shippingAddress} />
                    <button onClick={() => window.print()} className="no-print absolute -bottom-12 right-0 bg-primary text-white font-bold py-2 px-4 rounded-lg">Print</button>
                 </div>
            </div>
        )}
        </>
    );
};

export default FulfillmentModal;