import React from 'react';
import { mockUsers } from '../../services/mockData'; // In a real app, this would come from context/API
import { useAppContext } from '../../contexts/AppContext';

const CustomersPage: React.FC = () => {
    const { orders } = useAppContext();
    
    // In this mock setup, we'll calculate total spend per user
    const usersWithStats = mockUsers.map(user => {
        const userOrders = orders.filter(order => order.customerName === user.name);
        const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
        return {
            ...user,
            orderCount: userOrders.length,
            totalSpent,
        };
    });

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Customers ({usersWithStats.length})</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Orders</th>
                            <th scope="col" className="px-6 py-3">Total Spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersWithStats.map(user => (
                            <tr key={user.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.orderCount}</td>
                                <td className="px-6 py-4">₹{user.totalSpent.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 <div className="mt-6 text-center text-slate-500 text-sm">
                    <p>This is a mock customer list. In a real application, you could click on a customer to view their full profile, order history, and run AI-powered recommendations.</p>
                </div>
            </div>
        </div>
    );
};

export default CustomersPage;
