const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// --- MIDDLEWARE ---
app.use(cors());
app.use(express.json());


// --- "DATABASE" & LOGIC (in-memory) ---

const encrypt = (text) => Buffer.from(text).toString('base64');

// --- DATA (Converted from mockData.ts) ---
let baseCategories = [
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

    // Special Virtual/Filter categories
    { id: 6, name: 'All Products', slug: 'all', image: 'https://picsum.photos/seed/cat6/600/400' },
    { id: 7, name: 'Best Selling', slug: 'best-selling', image: 'https://picsum.photos/seed/cat7/600/400' },
    { id: 8, name: 'Recent Products', slug: 'new-arrivals', image: 'https://picsum.photos/seed/cat8/600/400' },
    { id: 9, name: 'Featured Products', slug: 'featured-products', image: 'https://picsum.photos/seed/cat9/600/400' },
];

const getCategory = (slug) => {
    return baseCategories.find(c => c.slug === slug) || baseCategories[0];
};

let baseReviews = [
    { id: 1, productId: 1, userId: 2, author: 'Ramesh K.', rating: 5, comment: 'Excellent quality and very comfortable.', date: '2023-10-10', verifiedBuyer: true, acknowledged: true },
    { id: 2, productId: 1, userId: 1, author: 'Suresh P.', rating: 4, comment: 'Good value for money. Color is vibrant.', date: '2023-10-12', verifiedBuyer: true, acknowledged: true },
    { id: 3, productId: 2, userId: 4, author: 'Anitha', rating: 5, comment: 'Soft material, my husband loves it!', date: '2023-09-20', verifiedBuyer: true, acknowledged: true },
    { id: 4, productId: 4, userId: 3, author: 'Gopal V.', rating: 4, comment: 'The party colors are perfect. Very happy with the purchase.', date: '2023-08-15', verifiedBuyer: true, acknowledged: true },
];

const baseProductsRaw = [
  { id: 1, name: 'Classic Checkered Lungi', slug: 'classic-checkered-lungi', category: getCategory('checkered-lungi'), price: 499, originalPrice: 799, images: ['https://picsum.photos/seed/product1/800/800', 'https://picsum.photos/seed/product1-2/800/800', 'https://picsum.photos/seed/product1-3/800/800'], description: 'A timeless classic, this checkered lungi is made from 100% pure Komarapalayam cotton, known for its softness and durability. Perfect for daily wear.', details: ['100% Cotton', 'Machine Washable', '2.25 meters length', 'Colorfast guarantee'], stock: 120, virtualCategories: ['best-selling', 'featured-products'] },
  { id: 2, name: 'Pure White Temple Dhoti', slug: 'pure-white-temple-dhoti', category: getCategory('temple-dhoti'), price: 899, originalPrice: 1199, images: ['https://picsum.photos/seed/product2/800/800', 'https://picsum.photos/seed/product2-2/800/800'], description: 'Feel divine in our pure white temple dhoti. Woven with care and precision, it offers unparalleled comfort and a graceful drape for all your spiritual occasions.', details: ['Premium Weave Cotton', 'Hand Wash Recommended', '4 meters length', 'Slightly starched for a crisp look'], stock: 75 },
  { id: 3, name: 'Silk Dhoti with Angavastram', slug: 'silk-dhoti-with-angavastram', category: getCategory('matching-dhoti'), price: 1599, originalPrice: 2199, images: ['https://picsum.photos/seed/product3/800/800', 'https://picsum.photos/seed/product3-2/800/800'], description: 'Exquisite silk-blend matching dhoti and angavastram set from the master weavers of Komarapalayam. Features a beautiful golden border for a regal touch.', details: ['Silk-Cotton Blend', 'Dry Clean Only', 'Dhoti: 4m, Angavastram: 2.5m', 'Intricate Zari Border'], stock: 40, virtualCategories: ['featured-products'] },
  { id: 4, name: 'DMK Flag Border Dhoti', slug: 'dmk-flag-border-dhoti', category: getCategory('political-party'), price: 950, originalPrice: 1299, images: ['https://picsum.photos/seed/product4/800/800', 'https://picsum.photos/seed/product4-2/800/800'], description: 'Show your support with this premium cotton dhoti featuring the iconic red and black border. Woven for comfort and durability.', details: ['100% Cotton', 'Machine Washable', '4 meters length', 'Vibrant, colorfast border'], stock: 8 },
  { id: 5, name: 'Absorbent Bath Towel', slug: 'absorbent-bath-towel', category: getCategory('towel'), price: 699, originalPrice: 999, images: ['https://picsum.photos/seed/product5/800/800', 'https://picsum.photos/seed/product5-2/800/800'], description: 'A large, highly absorbent bath towel made from the finest Komarapalayam cotton. Soft to the touch and quick-drying.', details: ['Premium Terry Cotton', 'Machine Washable', 'Size: 75cm x 150cm', 'High GSM for absorbency'], stock: 150, virtualCategories: ['best-selling'] },
  { id: 6, name: 'Striped Casual Lungi', slug: 'striped-casual-lungi', category: getCategory('striped-lungi'), price: 550, originalPrice: 699, images: ['https://picsum.photos/seed/product6/800/800', 'https://picsum.photos/seed/product6-2/800/800'], description: 'A modern take on the traditional lungi with stylish stripes. Perfect for lounging at home or a casual outing.', details: ['100% Cotton', 'Machine Washable', '2.25 meters length', 'Modern striped pattern'], stock: 90 },
  { id: 7, name: 'ADMK Flag Border Dhoti', slug: 'admk-flag-border-dhoti', category: getCategory('political-party'), price: 950, originalPrice: 1299, images: ['https://picsum.photos/seed/product7/800/800'], description: 'Represent your party with pride. This pure cotton dhoti features the signature black, white, and red border, perfectly woven for political events and daily wear.', details: ['100% Premium Cotton', 'Colorfast Guarantee', '4 meters length', 'Authentic Party Colors'], stock: 5, virtualCategories: ['featured-products'] },
  { id: 8, name: 'Cotton Dhoti with Silk Border', slug: 'cotton-dhoti-silk-border', category: getCategory('silk-border-dhoti'), price: 1100, originalPrice: 1400, images: ['https://picsum.photos/seed/product8/800/800'], description: 'The perfect blend of comfort and elegance. This soft cotton dhoti is enhanced with a shimmering silk border.', details: ['100% Cotton with Silk Border', 'Hand Wash Recommended', '4 meters length'], stock: 65 },
  { id: 9, name: 'Wedding Dhoti & Towel Set', slug: 'wedding-dhoti-towel-set', category: getCategory('matching-dhoti'), price: 1899, originalPrice: 2499, images: ['https://picsum.photos/seed/product9/800/800'], description: 'A complete set for the groom, featuring a luxurious silk-blend dhoti and a matching towel, both with ornate zari borders.', details: ['Silk-Cotton Blend', 'Dry Clean Only', 'Perfect for wedding ceremonies'], stock: 30, virtualCategories: ['featured-products'] },
  { id: 10, name: 'Komarapalayam Hand Towel Set', slug: 'komarapalayam-hand-towel-set', category: getCategory('towel'), price: 399, originalPrice: 599, images: ['https://picsum.photos/seed/product10/800/800'], description: 'A set of two soft and durable hand towels, woven in the traditional style of Komarapalayam. Perfect for daily use in the kitchen or bathroom.', details: ['100% Cotton', 'Machine Washable', 'Set of 2', 'Size: 40cm x 60cm'], stock: 200 },
];

const attachReviewData = (product, allReviews) => {
    const productReviews = allReviews.filter(r => r.productId === product.id);
    const reviewCount = productReviews.length;
    const rating = reviewCount > 0
        ? productReviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
        : 0;

    return { ...product, reviews: productReviews, rating, reviewCount };
};

let mockUsers = [
    { id: 1, name: 'Suresh P.', email: 'suresh@example.com', password: encrypt('password123'), phone: '9876543210', birthday: '1990-05-15', addresses: [{ id: 1, name: 'Suresh P. (Home)', street: "123, Weaver's Colony", city: 'Komarapalayam, Tamil Nadu', zip: '638183', isDefault: true }, { id: 2, name: 'Suresh P. (Work)', street: "456, Main Road", city: 'Erode, Tamil Nadu', zip: '638001' }] },
    { id: 2, name: 'Ramesh K.', email: 'ramesh@example.com', password: encrypt('password123'), phone: '9876543211', addresses: [{ id: 3, name: 'Ramesh K. (Home)', street: "789, Gandhi Street", city: 'Chennai, Tamil Nadu', zip: '600001', isDefault: true }] },
    { id: 3, name: 'Gopal V.', email: 'gopal@example.com', password: encrypt('password123'), phone: '9876543212', addresses: [{ id: 4, name: 'Gopal V. (Home)', street: "101, Bazaar Road", city: 'Madurai, Tamil Nadu', zip: '625001', isDefault: true }] },
    { id: 4, name: 'Anitha', email: 'anitha@example.com', password: encrypt('password123'), phone: '9876543213', addresses: [{ id: 5, name: 'Anitha (Home)', street: "212, Kovai Nagar", city: 'Coimbatore, Tamil Nadu', zip: '641001', isDefault: true }] }
];

let baseOrders = [
    { id: 'LM-1024', userId: 1, date: '2023-10-15', total: 1398, status: 'Delivered', customerName: 'Suresh P.', paymentMethod: 'Prepaid', trackingProvider: 'Delhivery', trackingNumber: 'AWB987654321', items: [ { ...baseProductsRaw.find(p => p.id === 1), quantity: 1 }, { ...baseProductsRaw.find(p => p.id === 5), quantity: 1 } ], reviewedProducts: { 1: true, 5: false } },
    { id: 'LM-1023', userId: 2, date: '2023-10-01', total: 899, status: 'Delivered', customerName: 'Ramesh K.', paymentMethod: 'Prepaid', trackingProvider: 'Blue Dart', trackingNumber: 'BD123456789', items: [ { ...baseProductsRaw.find(p => p.id === 2), quantity: 1 } ], reviewedProducts: { 2: true } },
    { id: 'LM-1022', userId: 3, date: '2023-09-29', total: 950, status: 'Shipped', customerName: 'Gopal V.', paymentMethod: 'Prepaid', trackingProvider: 'Ecom Express', trackingNumber: 'EE987123456', items: [ { ...baseProductsRaw.find(p => p.id === 4), quantity: 1 } ], reviewedProducts: {} },
    { id: 'LM-1021', userId: 4, date: '2023-09-28', total: 550, status: 'Processing', customerName: 'Anitha', paymentMethod: 'Prepaid', items: [ { ...baseProductsRaw.find(p => p.id === 6), quantity: 1 } ], reviewedProducts: { 6: false } },
];

let mockCoupons = [
  { id: 1, code: 'FESTIVE10', description: 'Get 10% off on all orders above ₹1000', discountType: 'percentage', discountValue: 10, minPurchase: 1000, trigger: 'none', isActive: true },
  { id: 2, code: 'LUNGIKING', description: '₹150 off on Classic Checkered Lungi', discountType: 'fixed', discountValue: 150, applicableProductIds: [1], trigger: 'none', isActive: true },
  { id: 3, code: 'NEW50', description: 'Flat ₹50 off on your first order', discountType: 'fixed', discountValue: 50, trigger: 'first_order', isActive: true },
  { id: 4, code: 'HBD20', description: '20% off on your birthday! Happy Birthday!', discountType: 'percentage', discountValue: 20, trigger: 'birthday', isActive: true },
];

let baseBanners = [
  { id: 'hero-slider-1', name: 'Hero Slider Image 1', imageUrl: 'https://picsum.photos/seed/hero-main/1200/800' },
  { id: 'hero-slider-2', name: 'Hero Slider Image 2', imageUrl: 'https://picsum.photos/seed/hero-alt1/1200/800' },
  { id: 'hero-slider-3', name: 'Hero Slider Image 3', imageUrl: 'https://picsum.photos/seed/hero-alt2/1200/800' },
  { id: 'temple-collection', name: 'Temple Vibe Banner', imageUrl: 'https://picsum.photos/seed/banner-temple/800/500' },
  { id: 'political-wear', name: 'Political Party Wear Banner', imageUrl: 'https://picsum.photos/seed/banner-political/800/500' },
  { id: 'festive-sale', name: 'Festive Season Sale Banner', imageUrl: 'https://picsum.photos/seed/festival-offer/1200/400' },
  { id: 'bulk-order-promo', name: 'Bulk Order Promo Banner', imageUrl: 'https://picsum.photos/seed/promo/1200/400' },
];

let allProducts = baseProductsRaw.map(p => attachReviewData(p, baseReviews));


// --- API ENDPOINTS ---

app.get('/api/initial-data', (req, res) => {
    res.json({
        products: allProducts,
        categories: baseCategories,
        banners: baseBanners,
        coupons: mockCoupons,
        reviews: baseReviews,
    });
});

app.get('/api/orders', (req, res) => {
    res.json(baseOrders); // For admin panel
});


app.post('/api/login', (req, res) => {
    const { email, phone, password } = req.body;
    const encryptedPassword = encrypt(password);

    let user;
    if (email) {
        user = mockUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    } else if (phone) {
        user = mockUsers.find(u => u.phone === phone);
    }

    if (user && user.password === encryptedPassword) {
        const { password, ...userWithoutPassword } = user;
        res.json({ success: true, user: userWithoutPassword });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials." });
    }
});

app.post('/api/signup', (req, res) => {
    const { name, email, phone, password } = req.body;

    if (mockUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
        return res.status(400).json({ success: false, message: "An account with this email already exists." });
    }

    const newUser = {
        id: Date.now(),
        name,
        email,
        phone,
        password: encrypt(password),
        addresses: [],
        birthday: '',
    };
    mockUsers.push(newUser);
    
    const { password: _, ...userWithoutPassword } = newUser;
    res.json({ success: true, user: userWithoutPassword });
});

app.post('/api/orders', (req, res) => {
    const { userId, items, total, customerName, paymentMethod } = req.body;
    if (!userId || !items || !total || !customerName) {
        return res.status(400).json({ success: false, message: 'Missing order details.' });
    }

    const newOrder = {
        id: `LM-${Date.now().toString().slice(-6)}`,
        userId: parseInt(userId),
        date: new Date().toISOString().split('T')[0],
        items,
        total,
        status: 'Processing',
        customerName,
        reviewedProducts: {},
        paymentMethod: paymentMethod || 'Prepaid'
    };
    baseOrders.unshift(newOrder);

    const user = mockUsers.find(u => u.id === parseInt(userId));

    res.status(201).json({ success: true, order: newOrder });
});

app.put('/api/orders/:orderId', (req, res) => {
    const { orderId } = req.params;
    const { status, trackingProvider, trackingNumber } = req.body;
    const orderIndex = baseOrders.findIndex(o => o.id === orderId);

    if (orderIndex > -1) {
        const originalStatus = baseOrders[orderIndex].status;
        if (status) baseOrders[orderIndex].status = status;
        if (trackingProvider) baseOrders[orderIndex].trackingProvider = trackingProvider;
        if (trackingNumber) baseOrders[orderIndex].trackingNumber = trackingNumber;
        
        res.json({ success: true, order: baseOrders[orderIndex] });
    } else {
        res.status(404).json({ success: false, message: "Order not found." });
    }
});


app.post('/api/reviews', (req, res) => {
    const { productId, orderId, rating, comment, userId, author } = req.body;
    if (!productId || !orderId || !rating || !comment || !userId || !author) {
         return res.status(400).json({ success: false, message: 'Missing review details.' });
    }
    const newReview = {
      id: Date.now(),
      productId: parseInt(productId),
      userId: parseInt(userId),
      author, rating, comment,
      date: new Date().toISOString().split('T')[0],
      verifiedBuyer: true,
      acknowledged: false,
    };
    baseReviews.unshift(newReview);

    const orderIndex = baseOrders.findIndex(o => o.id === orderId);
    if (orderIndex !== -1) {
        baseOrders[orderIndex].reviewedProducts[productId] = true;
    }

    allProducts = baseProductsRaw.map(p => attachReviewData(p, baseReviews));

    res.status(201).json({ success: true, review: newReview, orders: baseOrders });
});

app.put('/api/users/:userId', (req, res) => {
    const { userId } = req.params;
    const updatedUserData = req.body;
    const userIndex = mockUsers.findIndex(u => u.id === parseInt(userId));

    if (userIndex > -1) {
        mockUsers[userIndex] = { ...mockUsers[userIndex], ...updatedUserData };
        const { password, ...userWithoutPassword } = mockUsers[userIndex];
        res.json({ success: true, user: userWithoutPassword });
    } else {
        res.status(404).json({ success: false, message: "User not found." });
    }
});

app.post('/api/notifications/global', (req, res) => {
    const { message, link } = req.body;
    if (!message) {
        return res.status(400).json({ success: false, message: 'Notification message is required.' });
    }
    
    // In a real app, you might queue these jobs. Here we'll just log it.
    console.log(`Simulating global notification to ${mockUsers.length} users:`);
    console.log(`Message: ${message}`);
    console.log(`Link: ${link}`);

    res.json({ success: true, message: `Notification sent to ${mockUsers.length} users.` });
});


// --- STATIC FILE SERVING ---
const __dirname = path.dirname(new URL(import.meta.url).pathname);
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});