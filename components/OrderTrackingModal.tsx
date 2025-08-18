import React from 'react';
import { Order } from '../types';

interface OrderTrackingModalProps {
    order: Order;
    onClose: () => void;
}

const getTrackingLink = (provider?: string, number?: string) => {
    if (!provider || !number) return '#';
    const p = provider.toLowerCase();
    if (p.includes('delhivery')) return `https://www.delhivery.com/track/package/${number}`;
    if (p.includes('blue dart')) return `https://www.bluedart.com/tracking?go=go&trackwno=${number}`;
    if (p.includes('ecom express')) return `https://ecomexpress.in/tracking/?awb_field=${number}`;
    return '#';
};

const TrackingStep: React.FC<{ title: string, date?: string, isCompleted: boolean, isCurrent: boolean, isFirst?: boolean, isLast?: boolean }> = ({ title, date, isCompleted, isCurrent, isFirst, isLast }) => {
    const circleClass = isCompleted ? 'bg-primary border-primary' : 'bg-white border-slate-300';
    const textClass = isCompleted ? 'text-slate-800' : 'text-slate-400';
    const dateClass = isCompleted ? 'text-primary' : 'text-slate-400';

    return (
        <li className="relative flex items-start gap-4">
            {!isFirst && <div className={`absolute left-[11px] top-0 w-0.5 h-6 -translate-y-full ${isCompleted || isCurrent ? 'bg-primary' : 'bg-slate-300'}`}></div>}
            <div className="flex-shrink-0 z-10">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${circleClass}`}>
                    {isCompleted && !isCurrent && <div className="w-2 h-2 bg-white rounded-full"></div>}
                    {isCurrent && <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>}
                </div>
            </div>
            <div className={`-mt-1 ${textClass}`}>
                <p className="font-semibold">{title}</p>
                {isCompleted && <p className={`text-xs font-medium ${dateClass}`}>{date || 'Status updated'}</p>}
            </div>
        </li>
    );
};


const OrderTrackingModal: React.FC<OrderTrackingModalProps> = ({ order, onClose }) => {
    const statuses: Order['status'][] = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered'];
    const currentStatusIndex = statuses.indexOf(order.status);

    const trackingLink = getTrackingLink(order.trackingProvider, order.trackingNumber);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden animate-fade-in" onClick={e => e.stopPropagation()}>
                <div className="p-6 border-b flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Track Shipment</h2>
                        <p className="text-sm text-slate-500">Order ID: {order.id}</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-800" aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <p className="text-sm text-slate-600">
                            Tracking via <span className="font-bold text-slate-800">{order.trackingProvider || 'N/A'}</span>
                        </p>
                        <p className="text-lg font-mono text-primary">{order.trackingNumber || 'Not available yet'}</p>
                        {trackingLink !== '#' && (
                            <a href={trackingLink} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-primary hover:underline mt-2 inline-block">
                                Track on {order.trackingProvider} &rarr;
                            </a>
                        )}
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-800 mb-4">Shipment Status</h3>
                        <ul className="space-y-6">
                            <TrackingStep title="Order Processed" date={order.date} isCompleted={currentStatusIndex >= 0} isCurrent={currentStatusIndex === 0} isFirst />
                            <TrackingStep title="Shipped" isCompleted={currentStatusIndex >= 1} isCurrent={currentStatusIndex === 1} />
                            <TrackingStep title="Out for Delivery" isCompleted={currentStatusIndex >= 2} isCurrent={currentStatusIndex === 2} />
                            <TrackingStep title="Delivered" isCompleted={currentStatusIndex >= 3} isCurrent={currentStatusIndex === 3} isLast />
                        </ul>
                    </div>
                </div>

                 <div className="p-4 bg-slate-50 border-t text-right">
                    <button onClick={onClose} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderTrackingModal;