
import { Product, Category, Review } from '../types';

export const categories: Category[] = [
  { id: 1, name: 'Men', slug: 'men' },
  { id: 2, name: 'Women', slug: 'women' },
  { id: 3, name: 'T-Shirts', slug: 't-shirts' },
  { id: 4, name: 'Handbags', slug: 'handbags' },
  { id: 5, name: 'Watches', slug: 'watches' },
  { id: 6, name: 'Hat', slug: 'hat' },
  { id: 7, name: 'Shoes', slug: 'shoes' },
  { id: 8, name: 'Coats', slug: 'coats'},
  { id: 9, name: 'Blazers', slug: 'blazers'},
];

const getCategory = (slug: string): Category => {
    return categories.find(c => c.slug === slug) || categories[0];
};

const reviews: Review[] = [
    { id: 1, author: 'Alex D.', rating: 5, comment: 'Excellent quality and fits perfectly.' },
    { id: 2, author: 'Maria S.', rating: 4, comment: 'Good value for money. Color is vibrant.' },
    { id: 3, author: 'Chen W.', rating: 5, comment: 'Soft material, love it!' },
];

export const availableColors = [
    { name: 'Brown', hex: '#A52A2A' },
    { name: 'White', hex: '#FFFFFF' },
    { name: 'Green', hex: '#008000' },
    { name: 'Blue', hex: '#0000FF' },
    { name: 'Black', hex: '#000000' },
];

export const availableSizes = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export const products: Product[] = [
  {
    id: 1,
    name: 'Classy Light Coat',
    slug: 'classy-light-coat',
    category: getCategory('coats'),
    price: 68.00,
    originalPrice: 120.00,
    images: ['https://i.imgur.com/H102vV6.png'],
    description: 'A timeless classic coat made from high-quality materials.',
    details: ['100% Cotton', 'Machine Washable'],
    reviews: reviews.slice(0, 2),
    colors: [availableColors[0], availableColors[1], availableColors[4]],
    sizes: availableSizes.slice(1, 4),
    rating: 4.9,
    reviewCount: 120
  },
  {
    id: 2,
    name: 'Men\'s T-shirt',
    slug: 'mens-t-shirt-22',
    category: getCategory('t-shirts'),
    price: 20.00,
    originalPrice: 30.00,
    images: ['https://i.imgur.com/G28lVvq.png'],
    description: 'A comfortable and stylish T-shirt for men.',
    details: ['100% Cotton', 'Machine Washable'],
    reviews: [reviews[2]],
    colors: [availableColors[1], availableColors[4]],
    sizes: availableSizes,
    rating: 4.9,
    reviewCount: 98
  },
  {
    id: 3,
    name: 'Women\'s T-shirt',
    slug: 'womens-t-shirt-attack',
    category: getCategory('t-shirts'),
    price: 25.00,
    originalPrice: 40.00,
    images: ['https://i.imgur.com/Fq8P1sJ.png'],
    description: 'A trendy T-shirt for women with a unique design.',
    details: ['95% Cotton, 5% Spandex', 'Machine Washable'],
    reviews: [],
    colors: [availableColors[4]],
    sizes: availableSizes.slice(0, 5),
    rating: 4.9,
    reviewCount: 210
  },
  {
    id: 4,
    name: 'Light Shirt',
    slug: 'light-shirt',
    category: getCategory('men'),
    price: 150.00,
    originalPrice: 200.00,
    images: ['https://i.imgur.com/j1v2b8c.png'],
    description: 'A light and comfortable shirt for any occasion.',
    details: ['100% Linen', 'Hand Wash'],
    reviews: [reviews[0]],
    colors: [availableColors[1], availableColors[3]],
    sizes: availableSizes.slice(1, 5),
    rating: 4.9,
    reviewCount: 75
  },
  {
    id: 5,
    name: 'Blue Men\'s Shirt',
    slug: 'blue-mens-shirt',
    category: getCategory('men'),
    price: 165.00,
    originalPrice: 220.00,
    images: ['https://i.imgur.com/gOQ5s4U.png'],
    description: 'A stylish blue shirt for men.',
    details: ['100% Cotton', 'Machine Washable'],
    reviews: [],
    colors: [availableColors[3]],
    sizes: availableSizes.slice(1, 4),
    rating: 4.9,
    reviewCount: 64
  },
   {
    id: 6,
    name: 'Classy Light Shirt',
    slug: 'classy-light-shirt-green',
    category: getCategory('men'),
    price: 185.00,
    originalPrice: 220.00,
    images: ['https://i.imgur.com/I3e6mF5.png'],
    description: 'An elegant and classy light shirt.',
    details: ['100% Cotton', 'Machine Washable'],
    reviews: [reviews[1]],
    colors: [availableColors[2]],
    sizes: availableSizes.slice(0, 4),
    rating: 4.9,
    reviewCount: 88
  },
  {
    id: 7,
    name: 'Women\'s T-shirt Black',
    slug: 'womens-t-shirt-black',
    category: getCategory('t-shirts'),
    price: 165.00,
    originalPrice: 220.00,
    images: ['https://i.imgur.com/w9U5pM6.png'],
    description: 'A versatile black T-shirt for women.',
    details: ['100% Cotton', 'Machine Washable'],
    reviews: [],
    colors: [availableColors[4]],
    sizes: availableSizes,
    rating: 4.9,
    reviewCount: 150
  },
  {
    id: 8,
    name: 'Gray Blazer',
    slug: 'gray-blazer',
    category: getCategory('blazers'),
    price: 350.00,
    originalPrice: 420.00,
    images: ['https://i.imgur.com/sC5I59T.png'],
    description: 'A sharp gray blazer for a professional look.',
    details: ['Wool Blend', 'Dry Clean Only'],
    reviews: [],
    colors: [{name: 'Gray', hex: '#808080'}],
    sizes: ['M', 'L', 'XL'],
    rating: 4.9,
    reviewCount: 45
  },
  {
    id: 9,
    name: 'Classy Light Blazer',
    slug: 'classy-light-blazer',
    category: getCategory('blazers'),
    price: 665.00,
    originalPrice: 720.00,
    images: ['https://i.imgur.com/gKj3a0H.png'],
    description: 'A light and classy blazer for formal events.',
    details: ['Linen Blend', 'Dry Clean Only'],
    reviews: [],
    colors: [{name: 'Beige', hex: '#F5F5DC'}],
    sizes: availableSizes.slice(1, 4),
    rating: 4.9,
    reviewCount: 55
  },
  {
    id: 10,
    name: 'Classy Light Coat Women',
    slug: 'classy-light-coat-women',
    category: getCategory('coats'),
    price: 200.00,
    originalPrice: 320.00,
    images: ['https://i.imgur.com/0233dA0.png'],
    description: 'A stylish and classy light coat for women.',
    details: ['Wool Blend', 'Dry Clean Only'],
    reviews: [],
    colors: [{name: 'Khaki', hex: '#C3B091'}],
    sizes: ['S', 'M', 'L'],
    rating: 4.9,
    reviewCount: 112
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