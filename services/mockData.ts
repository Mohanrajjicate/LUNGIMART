import { Product, Category, Review } from '../types';

export const categories: Category[] = [
  { id: 1, name: 'Lungi', slug: 'lungi', image: 'https://picsum.photos/seed/cat1/600/400' },
  { id: 2, name: 'Dhoti', slug: 'dhoti', image: 'https://picsum.photos/seed/cat2/600/400' },
  { id: 3, name: 'Matching Dhoti', slug: 'matching-dhoti', image: 'https://picsum.photos/seed/cat3/600/400' },
  { id: 4, name: 'Political Party', slug: 'political-party', image: 'https://picsum.photos/seed/cat4/600/400' },
  { id: 5, name: 'Towel', slug: 'towel', image: 'https://picsum.photos/seed/cat5/600/400' },
  { id: 6, name: 'All Products', slug: 'all', image: 'https://picsum.photos/seed/cat6/600/400' },
  // Virtual categories for special filtered views
  { id: 7, name: 'Best Selling', slug: 'best-selling' },
  { id: 8, name: 'Recent Products', slug: 'new-arrivals' },
  { id: 9, name: 'Featured Products', slug: 'featured-products' },
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
    rating: 4.5,
    reviewCount: 2,
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
    rating: 5,
    reviewCount: 1,
  },
  {
    id: 3,
    name: 'Silk Dhoti with Angavastram',
    slug: 'silk-dhoti-with-angavastram',
    category: getCategory('matching-dhoti'),
    price: 1599,
    originalPrice: 2199,
    images: ['https://picsum.photos/seed/product3/800/800', 'https://picsum.photos/seed/product3-2/800/800'],
    description: 'Exquisite silk-blend matching dhoti and angavastram set from the master weavers of Komarapalayam. Features a beautiful golden border for a regal touch.',
    details: ['Silk-Cotton Blend', 'Dry Clean Only', 'Dhoti: 4m, Angavastram: 2.5m', 'Intricate Zari Border'],
    reviews: [],
    rating: 4.8,
    reviewCount: 5,
  },
   {
    id: 4,
    name: 'DMK Flag Border Dhoti',
    slug: 'dmk-flag-border-dhoti',
    category: getCategory('political-party'),
    price: 950,
    originalPrice: 1299,
    images: ['https://picsum.photos/seed/product4/800/800', 'https://picsum.photos/seed/product4-2/800/800'],
    description: 'Show your support with this premium cotton dhoti featuring the iconic red and black border. Woven for comfort and durability.',
    details: ['100% Cotton', 'Machine Washable', '4 meters length', 'Vibrant, colorfast border'],
    reviews: [reviews[1]],
    rating: 4,
    reviewCount: 1,
  },
  {
    id: 5,
    name: 'Absorbent Bath Towel',
    slug: 'absorbent-bath-towel',
    category: getCategory('towel'),
    price: 699,
    originalPrice: 999,
    images: ['https://picsum.photos/seed/product5/800/800', 'https://picsum.photos/seed/product5-2/800/800'],
    description: 'A large, highly absorbent bath towel made from the finest Komarapalayam cotton. Soft to the touch and quick-drying.',
    details: ['Premium Terry Cotton', 'Machine Washable', 'Size: 75cm x 150cm', 'High GSM for absorbency'],
    reviews: [],
    rating: 4.7,
    reviewCount: 3,
  },
  {
    id: 6,
    name: 'Striped Casual Lungi',
    slug: 'striped-casual-lungi',
    category: getCategory('lungi'),
    price: 550,
    originalPrice: 699,
    images: ['https://picsum.photos/seed/product6/800/800', 'https://picsum.photos/seed/product6-2/800/800'],
    description: 'A modern take on the traditional lungi with stylish stripes. Perfect for lounging at home or a casual outing.',
    details: ['100% Cotton', 'Machine Washable', '2.25 meters length', 'Modern striped pattern'],
    reviews: [],
    rating: 0,
    reviewCount: 0,
  },
  {
    id: 7,
    name: 'ADMK Flag Border Dhoti',
    slug: 'admk-flag-border-dhoti',
    category: getCategory('political-party'),
    price: 950,
    originalPrice: 1299,
    images: ['https://picsum.photos/seed/product7/800/800'],
    description: 'Represent your party with pride. This pure cotton dhoti features the signature black, white, and red border, perfectly woven for political events and daily wear.',
    details: ['100% Premium Cotton', 'Colorfast Guarantee', '4 meters length', 'Authentic Party Colors'],
    reviews: [],
    rating: 0,
    reviewCount: 0,
  },
   {
    id: 8,
    name: 'Cotton Dhoti with Silk Border',
    slug: 'cotton-dhoti-silk-border',
    category: getCategory('dhoti'),
    price: 1100,
    originalPrice: 1400,
    images: ['https://picsum.photos/seed/product8/800/800'],
    description: 'The perfect blend of comfort and elegance. This soft cotton dhoti is enhanced with a shimmering silk border.',
    details: ['100% Cotton with Silk Border', 'Hand Wash Recommended', '4 meters length'],
    reviews: [],
    rating: 4.6,
    reviewCount: 4,
  },
   {
    id: 9,
    name: 'Wedding Dhoti & Towel Set',
    slug: 'wedding-dhoti-towel-set',
    category: getCategory('matching-dhoti'),
    price: 1899,
    originalPrice: 2499,
    images: ['https://picsum.photos/seed/product9/800/800'],
    description: 'A complete set for the groom, featuring a luxurious silk-blend dhoti and a matching towel, both with ornate zari borders.',
    details: ['Silk-Cotton Blend', 'Dry Clean Only', 'Perfect for wedding ceremonies'],
    reviews: [],
    rating: 0,
    reviewCount: 0,
  },
  {
    id: 10,
    name: 'Komarapalayam Hand Towel Set',
    slug: 'komarapalayam-hand-towel-set',
    category: getCategory('towel'),
    price: 399,
    originalPrice: 599,
    images: ['https://picsum.photos/seed/product10/800/800'],
    description: 'A set of two soft and durable hand towels, woven in the traditional style of Komarapalayam. Perfect for daily use in the kitchen or bathroom.',
    details: ['100% Cotton', 'Machine Washable', 'Set of 2', 'Size: 40cm x 60cm'],
    reviews: [],
    rating: 0,
    reviewCount: 0,
  },
];

export const getProductBySlug = (slug: string): Product | undefined => {
    return products.find(p => p.slug === slug);
}

export const getProductsByCategory = (categorySlug: string): Product[] => {
    if (!categorySlug || categorySlug === 'all') return products;

    // Handle special slugs for filtered views
    if (categorySlug === 'best-selling') {
        // Mock logic: products with high rating, sorted by review count
        return products.filter(p => (p.rating || 0) >= 4.5).sort((a,b) => (b.reviewCount || 0) - (a.reviewCount || 0));
    }
    if (categorySlug === 'new-arrivals') {
        // Mock logic: Sort by ID descending to get newest first
        return [...products].sort((a, b) => b.id - a.id);
    }
    if (categorySlug === 'featured-products') {
        // Mock logic: specific product IDs
        const featuredIds = [1, 3, 7, 9];
        return products.filter(p => featuredIds.includes(p.id));
    }

    const category = categories.find(c => c.slug === categorySlug);
    if (!category) return [];
    return products.filter(p => p.category.id === category.id);
}

export const getRelatedProducts = (currentProductId: number): Product[] => {
    return products.filter(p => p.id !== currentProductId).slice(0, 4);
}