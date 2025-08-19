import { API_BASE_URL } from '../config';
import { Product, Category, Banner, Coupon, User, Order, Review, CartItem } from '../types';

// Helper to get the current user from localStorage for authenticated requests
const getCurrentUser = (): User | null => {
    try {
        const item = window.localStorage.getItem('currentUser');
        if (!item) return null;
        return JSON.parse(item);
    } catch (error) {
        return null;
    }
};

// Helper to construct authenticated headers
const getAuthHeaders = () => {
    const user = getCurrentUser();
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (user?.id) {
        headers['x-user-id'] = String(user.id);
    }
    return headers;
};


// API Functions
export const fetchProducts = async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/products`);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
};

export const fetchProductBySlug = async (slug: string): Promise<Product> => {
    const response = await fetch(`${API_BASE_URL}/products/${slug}`);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
};

export const fetchSiteData = async (): Promise<{ categories: Category[], banners: Banner[], coupons: Coupon[] }> => {
    const response = await fetch(`${API_BASE_URL}/site/data`);
    if (!response.ok) throw new Error('Failed to fetch site data');
    return response.json();
};

export const googleLogin = async (token: { name: string, email: string }): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/google-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(token),
    });
    if (!response.ok) throw new Error('Google login failed');
    return response.json();
};

export const fetchOrders = async (): Promise<Order[]> => {
    const response = await fetch(`${API_BASE_URL}/orders`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
};

export const fetchWishlist = async (): Promise<Product[]> => {
    const response = await fetch(`${API_BASE_URL}/users/wishlist`, { headers: getAuthHeaders() });
    if (!response.ok) throw new Error('Failed to fetch wishlist');
    return response.json();
};

export const toggleWishlist = async (productId: number): Promise<{ success: boolean, wishlist: number[] }> => {
    const response = await fetch(`${API_BASE_URL}/users/wishlist/toggle`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ productId }),
    });
    if (!response.ok) throw new Error('Failed to update wishlist');
    return response.json();
};

export const updateUser = async (userData: Partial<User>): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Failed to update user profile');
    return response.json();
};

export const submitReview = async (reviewData: { productId: number; rating: number; comment: string }): Promise<Review> => {
    const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(reviewData),
    });
    if (!response.ok) throw new Error('Failed to submit review');
    return response.json();
};

export const createOrder = async (orderData: { items: CartItem[], total: number, paymentMethod: string }): Promise<Order> => {
    const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(orderData),
    });
    if (!response.ok) throw new Error('Failed to create order');
    return response.json();
};
