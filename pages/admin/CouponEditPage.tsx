import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { Coupon } from '../../types';

const CouponEditPage: React.FC = () => {
    const { couponId } = useParams<{ couponId: string }>();
    const navigate = useNavigate();
    const { coupons, addCoupon, updateCoupon } = useAppContext();
    const isEditing = Boolean(couponId);

    const [formData, setFormData] = useState<Omit<Coupon, 'id'>>({
        code: '',
        description: '',
        discountType: 'fixed',
        discountValue: 0,
        minPurchase: undefined,
        applicableProductIds: [],
        trigger: 'none',
        isActive: true,
    });

    useEffect(() => {
        if (isEditing) {
            const couponToEdit = coupons.find(c => c.id === parseInt(couponId!));
            if (couponToEdit) {
                setFormData(couponToEdit);
            } else {
                navigate('/admin/coupons');
            }
        }
    }, [couponId, coupons, isEditing, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const { checked } = e.target as HTMLInputElement;
            setFormData(prev => ({ ...prev, [name]: checked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalData = {
            ...formData,
            discountValue: Number(formData.discountValue),
            minPurchase: formData.minPurchase ? Number(formData.minPurchase) : undefined,
            applicableProductIds: typeof formData.applicableProductIds === 'string'
                ? (formData.applicableProductIds as string).split(',').map(id => Number(id.trim())).filter(Boolean)
                : formData.applicableProductIds
        };
        
        if (isEditing) {
            updateCoupon({ ...finalData, id: parseInt(couponId!) });
        } else {
            addCoupon(finalData);
        }
        navigate('/admin/coupons');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-3xl mx-auto">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">{isEditing ? 'Edit Coupon' : 'Add New Coupon'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Coupon Code</label>
                        <input type="text" name="code" value={formData.code} onChange={handleChange} required className="mt-1 block w-full rounded-lg border-slate-300" />
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700">Status</label>
                        <label className="mt-2 inline-flex items-center cursor-pointer">
                          <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} className="sr-only peer" />
                          <div className="relative w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          <span className="ms-3 text-sm font-medium text-slate-900">{formData.isActive ? 'Active' : 'Inactive'}</span>
                        </label>
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Description</label>
                    <textarea name="description" value={formData.description} onChange={handleChange} rows={2} required className="mt-1 block w-full rounded-lg border-slate-300"></textarea>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Discount Type</label>
                        <select name="discountType" value={formData.discountType} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-300">
                            <option value="fixed">Fixed Amount</option>
                            <option value="percentage">Percentage</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Discount Value</label>
                        <input type="number" name="discountValue" value={formData.discountValue} onChange={handleChange} required className="mt-1 block w-full rounded-lg border-slate-300" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Coupon Trigger</label>
                        <select name="trigger" value={formData.trigger} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-300">
                            <option value="none">None (Standard)</option>
                            <option value="first_order">First Order</option>
                            <option value="birthday">Birthday</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Minimum Purchase (Optional)</label>
                        <input type="number" name="minPurchase" value={formData.minPurchase || ''} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-300" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">Applicable Product IDs (comma-separated, optional)</label>
                    <input type="text" name="applicableProductIds" value={Array.isArray(formData.applicableProductIds) ? formData.applicableProductIds.join(', ') : ''} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-300" />
                </div>
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <button type="button" onClick={() => navigate('/admin/coupons')} className="bg-slate-100 text-slate-800 font-bold py-2 px-6 rounded-lg hover:bg-slate-200">Cancel</button>
                    <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark">{isEditing ? 'Save Changes' : 'Create Coupon'}</button>
                </div>
            </form>
        </div>
    );
};

export default CouponEditPage;
