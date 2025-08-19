import React, { useMemo, useRef } from 'react';
import { useAppContext } from '../../contexts/AppContext';

const ImageGalleryPage: React.FC = () => {
    const { products, standaloneImages, addStandaloneImage } = useAppContext();
    const fileInputRef = useRef<HTMLInputElement>(null);

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

        standaloneImages.forEach(imageUrl => {
            if (imageUrl.trim() && !imageMap.has(imageUrl)) {
                imageMap.set(imageUrl, { productNames: ['Gallery Upload'] });
            }
        });

        return Array.from(imageMap.entries()).map(([url, data]) => ({ url, ...data }));
    }, [products, standaloneImages]);
    
    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            for (const file of Array.from(files)) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    if (reader.result) {
                        addStandaloneImage(reader.result as string);
                    }
                };
                reader.readAsDataURL(file);
            }
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };


    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                <h2 className="text-xl font-semibold text-slate-800">Image Gallery ({allImages.length} unique images)</h2>
                <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                />
                <button 
                    onClick={handleUploadClick}
                    className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors"
                >
                    Upload New Image(s)
                </button>
            </div>
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
                                {productNames[0] === 'Gallery Upload' ? 'Unassigned' : `Used in: ${productNames.join(', ')}`}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
            {allImages.length === 0 && (
                 <div className="text-center py-16 text-slate-500">
                    No images found. Use the upload button to add some.
                </div>
            )}
        </div>
    );
};

export default ImageGalleryPage;