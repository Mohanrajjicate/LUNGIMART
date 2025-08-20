
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { Product } from '../../types';
import ProductCard from '../../components/ProductCard';
import ImageGalleryModal from '../../components/admin/ImageGalleryModal';

const ProductEditPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const { products, categories, addProduct, updateProduct } = useAppContext();
    const isEditing = Boolean(productId);

    const [formData, setFormData] = useState<Omit<Product, 'id' | 'reviews' | 'rating' | 'reviewCount' | 'slug'> & { virtualCategories: string[] }>({
        name: '',
        category: categories.find(c => !c.parentId) || categories[0],
        price: 0,
        originalPrice: 0,
        stock: 0,
        images: [''],
        description: '',
        details: [''],
        virtualCategories: [],
    });
    
    const [selectedParentCategory, setSelectedParentCategory] = useState<number | undefined>(undefined);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);

    const parentCategories = useMemo(() => categories.filter(c => !c.parentId && !['all', 'best-selling', 'new-arrivals', 'featured-products'].includes(c.slug)), [categories]);
    const subCategories = useMemo(() => categories.filter(c => c.parentId === selectedParentCategory), [categories, selectedParentCategory]);
    const virtualCategoryOptions = useMemo(() => categories.filter(c => ['best-selling', 'new-arrivals', 'featured-products'].includes(c.slug)), [categories]);

    useEffect(() => {
        if (isEditing) {
            const productToEdit = products.find(p => p.id === parseInt(productId!));
            if (productToEdit) {
                const parent = categories.find(c => c.id === productToEdit.category.parentId);
                setSelectedParentCategory(parent?.id);
                
                const images = Array.isArray(productToEdit.images) && productToEdit.images.length > 0 ? productToEdit.images : [''];
                const details = Array.isArray(productToEdit.details) && productToEdit.details.length > 0 ? productToEdit.details : [''];
                
                setFormData({
                    ...productToEdit, 
                    images, 
                    details,
                    virtualCategories: productToEdit.virtualCategories || []
                });
            } else {
                navigate('/admin/products');
            }
        } else {
            // Set a default parent category on new product page
            if (parentCategories.length > 0) {
                setSelectedParentCategory(parentCategories[0].id);
            }
        }
    }, [productId, products, isEditing, navigate, categories, parentCategories]);
    
    useEffect(() => {
        // Auto-select first sub-category if parent changes and product is not being edited
        if (!isEditing && subCategories.length > 0) {
            setFormData(prev => ({ ...prev, category: subCategories[0] }));
        }
    }, [subCategories, isEditing]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'category') {
            const selectedCategory = categories.find(c => c.id === parseInt(value));
            setFormData(prev => ({ ...prev, category: selectedCategory || categories[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleParentCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const parentId = parseInt(e.target.value);
        setSelectedParentCategory(parentId);
        // If parent has no sub-categories, select the parent itself
        const children = categories.filter(c => c.parentId === parentId);
        if (children.length === 0) {
             const parentCategory = categories.find(c => c.id === parentId);
             if (parentCategory) {
                 setFormData(prev => ({ ...prev, category: parentCategory }));
             }
        }
    };
    
    const handleVirtualCategoryChange = (slug: string) => {
        setFormData(prev => {
            const currentVCs = prev.virtualCategories || [];
            const newVCs = currentVCs.includes(slug)
                ? currentVCs.filter(s => s !== slug)
                : [...currentVCs, slug];
            return { ...prev, virtualCategories: newVCs };
        });
    };
    
    const handleDetailChange = (index: number, value: string) => {
        const newDetails = [...formData.details];
        newDetails[index] = value;
        setFormData(prev => ({ ...prev, details: newDetails }));
    };

    const addDetail = () => {
        setFormData(prev => ({ ...prev, details: [...prev.details, ''] }));
    };
    
    const handleImageFileChange = (index: number, file: File | null) => {
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const newImages = [...formData.images];
                newImages[index] = reader.result as string;
                setFormData(prev => ({ ...prev, images: newImages }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageUrlChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({...prev, images: newImages }));
    };

    const addImage = () => {
        setFormData(prev => ({...prev, images: [...prev.images, '']}));
    };

    const removeImage = (index: number) => {
        setFormData(prev => ({...prev, images: prev.images.filter((_, i) => i !== index)}));
    };

    const handleMockAIGenerate = () => {
        const mockDescription = `Discover the unparalleled comfort of our ${formData.name}. Made from the finest 100% authentic Komarapalayam cotton, this piece is a testament to traditional craftsmanship. It's breathable, durable, and perfect for any occasion, blending timeless style with modern sensibilities. Embrace the heritage.`;
        setFormData(prev => ({ ...prev, description: mockDescription }));
    };

    const openGalleryForImage = (index: number) => {
        setEditingImageIndex(index);
        setIsGalleryOpen(true);
    };

    const handleImageSelectFromGallery = (imageUrl: string) => {
        if (editingImageIndex !== null) {
            handleImageUrlChange(editingImageIndex, imageUrl);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productData = {
            ...formData,
            price: parseFloat(String(formData.price)),
            originalPrice: parseFloat(String(formData.originalPrice)),
            stock: parseInt(String(formData.stock)),
            slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
            images: formData.images.filter(img => img.trim() !== ''),
            details: formData.details.filter(det => det.trim() !== ''),
            virtualCategories: formData.virtualCategories || [],
        };

        if (isEditing) {
            updateProduct({ ...productData, id: parseInt(productId!) } as Product);
        } else {
            addProduct(productData);
        }
        navigate('/admin/products');
    };
    
    const previewProduct: Product = useMemo(() => {
        const images = formData.images.filter(img => img);
        return {
            id: isEditing ? parseInt(productId!) : Date.now(),
            slug: formData.name.toLowerCase().replace(/\s+/g, '-') || 'new-product',
            reviews: [],
            rating: 0,
            reviewCount: 0,
            ...formData,
            images: images.length > 0 ? images : ['https://via.placeholder.com/800x800.png?text=No+Image'],
            price: Number(formData.price) || 0,
            originalPrice: Number(formData.originalPrice) || undefined,
            stock: Number(formData.stock) || 0,
        };
    }, [formData, isEditing, productId]);

    return (
        <>
            <ImageGalleryModal
                isOpen={isGalleryOpen}
                onClose={() => setIsGalleryOpen(false)}
                onSelectImage={handleImageSelectFromGallery}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Form Column */}
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-slate-800 mb-6">{isEditing ? `Editing: ${formData.name}` : 'Add New Product'}</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Product Name</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label className="block text-sm font-medium text-slate-700">Category</label>
                                <select value={selectedParentCategory || ''} onChange={handleParentCategoryChange} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm">
                                    <option value="" disabled>Select a parent category</option>
                                    {parentCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700">Sub-category</label>
                                <select name="category" value={formData.category.id} onChange={handleChange} disabled={subCategories.length === 0} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm disabled:bg-slate-50">
                                    {subCategories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                                    {subCategories.length === 0 && <option>No sub-categories</option>}
                                </select>
                            </div>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-slate-700">Virtual Categories</label>
                            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-2 p-3 bg-slate-50 rounded-lg">
                                {virtualCategoryOptions.map(vc => (
                                    <label key={vc.slug} className="flex items-center gap-2 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={(formData.virtualCategories || []).includes(vc.slug)} 
                                            onChange={() => handleVirtualCategoryChange(vc.slug)}
                                            className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/50"
                                        />
                                        <span className="text-sm text-slate-700">{vc.name}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm"></textarea>
                            <button type="button" onClick={handleMockAIGenerate} className="mt-2 text-sm font-semibold text-primary hover:underline">
                                Generate with AI
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                             <div>
                                <label className="block text-sm font-medium text-slate-700">Price</label>
                                <input type="number" name="price" value={formData.price} onChange={handleChange} required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700">Original Price</label>
                                <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700">Stock</label>
                                <input type="number" name="stock" value={formData.stock} onChange={handleChange} required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm" />
                            </div>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">Product Images</label>
                            <div className="space-y-4">
                                {formData.images.map((img, index) => (
                                    <div key={index} className="flex items-center gap-4 p-3 border rounded-lg bg-slate-50/50">
                                        <img src={img || 'https://via.placeholder.com/80x80.png?text=Preview'} alt={`Preview ${index + 1}`} className="w-20 h-20 object-cover rounded-md bg-slate-100 flex-shrink-0" />
                                        <div className="flex-grow space-y-2">
                                            <input type="text" value={img.startsWith('data:image') ? 'Uploaded from device' : img} placeholder="Select an image source" readOnly className="block w-full rounded-lg border-slate-300 shadow-sm text-sm bg-white" />
                                            <div className="flex gap-2">
                                                <label htmlFor={`upload-file-${index}`} className="cursor-pointer text-center flex-1 text-sm font-semibold py-2 px-4 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors">
                                                    Upload File
                                                </label>
                                                <input type="file" id={`upload-file-${index}`} className="hidden" accept="image/*" onChange={(e) => handleImageFileChange(index, e.target.files ? e.target.files[0] : null)} />
                                                <button type="button" onClick={() => openGalleryForImage(index)} className="flex-1 text-sm font-semibold py-2 px-4 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors">
                                                    From Gallery
                                                </button>
                                            </div>
                                        </div>
                                        {formData.images.length > 1 && (
                                            <button type="button" onClick={() => removeImage(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md self-start">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button type="button" onClick={addImage} className="mt-2 text-sm font-semibold text-primary hover:underline">+ Add Another Image</button>
                        </div>
                         <div>
                            <label className="block text-sm font-medium text-slate-700">Details (one per line)</label>
                            {formData.details.map((detail, index) => (
                                <input key={index} type="text" value={detail} onChange={(e) => handleDetailChange(index, e.target.value)} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm mb-2" />
                            ))}
                            <button type="button" onClick={addDetail} className="text-sm font-semibold text-primary hover:underline">+ Add Detail</button>
                        </div>

                        <div className="flex justify-end gap-4 pt-4 border-t">
                            <button type="button" onClick={() => navigate(-1)} className="bg-slate-100 text-slate-800 font-bold py-2 px-6 rounded-lg hover:bg-slate-200">Cancel</button>
                            <button type="submit" className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark">{isEditing ? 'Save Changes' : 'Add Product'}</button>
                        </div>
                    </form>
                </div>
                
                {/* Preview Column */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4">Live Preview</h3>
                        <div className="bg-slate-50 p-4 rounded-lg">
                            {formData.name ? (
                                <ProductCard product={previewProduct} />
                            ) : (
                                <div className="aspect-[4/5] flex flex-col items-center justify-center text-center bg-white rounded-xl border-2 border-dashed text-slate-400 p-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="mt-2 text-sm font-semibold">Product preview will appear here</p>
                                    <p className="text-xs mt-1">Start by entering a product name.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductEditPage;
