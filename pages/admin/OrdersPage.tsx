import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { Order } from '../../types';

const OrdersPage: React.FC = () => {
    const { orders, updateOrderStatus } = useAppContext();

    const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
        updateOrderStatus(orderId, newStatus);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">All Orders ({orders.length})</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Order ID</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Customer</th>
                            <th scope="col" className="px-6 py-3">Total</th>
                            <th scope="col" className="px-6 py-3">Status</th>
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
                                <td className="px-6 py-4">₹{order.total.toFixed(2)}</td>
                                <td className="px-6 py-4">
                                    <select 
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value as Order['status'])}
                                        className={`text-xs font-semibold rounded-full border-0 focus:ring-2 focus:ring-opacity-50
                                            ${order.status === 'Delivered' ? 'bg-green-100 text-green-800 focus:ring-green-500' : 
                                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800 focus:ring-blue-500' : 
                                            'bg-yellow-100 text-yellow-800 focus:ring-yellow-500'}`}
                                    >
                                        <option value="Processing">Processing</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Delivered">Delivered</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrdersPage;
