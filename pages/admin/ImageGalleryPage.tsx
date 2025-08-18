import React, { useMemo } from 'react';
import { useAppContext } from '../../contexts/AppContext';

const ImageGalleryPage: React.FC = () => {
    const { products } = useAppContext();

    const allImages = useMemo(() => {
        const imageMap = new Map<string, { productNames: string[] }>();
        products.forEach(product => {
            product.images.forEach(imageUrl => {
                if (imageUrl.trim()) {
                    if (imageMap.has(imageUrl)) {
                        imageMap.get(imageUrl)?.productNames.push(product.name);
                    } else {
                        imageMap.set(imageUrl, { productNames: [product.name] });
                    }
                }
            });
        });
        return Array.from(imageMap.entries()).map(([url, data]) => ({ url, ...data }));
    }, [products]);

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">Image Gallery ({allImages.length} unique images)</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {allImages.map(({ url, productNames }) => (
                    <div key={url} className="group relative aspect-square bg-slate-100 rounded-lg overflow-hidden">
                        <img 
                            src={url} 
                            alt={productNames[0] || 'Product Image'} 
                            className="w-full h-full object-cover" 
                            loading="lazy"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex items-end">
                            <p className="text-white text-xs font-semibold line-clamp-3" title={productNames.join(', ')}>
                                Used in: {productNames.join(', ')}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {allImages.length === 0 && (
                 <div className="text-center py-16 text-slate-500">
                    No images found in products.
                </div>
            )}
        </div>
    );
};

export default ImageGalleryPage;
