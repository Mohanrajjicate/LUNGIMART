import { Product, Category, Review } from '../types';

export const categories: Category[] = [
  { id: 1, name: 'Lungis', slug: 'lungis' },
  { id: 2, name: 'Dhotis', slug: 'dhotis' },
  { id: 3, name: 'Cotton', slug: 'cotton' },
  { id: 4, name: 'Silk Blend', slug: 'silk-blend' },
  { id: 5, name: 'Checked', slug: 'checked' },
  { id: 6, name: 'Plain', slug: 'plain' },
];

const getCategory = (slug: string): Category => {
    return categories.find(c => c.slug === slug) || categories[0];
};

const reviews: Review[] = [
    { id: 1, author: 'Suresh P.', rating: 5, comment: 'Excellent quality cotton, very comfortable for daily wear.' },
    { id: 2, author: 'Rajesh K.', rating: 4, comment: 'Good value for money. The colors have not faded after many washes.' },
    { id: 3, author: 'Anand V.', rating: 5, comment: 'Soft material, authentic Komarapalayam weave. Highly recommended!' },
];

export const availableColors = [
    { name: 'Royal Blue', hex: '#4169E1' },
    { name: 'Maroon', hex: '#800000' },
    { name: 'Forest Green', hex: '#228B22' },
    { name: 'Saffron Yellow', hex: '#F4C430' },
    { name: 'Classic White', hex: '#FFFFFF' },
    { name: 'Deep Black', hex: '#000000' },
];

export const availableSizes = ['2m', '2.25m', 'Free Size'];

export const products: Product[] = [
  {
    id: 1,
    name: 'Classic Checked Lungi',
    slug: 'classic-checked-lungi',
    category: getCategory('lungis'),
    price: 8.00, // Prices in USD for consistency
    originalPrice: 10.00,
    images: ['https://i.imgur.com/gZ9a4bH.jpg'],
    description: 'A timeless checked lungi made from high-quality, breathable cotton. Perfect for daily comfort and traditional style.',
    details: ['100% Cotton', 'Machine Washable', '2.25 meters length'],
    reviews: reviews.slice(0, 2),
    colors: [availableColors[0], availableColors[1], availableColors[2]],
    sizes: [availableSizes[1]],
    rating: 4.8,
    reviewCount: 152
  },
  {
    id: 2,
    name: 'Pure Cotton Dhoti',
    slug: 'pure-cotton-dhoti',
    category: getCategory('dhotis'),
    price: 12.00,
    originalPrice: 15.00,
    images: ['https://i.imgur.com/K12aZ0i.jpg'],
    description: 'A comfortable and elegant pure cotton dhoti, ideal for religious ceremonies and traditional events.',
    details: ['100% Mercerised Cotton', 'Hand Wash Recommended'],
    reviews: [reviews[2]],
    colors: [availableColors[4]],
    sizes: ['Free Size'],
    rating: 4.9,
    reviewCount: 98
  },
  {
    id: 3,
    name: 'Komarapalayam Silk Lungi',
    slug: 'komarapalayam-silk-lungi',
    category: getCategory('lungis'),
    price: 25.00,
    originalPrice: 30.00,
    images: ['https://i.imgur.com/Wv2JB2E.jpg'],
    description: 'Experience luxury with our authentic Komarapalayam silk blend lungi, featuring intricate patterns and a rich texture.',
    details: ['70% Silk, 30% Cotton', 'Dry Clean Only', '2.25 meters length'],
    reviews: [],
    colors: [availableColors[1], availableColors[3]],
    sizes: [availableSizes[1]],
    rating: 4.9,
    reviewCount: 75
  },
  {
    id: 4,
    name: 'Plain Colored Lungi',
    slug: 'plain-colored-lungi',
    category: getCategory('lungis'),
    price: 7.00,
    originalPrice: 9.00,
    images: ['https://i.imgur.com/pWp8Lzv.jpg'],
    description: 'A versatile and comfortable plain colored lungi for everyday use. Made from soft, durable cotton.',
    details: ['100% Cotton', 'Machine Washable', '2 meters length'],
    reviews: [reviews[0]],
    colors: [availableColors[2], availableColors[0]],
    sizes: [availableSizes[0]],
    rating: 4.7,
    reviewCount: 210
  },
  {
    id: 5,
    name: 'Silk Blend Angavastram',
    slug: 'silk-blend-angavastram',
    category: getCategory('dhotis'),
    price: 18.00,
    originalPrice: 22.00,
    images: ['https://i.imgur.com/mJ3r8pM.jpg'],
    description: 'A matching silk blend angavastram to complete your traditional attire. Features a simple gold border.',
    details: ['50% Silk, 50% Cotton', 'Gentle Wash'],
    reviews: [],
    colors: [availableColors[4]],
    sizes: ['Free Size'],
    rating: 4.8,
    reviewCount: 64
  },
   {
    id: 6,
    name: 'Maroon Striped Lungi',
    slug: 'maroon-striped-lungi',
    category: getCategory('lungis'),
    price: 9.00,
    originalPrice: 11.00,
    images: ['https://i.imgur.com/c6kln3I.jpg'],
    description: 'An elegant maroon lungi with subtle stripes, crafted from fine cotton for a comfortable fit.',
    details: ['100% Cotton', 'Machine Washable', '2.25 meters length'],
    reviews: [reviews[1]],
    colors: [availableColors[1]],
    sizes: [availableSizes[1]],
    rating: 4.9,
    reviewCount: 88
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