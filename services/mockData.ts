
import { Product, Category, Review } from '../types';

export const categories: Category[] = [
  { id: 1, name: 'Men', slug: 'men', icon: '' },
  { id: 2, name: 'Women', slug: 'women', icon: '' },
  { id: 3, name: 'T-Shirts', slug: 't-shirts', icon: '' },
  { id: 4, name: 'Hoodies', slug: 'hoodies', icon: '' },
  { id: 5, name: 'Jackets and Coats', slug: 'jackets-coats', icon: '' },
  { id: 6, name: 'Watches', slug: 'watches', icon: '' },
  { id: 7, name: 'Hat', slug: 'hat', icon: '' },
];

const getCategory = (slug: string): Category => {
    return categories.find(c => c.slug === slug) || categories[0];
};

const reviews: Review[] = [
    { id: 1, author: 'Alex D.', rating: 5, comment: 'Great fit and material.' },
    { id: 2, author: 'Jamie R.', rating: 4, comment: 'Good value for money.' },
    { id: 3, author: 'Casey B.', rating: 5, comment: 'Love the color!' },
];

const availableColors = [
    { name: 'Black', hex: '#000000' },
    { name: 'Grey', hex: '#808080' },
    { name: 'Pink', hex: '#FFC0CB' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Green', hex: '#008000' },
];

const availableSizes = ['S', 'M', 'L', 'XL', 'XXL'];

export const products: Product[] = [
  {
    id: 1, name: 'Spread Casual Shirt', slug: 'spread-casual-shirt', category: getCategory('men'),
    price: 75.00, images: ['https://picsum.photos/seed/product1/600/800'],
    description: 'Highlight the material fit and design', reviews: [reviews[0]],
    colors: [availableColors[0], availableColors[3]], sizes: availableSizes,
    rating: 4.5, reviewCount: 21, details: []
  },
  {
    id: 2, name: 'Collar Casual Shirt', slug: 'collar-casual-shirt', category: getCategory('men'),
    price: 75.00, images: ['https://picsum.photos/seed/product2/600/800'],
    description: 'Mention fabric, colors, and special features', reviews: [],
    colors: [availableColors[3], availableColors[4]], sizes: availableSizes,
    rating: 4.2, reviewCount: 15, details: []
  },
  {
    id: 3, name: 'Striped Sweatshirt', slug: 'striped-sweatshirt', category: getCategory('men'),
    price: 75.00, images: ['https://picsum.photos/seed/product3/600/800'],
    description: 'Elevate your casual look with our premium materials', reviews: [],
    colors: [availableColors[0], availableColors[1], availableColors[3]], sizes: availableSizes,
    rating: 4.8, reviewCount: 30, details: []
  },
  {
    id: 4, name: 'Solid Sweatshirt', slug: 'solid-sweatshirt', category: getCategory('women'),
    price: 75.00, images: ['https://picsum.photos/seed/product4/600/800'],
    description: 'Effortless style with our basic must-haves', reviews: [],
    colors: [availableColors[2], availableColors[3]], sizes: availableSizes,
    rating: 4.0, reviewCount: 10, details: []
  },
  {
    id: 5, name: 'Sleeve Sweatshirt', slug: 'sleeve-sweatshirt', category: getCategory('women'),
    price: 75.00, images: ['https://picsum.photos/seed/product5/600/800'],
    description: 'Classic fit, perfect for everyday comfort', reviews: [],
    colors: [availableColors[4], availableColors[5]], sizes: availableSizes,
    rating: 4.6, reviewCount: 18, details: []
  },
  {
    id: 6, name: 'Super Slimfit blazer', slug: 'super-slimfit-blazer', category: getCategory('women'),
    price: 75.00, images: ['https://picsum.photos/seed/product6/600/800'],
    description: 'Mention fabric, colors, and special features', reviews: [],
    colors: [availableColors[0], availableColors[1]], sizes: availableSizes,
    rating: 4.3, reviewCount: 25, details: []
  },
  {
    id: 7, name: 'Slimfit blazer-black', slug: 'slimfit-blazer-black', category: getCategory('men'),
    price: 75.00, images: ['https://picsum.photos/seed/product7/600/800'],
    description: 'Highlight the material fit and design', reviews: [],
    colors: [availableColors[0]], sizes: availableSizes,
    rating: 4.9, reviewCount: 42, details: []
  },
  {
    id: 8, name: 'Neck Pure T-Shirt', slug: 'neck-pure-t-shirt', category: getCategory('men'),
    price: 75.00, images: ['https://picsum.photos/seed/product8/600/800'],
    description: 'A basic tee with a comfortable neck design', reviews: [],
    colors: [availableColors[3], availableColors[1]], sizes: availableSizes,
    rating: 4.1, reviewCount: 9, details: []
  },
  {
    id: 9, name: 'Trendy Brown Coat', slug: 'trendy-brown-coat', category: getCategory('women'),
    price: 75.00, images: ['https://picsum.photos/seed/product9/600/800'],
    description: 'Stay warm and stylish with this trendy coat', reviews: [],
    colors: [{name: 'Brown', hex: '#A52A2A'}], sizes: availableSizes,
    rating: 4.7, reviewCount: 35, details: []
  },
  {
    id: 10, name: 'Trendy blazer', slug: 'trendy-blazer', category: getCategory('men'),
    price: 70.00, images: ['https://picsum.photos/seed/product10/600/800'],
    description: 'Highlight the material fit and design', reviews: [],
    colors: [availableColors[1], availableColors[0]], sizes: availableSizes,
    rating: 5.0, reviewCount: 2, details: []
  },
  {
    id: 11, name: 'Premium Solid Shirt', slug: 'premium-solid-shirt', category: getCategory('men'),
    price: 68.00, images: ['https://picsum.photos/seed/product11/600/800'],
    description: 'A premium shirt for any occasion', reviews: [],
    colors: [availableColors[5], availableColors[3]], sizes: availableSizes,
    rating: 4.5, reviewCount: 1, details: []
  },
  {
    id: 12, name: 'Trendy Gray T-Shirt', slug: 'trendy-gray-t-shirt', category: getCategory('women'),
    price: 80.00, images: ['https://picsum.photos/seed/product12/600/800'],
    description: 'A trendy gray t-shirt for your wardrobe', reviews: [],
    colors: [availableColors[1]], sizes: availableSizes,
    rating: 4.0, reviewCount: 3, details: []
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
    return products.find(p => p.slug === slug);
}

export const getProductsByCategory = (categorySlug: string): Product[] => {
    if (categorySlug === 'all') return products;
    const category = categories.find(c => c.slug === categorySlug);
    if (!category) return [];
    return products.filter(p => p.category.id === category.id);
}

export const getRelatedProducts = (currentProductSlug: string): Product[] => {
    const currentProduct = getProductBySlug(currentProductSlug);
    if (!currentProduct) return products.slice(0, 4);

    return products.filter(p => p.category.id === currentProduct.category.id && p.slug !== currentProductSlug).slice(0, 4);
}