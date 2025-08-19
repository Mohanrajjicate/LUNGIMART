import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { CartItem, Product, User, Review, Order, Coupon, Category, Notification, Banner, Address } from '../types';
import * as api from '../services/api';

interface AppContextType {
  cart: CartItem[];
  wishlist: Product[];
  orders: Order[];
  user: User | null;
  products: Product[];
  categories: Category[];
  notifications: Notification[];
  banners: Banner[];
  coupons: Coupon[];
  
  // State setters (some might be removed if not used by admin)
  setBanners: (banners: Banner[]) => void;
  setCategories: (categories: Category[]) => void;

  // Actions
  addNotification: (message: string, target: 'user' | 'admin', link?: string) => void;
  sendGlobalNotification: (message: string, link?: string) => void;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: (target: 'user' | 'admin') => void;
  clearAllNotifications: (target: 'user' | 'admin') => void;
  
  addReview: (productId: number, orderId: string, rating: number, comment: string) => Promise<void>;
  
  // Admin actions (to be refactored to an admin context later)
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  fulfillOrder: (orderId: string, trackingProvider: string, trackingNumber: string) => void;
  updateProduct: (updatedProduct: Product) => void;
  addProduct: (newProductData: Omit<Product, 'id' | 'reviews' | 'rating' | 'reviewCount'>) => void;
  deleteProduct: (productId: number) => void;
  addMultipleProducts: (newProductsData: Omit<Product, 'id' | 'reviews' | 'rating' | 'reviewCount'>[]) => void;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  updateCoupon: (coupon: Coupon) => void;
  deleteCoupon: (couponId: number) => void;
  
  // Cart
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  
  // Coupon
  appliedCoupon: Coupon | null;
  cartDiscount: number;
  cartFinalTotal: number;
  applyCoupon: (couponCode: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  
  // Wishlist
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: number) => boolean;
  wishlistCount: number;
  
  // User / Auth
  loginWithGoogle: (googleUser: { name: string; email: string; }) => Promise<void>;
  logout: () => void;
  updateUser: (updatedUser: Partial<User>) => Promise<void>;
  
  // Misc
  isQuietZoneActive: boolean;
  toggleQuietZone: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialState = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Global App Data (fetched from API)
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  // User-Specific Data (fetched from API when logged in)
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  
  // Session / User-Specific State (persisted in localStorage)
  const [currentUser, setCurrentUser] = useState<User | null>(() => getInitialState<User | null>('currentUser', null));
  const [cart, setCart] = useState<CartItem[]>(() => getInitialState<CartItem[]>('cart', []));
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => getInitialState<Coupon | null>('appliedCoupon', null));
  const [notifications, setNotifications] = useState<Notification[]>(() => getInitialState<Notification[]>('notifications', []));
  const [isQuietZoneActive, setIsQuietZoneActive] = useState<boolean>(() => getInitialState<boolean>('quietZone', false));

  // --- DATA FETCHING EFFECTS ---

  // Initial load for site-wide data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [productsData, siteData] = await Promise.all([
          api.fetchProducts(),
          api.fetchSiteData()
        ]);
        setProducts(productsData);
        setCategories(siteData.categories);
        setBanners(siteData.banners);
        setCoupons(siteData.coupons);
      } catch (error) {
        console.error("Failed to load initial site data:", error);
        // Handle error display to user
      }
    };
    loadInitialData();
  }, []);

  // Load user-specific data when user logs in or page loads with a user session
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        try {
          const [userOrders, userWishlist] = await Promise.all([
            api.fetchOrders(),
            api.fetchWishlist()
          ]);
          setOrders(userOrders);
          setWishlist(userWishlist);
          setWishlistIds(new Set(userWishlist.map(p => p.id)));
        } catch (error) {
          console.error("Failed to load user data:", error);
          // Potentially logout user if token is invalid
          if (error instanceof Error && error.message.includes('401')) {
            logout();
          }
        }
      } else {
        // Clear user data on logout
        setOrders([]);
        setWishlist([]);
        setWishlistIds(new Set());
      }
    };
    loadUserData();
  }, [currentUser]);

  // --- LOCALSTORAGE PERSISTENCE ---
  useEffect(() => { localStorage.setItem('currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon)); }, [appliedCoupon]);
  useEffect(() => { localStorage.setItem('notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('quietZone', JSON.stringify(isQuietZoneActive)); }, [isQuietZoneActive]);

  // --- ACTIONS ---

  const loginWithGoogle = async (googleUser: { name: string; email: string; }) => {
    try {
      const user = await api.googleLogin(googleUser);
      setCurrentUser(user);
      addNotification(`Welcome back, ${user.name}!`, 'user', '/profile');
    } catch (error) {
        console.error("Login failed:", error);
    }
  };

  const logout = useCallback(() => {
    setCurrentUser(null);
    setCart([]);
    setAppliedCoupon(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('cart');
    localStorage.removeItem('appliedCoupon');
  }, []);

  const updateUser = async (updatedUserData: Partial<User>) => {
    if (!currentUser) return;
    try {
        const updatedUser = await api.updateUser({ ...currentUser, ...updatedUserData });
        setCurrentUser(updatedUser);
    } catch (error) {
        console.error("Failed to update user:", error);
    }
  };
  
  const toggleWishlist = useCallback(async (product: Product) => {
      if (!currentUser) {
          // Optional: redirect to login or show a message
          alert("Please log in to manage your wishlist.");
          return;
      }
      try {
          const { wishlist: newWishlistIds } = await api.toggleWishlist(product.id);
          const newIdSet = new Set(newWishlistIds);
          setWishlistIds(newIdSet);
          // Optimistically update the full wishlist object array
          if (newIdSet.has(product.id)) {
              setWishlist(prev => [...prev, product]);
          } else {
              setWishlist(prev => prev.filter(p => p.id !== product.id));
          }
      } catch (error) {
          console.error("Failed to toggle wishlist:", error);
      }
  }, [currentUser]);

  const isInWishlist = useCallback((productId: number) => {
    return wishlistIds.has(productId);
  }, [wishlistIds]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart(prev => {
      const item = prev.find(i => i.id === product.id);
      return item
        ? prev.map(i => i.id === product.id ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) } : i)
        : [...prev, { ...product, quantity }];
    });
  }, []);
  
  const removeFromCart = useCallback((id: number) => setCart(prev => prev.filter(i => i.id !== id)), []);

  const updateQuantity = useCallback((id: number, quantity: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    if (quantity <= 0) removeFromCart(id);
    else setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.min(quantity, product.stock) } : i));
  }, [products, removeFromCart]);

  const removeCoupon = useCallback(() => setAppliedCoupon(null), []);
  const clearCart = useCallback(() => { setCart([]); removeCoupon(); }, [removeCoupon]);
  
  // This function is now used on the Checkout page to create the order in the backend.
  const addOrder = async (items: CartItem[], total: number) => {
    if (!currentUser) throw new Error("User not logged in");
    try {
        const orderData = { items, total, paymentMethod: 'Prepaid' as const };
        const newOrder = await api.createOrder(orderData);
        setOrders(prev => [newOrder, ...prev]);
        addNotification(`New order #${newOrder.id.slice(-4)} received!`, 'admin', '/admin/dashboard');
        clearCart();
    } catch (error) {
        console.error("Failed to create order:", error);
        throw error; // Re-throw to be caught by the calling component
    }
  };
  
  const addReview = async (productId: number, orderId: string, rating: number, comment: string) => {
      if (!currentUser) return;
      try {
          const newReview = await api.submitReview({ productId, rating, comment });
          setProducts(prev => prev.map(p => p.id === productId ? { ...p, reviews: [newReview, ...p.reviews] } : p));
          setOrders(prev => prev.map(o => o.id === orderId ? { ...o, reviewedProducts: { ...o.reviewedProducts, [productId]: true } } : o));
          addNotification(`New review for "${products.find(p=>p.id === productId)?.name}"`, 'admin', '/admin/reviews');
      } catch (error) {
          console.error("Failed to add review:", error);
      }
  };

  // --- MOCK/PLACEHOLDER ADMIN AND NOTIFICATION FUNCTIONS ---
  // These would be refactored to use a dedicated admin context and API calls
  const addNotification = useCallback((message: string, target: 'user' | 'admin', link?: string) => {
    if (isQuietZoneActive && target === 'user') return;
    const newNotification: Notification = {
      id: Date.now(), message, target, link, read: false, timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, [isQuietZoneActive]);
  const sendGlobalNotification = useCallback((message: string, link?: string) => { addNotification(message, 'user', link); }, [addNotification]);
  const markAsRead = useCallback((id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)), []);
  const markAllAsRead = useCallback((target: 'user' | 'admin') => setNotifications(prev => prev.map(n => n.target === target ? { ...n, read: true } : n)), []);
  const clearAllNotifications = useCallback((target: 'user' | 'admin') => setNotifications(prev => prev.filter(n => n.target !== target)), []);
  
  // MOCK ADMIN FUNCTIONS - These would be moved to an Admin Context and use API calls
  const updateOrderStatus = (orderId: string, status: Order['status']) => { setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o)); };
  const fulfillOrder = (orderId: string, trackingProvider: string, trackingNumber: string) => { setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Shipped', trackingProvider, trackingNumber } : o)); };
  const updateProduct = (p: Product) => setProducts(prev => prev.map(i => i.id === p.id ? p : i));
  const addProduct = (p: Omit<Product, 'id' | 'reviews' | 'rating' | 'reviewCount'>) => setProducts(prev => [...prev, { ...p, id: Date.now(), reviews: [], rating: 0, reviewCount: 0 }]);
  const deleteProduct = (id: number) => setProducts(prev => prev.filter(p => p.id !== id));
  const addMultipleProducts = (newData: Omit<Product, 'id' | 'reviews' | 'rating' | 'reviewCount'>[]) => setProducts(prev => [...prev, ...newData.map(p => ({ ...p, id: Date.now() + Math.random(), reviews: [], rating: 0, reviewCount: 0 }))]);
  const addCoupon = (c: Omit<Coupon, 'id'>) => setCoupons(prev => [{ ...c, id: Date.now() }, ...prev]);
  const updateCoupon = (c: Coupon) => setCoupons(prev => prev.map(i => i.id === c.id ? c : i));
  const deleteCoupon = (id: number) => setCoupons(prev => prev.filter(c => c.id !== id));
  
  const toggleQuietZone = useCallback(() => setIsQuietZoneActive(prev => !prev), []);

  // --- DERIVED STATE & MEMOS ---
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const wishlistCount = wishlist.length;

  const applyCoupon = useCallback((code: string): { success: boolean; message: string } => {
    const coupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    if (!coupon) return { success: false, message: "Invalid coupon code." };
    if (!coupon.isActive) return { success: false, message: "This coupon is currently inactive." };
    if (coupon.trigger === 'first_order' && (!currentUser || orders.length > 0)) return { success: false, message: "This is for first-time orders only." };
    if (coupon.trigger === 'birthday') {
      if (!currentUser?.birthday) return { success: false, message: "Set your birthday in your profile." };
      const today = new Date(); const bday = new Date(currentUser.birthday);
      if (today.getMonth() !== bday.getMonth() || today.getDate() !== bday.getDate()) return { success: false, message: "It's not your birthday yet!" };
    }
    if (coupon.minPurchase && cartTotal < coupon.minPurchase) return { success: false, message: `Minimum purchase of ₹${coupon.minPurchase} required.` };
    setAppliedCoupon(coupon);
    return { success: true, message: "Coupon applied!" };
  }, [coupons, currentUser, orders, cartTotal]);

  const { cartDiscount, cartFinalTotal } = useMemo(() => {
    let discount = 0;
    if (appliedCoupon && cart.length > 0 && (!appliedCoupon.minPurchase || cartTotal >= appliedCoupon.minPurchase)) {
      discount = appliedCoupon.discountType === 'percentage' ? (cartTotal * appliedCoupon.discountValue) / 100 : appliedCoupon.discountValue;
    }
    discount = Math.min(discount, cartTotal);
    return { cartDiscount: discount, cartFinalTotal: cartTotal - discount };
  }, [cart, cartTotal, appliedCoupon]);


  return (
    <AppContext.Provider value={{
      cart, wishlist, orders, user: currentUser, products, categories, notifications, banners, coupons,
      setBanners, setCategories, addNotification, sendGlobalNotification, markAsRead, markAllAsRead, clearAllNotifications,
      addReview, updateOrderStatus, fulfillOrder, updateProduct, addProduct, deleteProduct, addMultipleProducts, addCoupon, updateCoupon, deleteCoupon,
      addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal,
      appliedCoupon, cartDiscount, cartFinalTotal, applyCoupon, removeCoupon,
      toggleWishlist, isInWishlist, wishlistCount, loginWithGoogle, logout, updateUser,
      isQuietZoneActive, toggleQuietZone
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
