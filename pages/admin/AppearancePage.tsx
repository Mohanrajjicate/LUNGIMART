import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Banner, Category } from '../../types';

const AppearancePage: React.FC = () => {
    const { banners, categories, setBanners, setCategories, addNotification } = useAppContext();
    
    const [pendingBanners, setPendingBanners] = useState<Banner[]>(banners);
    const [pendingCategories, setPendingCategories] = useState<Category[]>(categories);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setPendingBanners(banners);
        setPendingCategories(categories);
    }, [banners, categories]);

    const hasChanges = JSON.stringify(pendingBanners) !== JSON.stringify(banners) || JSON.stringify(pendingCategories) !== JSON.stringify(categories);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, id: string, type: 'banner' | 'category') => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImageUrl = reader.result as string;
                if (type === 'banner') {
                    setPendingBanners(current => current.map(item => item.id === id ? { ...item, imageUrl: newImageUrl } : item));
                } else {
                    setPendingCategories(current => current.map(item => String(item.id) === id ? { ...item, image: newImageUrl } : item));
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSaveChanges = () => {
        setIsSaving(true);
        // Simulate async save
        setTimeout(() => {
            setBanners(pendingBanners);
            setCategories(pendingCategories);
            setIsSaving(false);
            addNotification('Appearance changes saved successfully.', 'admin');
        }, 500);
    };

    const handleDiscardChanges = () => {
        setPendingBanners(banners);
        setPendingCategories(categories);
    };

    return (
        <div className="space-y-8">
            {/* Sticky Header */}
            <div className="sticky top-[80px] md:top-0 z-10 -mt-8 -mx-6 mb-4 py-4 px-6 bg-slate-100/80 backdrop-blur-sm border-b border-slate-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-slate-800">Site Appearance</h2>
                <div className={`transition-opacity duration-300 ${hasChanges ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleDiscardChanges}
                            className="bg-white text-slate-700 font-bold py-2 px-4 rounded-lg hover:bg-slate-50 border border-slate-300 transition-colors"
                        >
                            Discard
                        </button>
                        <button 
                            onClick={handleSaveChanges}
                            disabled={isSaving}
                            className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:bg-slate-400"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Banner Images Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Homepage Banners</h3>
                <div className="space-y-8">
                    {pendingBanners.map(banner => (
                        <div key={banner.id} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b pb-6 last:border-b-0 last:pb-0">
                            <div className="md:col-span-1">
                                <h4 className="font-semibold text-slate-800">{banner.name}</h4>
                                <p className="text-sm text-slate-500">Key promotional image on the homepage.</p>
                            </div>
                            <div className="md:col-span-2 flex items-center gap-6">
                                <img 
                                    src={banner.imageUrl} 
                                    alt={banner.name} 
                                    className="w-48 h-28 object-cover rounded-md bg-slate-100 flex-shrink-0"
                                />
                                <div>
                                    <input
                                        type="file"
                                        id={`upload-${banner.id}`}
                                        className="hidden"
                                        accept="image/png, image/jpeg, image/webp"
                                        onChange={(e) => handleImageUpload(e, banner.id, 'banner')}
                                    />
                                    <label
                                        htmlFor={`upload-${banner.id}`}
                                        className="cursor-pointer bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors text-sm"
                                    >
                                        Upload New Image
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Category Images Section */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Category Display Images</h3>
                <div className="space-y-8">
                    {pendingCategories.filter(c => !['best-selling', 'new-arrivals', 'featured-products'].includes(c.slug)).map(category => (
                        <div key={category.id} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b pb-6 last:border-b-0 last:pb-0">
                            <div className="md:col-span-1">
                                <h4 className="font-semibold text-slate-800">{category.name}</h4>
                                <p className="text-sm text-slate-500">Image for category circles/links.</p>
                            </div>
                            <div className="md:col-span-2 flex items-center gap-6">
                                <img 
                                    src={category.image || 'https://via.placeholder.com/112x112.png?text=No+Image'} 
                                    alt={category.name} 
                                    className="w-28 h-28 object-cover rounded-full bg-slate-100 flex-shrink-0"
                                />
                                <div>
                                    <input
                                        type="file"
                                        id={`upload-cat-${category.id}`}
                                        className="hidden"
                                        accept="image/png, image/jpeg, image/webp"
                                        onChange={(e) => handleImageUpload(e, String(category.id), 'category')}
                                    />
                                    <label
                                        htmlFor={`upload-cat-${category.id}`}
                                        className="cursor-pointer bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors text-sm"
                                    >
                                        Upload New Image
                                    </label>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AppearancePage;