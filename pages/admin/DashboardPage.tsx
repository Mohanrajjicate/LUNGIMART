import React, { useMemo } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import StatCard from '../../components/admin/StatCard';
import { Order } from '../../types';

const DashboardPage: React.FC = () => {
    const { orders, products } = useAppContext();

    const totalRevenue = useMemo(() => {
        return orders.reduce((sum, order) => sum + order.total, 0);
    }, [orders]);

    const totalOrders = orders.length;

    const lowStockCount = useMemo(() => {
        return products.filter(p => p.stock < 10).length;
    }, [products]);

    // Simple sales chart data aggregation
    const salesByMonth = useMemo(() => {
        const months: { [key: string]: number } = {};
        orders.forEach(order => {
            const month = new Date(order.date).toLocaleString('default', { month: 'short', year: 'numeric' });
            if (!months[month]) {
                months[month] = 0;
            }
            months[month] += order.total;
        });
        return Object.entries(months).map(([name, value]) => ({ name, value })).slice(-6); // Last 6 months
    }, [orders]);

    const maxSales = Math.max(...salesByMonth.map(m => m.value), 0);

    return (
        <div>
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="Total Revenue" 
                    value={`₹${totalRevenue.toLocaleString()}`} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}
                    colorClass="bg-blue-100"
                />
                 <StatCard 
                    title="Total Orders" 
                    value={totalOrders.toString()} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                    colorClass="bg-green-100"
                />
                 <StatCard 
                    title="Low Stock Items" 
                    value={lowStockCount.toString()} 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                    colorClass="bg-red-100"
                />
            </div>

            {/* Recent Orders and Sales Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                {/* Sales Chart */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Sales Overview (Last 6 Months)</h3>
                    {salesByMonth.length > 0 ? (
                        <div className="flex justify-around items-end h-64 space-x-2 pt-4 border-t">
                            {salesByMonth.map(month => (
                                <div key={month.name} className="flex flex-col items-center flex-1">
                                    <div className="relative w-full h-full flex items-end">
                                        <div 
                                            className="w-3/4 mx-auto bg-primary/70 hover:bg-primary rounded-t-md transition-all"
                                            style={{ height: `${(month.value / maxSales) * 100}%` }}
                                            title={`₹${month.value.toLocaleString()}`}
                                        ></div>
                                    </div>
                                    <p className="mt-2 text-xs text-slate-500">{month.name}</p>
                                </div>
                            ))}
                        </div>
                    ) : <p className="text-slate-500">Not enough data to display chart.</p>}
                </div>

                {/* Recent Orders */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Orders</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                <tr>
                                    <th className="px-4 py-2">Order ID</th>
                                    <th className="px-4 py-2">Customer</th>
                                    <th className="px-4 py-2">Total</th>
                                    <th className="px-4 py-2">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 5).map((order: Order) => (
                                    <tr key={order.id} className="border-b">
                                        <td className="px-4 py-3 font-medium text-primary">{order.id}</td>
                                        <td className="px-4 py-3">{order.customerName}</td>
                                        <td className="px-4 py-3">₹{order.total.toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 
                                                'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
