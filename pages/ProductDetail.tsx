import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductBySlug, getRelatedProducts } from '../services/mockData';
import { useAppContext } from '../contexts/AppContext';
import ProductCard from '../components/ProductCard';

const AccordionItem: React.FC<{ title: string, children: React.ReactNode, defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-light-border py-6">
      <h3 className="-my-3 flow-root">
        <button
          type="button"
          className="flex w-full items-center justify-between py-3 text-sm text-secondary hover:text-primary"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="font-medium text-primary text-base">{title}</span>
          <span className="ml-6 flex items-center">
            {isOpen ? (
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 12H6" /></svg>
            ) : (
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" /></svg>
            )}
          </span>
        </button>
      </h3>
      {isOpen && <div className="pt-6 text-sm text-secondary space-y-4">{children}</div>}
    </div>
  );
};


const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const product = getProductBySlug(slug || '');
  
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product?.sizes[0]);
  
  const { addToCart } = useAppContext();

  if (!product || !selectedColor || !selectedSize) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <Link to="/" className="text-accent hover:underline mt-4 inline-block">Back to Shop</Link>
      </div>
    );
  }
  
  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    // Maybe show a confirmation toast here in a real app
  };
  
  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    navigate('/cart');
  }

  const relatedProducts = getRelatedProducts(product.slug);

  return (
    <div className="space-y-16">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
        {/* Image Gallery */}
        <div className="flex flex-col-reverse sm:flex-row gap-4">
            <div className="flex sm:flex-col gap-2 justify-center sm:justify-start flex-wrap">
              {product.images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`w-20 h-24 rounded-md overflow-hidden ring-2 transition ${activeImage === index ? 'ring-accent' : 'ring-transparent hover:ring-gray-300'}`}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover object-center" />
                </button>
              ))}
            </div>
            <div className="flex-1 aspect-w-1 aspect-h-1 bg-surface rounded-md">
              <img src={product.images[activeImage]} alt={`${product.name} view ${activeImage + 1}`} className="w-full h-full object-cover object-center" />
            </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
            <h1 className="text-3xl lg:text-4xl font-bold text-primary">{product.name}</h1>
            <p className="text-2xl text-primary font-bold mt-3">${product.price.toFixed(2)}</p>
            
            <div className="mt-6">
                {/* Colors */}
                <div>
                  <h3 className="text-sm font-medium text-primary">Color: <span className="text-secondary">{selectedColor.name}</span></h3>
                  <div className="flex items-center space-x-3 mt-2">
                    {product.colors.map((color) => (
                      <button key={color.name} onClick={() => setSelectedColor(color)}
                        className={`h-8 w-8 rounded-full border border-gray-300 ring-2 ring-offset-1 transition-all ${selectedColor.name === color.name ? 'ring-accent' : 'ring-transparent'}`}
                        style={{ backgroundColor: color.hex }}
                        aria-label={color.name}
                      ></button>
                    ))}
                  </div>
                </div>

                {/* Sizes */}
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-primary">Select Size</h3>
                  <div className="grid grid-cols-4 gap-4 sm:grid-cols-8 lg:grid-cols-6 mt-2">
                    {product.sizes.map((size) => (
                      <button key={size} onClick={() => setSelectedSize(size)}
                        className={`group relative flex items-center justify-center rounded-md border py-3 px-4 text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none sm:flex-1 ${selectedSize === size ? 'bg-primary text-white border-primary' : 'bg-white text-primary border-light-border'}`}
                      >{size}</button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mt-8">
                    <h3 className="text-sm font-medium text-primary mb-2">Quantity</h3>
                    <div className="flex items-center border border-light-border rounded-md w-fit">
                        <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-2 text-lg text-secondary hover:bg-surface rounded-l-md">-</button>
                        <span className="px-5 py-2 font-semibold text-lg">{quantity}</span>
                        <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-2 text-lg text-secondary hover:bg-surface rounded-r-md">+</button>
                    </div>
                </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <button onClick={handleAddToCart} className="w-full bg-white border border-primary text-primary py-3 px-8 text-base font-medium rounded-md hover:bg-surface transition-colors">
                Add to cart
              </button>
              <button onClick={handleBuyNow} className="w-full bg-accent border border-transparent text-white py-3 px-8 text-base font-medium rounded-md hover:bg-accent-dark transition-colors">
                Buy it now
              </button>
            </div>
            
            <div className="mt-8">
                <AccordionItem title="Description" defaultOpen>
                    <p>{product.description}</p>
                </AccordionItem>
                <AccordionItem title="Shipping & Returns">
                    <p>Standard shipping across India. We accept returns within 15 days of delivery. Please see our full policy for details.</p>
                </AccordionItem>
                <AccordionItem title="Details">
                    <ul className="list-disc list-inside space-y-2">
                       {product.details.map((detail, i) => <li key={i}>{detail}</li>)}
                    </ul>
                </AccordionItem>
            </div>
        </div>
      </div>
      
      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-center text-primary mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {relatedProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailPage;