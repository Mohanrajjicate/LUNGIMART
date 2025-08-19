import { Product, Category, Review, Order, Coupon, User, Address, Banner } from '../types';
import { encrypt } from '../utils/crypto';

export const baseCategories: Category[] = [
  // Parent Categories
  { id: 1, name: 'Lungi', slug: 'lungi' },
  { id: 2, name: 'Dhoti', slug: 'dhoti' },
  { id: 4, name: 'Political Party', slug: 'political-party', image: 'https://picsum.photos/seed/cat4/600/400' },
  { id: 5, name: 'Towel', slug: 'towel', image: 'https://picsum.photos/seed/cat5/600/400' },

  // Lungi Sub-categories
  { id: 11, name: 'Checkered Lungi', slug: 'checkered-lungi', parentId: 1, image: 'https://picsum.photos/seed/cat1/600/400' },
  { id: 12, name: 'Striped Lungi', slug: 'striped-lungi', parentId: 1, image: 'https://picsum.photos/seed/cat6/600/400' },

  // Dhoti Sub-categories
  { id: 3, name: 'Matching Dhoti', slug: 'matching-dhoti', parentId: 2, image: 'https://picsum.photos/seed/cat3/600/400' },
  { id: 10, name: 'Temple Dhoti', slug: 'temple-dhoti', parentId: 2, image: 'https://picsum.photos/seed/cat10/600/400' },
  { id: 13, name: 'Silk Border Dhoti', slug: 'silk-border-dhoti', parentId: 2, image: 'https://picsum.photos/seed/cat8/600/400' },

  // Special Virtual/Filter categories (not for direct assignment)
  { id: 6, name: 'All Products', slug: 'all', image: 'https://picsum.photos/seed/cat6/600/400' },
  { id: 7, name: 'Best Selling', slug: 'best-selling', image: 'https://picsum.photos/seed/cat7/600/400' },
  { id: 8, name: 'Recent Products', slug: 'new-arrivals', image: 'https://picsum.photos/seed/cat8/600/400' },
  { id: 9, name: 'Featured Products', slug: 'featured-products', image: 'https://picsum.photos/seed/cat9/600/400' },
];

const getCategory = (slug: string): Category => {
    return baseCategories.find(c => c.slug === slug) || baseCategories[0];
};

// Base reviews - managed by AppContext
export const baseReviews: Review[] = [
    { id: 1, productId: 1, userId: 2, author: 'Ramesh K.', rating: 5, comment: 'Excellent quality and very comfortable.', date: '2023-10-10', verifiedBuyer: true, acknowledged: true },
    { id: 2, productId: 1, userId: 1, author: 'Suresh P.', rating: 4, comment: 'Good value for money. Color is vibrant.', date: '2023-10-12', verifiedBuyer: true, acknowledged: true },
    { id: 3, productId: 2, userId: 4, author: 'Anitha', rating: 5, comment: 'Soft material, my husband loves it!', date: '2023-09-20', verifiedBuyer: true, acknowledged: true },
    { id: 4, productId: 4, userId: 3, author: 'Gopal V.', rating: 4, comment: 'The party colors are perfect. Very happy with the purchase.', date: '2023-08-15', verifiedBuyer: true, acknowledged: true },
];

// Base product data without dynamic review fields
export const baseProducts: Omit<Product, 'reviews' | 'rating' | 'reviewCount'>[] = [
  {
    id: 1,
    name: 'Classic Checkered Lungi',
    slug: 'classic-checkered-lungi',
    category: getCategory('checkered-lungi'),
    price: 499,
    originalPrice: 799,
    images: ['https://picsum.photos/seed/product1/800/800', 'https://picsum.photos/seed/product1-2/800/800', 'https://picsum.photos/seed/product1-3/800/800'],
    description: 'A timeless classic, this checkered lungi is made from 100% pure Komarapalayam cotton, known for its softness and durability. Perfect for daily wear.',
    details: ['100% Cotton', 'Machine Washable', '2.25 meters length', 'Colorfast guarantee'],
    stock: 120,
    virtualCategories: ['best-selling', 'featured-products'],
  },
  {
    id: 2,
    name: 'Pure White Temple Dhoti',
    slug: 'pure-white-temple-dhoti',
    category: getCategory('temple-dhoti'),
    price: 899,
    originalPrice: 1199,
    images: ['https://picsum.photos/seed/product2/800/800', 'https://picsum.photos/seed/product2-2/800/800'],
    description: 'Feel divine in our pure white temple dhoti. Woven with care and precision, it offers unparalleled comfort and a graceful drape for all your spiritual occasions.',
    details: ['Premium Weave Cotton', 'Hand Wash Recommended', '4 meters length', 'Slightly starched for a crisp look'],
    stock: 75,
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
    stock: 40,
    virtualCategories: ['featured-products'],
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
    stock: 8,
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
    stock: 150,
    virtualCategories: ['best-selling'],
  },
  {
    id: 6,
    name: 'Striped Casual Lungi',
    slug: 'striped-casual-lungi',
    category: getCategory('striped-lungi'),
    price: 550,
    originalPrice: 699,
    images: ['https://picsum.photos/seed/product6/800/800', 'https://picsum.photos/seed/product6-2/800/800'],
    description: 'A modern take on the traditional lungi with stylish stripes. Perfect for lounging at home or a casual outing.',
    details: ['100% Cotton', 'Machine Washable', '2.25 meters length', 'Modern striped pattern'],
    stock: 90,
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
    stock: 5,
    virtualCategories: ['featured-products'],
  },
   {
    id: 8,
    name: 'Cotton Dhoti with Silk Border',
    slug: 'cotton-dhoti-silk-border',
    category: getCategory('silk-border-dhoti'),
    price: 1100,
    originalPrice: 1400,
    images: ['https://picsum.photos/seed/product8/800/800'],
    description: 'The perfect blend of comfort and elegance. This soft cotton dhoti is enhanced with a shimmering silk border.',
    details: ['100% Cotton with Silk Border', 'Hand Wash Recommended', '4 meters length'],
    stock: 65,
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
    stock: 30,
    virtualCategories: ['featured-products'],
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
    stock: 200,
  },
];

// Central function to attach dynamic review data to a product
export const attachReviewData = (product: Omit<Product, 'reviews' | 'rating' | 'reviewCount'>, allReviews: Review[]): Product => {
    const productReviews = allReviews.filter(r => r.productId === product.id);
    const reviewCount = productReviews.length;
    const rating = reviewCount > 0
        ? productReviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
        : 0;

    return {
        ...product,
        reviews: productReviews,
        rating,
        reviewCount,
    };
};

export const mockUsers: User[] = [
    {
      id: 1,
      name: 'Suresh P.',
      email: 'suresh@example.com',
      password: encrypt('password123'),
      phone: '9876543210',
      birthday: '1990-05-15',
      addresses: [
        {
          id: 1,
          name: 'Suresh P. (Home)',
          street: "123, Weaver's Colony",
          city: 'Komarapalayam, Tamil Nadu',
          zip: '638183',
          isDefault: true,
        },
        {
          id: 2,
          name: 'Suresh P. (Work)',
          street: "456, Main Road",
          city: 'Erode, Tamil Nadu',
          zip: '638001',
        }
      ],
    },
    {
      id: 2,
      name: 'Ramesh K.',
      email: 'ramesh@example.com',
      password: encrypt('password123'),
      phone: '9876543211',
      addresses: [
        {
          id: 3,
          name: 'Ramesh K. (Home)',
          street: "789, Gandhi Street",
          city: 'Chennai, Tamil Nadu',
          zip: '600001',
          isDefault: true,
        }
      ],
    },
    {
      id: 3,
      name: 'Gopal V.',
      email: 'gopal@example.com',
      password: encrypt('password123'),
      phone: '9876543212',
      addresses: [
        {
          id: 4,
          name: 'Gopal V. (Home)',
          street: "101, Bazaar Road",
          city: 'Madurai, Tamil Nadu',
          zip: '625001',
          isDefault: true,
        }
      ],
    },
    {
      id: 4,
      name: 'Anitha',
      email: 'anitha@example.com',
      password: encrypt('password123'),
      phone: '9876543213',
      addresses: [
        {
          id: 5,
          name: 'Anitha (Home)',
          street: "212, Kovai Nagar",
          city: 'Coimbatore, Tamil Nadu',
          zip: '641001',
          isDefault: true,
        }
      ],
    }
];


// Mock orders with items, to be managed by AppContext
export const baseOrders: Order[] = [
    { 
      id: 'LM-1024', 
      userId: 1,
      date: '2023-10-15', 
      total: 1398, 
      status: 'Delivered', 
      customerName: 'Suresh P.',
      paymentMethod: 'Prepaid',
      trackingProvider: 'Delhivery',
      trackingNumber: 'AWB987654321',
      items: [
          attachReviewData(baseProducts.find(p => p.id === 1)!, []),
          attachReviewData(baseProducts.find(p => p.id === 5)!, []),
      ].map(p => ({...p, quantity: 1})),
      reviewedProducts: { 1: true, 5: false } // Product 1 is already reviewed
    },
    { 
      id: 'LM-1023', 
      userId: 2,
      date: '2023-10-01', 
      total: 899, 
      status: 'Delivered', 
      customerName: 'Ramesh K.',
      paymentMethod: 'Prepaid',
      trackingProvider: 'Blue Dart',
      trackingNumber: 'BD123456789',
      items: [
          attachReviewData(baseProducts.find(p => p.id === 2)!, [])
      ].map(p => ({...p, quantity: 1})),
      reviewedProducts: { 2: true } // Product 2 is already reviewed
    },
    { 
      id: 'LM-1022', 
      userId: 3,
      date: '2023-09-29', 
      total: 950, 
      status: 'Shipped', 
      customerName: 'Gopal V.',
      paymentMethod: 'Prepaid',
      trackingProvider: 'Ecom Express',
      trackingNumber: 'EE987123456',
      items: [
          attachReviewData(baseProducts.find(p => p.id === 4)!, [])
      ].map(p => ({...p, quantity: 1})),
      reviewedProducts: {}
    },
    { 
      id: 'LM-1021', 
      userId: 4,
      date: '2023-09-28', 
      total: 550, 
      status: 'Processing', 
      customerName: 'Anitha',
      paymentMethod: 'Prepaid',
      items: [
          attachReviewData(baseProducts.find(p => p.id === 6)!, [])
      ].map(p => ({...p, quantity: 1})),
      reviewedProducts: { 6: false }
    },
  ];

export const mockCoupons: Coupon[] = [
  {
    id: 1,
    code: 'FESTIVE10',
    description: 'Get 10% off on all orders above ₹1000',
    discountType: 'percentage',
    discountValue: 10,
    minPurchase: 1000,
    trigger: 'none',
    isActive: true,
  },
  {
    id: 2,
    code: 'LUNGIKING',
    description: '₹150 off on Classic Checkered Lungi',
    discountType: 'fixed',
    discountValue: 150,
    applicableProductIds: [1],
    trigger: 'none',
    isActive: true,
  },
  {
    id: 3,
    code: 'NEW50',
    description: 'Flat ₹50 off on your first order',
    discountType: 'fixed',
    discountValue: 50,
    trigger: 'first_order',
    isActive: true,
  },
  {
    id: 4,
    code: 'HBD20',
    description: '20% off on your birthday! Happy Birthday!',
    discountType: 'percentage',
    discountValue: 20,
    trigger: 'birthday',
    isActive: true,
  },
];

export const getAvailableCouponsForProduct = (productId: number): Coupon[] => {
  return mockCoupons.filter(coupon => {
    // Must be active and not a special user-triggered coupon
    if (!coupon.isActive || coupon.trigger !== 'none') {
      return false;
    }
    
    // If it's a generic coupon (no specific products), it applies.
    if (!coupon.applicableProductIds || coupon.applicableProductIds.length === 0) {
      return true;
    }
    
    // If it's product-specific, check if this product is included.
    return coupon.applicableProductIds.includes(productId);
  });
};

export const baseBanners: Banner[] = [
  { id: 'hero-slider-1', name: 'Hero Slider Image 1', imageUrl: 'https://picsum.photos/seed/hero-main/1200/800' },
  { id: 'hero-slider-2', name: 'Hero Slider Image 2', imageUrl: 'https://picsum.photos/seed/hero-alt1/1200/800' },
  { id: 'hero-slider-3', name: 'Hero Slider Image 3', imageUrl: 'https://picsum.photos/seed/hero-alt2/1200/800' },
  { id: 'temple-collection', name: 'Temple Vibe Banner', imageUrl: 'https://picsum.photos/seed/banner-temple/800/500' },
  { id: 'political-wear', name: 'Political Party Wear Banner', imageUrl: 'https://picsum.photos/seed/banner-political/800/500' },
  { id: 'festive-sale', name: 'Festive Season Sale Banner', imageUrl: 'https://picsum.photos/seed/festival-offer/1200/400' },
  { id: 'bulk-order-promo', name: 'Bulk Order Promo Banner', imageUrl: 'https://picsum.photos/seed/promo/1200/400' },
];


export const getProductsByCategory = (slug: string, allProducts: Product[]): Product[] => {
    const category = baseCategories.find(c => c.slug === slug);
    if (!category) {
        return [];
    }
    // If it's a parent category, get all products from its sub-categories too
    if (!category.parentId) {
        const subCategoryIds = baseCategories.filter(c => c.parentId === category.id).map(c => c.id);
        const allCategoryIds = [category.id, ...subCategoryIds];
        return allProducts.filter(p => allCategoryIds.includes(p.category.id));
    }
    // It's a sub-category, just get its products
    return allProducts.filter(p => p.category.id === category.id);
};

// New data structure for user-specific wishlists (product IDs)
export const mockWishlists: { [userId: number]: number[] } = {
    1: [3, 5], // User Suresh P. likes Silk Dhoti and Bath Towel
    2: [1],    // User Ramesh K. likes Classic Checkered Lungi
};