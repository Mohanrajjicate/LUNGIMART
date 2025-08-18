import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { Product } from '../../types';

const ProductEditPage: React.FC = () => {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();
    const { products, categories, addProduct, updateProduct } = useAppContext();
    const isEditing = Boolean(productId);

    const [formData, setFormData] = useState<Omit<Product, 'id' | 'reviews' | 'rating' | 'reviewCount' | 'slug'>>({
        name: '',
        category: categories[0],
        price: 0,
        originalPrice: 0,
        stock: 0,
        images: [''],
        description: '',
        details: [''],
    });

    useEffect(() => {
        if (isEditing) {
            const productToEdit = products.find(p => p.id === parseInt(productId!));
            if (productToEdit) {
                // Ensure images and details are arrays
                const images = Array.isArray(productToEdit.images) && productToEdit.images.length > 0 ? productToEdit.images : [''];
                const details = Array.isArray(productToEdit.details) && productToEdit.details.length > 0 ? productToEdit.details : [''];
                setFormData({...productToEdit, images, details});
            } else {
                navigate('/admin/products');
            }
        }
    }, [productId, products, isEditing, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        if (name === 'category') {
            const selectedCategory = categories.find(c => c.id === parseInt(value));
            setFormData(prev => ({ ...prev, category: selectedCategory || categories[0] }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleDetailChange = (index: number, value: string) => {
        const newDetails = [...formData.details];
        newDetails[index] = value;
        setFormData(prev => ({ ...prev, details: newDetails }));
    };

    const addDetail = () => {
        setFormData(prev => ({ ...prev, details: [...prev.details, ''] }));
    };
    
    const handleImageChange = (index: number, value: string) => {
        const newImages = [...formData.images];
        newImages[index] = value;
        setFormData(prev => ({...prev, images: newImages }));
    }

    const addImage = () => {
        setFormData(prev => ({...prev, images: [...prev.images, '']}));
    }

    const removeImage = (index: number) => {
        setFormData(prev => ({...prev, images: prev.images.filter((_, i) => i !== index)}));
    }

    const handleMockAIGenerate = () => {
        // In a real app, this would make an API call to Google Gemini.
        // For this mock, we'll just populate with some sample text.
        const mockDescription = `Discover the unparalleled comfort of our ${formData.name}. Made from the finest 100% authentic Komarapalayam cotton, this piece is a testament to traditional craftsmanship. It's breathable, durable, and perfect for any occasion, blending timeless style with modern sensibilities. Embrace the heritage.`;
        setFormData(prev => ({ ...prev, description: mockDescription }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const productData = {
            ...formData,
            price: parseFloat(String(formData.price)),
            originalPrice: parseFloat(String(formData.originalPrice)),
            stock: parseInt(String(formData.stock)),
            slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
            images: formData.images.filter(img => img.trim() !== ''), // Filter out empty strings
            details: formData.details.filter(det => det.trim() !== ''), // Filter out empty strings
        };

        if (isEditing) {
            updateProduct({ ...productData, id: parseInt(productId!) } as Product);
        } else {
            addProduct(productData);
        }
        navigate('/admin/products');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md max-w-4xl mx-auto">
            <h2 className="text-xl font-semibold text-slate-800 mb-6">{isEditing ? 'Edit Product' : 'Add New Product'}</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Product Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">Category</label>
                        <select name="category" value={formData.category.id} onChange={handleChange} className="mt-1 block w-full rounded-lg border-slate-300 shadow-sm">
                            {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </select>
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
                    <label className="block text-sm font-medium text-slate-700 mb-2">Image URLs</label>
                    <div className="space-y-2">
                        {formData.images.map((img, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <input 
                                    type="text" 
                                    value={img} 
                                    placeholder="https://example.com/image.jpg"
                                    onChange={(e) => handleImageChange(index, e.target.value)} 
                                    className="block w-full rounded-lg border-slate-300 shadow-sm" 
                                />
                                {formData.images.length > 1 && (
                                    <button type="button" onClick={() => removeImage(index)} className="p-2 text-red-500 hover:bg-red-50 rounded-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={addImage} className="mt-2 text-sm font-semibold text-primary hover:underline">+ Add Image URL</button>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700">Details</label>
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
    );
};

export default ProductEditPage;