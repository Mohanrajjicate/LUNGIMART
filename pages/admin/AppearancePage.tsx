import React from 'react';
import { useAppContext } from '../../contexts/AppContext';

const AppearancePage: React.FC = () => {
    const { banners, updateBannerImage } = useAppContext();
    
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, bannerId: string) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImageUrl = reader.result as string; // base64 data URL
                updateBannerImage(bannerId, newImageUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Site Appearance</h2>
            <div className="space-y-8">
                {banners.map(banner => (
                    <div key={banner.id} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center border-b pb-6 last:border-b-0 last:pb-0">
                        <div className="md:col-span-1">
                            <h3 className="font-semibold text-slate-800">{banner.name}</h3>
                            <p className="text-sm text-slate-500">This image appears on the homepage.</p>
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
                                    onChange={(e) => handleImageUpload(e, banner.id)}
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
    );
};

export default AppearancePage;
