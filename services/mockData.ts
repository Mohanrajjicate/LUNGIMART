
import { Product, Category, Review, User, Order, Coupon, Banner } from '../types';

// --- CATEGORIES ---
export const mockCategories: Category[] = [
  { id: 1, name: 'All Products', slug: 'all', image: 'https://picsum.photos/seed/all-cat/400' },
  { id: 2, name: 'Lungi', slug: 'lungi', image: 'https://picsum.photos/seed/lungi-cat/400' },
  { id: 3, name: 'Dhoti', slug: 'dhoti', image: 'https://picsum.photos/seed/dhoti-cat/400' },
  { id: 4, name: 'Matching Dhoti Sets', slug: 'matching-dhoti', image: 'https://picsum.photos/seed/matching-cat/400' },
  { id: 5, name: 'Political Party Wear', slug: 'political-party', image: 'https://picsum.photos/seed/political-cat/400' },
  { id: 6, name: 'Towels', slug: 'towel', image: 'https://picsum.photos/seed/towel-cat/400' },
  { id: 7, name: 'Best Selling', slug: 'best-selling', image: 'https://picsum.photos/seed/bestsell-cat/400' },
  { id: 8, name: 'New Arrivals', slug: 'new-arrivals', image: 'https://picsum.photos/seed/new-cat/400' },
  { id: 9, name: 'Featured Products', slug: 'featured-products', image: 'https://picsum.photos/seed/featured-cat/400' },
  { id: 10, name: 'Temple Vibe', slug: 'temple-vibe', image: 'https://picsum.photos/seed/temple-cat/400' },
];

// --- REVIEWS ---
export const mockReviews: Review[] = [
  { id: 1, productId: 1, userId: 2, author: 'Ramesh Kumar', rating: 5, comment: 'Fantastic quality, very soft and comfortable for daily wear.', date: '2023-10-15', verifiedBuyer: true, acknowledged: true },
  { id: 2, productId: 2, userId: 3, author: 'Priya Selvam', rating: 5, comment: 'The material is divine and feels very premium. Delivery was prompt too.', date: '2023-10-12', verifiedBuyer: true, acknowledged: true },
  { id: 3, productId: 4, userId: 4, author: 'Anand Rao', rating: 4, comment: 'Consistent quality and smooth bulk ordering process. My customers are happy.', date: '2023-10-10', verifiedBuyer: true, acknowledged: true },
  { id: 4, productId: 1, userId: 3, author: 'Priya Selvam', rating: 4, comment: 'Good value for money. The colors are vibrant.', date: '2023-10-05', verifiedBuyer: true, acknowledged: true },
  { id: 5, productId: 7, userId: 2, author: 'Ramesh Kumar', rating: 5, comment: 'This matching set is perfect for functions. Looked great!', date: '2023-09-28', verifiedBuyer: true, acknowledged: false },
  { id: 6, productId: 9, userId: 4, author: 'Anand Rao', rating: 5, comment: 'Very soft towels, absorbs water very well.', date: '2023-11-01', verifiedBuyer: true, acknowledged: false },
];

// --- PRODUCTS ---
export const mockProducts: Product[] = [
    {
        id: 1,
        name: 'Classic Checkered Lungi',
        slug: 'classic-checkered-lungi',
        category: mockCategories[1], // Lungi
        price: 499,
        originalPrice: 799,
        images: ['https://picsum.photos/seed/p1/800', 'https://picsum.photos/seed/p1-alt/800'],
        description: 'A timeless checkered lungi made from 100% premium Komarapalayam cotton. Perfect for daily wear, offering exceptional comfort and durability.',
        details: ['100% Pure Cotton', 'Machine Washable', 'Colorfast Guarantee', 'Breathable Fabric'],
        stock: 120,
        reviews: [],
        virtualCategories: ['best-selling', 'featured-products'],
    },
    {
        id: 2,
        name: 'Pure White Temple Dhoti',
        slug: 'pure-white-temple-dhoti',
        category: mockCategories[2], // Dhoti
        price: 650,
        images: ['https://picsum.photos/seed/p2/800', 'https://picsum.photos/seed/p2-alt/800'],
        description: 'An elegant pure white dhoti, ideal for temple visits and spiritual occasions. Made with soft, high-quality cotton for a pristine look.',
        details: ['Premium Soft Cotton', 'Ideal for Religious Ceremonies', 'Comfort Fit', 'Easy to Drape'],
        stock: 85,
        reviews: [],
        virtualCategories: ['temple-vibe'],
    },
    {
        id: 3,
        name: 'Golden Border Dhoti',
        slug: 'golden-border-dhoti',
        category: mockCategories[2], // Dhoti
        price: 750,
        originalPrice: 900,
        images: ['https://picsum.photos/seed/p3/800', 'https://picsum.photos/seed/p3-alt/800'],
        description: 'A sophisticated dhoti featuring a classic golden border. Perfect for weddings, festivals, and formal traditional events.',
        details: ['Rich Golden Zari Border', '100% Cotton', 'Handloom Product', 'Perfect for Formal Occasions'],
        stock: 60,
        reviews: [],
        virtualCategories: ['featured-products', 'temple-vibe', 'best-selling'],
    },
    {
        id: 4,
        name: 'DMK Party Dhoti',
        slug: 'dmk-party-dhoti',
        category: mockCategories[4], // Political
        price: 899,
        images: ['https://picsum.photos/seed/p4/800', 'https://picsum.photos/seed/p4-alt/800'],
        description: 'Show your support with this premium quality dhoti featuring the iconic DMK party colors and symbol border.',
        details: ['Official Party Colors', 'High-Quality Woven Border', 'Durable and Comfortable Cotton', 'Specially for Party Members'],
        stock: 200,
        reviews: [],
        virtualCategories: [],
    },
    {
        id: 5,
        name: 'Soft Cotton Bath Towel',
        slug: 'soft-cotton-bath-towel',
        category: mockCategories[5], // Towel
        price: 350,
        images: ['https://picsum.photos/seed/p5/800', 'https://picsum.photos/seed/p5-alt/800'],
        description: 'A highly absorbent and incredibly soft bath towel. Woven from the finest Komarapalayam cotton to ensure a gentle feel on your skin.',
        details: ['High Absorbency', 'Quick Drying', '100% Soft Cotton', 'Large Size (75x150 cm)'],
        stock: 150,
        reviews: [],
        virtualCategories: ['new-arrivals'],
    },
    {
        id: 6,
        name: 'ADMK Party Dhoti',
        slug: 'admk-party-dhoti',
        category: mockCategories[4], // Political
        price: 899,
        images: ['https://picsum.photos/seed/p6/800', 'https://picsum.photos/seed/p6-alt/800'],
        description: 'Display your allegiance with this expertly crafted dhoti, featuring the signature ADMK party colors on the border.',
        details: ['Signature Party Colors', 'Premium Weave', 'Comfortable for Long Events', 'Machine Washable'],
        stock: 180,
        reviews: [],
        virtualCategories: [],
    },
    {
        id: 7,
        name: 'Silk Blend Matching Set',
        slug: 'silk-blend-matching-set',
        category: mockCategories[3], // Matching
        price: 1299,
        originalPrice: 1500,
        images: ['https://picsum.photos/seed/p7/800', 'https://picsum.photos/seed/p7-alt/800'],
        description: 'An exquisite matching dhoti and angavastram set made from a comfortable silk-cotton blend. Perfect for the groom or special guests at a wedding.',
        details: ['Luxurious Silk-Cotton Blend', 'Includes Dhoti and Angavastram', 'Intricate Border Design', 'Dry Clean Only'],
        stock: 40,
        reviews: [],
        virtualCategories: ['featured-products'],
    },
    {
        id: 8,
        name: 'Simple Border Temple Dhoti',
        slug: 'simple-border-temple-dhoti',
        category: mockCategories[2], // Dhoti
        price: 550,
        images: ['https://picsum.photos/seed/p8/800', 'https://picsum.photos/seed/p8-alt/800'],
        description: 'A minimalist yet elegant dhoti with a simple colored border. Perfect for daily poojas and temple visits.',
        details: ['100% Cotton', 'Simple and Elegant Design', 'Available in various border colors', 'Easy to maintain'],
        stock: 95,
        reviews: [],
        virtualCategories: ['temple-vibe'],
    },
    {
        id: 9,
        name: 'Striped Cotton Hand Towels (Set of 3)',
        slug: 'striped-cotton-hand-towels',
        category: mockCategories[5], // Towel
        price: 299,
        images: ['https://picsum.photos/seed/p9/800', 'https://picsum.photos/seed/p9-alt/800'],
        description: 'A set of three soft and durable hand towels with a classic striped pattern. Perfect for your kitchen or guest bathroom.',
        details: ['Set of 3 Hand Towels', '100% Absorbent Cotton', 'Vibrant Striped Pattern', 'Compact and Multi-purpose'],
        stock: 300,
        reviews: [],
        virtualCategories: ['featured-products', 'best-selling'],
    },
     {
        id: 10,
        name: 'Solid Color Lungi',
        slug: 'solid-color-lungi',
        category: mockCategories[1], // Lungi
        price: 450,
        images: ['https://picsum.photos/seed/p10/800'],
        description: 'A comfortable and versatile solid color lungi. Available in multiple deep shades, perfect for a subtle and classic look.',
        details: ['Single Solid Color', 'Soft-Weave Cotton', 'Breathable and Lightweight', 'Stitched for immediate use'],
        stock: 110,
        reviews: [],
        virtualCategories: ['new-arrivals'],
    },
];

// --- USERS ---
export const mockUsers: User[] = [
    {
        id: 1,
        name: 'Admin User',
        email: 'admin@lungimart.in',
        password: 'password',
        phone: '9876543210',
        addresses: [],
        birthday: '1990-01-01',
    },
    {
        id: 2,
        name: 'Ramesh Kumar',
        email: 'ramesh@example.com',
        password: 'password123',
        phone: '9123456780',
        addresses: [{ id: 1, name: 'Home', street: '123 Anna Salai', city: 'Chennai', zip: '600002', isDefault: true }],
        birthday: '1985-05-20',
    },
    {
        id: 3,
        name: 'Priya Selvam',
        email: 'priya@example.com',
        password: 'password123',
        phone: '9098765432',
        addresses: [{ id: 2, name: 'Work', street: '456 IT Park', city: 'Coimbatore', zip: '641014', isDefault: true }],
        birthday: new Date().toISOString().split('T')[0], // Birthday is today for testing
    },
     {
        id: 4,
        name: 'Anand Rao',
        email: 'anand@example.com',
        password: 'password123',
        phone: '9888777666',
        addresses: [{ id: 3, name: 'Main Residence', street: '789 West Street', city: 'Madurai', zip: '625001', isDefault: true }],
        birthday: '1992-11-30',
    },
];

// --- ORDERS ---
export const mockOrders: Order[] = [
    {
        id: 'LM-2023-001',
        userId: 2,
        customerName: 'Ramesh Kumar',
        date: '2023-10-15',
        items: [{ ...mockProducts[0], quantity: 2 }],
        total: 998,
        status: 'Delivered',
        paymentMethod: 'Prepaid',
        trackingProvider: 'Delhivery',
        trackingNumber: 'AWB123456789',
        reviewedProducts: { 1: true },
    },
    {
        id: 'LM-2023-002',
        userId: 3,
        customerName: 'Priya Selvam',
        date: '2023-10-12',
        items: [{ ...mockProducts[1], quantity: 1 }, { ...mockProducts[8], quantity: 1 }],
        total: 949,
        status: 'Delivered',
        paymentMethod: 'COD',
        trackingProvider: 'Blue Dart',
        trackingNumber: 'BD987654321',
        reviewedProducts: { 2: true },
    },
    {
        id: 'LM-2023-003',
        userId: 4,
        customerName: 'Anand Rao',
        date: '2023-10-10',
        items: [{ ...mockProducts[3], quantity: 5 }],
        total: 4495,
        status: 'Shipped',
        paymentMethod: 'Prepaid',
        trackingProvider: 'Ecom Express',
        trackingNumber: 'EE543216789',
        reviewedProducts: {},
    },
    {
        id: 'LM-2023-004',
        userId: 2,
        customerName: 'Ramesh Kumar',
        date: '2023-11-02',
        items: [{ ...mockProducts[6], quantity: 1 }, { ...mockProducts[4], quantity: 2 }],
        total: 1998,
        status: 'Processing',
        paymentMethod: 'Prepaid',
        reviewedProducts: {},
    },
];

// --- COUPONS ---
export const mockCoupons: Coupon[] = [
    { id: 1, code: 'WELCOME10', description: '10% off on your first order', discountType: 'percentage', discountValue: 10, trigger: 'first_order', isActive: true },
    { id: 2, code: 'FESTIVE50', description: 'Flat ₹50 off on orders above ₹500', discountType: 'fixed', discountValue: 50, minPurchase: 500, trigger: 'none', isActive: true },
    { id: 3, code: 'HAPPYBIRTHDAY', description: 'Special 15% discount on your birthday', discountType: 'percentage', discountValue: 15, trigger: 'birthday', isActive: true },
    { id: 4, code: 'DHOTILOVE', description: '20% off on Golden Border Dhoti', discountType: 'percentage', discountValue: 20, trigger: 'none', applicableProductIds: [3], isActive: true },
];

// --- BANNERS ---
export const mockBanners: Banner[] = [
    { id: 'hero-slider-1', name: 'Hero Slider Image 1', imageUrl: 'https://picsum.photos/seed/hero-main/1200/800' },
    { id: 'hero-slider-2', name: 'Hero Slider Image 2', imageUrl: 'https://picsum.photos/seed/hero-alt1/1200/800' },
    { id: 'hero-slider-3', name: 'Hero Slider Image 3', imageUrl: 'https://picsum.photos/seed/hero-alt2/1200/800' },
    { id: 'temple-collection', name: 'Temple Collection Banner', imageUrl: 'https://picsum.photos/seed/banner-temple/800/500' },
    { id: 'political-wear', name: 'Political Wear Banner', imageUrl: 'https://picsum.photos/seed/banner-political/800/500' },
    { id: 'festive-sale', name: 'Festive Sale Banner', imageUrl: 'https://picsum.photos/seed/festival-offer/1200/400' },
    { id: 'bulk-order-promo', name: 'Bulk Order Promo Banner', imageUrl: 'https://picsum.photos/seed/promo/1200/400' },
];

export const mockStandaloneImages: string[] = [
    'https://picsum.photos/seed/gallery1/800',
    'https://picsum.photos/seed/gallery2/800',
    'https://picsum.photos/seed/gallery3/800',
]

// --- Populate reviews in products ---
mockProducts.forEach(p => {
    p.reviews = mockReviews.filter(r => r.productId === p.id);
    p.reviewCount = p.reviews.length;
    p.rating = p.reviews.length > 0 ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length : 0;
});
