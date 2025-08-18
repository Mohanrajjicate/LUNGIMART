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
                setFormData(productToEdit);
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
