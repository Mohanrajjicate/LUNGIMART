
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import ProductUploadModal from '../../components/admin/ProductUploadModal';

const ProductsListPage: React.FC = () => {
    const { products, deleteProduct } = useAppContext();
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);

    const handleDelete = (productId: number, productName: string) => {
        if (window.confirm(`Are you sure you want to delete "${productName}"? This action cannot be undone.`)) {
            deleteProduct(productId);
        }
    };

    return (
        <>
            <ProductUploadModal 
                isOpen={isUploadModalOpen}
                onClose={() => setUploadModalOpen(false)}
            />
            <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
                    <h2 className="text-xl font-semibold text-slate-800">All Products ({products.length})</h2>
                    <div className="flex gap-4">
                        <button onClick={() => setUploadModalOpen(true)} className="bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors">
                            Upload Products
                        </button>
                        <Link to="/admin/products/new" className="bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors">
                            Add New Product
                        </Link>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Product Name</th>
                                <th scope="col" className="px-6 py-3">Category</th>
                                <th scope="col" className="px-6 py-3">Price</th>
                                <th scope="col" className="px-6 py-3">Stock</th>
                                <th scope="col" className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(product => (
                                <tr key={product.id} className="bg-white border-b hover:bg-slate-50">
                                    <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                                        {product.name}
                                    </th>
                                    <td className="px-6 py-4">
                                        {product.category.name}
                                    </td>
                                    <td className="px-6 py-4">
                                        ₹{product.price.toFixed(2)}
                                    </td>
                                    <td className={`px-6 py-4 font-semibold ${product.stock < 10 ? 'text-red-500' : 'text-slate-700'}`}>
                                        {product.stock}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-4">
                                        <Link to={`/admin/products/edit/${product.id}`} className="font-medium text-primary hover:underline">Edit</Link>
                                        <button onClick={() => handleDelete(product.id, product.name)} className="font-medium text-red-500 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default ProductsListPage;
