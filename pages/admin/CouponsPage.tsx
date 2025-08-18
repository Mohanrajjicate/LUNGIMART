import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';

const CouponsPage: React.FC = () => {
    const { coupons, deleteCoupon } = useAppContext();

    const handleDelete = (couponId: number, couponCode: string) => {
        if (window.confirm(`Are you sure you want to delete the coupon "${couponCode}"?`)) {
            deleteCoupon(couponId);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-slate-800">Coupons ({coupons.length})</h2>
                <Link to="/admin/coupons/new" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                    Add New Coupon
                </Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-slate-500">
                    <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Code</th>
                            <th scope="col" className="px-6 py-3">Description</th>
                            <th scope="col" className="px-6 py-3">Type</th>
                            <th scope="col" className="px-6 py-3">Trigger</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {coupons.map(coupon => (
                            <tr key={coupon.id} className="bg-white border-b hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{coupon.code}</td>
                                <td className="px-6 py-4">{coupon.description}</td>
                                <td className="px-6 py-4">{coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}</td>
                                <td className="px-6 py-4 capitalize">{coupon.trigger.replace('_', ' ')}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-600'}`}>
                                        {coupon.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right space-x-4">
                                    <Link to={`/admin/coupons/edit/${coupon.id}`} className="font-medium text-primary hover:underline">Edit</Link>
                                    <button onClick={() => handleDelete(coupon.id, coupon.code)} className="font-medium text-red-500 hover:underline">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CouponsPage;
