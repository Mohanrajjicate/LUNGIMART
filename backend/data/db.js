import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// In-memory data store, loaded from JSON files
let data = {
    products: require('./products.json'),
    categories: require('./categories.json'),
    users: require('./users.json'),
    orders: require('./orders.json'),
    reviews: require('./reviews.json'),
    coupons: require('./coupons.json'),
    banners: require('./banners.json'),
    wishlists: require('./wishlists.json'),
};

// --- Helper Functions ---
const attachReviewData = (product, allReviews) => {
    if (!product) return null;
    const productReviews = allReviews.filter(r => r.productId === product.id);
    const reviewCount = productReviews.length;
    const rating = reviewCount > 0
        ? productReviews.reduce((acc, r) => acc + r.rating, 0) / reviewCount
        : 0;
    return { ...product, reviews: productReviews, rating, reviewCount };
};

const getFullProduct = (product, store) => {
    if (!product) return null;
    const productWithReviews = attachReviewData(product, store.reviews);
    return {
        ...productWithReviews,
        category: store.categories.find(c => c.id === product.categoryId),
    };
};

// --- Public DB Interface ---
export const db = {
    // --- READ OPERATIONS ---
    getAllProducts: () => {
        const store = JSON.parse(JSON.stringify(data)); // Deep copy
        return store.products.map(p => getFullProduct(p, store));
    },
    getProductById: (id) => {
        const store = JSON.parse(JSON.stringify(data));
        const product = store.products.find(p => p.id === id);
        return getFullProduct(product, store);
    },
    getAllCategories: () => data.categories,
    getAllOrders: () => data.orders,
    getOrdersByUserId: (userId) => data.orders.filter(o => o.userId === userId),
    findUserByEmail: (email) => data.users.find(u => u.email.toLowerCase() === email.toLowerCase()),
    getAllBanners: () => data.banners,
    getAllCoupons: () => data.coupons,
    getWishlistByUserId: (userId) => {
        const productIds = data.wishlists[userId] || [];
        const store = JSON.parse(JSON.stringify(data));
        return productIds.map(id => {
            const product = store.products.find(p => p.id === id);
            return getFullProduct(product, store);
        }).filter(Boolean);
    },

    // --- WRITE OPERATIONS (In-Memory) ---
    addUser: (userData) => {
        const newUser = {
            id: Date.now(),
            addresses: [],
            ...userData,
        };
        data.users.push(newUser);
        return newUser;
    },

    addOrder: (orderData) => {
        const newOrder = {
            ...orderData,
            id: `LM-${Date.now().toString().slice(-6)}`,
            date: new Date().toISOString().split('T')[0],
        };
        data.orders.unshift(newOrder); // Add to the top
        return newOrder;
    },

    updateOrderStatus: (orderId, status) => {
        const orderIndex = data.orders.findIndex(o => o.id === orderId);
        if (orderIndex !== -1) {
            data.orders[orderIndex].status = status;
            return data.orders[orderIndex];
        }
        return null;
    },
};
