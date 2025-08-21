
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { CartItem, Product, User, Review, Order, Coupon, Category, Notification, Banner, Address } from '../types';
import { useToast } from './ToastContext';
import { 
    mockProducts, mockCategories, mockUsers, mockOrders, 
    mockReviews, mockCoupons, mockBanners, mockStandaloneImages 
} from '../services/mockData';

// --- Local Storage Helpers ---
const getFromStorage = <T,>(key: string, defaultValue: T): T => {
    try {
        const item = window.localStorage.getItem(key);
        return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
        console.error(`Error reading from localStorage key “${key}”:`, error);
        return defaultValue;
    }
};

const setToStorage = <T,>(key: string, value: T) => {
    try {
        window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
        console.error(`Error setting localStorage key “${key}”:`, error);
    }
};


interface AppContextType {
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  allOrders: Order[]; // For admin panel
  users: User[]; // For admin panel
  user: User | null;
  reviews: Review[];
  products: Product[];
  categories: Category[];
  notifications: Notification[];
  banners: Banner[];
  coupons: Coupon[];
  standaloneImages: string[];
  isLoading: boolean;
  error: string | null;
  pendingGoogleUser: { name: string; email: string } | null;

  setBanners: (banners: Banner[]) => void;
  setCategories: (categories: Category[]) => void;
  addNotification: (message: string, target: 'user' | 'admin', link?: string) => void;
  sendGlobalNotification: (message: string, link?: string) => void;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: (target: 'user' | 'admin') => void;
  clearAllNotifications: (target: 'user' | 'admin') => void;
  addReview: (productId: number, orderId: string, rating: number, comment: string) => void;
  deleteReview: (reviewId: number) => void;
  acknowledgeReview: (reviewId: number) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  fulfillOrder: (orderId: string, trackingProvider: string, trackingNumber: string) => void;
  updateProduct: (updatedProduct: Product) => void;
  addProduct: (newProductData: Omit<Product, 'id' | 'reviews' | 'rating' | 'reviewCount'>) => void;
  deleteProduct: (productId: number) => void;
  addMultipleProducts: (newProductsData: Omit<Product, 'id' | 'reviews' | 'rating' | 'reviewCount'>[]) => void;
  addOrder: (items: CartItem[], total: number, selectedAddress: Address) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  appliedCoupon: Coupon | null;
  cartDiscount: number;
  cartFinalTotal: number;
  applyCoupon: (couponCode: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  isQuietZoneActive: boolean;
  toggleQuietZone: () => void;
  loginWithGoogle: (googleUser: { name: string; email: string }) => { success: boolean, isNewUser: boolean, message: string };
  signInWithEmail: (credentials: { email: string, password: string }) => { success: boolean, message: string };
  signUpWithEmail: (userData: Omit<User, 'id'|'addresses'>) => { success: boolean, message: string };
  signInWithPhone: (credentials: { phone: string, password: string }) => { success: boolean, message: string };
  completeSignup: (details: { name: string, birthday: string, phone: string, address: Omit<Address, 'id' | 'isDefault'> }) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  deleteAccount: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  updateCoupon: (coupon: Coupon) => void;
  deleteCoupon: (couponId: number) => void;
  addStandaloneImage: (imageUrl: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { addToast } = useToast();
    
    // --- STATE MANAGEMENT ---
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [categories, setCategories] = useState<Category[]>(mockCategories);
    const [users, setUsers] = useState<User[]>(mockUsers);
    const [allOrders, setAllOrders] = useState<Order[]>(mockOrders); // For admin
    const [reviews, setReviews] = useState<Review[]>(mockReviews);
    const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);
    const [banners, setBanners] = useState<Banner[]>(mockBanners);
    const [standaloneImages, setStandaloneImages] = useState<string[]>(mockStandaloneImages);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    
    // User-specific state with localStorage persistence
    const [user, setUser] = useState<User | null>(() => getFromStorage('user', null));
    const [cart, setCart] = useState<CartItem[]>(() => getFromStorage('cart', []));
    const [wishlist, setWishlist] = useState<Product[]>(() => getFromStorage('wishlist', []));
    const [isQuietZoneActive, setIsQuietZoneActive] = useState<boolean>(() => getFromStorage('quietZone', false));
    const [pendingGoogleUser, setPendingGoogleUser] = useState<{name: string, email: string} | null>(null);

    // Coupon state
    const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

    // Persist changes to localStorage
    useEffect(() => { setToStorage('user', user); }, [user]);
    useEffect(() => { setToStorage('cart', cart); }, [cart]);
    useEffect(() => { setToStorage('wishlist', wishlist); }, [wishlist]);
    useEffect(() => { setToStorage('quietZone', isQuietZoneActive); }, [isQuietZoneActive]);

    // --- COMPUTED VALUES ---
    const cartCount = useMemo(() => cart.reduce((count, item) => count + item.quantity, 0), [cart]);
    const cartTotal = useMemo(() => cart.reduce((total, item) => total + item.price * item.quantity, 0), [cart]);
    const wishlistCount = useMemo(() => wishlist.length, [wishlist]);

    const { cartDiscount, cartFinalTotal } = useMemo(() => {
        if (!appliedCoupon) return { cartDiscount: 0, cartFinalTotal: cartTotal };
        let discount = 0;
        if (appliedCoupon.discountType === 'percentage') {
            discount = cartTotal * (appliedCoupon.discountValue / 100);
        } else {
            discount = appliedCoupon.discountValue;
        }
        return { cartDiscount: discount, cartFinalTotal: Math.max(0, cartTotal - discount) };
    }, [cartTotal, appliedCoupon]);

    const orders = useMemo(() => user ? allOrders.filter(o => o.userId === user.id) : [], [user, allOrders]);

    // --- FUNCTIONS ---
    const showNotification = useCallback((message: string) => {
        if (!isQuietZoneActive) {
            addToast(message, 'info');
        }
    }, [isQuietZoneActive, addToast]);

    const addToCart = useCallback((product: Product, quantity = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                const newQuantity = Math.min(product.stock, existingItem.quantity + quantity);
                return prevCart.map(item => item.id === product.id ? { ...item, quantity: newQuantity } : item);
            }
            return [...prevCart, { ...product, quantity }];
        });
        showNotification(`${product.name} added to cart!`);
    }, [showNotification]);

    const removeFromCart = useCallback((productId: number) => {
        setCart(prev => prev.filter(item => item.id !== productId));
        addToast("Item removed from cart", 'info');
    }, [addToast]);

    const updateQuantity = useCallback((productId: number, quantity: number) => {
        setCart(prev => {
            if (quantity <= 0) return prev.filter(item => item.id !== productId);
            const product = products.find(p => p.id === productId);
            const newQuantity = Math.min(product?.stock || 0, quantity);
            return prev.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item);
        });
    }, [products]);

    const clearCart = useCallback(() => setCart([]), []);

    const toggleWishlist = useCallback((product: Product) => {
        setWishlist(prev => {
            const isInWishlist = prev.some(item => item.id === product.id);
            if (isInWishlist) {
                addToast(`${product.name} removed from wishlist`, 'info');
                return prev.filter(item => item.id !== product.id);
            } else {
                addToast(`${product.name} added to wishlist`, 'info');
                return [...prev, product];
            }
        });
    }, [addToast]);

    const isInWishlist = useCallback((productId: number) => wishlist.some(p => p.id === productId), [wishlist]);

    const applyCoupon = useCallback((couponCode: string) => {
        const coupon = coupons.find(c => c.code === couponCode && c.isActive);
        if (!coupon) return { success: false, message: 'Invalid coupon code.' };
        if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
            return { success: false, message: `Minimum purchase of ₹${coupon.minPurchase} required.` };
        }
        setAppliedCoupon(coupon);
        return { success: true, message: 'Coupon applied!' };
    }, [coupons, cartTotal]);

    const removeCoupon = useCallback(() => setAppliedCoupon(null), []);
    
    const addOrder = useCallback((items: CartItem[], total: number, selectedAddress: Address) => {
        if (!user) return;
        const newOrder: Order = {
            id: `LM-${Date.now()}`,
            userId: user.id,
            customerName: user.name,
            date: new Date().toISOString(),
            items,
            total,
            status: 'Processing',
            paymentMethod: 'Prepaid',
            reviewedProducts: {}
        };
        setAllOrders(prev => [newOrder, ...prev]);
        clearCart();
        removeCoupon();
        addNotification(`Your order #${newOrder.id} has been placed!`, 'user', `/invoice/${btoa(newOrder.id)}`);
    }, [user, clearCart, removeCoupon]);
    
    // --- AUTH FUNCTIONS ---
    const logout = () => {
        setUser(null);
        setCart([]);
        setWishlist([]);
    };

    const loginWithGoogle = (googleUser: { name: string; email: string }) => {
        const existingUser = users.find(u => u.email === googleUser.email);
        if (existingUser) {
            setUser(existingUser);
            return { success: true, isNewUser: false, message: 'Login successful!' };
        } else {
            setPendingGoogleUser(googleUser);
            return { success: true, isNewUser: true, message: 'New user detected. Please complete your profile.' };
        }
    };
    
    const completeSignup = (details: { name: string, birthday: string, phone: string, address: Omit<Address, 'id' | 'isDefault'> }) => {
        if (!pendingGoogleUser) return;
        const newUser: User = {
            id: Date.now(),
            name: details.name,
            email: pendingGoogleUser.email,
            phone: details.phone,
            birthday: details.birthday,
            addresses: [{ ...details.address, id: Date.now(), isDefault: true }],
        };
        setUsers(prev => [...prev, newUser]);
        setUser(newUser);
        setPendingGoogleUser(null);
        addToast(`Welcome, ${newUser.name}!`, 'success');
    };

    const signInWithEmail = ({ email, password }: { email: string, password: string }) => {
        const foundUser = users.find(u => u.email === email && u.password === password);
        if (foundUser) {
            setUser(foundUser);
            return { success: true, message: 'Login successful!' };
        }
        return { success: false, message: 'Invalid email or password.' };
    };

    const signInWithPhone = ({ phone, password }: { phone: string, password: string }) => {
        const foundUser = users.find(u => u.phone === phone && u.password === password);
        if (foundUser) {
            setUser(foundUser);
            return { success: true, message: 'Login successful!' };
        }
        return { success: false, message: 'Invalid phone number or password.' };
    };

    const signUpWithEmail = (userData: Omit<User, 'id'|'addresses'>) => {
        if (users.some(u => u.email === userData.email)) {
            return { success: false, message: 'An account with this email already exists.' };
        }
        const newUser: User = { ...userData, id: Date.now(), addresses: [] };
        setUsers(prev => [...prev, newUser]);
        setUser(newUser);
        addToast(`Welcome, ${newUser.name}!`, 'success');
        return { success: true, message: 'Account created successfully!' };
    };
    
    const updateUser = (updatedUser: User) => {
        if (!user) return;
        setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
        if(user.id === updatedUser.id) {
            setUser(updatedUser);
        }
        addToast('Profile updated!', 'success');
    };

    const deleteAccount = () => {
        if (!user) return;
        // In a real app, you'd also delete their data. Here we just log them out.
        logout();
        addToast('Account deleted successfully.', 'info');
    };

    const toggleQuietZone = () => setIsQuietZoneActive(prev => !prev);
    
    // --- ADMIN FUNCTIONS ---

    const addNotification = (message: string, target: 'user' | 'admin', link?: string) => {
        const newNotif: Notification = {
            id: Date.now(),
            message, target, link,
            read: false,
            timestamp: new Date().toISOString()
        };
        setNotifications(prev => [newNotif, ...prev]);
    };

    const sendGlobalNotification = (message: string, link?: string) => {
        users.forEach(u => {
             const newNotif: Notification = {
                id: Date.now() + u.id,
                message, 
                target: 'user', 
                link,
                read: false,
                timestamp: new Date().toISOString()
            };
            setNotifications(prev => [newNotif, ...prev]);
        });
        addNotification(`Global notification sent: "${message}"`, 'admin');
    };

    const markAsRead = (id: number) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = (target: 'user' | 'admin') => {
        setNotifications(prev => prev.map(n => n.target === target ? { ...n, read: true } : n));
    };
    
    const clearAllNotifications = (target: 'user' | 'admin') => {
        setNotifications(prev => prev.filter(n => n.target !== target));
    };

    const addReview = (productId: number, orderId: string, rating: number, comment: string) => {
        if(!user) return;
        const newReview: Review = {
            id: Date.now(),
            productId,
            userId: user.id,
            author: user.name,
            rating,
            comment,
            date: new Date().toISOString(),
            verifiedBuyer: true,
            acknowledged: false
        };
        setReviews(prev => [newReview, ...prev]);
        setProducts(prev => prev.map(p => {
            if (p.id === productId) {
                const updatedReviews = [...p.reviews, newReview];
                return {
                    ...p,
                    reviews: updatedReviews,
                    reviewCount: updatedReviews.length,
                    rating: updatedReviews.reduce((acc, r) => acc + r.rating, 0) / updatedReviews.length
                };
            }
            return p;
        }));
        setAllOrders(prev => prev.map(o => o.id === orderId ? {...o, reviewedProducts: {...o.reviewedProducts, [productId]: true}} : o));
        addToast('Thank you for your review!', 'success');
        addNotification(`New review for ${products.find(p=>p.id === productId)?.name} from ${user.name}`, 'admin', '/admin/reviews');
    };

    const deleteReview = (reviewId: number) => setReviews(prev => prev.filter(r => r.id !== reviewId));
    const acknowledgeReview = (reviewId: number) => setReviews(prev => prev.map(r => r.id === reviewId ? {...r, acknowledged: true} : r));

    const updateOrderStatus = (orderId: string, status: Order['status']) => {
        setAllOrders(prev => prev.map(o => o.id === orderId ? {...o, status} : o));
    };

    const fulfillOrder = (orderId: string, trackingProvider: string, trackingNumber: string) => {
        setAllOrders(prev => prev.map(o => o.id === orderId ? {...o, status: 'Shipped', trackingProvider, trackingNumber} : o));
        addNotification(`Your order #${orderId} has been shipped!`, 'user', '/profile');
    };

    const addProduct = (newProductData: Omit<Product, 'id' | 'reviews' | 'rating' | 'reviewCount'>) => {
        const newProduct: Product = {
            ...newProductData,
            id: Date.now(),
            reviews: [], rating: 0, reviewCount: 0
        };
        setProducts(prev => [newProduct, ...prev]);
    };
    
    const addMultipleProducts = (newProductsData: Omit<Product, 'id' | 'reviews' | 'rating' | 'reviewCount'>[]) => {
        const newProducts: Product[] = newProductsData.map((p, i) => ({
            ...p,
            id: Date.now() + i,
            reviews: [], rating: 0, reviewCount: 0
        }));
        setProducts(prev => [...newProducts, ...prev]);
    };

    const updateProduct = (updatedProduct: Product) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const deleteProduct = (productId: number) => {
        setProducts(prev => prev.filter(p => p.id !== productId));
    };
    
    const addCoupon = (coupon: Omit<Coupon, 'id'>) => setCoupons(prev => [{...coupon, id: Date.now()}, ...prev]);
    const updateCoupon = (coupon: Coupon) => setCoupons(prev => prev.map(c => c.id === coupon.id ? coupon : c));
    const deleteCoupon = (couponId: number) => setCoupons(prev => prev.filter(c => c.id !== couponId));
    
    const addStandaloneImage = (imageUrl: string) => setStandaloneImages(prev => [imageUrl, ...prev]);

    return (
        <AppContext.Provider value={{ 
            cart, wishlist, orders, user, reviews, products, categories, notifications,
            allOrders, users, coupons, banners, standaloneImages,
            isLoading: false, error: null, pendingGoogleUser,
            setBanners, setCategories,
            addNotification, sendGlobalNotification, markAsRead, markAllAsRead, clearAllNotifications,
            addReview, deleteReview, acknowledgeReview,
            updateOrderStatus, fulfillOrder,
            addProduct, updateProduct, deleteProduct, addMultipleProducts,
            addOrder, addToCart, removeFromCart, updateQuantity, clearCart,
            cartCount, cartTotal, wishlistCount, appliedCoupon, cartDiscount, cartFinalTotal,
            applyCoupon, removeCoupon,
            toggleWishlist, isInWishlist,
            isQuietZoneActive, toggleQuietZone,
            loginWithGoogle, signInWithEmail, signInWithPhone, signUpWithEmail, completeSignup,
            logout, updateUser, deleteAccount,
            addCoupon, updateCoupon, deleteCoupon, addStandaloneImage,
        }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
