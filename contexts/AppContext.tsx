
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { CartItem, Product, User, Review, Order, Coupon, Category, Notification, Banner, Address } from '../types';
import { useToast } from './ToastContext';

// Helper for API calls
const api = {
  get: async (action: string, params = {}) => {
    const query = new URLSearchParams({ action, ...params }).toString();
    const response = await fetch(`/api/?${query}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
  },
  post: async (action: string, body = {}) => {
    const response = await fetch(`/api/?action=${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!response.ok) throw new Error('Network response was not ok');
    return response.json();
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
  addOrder: (items: CartItem[], total: number, selectedAddress: Address) => Promise<void>;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  appliedCoupon: Coupon | null;
  cartDiscount: number;
  cartFinalTotal: number;
  applyCoupon: (couponCode: string) => Promise<{ success: boolean; message: string }>;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [standaloneImages, setStandaloneImages] = useState<string[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [isQuietZoneActive, setIsQuietZoneActive] = useState<boolean>(() => getLocalStorageState<boolean>('quietZone', false));
  const [pendingGoogleUser, setPendingGoogleUser] = useState<{ name: string; email: string; } | null>(() => getLocalStorageState<{ name: string; email:string; } | null>('pendingGoogleUser', null));

  const { addToast } = useToast();

  const syncUserData = useCallback(async () => {
    if (!user) {
      setCart([]);
      setWishlist([]);
      setOrders([]);
      setNotifications([]);
      setAppliedCoupon(null);
      return;
    }
    try {
      const data = await api.get('getUserData');
      if (data.success) {
        setCart(data.cart || []);
        setWishlist(data.wishlist || []);
        setOrders(data.orders || []);
        setNotifications(data.notifications || []);
        setAppliedCoupon(data.appliedCoupon || null);
      } else {
        throw new Error(data.message || 'Failed to sync user data');
      }
    } catch (err: any) {
      setError(err.message);
      addToast(err.message, 'error');
    }
  }, [user, addToast]);
  
  useEffect(() => {
     localStorage.setItem('pendingGoogleUser', JSON.stringify(pendingGoogleUser)); 
  }, [pendingGoogleUser]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setIsLoading(true);
        const [initialData, sessionData] = await Promise.all([
            api.get('getInitialData'),
            api.get('checkSession')
        ]);

        if (initialData.success) {
          setProducts(initialData.products);
          setCategories(initialData.categories);
          setBanners(initialData.banners);
          setCoupons(initialData.coupons);
          // These might not be sent on initial load unless for admin
          setAllReviews(initialData.reviews || []); 
          setAllOrders(initialData.orders || []);
          setUsers(initialData.users || []);
          setStandaloneImages(initialData.standaloneImages || []);
        } else {
          throw new Error(initialData.message || "Failed to load site data.");
        }
        
        if (sessionData.success && sessionData.user) {
            setUser(sessionData.user);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
      syncUserData();
  }, [user, syncUserData]);
  
  useEffect(() => {
    localStorage.setItem('quietZone', JSON.stringify(isQuietZoneActive));
  }, [isQuietZoneActive]);


  const addToCart = useCallback((product: Product, quantity = 1) => {
    if (!user) {
        addToast("Please sign in to add items to your cart.", "info");
        return;
    }
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item => 
          item.id === product.id 
            ? { ...item, quantity: item.quantity + quantity } 
            : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
    addToast(`${product.name} added to cart!`);
  }, [user, addToast]);
  
  const removeFromCart = useCallback((productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
        removeFromCart(productId);
        return;
    }
    setCart(prevCart => prevCart.map(item => 
        item.id === productId ? { ...item, quantity } : item
    ));
  }, [removeFromCart]);
  
  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const signInWithEmail = async (credentials: { email: string; password: string; }) => {
    const res = await api.post('signInWithEmail', credentials);
    if (res.success) setUser(res.user);
    return res;
  };
  
  const signInWithPhone = async (credentials: { phone: string; password: string; }) => {
    // This part of backend is not fully implemented in the provided snippet
    addToast("Sign in with phone not yet available.", "info");
    return { success: false, message: "Not implemented." };
  }
  
  const loginWithGoogle = async (googleUser: { name: string; email: string; }) => {
    // This part of backend is not fully implemented in the provided snippet
    addToast("Google Sign-in not yet available.", "info");
    return { success: false, message: "Not implemented.", isNewUser: false };
  };

  const signUpWithEmail = async (details: { name: string; email: string; phone: string; password: string; }) => {
    const res = await api.post('signUpWithEmail', details);
    if (res.success) setUser(res.user);
    return res;
  };

  const completeSignup = async (details: { name: string; phone: string; birthday: string; address: Omit<Address, 'id' | 'isDefault'> }) => {
    if (!pendingGoogleUser) return;
    const res = await api.post('completeSignup', { ...details, email: pendingGoogleUser.email });
    if(res.success) {
        setUser(res.user);
        setPendingGoogleUser(null);
    } else {
        addToast(res.message, 'error');
    }
  };

  const logout = useCallback(async () => {
    await api.get('logout');
    setUser(null);
  }, []);
  
  const deleteAccount = async () => {
      if (user && window.confirm('Are you sure you want to delete your account? This is irreversible.')) {
        const res = await api.post('deleteAccount');
        if (res.success) {
            logout();
            addToast("Account deleted successfully.", "info");
        } else {
            addToast(res.message, 'error');
        }
      }
  };
  
  const updateUser = async (updatedUser: User) => {
    // In a real app, you would post this to the backend.
    // For now, we'll update local state to reflect changes.
    setUser(updatedUser);
    addToast("Profile updated!", "success");
  };
  
  const toggleWishlist = async (product: Product) => {
    if (!user) {
        addToast("Please sign in to use the wishlist.", "info");
        return;
    }
    setWishlist(currentWishlist => {
      const exists = currentWishlist.some(p => p.id === product.id);
      if (exists) {
        addToast(`${product.name} removed from wishlist.`);
        return currentWishlist.filter(p => p.id !== product.id);
      } else {
        addToast(`${product.name} added to wishlist!`);
        return [...currentWishlist, product];
      }
    });
  };
  
  const isInWishlist = (productId: number) => wishlist.some(p => p.id === productId);

  const addOrder = async (items: CartItem[], total: number, selectedAddress: Address) => {
    if (!user) return;
    const res = await api.post('addOrder', { items, total, address: selectedAddress });
    if (res.success) {
        // We'd ideally get the full order object back
        const newOrder: Order = {
            id: res.orderId,
            userId: user.id,
            date: new Date().toISOString(),
            items,
            total,
            status: 'Processing',
            reviewedProducts: {},
            customerName: user.name,
            paymentMethod: 'Prepaid'
        };
        setOrders(prev => [newOrder, ...prev]);
        setAllOrders(prev => [newOrder, ...prev]); // also add to admin orders
        clearCart();
    } else {
        addToast(res.message || 'There was an issue placing your order.', 'error');
    }
  };
  
  const applyCoupon = async (couponCode: string) => {
    const coupon = coupons.find(c => c.code.toUpperCase() === couponCode.toUpperCase() && c.isActive);
    if (coupon) {
      setAppliedCoupon(coupon);
      addToast("Coupon applied!", "success");
      return { success: true, message: "Coupon applied!" };
    }
    addToast("Invalid or expired coupon.", "error");
    return { success: false, message: "Invalid or expired coupon." };
  };
  
  const removeCoupon = async () => {
    setAppliedCoupon(null);
  };
  
  const addReview = async (productId: number, orderId: string, rating: number, comment: string) => {
    // Mocking this as backend isn't implemented for it
     addToast("Review submitted!", "success");
  };
  
  // Admin actions
  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
     setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const fulfillOrder = async (orderId: string, trackingProvider: string, trackingNumber: string) => {
     setAllOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'Shipped', trackingProvider, trackingNumber } : o));
  };
  
  const updateProduct = async (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
  };

  const addProduct = async (newProductData: Omit<Product, 'id' | 'reviews' | 'rating' | 'reviewCount'>) => {
     const newProduct: Product = {
      ...newProductData,
      id: Date.now(),
      reviews: [],
      rating: 0,
      reviewCount: 0,
    };
    setProducts(prev => [newProduct, ...prev]);
  };
  
  const deleteProduct = async (productId: number) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };
  
  const addMultipleProducts = async (newProductsData: Omit<Product, 'id' | 'reviews' | 'rating' | 'reviewCount'>[]) => {
      const newProducts: Product[] = newProductsData.map(p => ({
            ...p,
            id: Date.now() + Math.random(),
            reviews: [],
            rating: 0,
            reviewCount: 0
      }));
      setProducts(prev => [...prev, ...newProducts]);
  };
  
  const addCoupon = async (coupon: Omit<Coupon, 'id'>) => {
    const newCoupon = { ...coupon, id: Date.now() };
    setCoupons(prev => [newCoupon, ...prev]);
  };
  
  const updateCoupon = async (coupon: Coupon) => {
    setCoupons(prev => prev.map(c => c.id === coupon.id ? coupon : c));
  };
  
  const deleteCoupon = async (couponId: number) => {
    setCoupons(prev => prev.filter(c => c.id !== couponId));
  };
  
  const setBannersAPI = async (banners: Banner[]) => {
      setBanners(banners);
  }

  const setCategoriesAPI = async (categories: Category[]) => {
      setCategories(categories);
  }

  const sendGlobalNotification = async (message: string, link?: string) => {
      // Mocking this, in real app would POST to server
      const newNotification: Notification = {
          id: Date.now(),
          message,
          link,
          target: 'user',
          read: false,
          timestamp: new Date().toISOString()
      };
      setNotifications(prev => [newNotification, ...prev]);
      addToast("Global notification sent (mocked).", "info");
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const wishlistCount = wishlist.length;

  const { cartDiscount, cartFinalTotal } = useMemo(() => {
    let discount = 0;
    if (appliedCoupon) {
      discount = appliedCoupon.discountType === 'percentage' ? (cartTotal * appliedCoupon.discountValue) / 100 : appliedCoupon.discountValue;
    }
    discount = Math.min(discount, cartTotal);
    return { cartDiscount: discount, cartFinalTotal: cartTotal - discount };
  }, [cartTotal, appliedCoupon]);

  const toggleQuietZone = () => setIsQuietZoneActive(p => !p);

  // The below functions are either not needed with a backend or are simplified
  const addNotification = (message: string, target: 'user' | 'admin', link?: string) => { /* Notifications are now pushed from backend */ };
  const markAsRead = async (notificationId: number) => {
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };
  const markAllAsRead = async (target: 'user' | 'admin') => {
      setNotifications(prev => prev.map(n => n.target === target ? { ...n, read: true } : n));
  };
  const clearAllNotifications = async (target: 'user' | 'admin') => {
      setNotifications(prev => prev.filter(n => n.target !== target));
  };
  const deleteReview = (reviewId: number) => {};
  const acknowledgeReview = (reviewId: number) => {};
  const addUser = (userData: Omit<User, 'id' | 'addresses'>) => ({} as User);
  const findUserByEmail = (email: string) => users.find(u => u.email === email);
  const addStandaloneImage = (imageUrl: string) => {
    setStandaloneImages(prev => [imageUrl, ...prev]);
  };
  
  return (
    <AppContext.Provider value={{
      cart, wishlist, orders, allOrders, users, user, reviews: allReviews, products, categories, notifications, banners, coupons, standaloneImages,
      isLoading, error,
      setBanners: setBannersAPI, setCategories: setCategoriesAPI, addNotification, sendGlobalNotification, markAsRead, markAllAsRead, clearAllNotifications,
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
