
import React, { useState } from 'react';
import { useAppContext } from '../../contexts/AppContext';
import { Product } from '../../types';

interface ProductUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ProductUploadModal: React.FC<ProductUploadModalProps> = ({ isOpen, onClose }) => {
    const { addMultipleProducts, categories } = useAppContext();
    const [file, setFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFile(e.target.files[0]);
            setError('');
        }
    };

    const handleUpload = () => {
        if (!file) {
            setError('Please select a file.');
            return;
        }

        setIsProcessing(true);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result as string;
                const rows = text.split('\n').filter(row => row.trim() !== '');
                const headers = rows[0].split(',').map(h => h.trim());
                
                const requiredHeaders = ['name', 'category_slug', 'price', 'stock'];
                for(const header of requiredHeaders) {
                    if (!headers.includes(header)) {
                        throw new Error(`Missing required header column: ${header}`);
                    }
                }

                const newProducts: Omit<Product, 'id' | 'reviews' | 'rating' | 'reviewCount'>[] = [];

                for (let i = 1; i < rows.length; i++) {
                    const values = rows[i].split(',');
                    const rowData: { [key: string]: any } = {};
                    headers.forEach((header, index) => {
                        rowData[header] = values[index]?.trim() || '';
                    });
                    
                    const category = categories.find(c => c.slug === rowData.category_slug);
                    if (!category) {
                        console.warn(`Skipping row ${i+1}: Invalid category slug "${rowData.category_slug}"`);
                        continue;
                    }

                    newProducts.push({
                        name: rowData.name,
                        category: category,
                        price: parseFloat(rowData.price) || 0,
                        originalPrice: parseFloat(rowData.originalPrice) || undefined,
                        stock: parseInt(rowData.stock) || 0,
                        description: rowData.description || '',
                        images: rowData.images ? rowData.images.split('|').map((s: string) => s.trim()) : [],
                        details: rowData.details ? rowData.details.split('|').map((s: string) => s.trim()) : [],
                        slug: rowData.name.toLowerCase().replace(/\s+/g, '-'),
                    });
                }
                
                addMultipleProducts(newProducts);
                alert(`${newProducts.length} products uploaded successfully!`);
                onClose();

            } catch (err: any) {
                setError(`Failed to process file: ${err.message}`);
            } finally {
                setIsProcessing(false);
            }
        };

        reader.readAsText(file);
    };
    
    const csvTemplate = `name,category_slug,price,originalPrice,stock,description,images (use '|' separator),details (use '|' separator)
Classic Checkered Lungi,lungi,499,799,120,A timeless classic.,https://picsum.photos/seed/p1/800,100% Cotton|Machine Washable`;

    const handleDownloadTemplate = () => {
        const blob = new Blob([csvTemplate], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "product_template.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl p-6" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-slate-900">Upload Products via CSV</h2>
                <div className="mt-4 space-y-4">
                    <p className="text-sm text-slate-600">
                        Upload a CSV file to add multiple products at once. Please ensure the file follows the required format.
                    </p>
                    <div className="text-xs p-3 bg-slate-50 rounded-md border text-slate-500">
                        <strong>Required Columns:</strong> name, category_slug, price, stock <br/>
                        <strong>Optional Columns:</strong> originalPrice, description, images, details <br/>
                        <strong>Note:</strong> Use a pipe `|` to separate multiple image URLs or details.
                    </div>
                     <button onClick={handleDownloadTemplate} className="text-sm font-semibold text-primary hover:underline">Download Template</button>
                    <div>
                        <label className="block text-sm font-medium text-slate-700">CSV File</label>
                        <input
                            type="file"
                            accept=".csv"
                            onChange={handleFileChange}
                            className="mt-1 block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                        />
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                </div>
                <div className="mt-6 flex justify-end gap-4">
                    <button onClick={onClose} className="bg-slate-100 text-slate-800 font-bold py-2 px-6 rounded-lg hover:bg-slate-200">Cancel</button>
                    <button onClick={handleUpload} disabled={!file || isProcessing} className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark disabled:bg-slate-400">
                        {isProcessing ? 'Processing...' : 'Upload'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductUploadModal;
