
import { Product, Category, Review } from '../types';

export const categories: Category[] = [
  { id: 1, name: 'Lungi', slug: 'lungi', icon: 'https://picsum.photos/seed/lungi-cat/100/100' },
  { id: 2, name: 'Dhoti', slug: 'dhoti', icon: 'https://picsum.photos/seed/dhoti-cat/100/100' },
  { id: 3, name: 'Matching Sets', slug: 'matching-dhoti', icon: 'https://picsum.photos/seed/matching-cat/100/100' },
  { id: 4, name: 'Political', slug: 'political-party', icon: 'https://picsum.photos/seed/political-cat/100/100' },
  { id: 5, name: 'Towel', slug: 'towel', icon: 'https://picsum.photos/seed/towel-cat/100/100' },
  { id: 6, name: 'Wedding', slug: 'wedding', icon: 'https://picsum.photos/seed/wedding-cat/100/100' },
  { id: 7, name: 'Casual Wear', slug: 'casual-wear', icon: 'https://picsum.photos/seed/casual-cat/100/100' },
];

const getCategory = (slug: string): Category => {
    return categories.find(c => c.slug === slug) || categories[0];
};

const reviews: Review[] = [
    { id: 1, author: 'Ramesh K.', rating: 5, comment: 'Excellent quality and very comfortable.' },
    { id: 2, author: 'Suresh P.', rating: 4, comment: 'Good value for money. Color is vibrant.' },
    { id: 3, author: 'Anitha', rating: 5, comment: 'Soft material, my husband loves it!' },
];

export const products: Product[] = [
  {
    id: 1,
    name: 'Classic Checkered Lungi',
    slug: 'classic-checkered-lungi',
    category: getCategory('lungi'),
    price: 499,
    originalPrice: 799,
    images: ['https://picsum.photos/seed/product1/800/800', 'https://picsum.photos/seed/product1-2/800/800', 'https://picsum.photos/seed/product1-3/800/800'],
    description: 'A timeless classic, this checkered lungi is made from 100% pure Komarapalayam cotton, known for its softness and durability. Perfect for daily wear.',
    details: ['100% Cotton', 'Machine Washable', '2.25 meters length', 'Colorfast guarantee'],
    reviews: reviews.slice(0, 2),
  },
  {
    id: 2,
    name: 'Pure White Temple Dhoti',
    slug: 'pure-white-temple-dhoti',
    category: getCategory('dhoti'),
    price: 899,
    originalPrice: 1199,
    images: ['https://picsum.photos/seed/product2/800/800', 'https://picsum.photos/seed/product2-2/800/800'],
    description: 'Feel divine in our pure white temple dhoti. Woven with care and precision, it offers unparalleled comfort and a graceful drape for all your spiritual occasions.',
    details: ['Premium Weave Cotton', 'Hand Wash Recommended', '4 meters length', 'Slightly starched for a crisp look'],
    reviews: [reviews[2]],
  },
  {
    id: 3,
    name: 'Silk Matching Dhoti Set',
    slug: 'silk-matching-dhoti-set',
    category: getCategory('matching-dhoti'),
    price: 1599,
    originalPrice: 2199,
    images: ['https://picsum.photos/seed/product3/800/800', 'https://picsum.photos/seed/product3-2/800/800'],
    description: 'Elevate your traditional attire with this exquisite silk-blend matching dhoti and angavastram set. Features a beautiful golden border for a regal touch.',
    details: ['Silk-Cotton Blend', 'Dry Clean Only', 'Dhoti: 4m, Angavastram: 2.5m', 'Intricate Zari Border'],
    reviews: [],
  },
  {
    id: 4,
    name: 'Party Flag Border Dhoti',
    slug: 'party-flag-border-dhoti',
    category: getCategory('political-party'),
    price: 650,
    originalPrice: 800,
    images: ['https://picsum.photos/seed/product4/800/800', 'https://picsum.photos/seed/product4-2/800/800'],
    description: 'Show your support with our special edition political party dhoti. Made with durable cotton and featuring the iconic party colors on the border.',
    details: ['100% Cotton', 'Bold Color Border', 'Ideal for rallies and events', 'Comfortable for long hours'],
    reviews: [reviews[0]],
  },
  {
    id: 5,
    name: 'Ultra Absorbent Bath Towel',
    slug: 'ultra-absorbent-bath-towel',
    category: getCategory('towel'),
    price: 350,
    originalPrice: 500,
    images: ['https://picsum.photos/seed/product5/800/800'],
    description: 'Experience the softness of Komarapalayam cotton with our ultra-absorbent bath towels. Quick-drying and incredibly soft on the skin.',
    details: ['100% Terry Cotton', 'High GSM for absorbency', 'Size: 75cm x 150cm', 'Available in multiple colors'],
    reviews: [],
  },
   {
    id: 6,
    name: 'Striped Casual Lungi',
    slug: 'striped-casual-lungi',
    category: getCategory('casual-wear'),
    price: 550,
    originalPrice: 699,
    images: ['https://picsum.photos/seed/product6/800/800', 'https://picsum.photos/seed/product6-2/800/800'],
    description: 'A modern take on the traditional lungi with stylish stripes. Perfect for lounging at home or a casual outing.',
    details: ['100% Cotton', 'Machine Washable', '2.25 meters length', 'Modern striped pattern'],
    reviews: [reviews[1]],
  },
  {
    id: 7,
    name: 'Gold Border Wedding Dhoti',
    slug: 'gold-border-wedding-dhoti',
    category: getCategory('wedding'),
    price: 1299,
    originalPrice: 1799,
    images: ['https://picsum.photos/seed/product7/800/800'],
    description: 'A premium dhoti for weddings and special functions. The rich gold border adds a touch of grandeur to your look.',
    details: ['Premium Cotton', 'Hand Wash', '4.5 meters length', 'Wide gold zari border'],
    reviews: [],
  },
  {
    id: 8,
    name: 'DMK Flag Border Dhoti',
    slug: 'dmk-flag-border-dhoti',
    category: getCategory('political-party'),
    price: 650,
    images: ['https://picsum.photos/seed/product8/800/800', 'https://picsum.photos/seed/product8-2/800/800'],
    description: 'Show your support for the DMK party with this dhoti featuring their signature black and red border. Made for comfort during campaigns.',
    details: ['100% Cotton', 'Black & Red Border', 'Ideal for party meetings', 'Breathable fabric'],
    reviews: [],
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

export const getRelatedProducts = (currentProductId: number): Product[] => {
    return products.filter(p => p.id !== currentProductId).slice(0, 4);
}