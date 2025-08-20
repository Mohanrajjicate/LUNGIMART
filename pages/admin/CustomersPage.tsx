
import React from 'react';
import { useAppContext } from '../../contexts/AppContext';

const CustomersPage: React.FC = () => {
    const { allOrders: orders, users } = useAppContext();
    
    // In this mock setup, we'll calculate total spend per user
    const usersWithStats = users.map(user => {
        const userOrders = orders.filter(order => order.customerName === user.name);
        const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0);
        return {
            ...user,
            orderCount: userOrders.length,
            totalSpent,
        };
    });

    const handleDownloadCRM = () => {
        const headers = ["Name", "Email", "Mobile Number", "Orders", "Total Spent (INR)"];
        const csvContent = [
            headers.join(","),
            ...usersWithStats.map(user => 
                [
                    `"${user.name}"`, 
                    user.email,
                    user.phone || 'N/A',
                    user.orderCount, 
                    user.totalSpent.toFixed(2)
                ].join(",")
            )
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", "customers.csv");
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Customers ({usersWithStats.length})</h2>
                <button onClick={handleDownloadCRM} className="bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors">
                    Download CRM (CSV)
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Name</th>
                            <th scope="col" className="px-6 py-3">Email</th>
                            <th scope="col" className="px-6 py-3">Mobile Number</th>
                            <th scope="col" className="px-6 py-3">Orders</th>
                            <th scope="col" className="px-6 py-3">Total Spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersWithStats.map(user => (
                            <tr key={user.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{user.name}</td>
                                <td className="px-6 py-4">{user.email}</td>
                                <td className="px-6 py-4">{user.phone}</td>
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
