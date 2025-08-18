

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { Order, User } from '../../types';
import FulfillmentModal from '../../components/admin/FulfillmentModal';
import { mockUsers } from '../../services/mockData';

const OrdersPage: React.FC = () => {
    const { orders, updateOrderStatus } = useAppContext();
    const [pendingChanges, setPendingChanges] = useState<{ [key: string]: Order['status'] }>({});
    const [isFulfillmentModalOpen, setFulfillmentModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

    const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
        setPendingChanges(prev => ({ ...prev, [orderId]: newStatus }));
    };
    
    const handleSaveChanges = () => {
        Object.entries(pendingChanges).forEach(([orderId, status]) => {
            updateOrderStatus(orderId, status);
        });
        setPendingChanges({});
    };

    const handleFulfillClick = (order: Order) => {
        const customer = mockUsers.find(u => u.name === order.customerName);
        setSelectedOrder(order);
        setSelectedCustomer(customer || null);
        setFulfillmentModalOpen(true);
    };

    const showCustomerDetails = (order: Order) => {
        const customer = mockUsers.find(u => u.name === order.customerName);
        if (customer) {
            alert(`Customer Details:\n\nName: ${customer.name}\nEmail: ${customer.email}\nPhone: ${customer.phone || 'N/A'}`);
        } else {
            alert(`Customer "${order.customerName}" not found.`);
        }
    };

    const hasPendingChanges = Object.keys(pendingChanges).length > 0;

    return (
        <>
        {isFulfillmentModalOpen && selectedOrder && selectedCustomer && (
            <FulfillmentModal 
                order={selectedOrder}
                customer={selectedCustomer}
                onClose={() => setFulfillmentModalOpen(false)}
            />
        )}
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">All Orders ({orders.length})</h2>
                {hasPendingChanges && (
                    <button 
                        onClick={handleSaveChanges} 
                        className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Save Changes
                    </button>
                )}
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Order ID</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Customer</th>
                            <th scope="col" className="px-6 py-3">Products</th>
                            <th scope="col" className="px-6 py-3">Total</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="bg-white border-b hover:bg-slate-50">
                                <th scope="row" className="px-6 py-4 font-medium text-primary whitespace-nowrap">
                                    <Link to={`/invoice/${btoa(order.id)}`} target="_blank">{order.id}</Link>
                                </th>
                                <td className="px-6 py-4">{new Date(order.date).toLocaleDateString()}</td>
                                <td className="px-6 py-4">{order.customerName}</td>
                                <td className="px-6 py-4 truncate max-w-xs">{order.items[0]?.name}{order.items.length > 1 ? ` + ${order.items.length - 1} more` : ''}</td>
                                <td className="px-6 py-4">₹{order.total.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <select 
                                        value={pendingChanges[order.id] || order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                        className={`text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-opacity-50
                                            ${(pendingChanges[order.id] || order.status) === 'Delivered' ? 'bg-green-100 text-green-800 focus:ring-green-500' : 
                                            (pendingChanges[order.id] || order.status) === 'Shipped' ? 'bg-blue-100 text-blue-800 focus:ring-blue-500' : 
                                            'bg-yellow-100 text-yellow-800 focus:ring-yellow-500'}`}
                                    >
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end items-center gap-4">
                                        <Link to={`/invoice/${btoa(order.id)}`} target="_blank" title="Download Invoice" className="text-slate-500 hover:text-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        </Link>
                                        <button 
                                            onClick={() => handleFulfillClick(order)} 
                                            title={order.status !== 'Processing' ? 'Order has been processed' : 'Fulfill & Ship'}
                                            className={`transition-colors ${order.status !== 'Processing' ? 'text-slate-300 cursor-not-allowed' : 'text-slate-500 hover:text-primary'}`}
                                            disabled={order.status !== 'Processing'}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l2 2h8a1 1 0 001-1z" /><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h2a1 1 0 001-1V7a1 1 0 00-1-1h-2" /></svg>
                                        </button>
                                        <button onClick={() => showCustomerDetails(order)} title="Customer Details" className="text-slate-500 hover:text-primary">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </>
    );
};

export default OrdersPage;