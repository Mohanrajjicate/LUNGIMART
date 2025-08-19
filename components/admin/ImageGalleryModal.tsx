import React, { useMemo, useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';

interface ImageGalleryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectImage: (imageUrl: string) => void;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({ isOpen, onClose, onSelectImage }) => {
    const { products, standaloneImages } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');

    const allImages = useMemo(() => {
        const imageSet = new Set<string>();
        // Add standalone images first so they appear at the top
        standaloneImages.forEach(imageUrl => {
            if (imageUrl.trim()) {
                imageSet.add(imageUrl);
            }
        });
        products.forEach(product => {
            product.images.forEach(imageUrl => {
                if (imageUrl.trim()) {
                    imageSet.add(imageUrl);
                }
            });
        });
        return Array.from(imageSet);
    }, [products, standaloneImages]);

    const filteredImages = useMemo(() => {
        if (!searchTerm.trim()) return allImages;
        return allImages.filter(url => url.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [allImages, searchTerm]);

    if (!isOpen) return null;

    const handleImageClick = (url: string) => {
        onSelectImage(url);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-4xl h-[80vh] bg-white rounded-xl shadow-2xl flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="p-4 border-b flex justify-between items-center flex-shrink-0">
                    <h2 className="text-xl font-bold text-slate-900">Select an Image from Gallery</h2>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-800" aria-label="Close modal">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-4 border-b flex-shrink-0">
                    <input
                        type="search"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        placeholder="Search images by URL..."
                        className="w-full rounded-lg border-slate-300 shadow-sm focus:border-primary focus:ring-primary/20 focus:ring-1"
                    />
                </div>
                <div className="p-4 flex-grow overflow-y-auto">
                    {filteredImages.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                            {filteredImages.map((url) => (
                                <div key={url} className="group relative aspect-square bg-slate-100 rounded-lg overflow-hidden cursor-pointer" onClick={() => handleImageClick(url)}>
                                    <img 
                                        src={url} 
                                        alt="Gallery image"
                                        className="w-full h-full object-cover" 
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <p className="text-white font-bold text-lg">Select</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 text-slate-500">
                            <p>No images found{searchTerm ? ` for "${searchTerm}"` : ""}.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ImageGalleryModal;
