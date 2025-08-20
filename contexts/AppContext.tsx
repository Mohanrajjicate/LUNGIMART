import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { CartItem, Product, User, Review, Order, Coupon, Category, Notification, Banner, Address } from '../types';

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
  toggleWishlist: (product: Product) => void;
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

const API_BASE_URL = ''; // Relative path for production

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Master Data - now fetched from backend
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  // Global App State
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Session / User-Specific State
  const [currentUser, setCurrentUser] = useState<User | null>(() => getLocalStorageState<User | null>('currentUser', null));
  const [cart, setCart] = useState<CartItem[]>(() => getLocalStorageState<CartItem[]>('cart', []));
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => getLocalStorageState<Coupon | null>('appliedCoupon', null));
  const [notifications, setNotifications] = useState<Notification[]>(() => getLocalStorageState<Notification[]>('notifications', []));
  const [isQuietZoneActive, setIsQuietZoneActive] = useState<boolean>(() => getLocalStorageState<boolean>('quietZone', false));
  const [standaloneImages, setStandaloneImages] = useState<string[]>([]); // This can be derived
  const [pendingGoogleUser, setPendingGoogleUser] = useState<{ name: string; email: string; } | null>(() => getLocalStorageState<{ name: string; email:string; } | null>('pendingGoogleUser', null));
  const [allWishlists, setAllWishlists] = useState<{ [userId: number]: number[] }>(() => getLocalStorageState('allWishlists', {}));

  // --- DATA FETCHING ---
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const res = await fetch(`${API_BASE_URL}/api/initial-data`);
        if (!res.ok) throw new Error('Failed to fetch initial data');
        
        const data = await res.json();

        setProducts(data.products);
        setCategories(data.categories);
        setBanners(data.banners);
        setCoupons(data.coupons);
        setAllReviews(data.reviews);
        
        // Admin-related data (in a real app, this would be behind auth)
        const ordersRes = await fetch(`${API_BASE_URL}/api/orders`);
        const allOrdersData = await ordersRes.json();
        setAllOrders(allOrdersData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Persistence Effects for client-side state
  useEffect(() => { localStorage.setItem('currentUser', JSON.stringify(currentUser)); }, [currentUser]);
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon)); }, [appliedCoupon]);
  useEffect(() => { localStorage.setItem('pendingGoogleUser', JSON.stringify(pendingGoogleUser)); }, [pendingGoogleUser]);
  useEffect(() => { localStorage.setItem('notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('quietZone', JSON.stringify(isQuietZoneActive)); }, [isQuietZoneActive]);
  useEffect(() => { localStorage.setItem('allWishlists', JSON.stringify(allWishlists)); }, [allWishlists]);

  // Derived user-specific data
  const userWishlistProductIds = useMemo(() => (currentUser ? allWishlists[currentUser.id] || [] : []), [currentUser, allWishlists]);
  const wishlist = useMemo(() => products.filter(p => userWishlistProductIds.includes(p.id)), [products, userWishlistProductIds]);
  const orders = useMemo(() => (currentUser ? allOrders.filter(o => o.userId === currentUser.id) : []), [currentUser, allOrders]);

  // --- API-driven Actions ---
  const signInWithEmail = useCallback(async (credentials: { email: string; password: string; }): Promise<{ success: boolean; message: string; }> => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        setCurrentUser(data.user);
        return { success: true, message: "Logged in successfully." };
    } catch (err) {
        return { success: false, message: err instanceof Error ? err.message : 'An unknown error occurred.' };
    }
  }, []);

  const signInWithPhone = useCallback(async (credentials: { phone: string; password: string; }): Promise<{ success: boolean; message: string; }> => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/login`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone: credentials.phone, password: credentials.password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Login failed');
        setCurrentUser(data.user);
        return { success: true, message: "Logged in successfully." };
    } catch (err) {
        return { success: false, message: err instanceof Error ? err.message : 'An unknown error occurred.' };
    }
  }, []);

  const signUpWithEmail = useCallback(async (details: { name: string; email: string; phone: string; password: string; }): Promise<{ success: boolean; message: string; }> => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/signup`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(details)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Sign up failed');
        setCurrentUser(data.user);
        addNotification(`Welcome, ${data.user.name}! Your account is created.`, 'user', '/profile');
        return { success: true, message: "Account created successfully!" };
    } catch (err) {
        return { success: false, message: err instanceof Error ? err.message : 'An unknown error occurred.' };
    }
  }, []);
  
  const addOrder = useCallback(async (items: CartItem[], total: number) => {
    if (!currentUser) return;
    try {
        const res = await fetch(`${API_BASE_URL}/api/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: currentUser.id, items, total, customerName: currentUser.name })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to place order');
        setAllOrders(prev => [data.order, ...prev]);
        addNotification(`New order #${data.order.id.slice(-4)} received!`, 'admin', '/admin/dashboard');
    } catch (err) {
        console.error("Failed to add order:", err);
        // Optionally show an error to the user
    }
  }, [currentUser]);

  const addReview = useCallback(async (productId: number, orderId: string, rating: number, comment: string) => {
    if (!currentUser) return;
    try {
        const res = await fetch(`${API_BASE_URL}/api/reviews`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ productId, orderId, rating, comment, userId: currentUser.id, author: currentUser.name })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to submit review');
        setAllReviews(prev => [data.review, ...prev]);
        setAllOrders(data.orders); // The server sends back the updated orders list
        addNotification(`New review for "${products.find(p => p.id === productId)?.name || 'a product'}" from ${currentUser.name}.`, 'admin', '/admin/reviews');
    } catch (err) {
        console.error("Failed to add review:", err);
    }
  }, [currentUser, products]);

  const updateUser = useCallback(async (updatedUser: User) => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/users/${updatedUser.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update user');
        
        // This is simplified; a real app would update an `allUsers` state for admin
        if (currentUser?.id === data.user.id) {
            setCurrentUser(data.user);
        }
    } catch (err) {
        console.error("Failed to update user:", err);
    }
  }, [currentUser]);

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
        const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to update order status');
        setAllOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
    } catch (err) {
        console.error("Failed to update order status:", err);
    }
  };

  const fulfillOrder = async (orderId: string, trackingProvider: string, trackingNumber: string) => {
     try {
        const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'Shipped', trackingProvider, trackingNumber })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fulfill order');
        setAllOrders(prev => prev.map(o => o.id === orderId ? data.order : o));
    } catch (err) {
        console.error("Failed to fulfill order:", err);
    }
  };
  
  const sendGlobalNotification = async (message: string, link?: string) => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/notifications/global`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, link })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to send notification');
        // Add a notification for the admin as confirmation
        addNotification('Global notification sent to all users.', 'admin');
    } catch (err) {
        console.error("Failed to send global notification:", err);
    }
  };

  // --- Functions that remain mostly client-side or are simple state setters ---

  const addNotification = useCallback((message: string, target: 'user' | 'admin', link?: string) => {
    const newNotification: Notification = {
      id: Date.now(), message, target, link, read: false, timestamp: new Date().toISOString(),
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const loginWithGoogle = async (googleUser: { name: string; email: string; }): Promise<{ success: boolean; message: string, isNewUser: boolean }> => {
    // This logic stays on the client to check if user exists before deciding to signup or signin.
    // A more robust solution would be a single `/api/google-login` endpoint.
    const res = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: googleUser.email, password: '' }) // Send empty pass, server should handle google login differently
    });
    if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        return { success: true, message: "Logged in successfully with Google.", isNewUser: false };
    } else {
        // User likely doesn't exist.
        setPendingGoogleUser({ name: googleUser.name, email: googleUser.email });
        return { success: true, message: "New user, proceeding to signup.", isNewUser: true };
    }
  };

  const completeSignup = (details: { name: string; phone: string; birthday: string; address: Omit<Address, 'id' | 'isDefault'> }) => {
    if (!pendingGoogleUser) return;
    // This would become a POST to a new `/api/complete-signup` endpoint. For now, we'll piggy-back on the existing signup and update.
    signUpWithEmail({ name: details.name, email: pendingGoogleUser.email, phone: details.phone, password: Math.random().toString(36).slice(-8) })
      .then(result => {
          if (result.success) {
              // This is a bit of a hack. After signup, we get a user object back. We need to update it with address info.
              // In a real app, the `complete-signup` endpoint would do this atomically.
              const newlyCreatedUser = getLocalStorageState<User | null>('currentUser', null);
              if (newlyCreatedUser) {
                  const newAddress: Address = { ...details.address, id: Date.now(), isDefault: true };
                  const userToUpdate = { ...newlyCreatedUser, addresses: [newAddress], birthday: details.birthday };
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
      // This would be a DELETE /api/users/:id request
      if (currentUser) {
        console.log(`Simulating account deletion for user ${currentUser.id}`);
        logout();
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
  }, []);
  const removeFromCart = useCallback((id: number) => setCart(prev => prev.filter(i => i.id !== id)), []);
  const updateQuantity = useCallback((id: number, quantity: number) => {
    const product = products.find(p => p.id === id);
    if (!product) return;
    if (quantity <= 0) removeFromCart(id);
    else setCart(prev => prev.map(i => i.id === id ? { ...i, quantity: Math.min(quantity, product.stock) } : i));
  }, [products, removeFromCart]);

  const toggleWishlist = useCallback((product: Product) => {
    if (!currentUser) return;
    setAllWishlists(prev => {
      const currentWishlist = prev[currentUser.id] || [];
      const newWishlist = currentWishlist.includes(product.id)
        ? currentWishlist.filter(id => id !== product.id)
        : [...currentWishlist, product.id];
      return { ...prev, [currentUser.id]: newWishlist };
    });
  }, [currentUser]);
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
    return { success: true, message: "Coupon applied!" };
  }, [coupons, orders, cartTotal]);

  const { cartDiscount, cartFinalTotal } = useMemo(() => {
    let discount = 0;
    if (appliedCoupon) {
      discount = appliedCoupon.discountType === 'percentage' ? (cartTotal * appliedCoupon.discountValue) / 100 : appliedCoupon.discountValue;
    }
    discount = Math.min(discount, cartTotal);
    return { cartDiscount: discount, cartFinalTotal: cartTotal - discount };
  }, [cartTotal, appliedCoupon]);

  // Pass-through functions for values that are not yet fully implemented on the backend in this step
  const findUserByEmail = () => undefined;
  const addUser = (d: any) => d as User;
  const toggleQuietZone = () => setIsQuietZoneActive(p => !p);
  const addStandaloneImage = () => {};
  // Admin functions would need their own API endpoints
  const deleteReview = () => {};
  const acknowledgeReview = () => {};
  const updateProduct = () => {};
  const addProduct = () => {};
  const deleteProduct = () => {};
  const addMultipleProducts = () => {};
  const addCoupon = () => {};
  const updateCoupon = () => {};
  const deleteCoupon = () => {};

  if (isLoading) {
      return (
          <div className="flex justify-center items-center min-h-screen">
              <div className="text-center">
                  <p className="text-2xl font-bold tracking-tight text-slate-900">LungiMart.in</p>
                  <p className="mt-2 text-slate-600">Loading authentic weaves...</p>
              </div>
          </div>
      );
  }

  if(error) {
       return (
          <div className="flex justify-center items-center min-h-screen">
              <div className="text-center p-8 bg-red-50 rounded-lg">
                  <p className="text-xl font-bold text-red-700">Oops! Something went wrong.</p>
                  <p className="mt-2 text-red-600">{error}</p>
                   <p className="mt-4 text-sm text-slate-500">Please try refreshing the page.</p>
              </div>
          </div>
      );
  }

  return (
    <AppContext.Provider value={{
      cart, wishlist, orders, allOrders, users, user: currentUser, reviews: allReviews, products, categories, notifications, banners, coupons, standaloneImages,
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