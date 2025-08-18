import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import StatCard from '../../components/admin/StatCard';
import CategoryPieChart from '../../components/admin/CategoryPieChart';
import { Order, Product, User } from '../../types';
import FulfillmentModal from '../../components/admin/FulfillmentModal';
import { mockUsers } from '../../services/mockData';


const DashboardPage: React.FC = () => {
    const { orders, products } = useAppContext();
    const [isFulfillmentModalOpen, setFulfillmentModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

    const { totalRevenue, averageOrderValue } = useMemo(() => {
        const revenue = orders.reduce((sum, order) => sum + order.total, 0);
        const aov = orders.length > 0 ? revenue / orders.length : 0;
        return { totalRevenue: revenue, averageOrderValue: aov };
    }, [orders]);
    
    const lowStockProducts = useMemo(() => {
        return products.filter(p => p.stock < 10).sort((a,b) => a.stock - b.stock);
    }, [products]);

    const newOrders = useMemo(() => orders.filter(o => o.status === 'Processing'), [orders]);

    const topSellingProducts = useMemo(() => {
        const productQuantities: { [key: number]: number } = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                productQuantities[item.id] = (productQuantities[item.id] || 0) + item.quantity;
            });
        });

        return Object.entries(productQuantities)
            .sort(([, qtyA], [, qtyB]) => qtyB - qtyA)
            .slice(0, 5)
            .map(([productId, quantity]) => {
                const product = products.find(p => p.id === Number(productId));
                return { ...product, quantitySold: quantity };
            }) as (Product & { quantitySold: number })[];
    }, [orders, products]);
    
    const handleFulfillClick = (order: Order) => {
        const customer = mockUsers.find(u => u.name === order.customerName);
        setSelectedOrder(order);
        setSelectedCustomer(customer || null);
        setFulfillmentModalOpen(true);
    };

    return (
        <>
            {isFulfillmentModalOpen && selectedOrder && selectedCustomer && (
                <FulfillmentModal 
                    order={selectedOrder}
                    customer={selectedCustomer}
                    onClose={() => setFulfillmentModalOpen(false)}
                />
            )}
            <div className="space-y-8">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                        title="Total Revenue" 
                        value={`₹${totalRevenue.toLocaleString()}`} 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01" /></svg>}
                        colorClass="bg-blue-100"
                    />
                     <StatCard 
                        title="New Orders" 
                        value={newOrders.length.toString()} 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                        colorClass="bg-green-100"
                    />
                    <StatCard 
                        title="Avg. Order Value" 
                        value={`₹${averageOrderValue.toFixed(2)}`}
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}
                        colorClass="bg-purple-100"
                    />
                     <StatCard 
                        title="Low Stock Items" 
                        value={lowStockProducts.length.toString()} 
                        icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}
                        colorClass="bg-red-100"
                    />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Category Pie Chart */}
                    <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Revenue by Category</h3>
                        <CategoryPieChart orders={orders} products={products} />
                    </div>

                    {/* Top Selling Products */}
                    <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Top Selling Products</h3>
                        {topSellingProducts.length > 0 ? (
                            <ul className="space-y-3">
                                {topSellingProducts.map(product => (
                                    <li key={product.id} className="flex items-center gap-4">
                                        <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-md object-cover flex-shrink-0" />
                                        <div className="flex-grow">
                                            <p className="font-semibold text-sm text-slate-800">{product.name}</p>
                                            <p className="text-xs text-slate-500">{product.quantitySold} units sold</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="text-slate-500 text-sm py-4">No sales data available to determine top products.</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* New Orders for Fulfillment */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">New Orders for Fulfillment ({newOrders.length})</h3>
                        {newOrders.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-2">Order ID</th>
                                            <th className="px-4 py-2">Products</th>
                                            <th className="px-4 py-2">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {newOrders.slice(0, 5).map((order: Order) => (
                                            <tr key={order.id} className="border-b hover:bg-slate-50 cursor-pointer" onClick={() => handleFulfillClick(order)}>
                                                <td className="px-4 py-3 font-medium text-primary">{order.id}</td>
                                                <td className="px-4 py-3">{order.items[0]?.name}{order.items.length > 1 ? ` +${order.items.length-1}`: ''}</td>
                                                <td className="px-4 py-3">₹{order.total.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : <p className="text-slate-500 text-sm py-4">No new orders.</p>}
                    </div>

                    {/* Low Stock Items */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Low Stock Items ({lowStockProducts.length})</h3>
                        {lowStockProducts.length > 0 ? (
                             <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                                        <tr>
                                            <th className="px-4 py-2">Product Name</th>
                                            <th className="px-4 py-2">Stock</th>
                                            <th className="px-4 py-2 text-right">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {lowStockProducts.slice(0, 5).map(product => (
                                            <tr key={product.id} className="border-b">
                                                <td className="px-4 py-3 font-medium text-slate-800">{product.name}</td>
                                                <td className="px-4 py-3 font-bold text-red-600">{product.stock}</td>
                                                <td className="px-4 py-3 text-right">
                                                    <Link to={`/admin/products/edit/${product.id}`} className="text-primary font-semibold text-xs hover:underline">
                                                        Edit Stock
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : <p className="text-slate-500 text-sm py-4">No items are low on stock.</p>}
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashboardPage;