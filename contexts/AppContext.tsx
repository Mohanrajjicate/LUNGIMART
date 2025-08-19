

import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { CartItem, Product, User, Review, Order, Coupon, Category, Notification, Banner } from '../types';
import { baseReviews, baseOrders, baseProducts, attachReviewData, mockUsers, baseCategories, baseBanners, mockCoupons, mockWishlists } from '../services/mockData';
import { encrypt, decrypt } from '../utils/crypto';

interface AppContextType {
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  user: User | null;
  reviews: Review[];
  products: Product[];
  categories: Category[];
  notifications: Notification[];
  banners: Banner[];
  coupons: Coupon[];
  setBanners: (banners: Banner[]) => void;
  setCategories: (categories: Category[]) => void;
  addNotification: (message: string, target: 'user' | 'admin', link?: string) => void;
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
  addOrder: (items: CartItem[], total: number) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  appliedCoupon: Coupon | null;
  cartDiscount: number;
  cartFinalTotal: number;
  applyCoupon: (couponCode: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  wishlistCount: number;
  login: (phone: string, password: string) => { success: boolean; message: string };
  logout: () => void;
  updateUser: (updatedUser: User) => void;
  addUser: (userData: Omit<User, 'id' | 'addresses'>) => User;
  findUserByPhone: (phone: string) => User | undefined;
  findUserByEmail: (email: string) => User | undefined;
  isQuietZoneActive: boolean;
  toggleQuietZone: () => void;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  updateCoupon: (coupon: Coupon) => void;
  deleteCoupon: (couponId: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialState = <T,>(key: string, defaultValue: T, isEncrypted = false): T => {
  try {
    const item = window.localStorage.getItem(key);
    if (!item) return defaultValue;
    const data = isEncrypted ? decrypt(item) : item;
    return JSON.parse(data);
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Master Data - "The Database"
  const [allUsers, setAllUsers] = useState<User[]>(() => getInitialState<User[]>('allUsers', mockUsers, true));
  const [allOrders, setAllOrders] = useState<Order[]>(() => getInitialState<Order[]>('allOrders', baseOrders));
  const [allReviews, setAllReviews] = useState<Review[]>(() => getInitialState<Review[]>('allReviews', baseReviews));
  const [allWishlists, setAllWishlists] = useState<{ [userId: number]: number[] }>(() => getInitialState('allWishlists', mockWishlists));

  // Global App Data
  const [products, setProducts] = useState<Product[]>(() => getInitialState<Product[]>('products', []));
  const [categories, setCategories] = useState<Category[]>(() => getInitialState<Category[]>('categories', baseCategories));
  const [banners, setBanners] = useState<Banner[]>(() => getInitialState<Banner[]>('banners', baseBanners));
  const [coupons, setCoupons] = useState<Coupon[]>(() => getInitialState<Coupon[]>('coupons', mockCoupons));
  const [notifications, setNotifications] = useState<Notification[]>(() => getInitialState<Notification[]>('notifications', []));
  const [isQuietZoneActive, setIsQuietZoneActive] = useState<boolean>(() => getInitialState<boolean>('quietZone', false));
  
  // Session / User-Specific State
  const [currentUser, setCurrentUser] = useState<User | null>(() => getInitialState<User | null>('currentUser', null, true));
  const [cart, setCart] = useState<CartItem[]>(() => getInitialState<CartItem[]>('cart', []));
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => getInitialState<Coupon | null>('appliedCoupon', null));

  // Initialize products with review data
  useEffect(() => {
    const initialProducts = getInitialState<Product[]>('products', []);
    if (initialProducts.length === 0) {
        const productsWithReviews = baseProducts.map(p => attachReviewData(p, allReviews));
        setProducts(productsWithReviews);
    }
  }, []);

  const updateProductsWithReviews = useCallback(() => {
    setProducts(prevProducts => {
        const baseProductMap = new Map(prevProducts.map(p => [p.id, { ...p, reviews: [], rating: 0, reviewCount: 0 }]));
        baseProducts.forEach(bp => {
            const existing = baseProductMap.get(bp.id);
            baseProductMap.set(bp.id, { ...existing, ...bp });
        });
        const updatedProducts = Array.from(baseProductMap.values()).map(p => attachReviewData(p as any, allReviews));
        return updatedProducts;
    });
  }, [allReviews]);

  useEffect(() => {
    updateProductsWithReviews();
  }, [allReviews, updateProductsWithReviews]);

  // Persistence Effects
  useEffect(() => { localStorage.setItem('allUsers', encrypt(JSON.stringify(allUsers))); }, [allUsers]);
  useEffect(() => { localStorage.setItem('currentUser', encrypt(JSON.stringify(currentUser))); }, [currentUser]);
  useEffect(() => { localStorage.setItem('allOrders', JSON.stringify(allOrders)); }, [allOrders]);
  useEffect(() => { localStorage.setItem('allReviews', JSON.stringify(allReviews)); }, [allReviews]);
  useEffect(() => { localStorage.setItem('allWishlists', JSON.stringify(allWishlists)); }, [allWishlists]);
  useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('banners', JSON.stringify(banners)); }, [banners]);
  useEffect(() => { localStorage.setItem('coupons', JSON.stringify(coupons)); }, [coupons]);
  useEffect(() => { localStorage.setItem('notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('quietZone', JSON.stringify(isQuietZoneActive)); }, [isQuietZoneActive]);
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon)); }, [appliedCoupon]);
  
  // Derived user-specific data for context value
  const userWishlistProductIds = useMemo(() => (currentUser ? allWishlists[currentUser.id] || [] : []), [currentUser, allWishlists]);
  const wishlist = useMemo(() => products.filter(p => userWishlistProductIds.includes(p.id)), [products, userWishlistProductIds]);
  const orders = useMemo(() => (currentUser ? allOrders.filter(o => o.userId === currentUser.id) : []), [currentUser, allOrders]);

  const login = (phone: string, password: string): { success: boolean; message: string } => {
    const user = findUserByPhone(phone);
    if (!user) {
        return { success: false, message: "No account found with this phone number." };
    }
    if (decrypt(user.password) !== password) {
        return { success: false, message: "Incorrect password." };
    }
    setCurrentUser(user);
    return { success: true, message: "Logged in successfully." };
  };

  const logout = () => {
    setCurrentUser(null);
    clearCart(); // Also clear cart on logout
  }
  const findUserByPhone = (phone: string): User | undefined => allUsers.find(u => u.phone === phone);
  const findUserByEmail = (email: string): User | undefined => allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  
  const addUser = (userData: Omit<User, 'id' | 'addresses'>): User => {
      const newUser: User = {
          ...userData,
          id: Date.now(),
          addresses: [],
          password: encrypt(userData.password), // Encrypt password on creation
      };
      setAllUsers(prev => [...prev, newUser]);
      return newUser;
  };

  const updateUser = (updatedUser: User) => {
      setAllUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
      if (currentUser?.id === updatedUser.id) {
          setCurrentUser(updatedUser);
      }
  };

  const addNotification = (message: string, target: 'user' | 'admin', link?: string) => {
      const newNotification: Notification = {
          id: Date.now(), message, target, link, read: false, timestamp: new Date().toISOString(),
      };
      setNotifications(prev => [newNotification, ...prev]);
  };
  const markAsRead = (id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  const markAllAsRead = (target: 'user' | 'admin') => setNotifications(prev => prev.map(n => n.target === target ? { ...n, read: true } : n));
  const clearAllNotifications = (target: 'user' | 'admin') => setNotifications(prev => prev.filter(n => n.target !== target));

  const addReview = (productId: number, orderId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    const newReview: Review = {
        id: Date.now(), productId, userId: currentUser.id, author: currentUser.name, rating, comment,
        date: new Date().toISOString().split('T')[0], verifiedBuyer: true, acknowledged: false,
    };
    setAllReviews(prev => [newReview, ...prev]);
    setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, reviewedProducts: { ...o.reviewedProducts, [productId]: true } } : o));
    addNotification(`New review for "${products.find(p=>p.id===productId)?.name || 'a product'}" from ${currentUser.name}.`, 'admin', '/admin/reviews');
  };
  const deleteReview = (id: number) => setAllReviews(prev => prev.filter(r => r.id !== id));
  const acknowledgeReview = (id: number) => setAllReviews(prev => prev.map(r => r.id === id ? { ...r, acknowledged: true } : r));
  
  const fulfillOrder = (orderId: string, trackingProvider: string, trackingNumber: string) => {
    setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Shipped', trackingProvider, trackingNumber } : o));
    addNotification(`Your order #${orderId.slice(-4)} has shipped!`, 'user', '/profile');
    addNotification(`Order #${orderId.slice(-4)} marked as shipped.`, 'admin', '/admin/orders');
  };
  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
    addNotification(`Your order #${orderId.slice(-4)} status is now: ${status}.`, 'user', '/profile');
    addNotification(`Order #${orderId.slice(-4)} status updated to ${status}.`, 'admin', '/admin/orders');
  };

  const updateProduct = (p: Product) => setProducts(prev => prev.map(i => i.id === p.id ? p : i));
  const addProduct = (p: Omit<Product, 'id' | 'reviews'|'rating'|'reviewCount'>) => {
      const newProduct = { ...p, id: Date.now(), reviews: [], rating: 0, reviewCount: 0 };
      setProducts(prev => [...prev, newProduct]);
  };
  const deleteProduct = (id: number) => setProducts(prev => prev.filter(p => p.id !== id));
  const addMultipleProducts = (newData: Omit<Product, 'id'|'reviews'|'rating'|'reviewCount'>[]) => {
      const newProducts = newData.map(p => ({ ...p, id: Date.now()+Math.random(), reviews:[], rating:0, reviewCount:0 }));
      setProducts(prev => [...prev, ...newProducts]);
  };
  
  const addOrder = (items: CartItem[], total: number) => {
      if (!currentUser) return;
      const newOrder: Order = {
          id: `LM-${Date.now().toString().slice(-6)}`, userId: currentUser.id, date: new Date().toISOString().split('T')[0],
          items, total, status: 'Processing', customerName: currentUser.name, reviewedProducts: {}, paymentMethod: 'Prepaid'
      };
      setAllOrders(prev => [newOrder, ...prev]);
      addNotification(`New order #${newOrder.id.slice(-4)} received!`, 'admin', '/admin/dashboard');
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prev => {
      const item = prev.find(i => i.id === product.id);
      return item 
        ? prev.map(i => i.id === product.id ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) } : i)
        : [...prev, { ...product, quantity }];
    });
  };
  const removeFromCart = (id: number) => setCart(prev => prev.filter(i => i.id !== id));
  const updateQuantity = (id: number, quantity: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    if (quantity <= 0) removeFromCart(id);
    else setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.min(quantity, product.stock) } : i));
  };
  const clearCart = () => { setCart([]); removeCoupon(); };
  
  const toggleWishlist = (product: Product) => {
    if (!currentUser) return;
    setAllWishlists(prev => {
        const currentWishlist = prev[currentUser.id] || [];
        const newWishlist = currentWishlist.includes(product.id)
            ? currentWishlist.filter(id => id !== product.id)
            : [...currentWishlist, product.id];
        return { ...prev, [currentUser.id]: newWishlist };
    });
  };
  const isInWishlist = (productId: number) => {
    if (!currentUser) return false;
    return (allWishlists[currentUser.id] || []).includes(productId);
  };
  
  const toggleQuietZone = () => setIsQuietZoneActive(prev => !prev);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const wishlistCount = wishlist.length;

  const applyCoupon = (code: string): { success: boolean; message: string } => {
    const coupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    if (!coupon) return { success: false, message: "Invalid coupon code." };
    if (!coupon.isActive) return { success: false, message: "This coupon is currently inactive." };
    if (coupon.trigger === 'first_order') {
        if (!currentUser) return { success: false, message: "You must be logged in." };
        if (orders.length > 0) return { success: false, message: "This coupon is only for your first order." };
    }
    if (coupon.trigger === 'birthday') {
        if (!currentUser || !currentUser.birthday) return { success: false, message: "Set your birthday in your profile." };
        const today = new Date();
        const userBday = new Date(currentUser.birthday);
        if (today.getMonth() !== userBday.getMonth() || today.getDate() !== userBday.getDate()) return { success: false, message: "It's not your birthday yet!" };
    }
    if (coupon.minPurchase && cartTotal < coupon.minPurchase) return { success: false, message: `Minimum purchase of ₹${coupon.minPurchase} required.` };
    if (coupon.applicableProductIds?.length) {
        if (!cart.some(item => coupon.applicableProductIds!.includes(item.id))) return { success: false, message: "Coupon not applicable to items in cart." };
    }
    setAppliedCoupon(coupon);
    return { success: true, message: "Coupon applied!" };
  };
  const removeCoupon = () => setAppliedCoupon(null);
  
  const { cartDiscount, cartFinalTotal } = useMemo(() => {
    let discount = 0;
    if (appliedCoupon && cart.length > 0) {
        const isApplicable = !appliedCoupon.minPurchase || cartTotal >= appliedCoupon.minPurchase;
        if (isApplicable) {
            if (appliedCoupon.applicableProductIds?.length) {
                const applicableTotal = cart.filter(item => appliedCoupon.applicableProductIds!.includes(item.id)).reduce((t, i) => t + i.price * i.quantity, 0);
                discount = appliedCoupon.discountType === 'percentage' ? (applicableTotal * appliedCoupon.discountValue) / 100 : appliedCoupon.discountValue;
                discount = Math.min(discount, applicableTotal);
            } else {
                discount = appliedCoupon.discountType === 'percentage' ? (cartTotal * appliedCoupon.discountValue) / 100 : appliedCoupon.discountValue;
            }
        }
    }
    discount = Math.min(discount, cartTotal);
    return { cartDiscount: discount, cartFinalTotal: cartTotal - discount };
  }, [cart, cartTotal, appliedCoupon]);

  const addCoupon = (c: Omit<Coupon, 'id'>) => setCoupons(prev => [{ ...c, id: Date.now() }, ...prev]);
  const updateCoupon = (c: Coupon) => setCoupons(prev => prev.map(i => i.id === c.id ? c : i));
  const deleteCoupon = (id: number) => setCoupons(prev => prev.filter(c => c.id !== id));

  return (
    <AppContext.Provider value={{
      cart, wishlist, orders, user: currentUser, reviews: allReviews, products, categories, notifications, banners, coupons,
      setBanners, setCategories, addNotification, markAsRead, markAllAsRead, clearAllNotifications,
      addReview, deleteReview, acknowledgeReview, updateOrderStatus, fulfillOrder, updateProduct, addProduct, deleteProduct, addMultipleProducts, addOrder,
      addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal,
      appliedCoupon, cartDiscount, cartFinalTotal, applyCoupon, removeCoupon,
      toggleWishlist, isInWishlist, wishlistCount, login, logout, updateUser, addUser, findUserByPhone, findUserByEmail,
      isQuietZoneActive, toggleQuietZone, addCoupon, updateCoupon, deleteCoupon
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};