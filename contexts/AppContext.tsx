
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { CartItem, Product, User, Review, Order, Coupon, Category, Notification, Banner, Address } from '../types';
import { useToast } from './ToastContext';
import { baseProducts, baseCategories, baseBanners, baseCoupons, baseReviews, baseOrders, baseUsers, attachReviewData } from '../services/mockData';
import { encrypt } from '../utils/crypto';

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
  setBanners: (banners: Banner[]) => void;
  setCategories: (categories: Category[]) => void;
  addNotification: (message: string, target: 'user' | 'admin', link?: string) => void;
  sendGlobalNotification: (message: string, link?: string) => Promise<void>;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: (target: 'user' | 'admin') => void;
  clearAllNotifications: (target: 'user' | 'admin') => void;
  addReview: (productId: number, orderId: string, rating: number, comment: string) => Promise<void>;
  deleteReview: (reviewId: number) => void;
  acknowledgeReview: (reviewId: number) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  fulfillOrder: (orderId: string, trackingProvider: string, trackingNumber: string) => Promise<void>;
  updateProduct: (updatedProduct: Product) => void;
  addProduct: (newProductData: Omit<Product, 'id' | 'reviews' | 'rating' | 'reviewCount'>) => void;
  deleteProduct: (productId: number) => void;
  addMultipleProducts: (newProductsData: Omit<Product, 'id' | 'reviews' | 'rating' | 'reviewCount'>[]) => void;
  addOrder: (items: CartItem[], total: number) => Promise<void>;
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
  toggleWishlist: (product: Product) => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  wishlistCount: number;
  loginWithGoogle: (googleUser: { name: string; email: string; }) => Promise<{ success: boolean; message: string; isNewUser: boolean; }>;
  signInWithEmail: (credentials: { email: string; password: string; }) => Promise<{ success: boolean; message: string; }>;
  signInWithPhone: (credentials: { phone: string; password: string; }) => Promise<{ success: boolean; message: string; }>;
  signUpWithEmail: (details: { name: string; email: string; phone: string; password: string; }) => Promise<{ success: boolean; message: string; }>;
  logout: () => void;
  updateUser: (updatedUser: User) => Promise<void>;
  addUser: (userData: Omit<User, 'id' | 'addresses'>) => User;
  findUserByEmail: (email: string) => User | undefined;
  isQuietZoneActive: boolean;
  toggleQuietZone: () => void;
  addStandaloneImage: (imageUrl: string) => void;
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  updateCoupon: (coupon: Coupon) => void;
  deleteCoupon: (couponId: number) => void;
  pendingGoogleUser: { name: string; email: string; } | null;
  completeSignup: (details: { name: string; phone: string; birthday: string; address: Omit<Address, 'id' | 'isDefault'> }) => void;
  deleteAccount: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getLocalStorageState = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Master Data - now from local mock data
  const [products, setProducts] = useState<Product[]>(() => getLocalStorageState('products', baseProducts));
  const [categories, setCategories] = useState<Category[]>(() => getLocalStorageState('categories', baseCategories));
  const [banners, setBanners] = useState<Banner[]>(() => getLocalStorageState('banners', baseBanners));
  const [coupons, setCoupons] = useState<Coupon[]>(() => getLocalStorageState('coupons', baseCoupons));
  const [allReviews, setAllReviews] = useState<Review[]>(() => getLocalStorageState('reviews', baseReviews));
  const [allOrders, setAllOrders] = useState<Order[]>(() => getLocalStorageState('orders', baseOrders));
  const [users, setUsers] = useState<User[]>(() => getLocalStorageState('users', baseUsers));

  // Global App State
  const [isLoading, setIsLoading] = useState(false); // No initial load needed
  const [error, setError] = useState<string | null>(null);
  
  // Session / User-Specific State
  const [currentUser, setCurrentUser] = useState<User | null>(() => getLocalStorageState<User | null>('currentUser', null));
  const [cart, setCart] = useState<CartItem[]>(() => getLocalStorageState<CartItem[]>('cart', []));
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => getLocalStorageState<Coupon | null>('appliedCoupon', null));
  const [notifications, setNotifications] = useState<Notification[]>(() => getLocalStorageState<Notification[]>('notifications', []));
  const [isQuietZoneActive, setIsQuietZoneActive] = useState<boolean>(() => getLocalStorageState<boolean>('quietZone', false));
  const [standaloneImages, setStandaloneImages] = useState<string[]>(() => getLocalStorageState<string[]>('standaloneImages', []));
  const [pendingGoogleUser, setPendingGoogleUser] = useState<{ name: string; email: string; } | null>(() => getLocalStorageState<{ name: string; email:string; } | null>('pendingGoogleUser', null));
  const [allWishlists, setAllWishlists] = useState<{ [userId: number]: number[] }>(() => getLocalStorageState('allWishlists', {}));
  
  const { addToast } = useToast();
  
  // --- DATA PERSISTENCE ---
  useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('banners', JSON.stringify(banners)); }, [banners]);
  useEffect(() => { localStorage.setItem('coupons', JSON.stringify(coupons)); }, [coupons]);
  useEffect(() => { localStorage.setItem('reviews', JSON.stringify(allReviews)); }, [allReviews]);
  useEffect(() => { localStorage.setItem('orders', JSON.stringify(allOrders)); }, [allOrders]);
  useEffect(() => { localStorage.setItem('users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon)); }, [appliedCoupon]);
  useEffect(() => { localStorage.setItem('pendingGoogleUser', JSON.stringify(pendingGoogleUser)); }, [pendingGoogleUser]);
  useEffect(() => { localStorage.setItem('notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('quietZone', JSON.stringify(isQuietZoneActive)); }, [isQuietZoneActive]);
  useEffect(() => { localStorage.setItem('allWishlists', JSON.stringify(allWishlists)); }, [allWishlists]);
  useEffect(() => { localStorage.setItem('standaloneImages', JSON.stringify(standaloneImages)); }, [standaloneImages]);

  // Derived user-specific data
  const userWishlistProductIds = useMemo(() => (currentUser ? allWishlists[currentUser.id] || [] : []), [currentUser, allWishlists]);
  const wishlist = useMemo(() => products.filter(p => userWishlistProductIds.includes(p.id)), [products, userWishlistProductIds]);
  const orders = useMemo(() => (currentUser ? allOrders.filter(o => o.userId === currentUser.id) : []), [currentUser, allOrders]);

  // --- CLIENT-SIDE ACTIONS (Replaced API calls) ---

  const signInWithEmail = useCallback(async (credentials: { email: string; password: string; }): Promise<{ success: boolean; message: string; }> => {
    const user = users.find(u => u.email.toLowerCase() === credentials.email.toLowerCase());
    if (user && user.password && user.password === encrypt(credentials.password)) {
      const { password, ...userToStore } = user;
      setCurrentUser(userToStore);
      return { success: true, message: "Logged in successfully." };
    }
    return { success: false, message: "Invalid email or password." };
  }, [users]);

  const signInWithPhone = useCallback(async (credentials: { phone: string; password: string; }): Promise<{ success: boolean; message: string; }> => {
    const user = users.find(u => u.phone === credentials.phone);
    if (user && user.password && user.password === encrypt(credentials.password)) {
      const { password, ...userToStore } = user;
      setCurrentUser(userToStore);
      return { success: true, message: "Logged in successfully." };
    }
    return { success: false, message: "Invalid phone number or password." };
  }, [users]);
  
  const addNotification = useCallback((message: string, target: 'user' | 'admin', link?: string) => {
    const newNotification: Notification = {
      id: Date.now(), message, target, link, read: false, timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const signUpWithEmail = useCallback(async (details: { name: string; email: string; phone: string; password: string; }): Promise<{ success: boolean; message: string; }> => {
    if (users.some(u => u.email.toLowerCase() === details.email.toLowerCase())) {
        return { success: false, message: "An account with this email already exists." };
    }
    const newUser: User = {
        id: Date.now(),
        name: details.name,
        email: details.email,
        phone: details.phone,
        password: encrypt(details.password),
        addresses: [],
    };
    setUsers(prev => [...prev, newUser]);
    const { password, ...userToStore } = newUser;
    setCurrentUser(userToStore);
    addNotification(`Welcome, ${userToStore.name}! Your account is created.`, 'user', '/profile');
    return { success: true, message: "Account created successfully!" };
  }, [users, addNotification]);
  
  const addOrder = useCallback(async (items: CartItem[], total: number) => {
    if (!currentUser) return;
    const newOrder: Order = {
        id: `LM-${Date.now().toString().slice(-6)}`,
        userId: currentUser.id,
        date: new Date().toISOString().split('T')[0],
        items,
        total,
        status: 'Processing',
        customerName: currentUser.name,
        reviewedProducts: {},
        paymentMethod: 'Prepaid',
    };
    setAllOrders(prev => [newOrder, ...prev]);
    addNotification(`New order #${newOrder.id.slice(-4)} received!`, 'admin', '/admin/dashboard');
  }, [currentUser, addNotification]);

  const addReview = useCallback(async (productId: number, orderId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    const newReview: Review = {
        id: Date.now(),
        productId,
        orderId,
        rating,
        comment,
        userId: currentUser.id,
        author: currentUser.name,
        date: new Date().toISOString().split('T')[0],
        verifiedBuyer: true,
        acknowledged: false,
    };
    setAllReviews(prev => [newReview, ...prev]);
    setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, reviewedProducts: { ...o.reviewedProducts, [productId]: true } } : o));
    addNotification(`New review for "${products.find(p => p.id === productId)?.name || 'a product'}" from ${currentUser.name}.`, 'admin', '/admin/reviews');
    // Recalculate product ratings
    setProducts(prevProducts => {
        const rawProducts = prevProducts.map(({ reviews, rating, reviewCount, ...rest }) => rest);
        return attachReviewData(rawProducts, [newReview, ...allReviews]);
    });
  }, [currentUser, products, allReviews, addNotification]);

  const updateUser = useCallback(async (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? { ...u, ...updatedUser } : u));
    if (currentUser?.id === updatedUser.id) {
        setCurrentUser(updatedUser);
    }
  }, [currentUser]);

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const fulfillOrder = async (orderId: string, trackingProvider: string, trackingNumber: string) => {
     setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Shipped', trackingProvider, trackingNumber } : o));
  };
  
  const sendGlobalNotification = async (message: string, link?: string) => {
      users.forEach(user => {
          addNotification(message, 'user', link);
      });
      addNotification('Global notification sent to all users.', 'admin');
  };

  const loginWithGoogle = async (googleUser: { name: string; email: string; }): Promise<{ success: boolean; message: string, isNewUser: boolean }> => {
    const existingUser = users.find(u => u.email.toLowerCase() === googleUser.email.toLowerCase());
    if (existingUser) {
        const { password, ...userToStore } = existingUser;
        setCurrentUser(userToStore);
        return { success: true, message: "Logged in successfully with Google.", isNewUser: false };
    } else {
        setPendingGoogleUser({ name: googleUser.name, email: googleUser.email });
        return { success: true, message: "New user, proceeding to signup.", isNewUser: true };
    }
  };

  const completeSignup = (details: { name: string; phone: string; birthday: string; address: Omit<Address, 'id' | 'isDefault'> }) => {
    if (!pendingGoogleUser) return;
    signUpWithEmail({ name: details.name, email: pendingGoogleUser.email, phone: details.phone, password: Math.random().toString(36).slice(-8) })
      .then(result => {
          if (result.success) {
              const newlyCreatedUser = getLocalStorageState<User | null>('currentUser', null);
              if (newlyCreatedUser) {
                  const newAddress: Address = { ...details.address, id: Date.now(), isDefault: true };
                  const userToUpdate: User = { ...newlyCreatedUser, addresses: [newAddress], birthday: details.birthday };
                  updateUser(userToUpdate);
              }
          }
      });
    setPendingGoogleUser(null);
  };

  const removeCoupon = useCallback(() => setAppliedCoupon(null), []);
  const clearCart = useCallback(() => { setCart([]); removeCoupon(); }, [removeCoupon]);
  const logout = useCallback(() => {
    setCurrentUser(null);
    clearCart();
  }, [clearCart]);
  
  const deleteAccount = () => {
      if (currentUser && window.confirm('Are you sure you want to delete your account? This is irreversible.')) {
        setUsers(prev => prev.filter(u => u.id !== currentUser.id));
        setAllOrders(prev => prev.filter(o => o.userId !== currentUser.id));
        setAllReviews(prev => prev.filter(r => r.userId !== currentUser.id));
        logout();
        addToast("Account deleted successfully.", "info");
      }
  };

  const markAsRead = useCallback((id: number) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n)), []);
  const markAllAsRead = useCallback((target: 'user' | 'admin') => setNotifications(prev => prev.map(n => n.target === target ? { ...n, read: true } : n)), []);
  const clearAllNotifications = useCallback((target: 'user' | 'admin') => setNotifications(prev => prev.filter(n => n.target !== target)), []);
  
  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart(prev => {
      const item = prev.find(i => i.id === product.id);
      return item
        ? prev.map(i => i.id === product.id ? { ...i, quantity: Math.min(i.quantity + quantity, product.stock) } : i)
        : [...prev, { ...product, quantity }];
    });
    addToast(`${product.name} added to cart!`);
  }, [addToast]);
  
  const removeFromCart = useCallback((id: number) => setCart(prev => prev.filter(i => i.id !== id)), []);
  const updateQuantity = useCallback((id: number, quantity: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    if (quantity <= 0) removeFromCart(id);
    else setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.min(quantity, product.stock) } : i));
  }, [products, removeFromCart]);

  const toggleWishlist = useCallback(async (product: Product) => {
    if (!currentUser) {
        addToast("Please sign in to use the wishlist.", "info");
        return;
    }
    const wasInWishlist = (allWishlists[currentUser.id] || []).includes(product.id);
    setAllWishlists(prev => {
      const currentWishlist = prev[currentUser.id] || [];
      const newWishlist = wasInWishlist
        ? currentWishlist.filter(id => id !== product.id)
        : [...currentWishlist, product.id];
      return { ...prev, [currentUser.id]: newWishlist };
    });
    addToast(wasInWishlist ? `${product.name} removed from wishlist.` : `${product.name} added to wishlist!`);
  }, [currentUser, allWishlists, addToast]);
  
  const isInWishlist = useCallback((productId: number) => {
    if (!currentUser) return false;
    return (allWishlists[currentUser.id] || []).includes(productId);
  }, [currentUser, allWishlists]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const wishlistCount = wishlist.length;

  const applyCoupon = useCallback((code: string): { success: boolean; message: string } => {
    const coupon = coupons.find(c => c.code.toLowerCase() === code.toLowerCase());
    if (!coupon) return { success: false, message: "Invalid coupon code." };
    if (!coupon.isActive) return { success: false, message: "This coupon is currently inactive." };
    if (coupon.trigger === 'first_order' && orders.length > 0) return { success: false, message: "This coupon is only for your first order." };
    if (coupon.minPurchase && cartTotal < coupon.minPurchase) return { success: false, message: `Minimum purchase of ₹${coupon.minPurchase} required.` };
    setAppliedCoupon(coupon);
    addToast("Coupon applied successfully!", "success");
    return { success: true, message: "Coupon applied!" };
  }, [coupons, orders, cartTotal, addToast]);

  const { cartDiscount, cartFinalTotal } = useMemo(() => {
    let discount = 0;
    if (appliedCoupon) {
      discount = appliedCoupon.discountType === 'percentage' ? (cartTotal * appliedCoupon.discountValue) / 100 : appliedCoupon.discountValue;
    }
    discount = Math.min(discount, cartTotal);
    return { cartDiscount: discount, cartFinalTotal: cartTotal - discount };
  }, [cartTotal, appliedCoupon]);

  const findUserByEmail = (email: string) => users.find(u => u.email === email);
  const addUser = (userData: Omit<User, 'id' | 'addresses' | 'password'> & {password: string}) => {
    const newUser = { ...userData, id: Date.now(), addresses: [], password: encrypt(userData.password) };
    setUsers(prev => [...prev, newUser]);
    return newUser;
  };

  const toggleQuietZone = () => setIsQuietZoneActive(p => !p);
  const addStandaloneImage = (imageUrl: string) => setStandaloneImages(prev => [imageUrl, ...prev]);

  const deleteReview = (reviewId: number) => setAllReviews(prev => prev.filter(r => r.id !== reviewId));
  const acknowledgeReview = (reviewId: number) => setAllReviews(prev => prev.map(r => r.id === reviewId ? { ...r, acknowledged: true } : r));
  const updateProduct = (updatedProduct: Product) => setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  const addProduct = (newProductData: Omit<Product, 'id' | 'reviews' | 'rating' | 'reviewCount'>) => {
    const newProduct = { ...newProductData, id: Date.now(), reviews: [], rating: 0, reviewCount: 0 };
    setProducts(prev => [newProduct, ...prev]);
  };
  const deleteProduct = (productId: number) => setProducts(prev => prev.filter(p => p.id !== productId));
  const addMultipleProducts = (newProductsData: Omit<Product, 'id' | 'reviews' | 'rating' | 'reviewCount'>[]) => {
      const newProducts = newProductsData.map(p => ({ ...p, id: Date.now() + Math.random(), reviews: [], rating: 0, reviewCount: 0 }));
      setProducts(prev => [...prev, ...newProducts]);
  };
  const addCoupon = (coupon: Omit<Coupon, 'id'>) => setCoupons(prev => [{ ...coupon, id: Date.now() }, ...prev]);
  const updateCoupon = (coupon: Coupon) => setCoupons(prev => prev.map(c => c.id === coupon.id ? coupon : c));
  const deleteCoupon = (couponId: number) => setCoupons(prev => prev.filter(c => c.id !== couponId));

  return (
    <AppContext.Provider value={{
      cart, wishlist, orders, allOrders, users, user: currentUser, reviews: allReviews, products, categories, notifications, banners, coupons, standaloneImages,
      isLoading, error,
      setBanners, setCategories, addNotification, sendGlobalNotification, markAsRead, markAllAsRead, clearAllNotifications,
      addReview, deleteReview, acknowledgeReview, updateOrderStatus, fulfillOrder, updateProduct, addProduct, deleteProduct, addMultipleProducts, addOrder,
      addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal,
      appliedCoupon, cartDiscount, cartFinalTotal, applyCoupon, removeCoupon,
      toggleWishlist, isInWishlist, wishlistCount, loginWithGoogle, logout, updateUser, addUser, findUserByEmail,
      signInWithEmail, signInWithPhone, signUpWithEmail,
      isQuietZoneActive, toggleQuietZone, addStandaloneImage, addCoupon, updateCoupon, deleteCoupon,
      pendingGoogleUser, completeSignup, deleteAccount
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