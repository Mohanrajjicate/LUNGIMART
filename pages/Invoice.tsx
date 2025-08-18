import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const InvoicePage: React.FC = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const { orders, user } = useAppContext();
    const navigate = useNavigate();

    const order = orders.find(o => o.id === orderId);

    const handlePrint = () => {
        window.print();
    };

    if (!order) {
        return (
            <div className="text-center py-20 bg-white rounded-xl shadow-md">
                <h1 className="text-2xl font-bold">Order not found</h1>
                <p className="mt-2 text-slate-600">The order you are looking for does not exist.</p>
                <button onClick={() => navigate(-1)} className="text-primary hover:underline mt-4 inline-block">
                    &larr; Go Back
                </button>
            </div>
        );
    }
    
    // Assume the default or first address is the shipping address for this order
    const shippingAddress = user?.addresses.find(a => a.isDefault) || user?.addresses[0];
    
    const subtotal = order.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const shippingCost = 50; // Fixed shipping cost
    const discount = subtotal - order.total;
    const grandTotal = order.total + shippingCost;


    return (
        <>
            {/* Print-specific styles */}
            <style>{`
                @media print {
                    body > #root > div {
                        /* Hide the main layout component */
                        & > header, & > main > *:not(#invoice-container), & > footer, & > nav {
                            display: none !important;
                        }
                    }
                    #invoice-container {
                        padding: 0 !important;
                    }
                    #invoice-section {
                        box-shadow: none !important;
                        border-radius: 0 !important;
                        border: none !important;
                        margin: 0 !important;
                        padding: 0 !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>
            <div id="invoice-container" className="max-w-4xl mx-auto">
                <div className="no-print flex justify-between items-center mb-6">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-primary font-semibold">
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        Back to Orders
                    </button>
                    <button onClick={handlePrint} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                        Print Invoice
                    </button>
                </div>

                <div id="invoice-section" className="bg-white p-8 rounded-xl shadow-md border border-slate-200">
                    {/* Header */}
                    <div className="flex justify-between items-start pb-6 border-b border-slate-200">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900">LungiMart.in</h1>
                            <p className="text-slate-500">123 Weaver's Colony, Komarapalayam, TN</p>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-bold uppercase text-slate-500 tracking-wider">Invoice</h2>
                            <p className="text-slate-600 mt-1"><strong>Order ID:</strong> {order.id}</p>
                            <p className="text-slate-600"><strong>Date:</strong> {new Date(order.date).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Billing Info */}
                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <div>
                            <h3 className="font-semibold text-slate-600">Bill To:</h3>
                            {shippingAddress ? (
                                <address className="not-italic text-slate-800">
                                    <strong>{shippingAddress.name}</strong><br/>
                                    {shippingAddress.street}<br/>
                                    {shippingAddress.city}, {shippingAddress.zip}
                                </address>
                            ) : (
                                <p className="text-slate-800">{user?.name}<br/>{user?.email}</p>
                            )}
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="mt-8">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-slate-50 text-sm font-semibold text-slate-600 uppercase">
                                    <th className="p-3">Product</th>
                                    <th className="p-3 text-center">Qty</th>
                                    <th className="p-3 text-right">Unit Price</th>
                                    <th className="p-3 text-right">Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map(item => (
                                    <tr key={item.id} className="border-b border-slate-100">
                                        <td className="p-3 font-medium text-slate-800">{item.name}</td>
                                        <td className="p-3 text-center text-slate-600">{item.quantity}</td>
                                        <td className="p-3 text-right text-slate-600">₹{item.price.toFixed(2)}</td>
                                        <td className="p-3 text-right font-medium text-slate-800">₹{(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Totals Section */}
                    <div className="mt-8 flex justify-end">
                        <div className="w-full max-w-xs">
                            <dl className="space-y-3 text-sm">
                                <div className="flex justify-between"><dt className="text-slate-600">Subtotal</dt><dd className="font-medium text-slate-800">₹{subtotal.toFixed(2)}</dd></div>
                                {discount > 0 && <div className="flex justify-between text-green-600"><dt>Discount</dt><dd className="font-medium">-₹{discount.toFixed(2)}</dd></div>}
                                <div className="flex justify-between"><dt className="text-slate-600">Shipping</dt><dd className="font-medium text-slate-800">₹{shippingCost.toFixed(2)}</dd></div>
                                <div className="flex justify-between font-bold text-base border-t-2 border-slate-300 pt-3 mt-3"><dt>Grand Total</dt><dd>₹{grandTotal.toFixed(2)}</dd></div>
                            </dl>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-12 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
                        <p>Thank you for your purchase!</p>
                        <p>If you have any questions, please contact us at contact@lungimart.in.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default InvoicePage;
