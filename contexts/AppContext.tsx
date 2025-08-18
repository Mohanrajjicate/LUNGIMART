
import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { CartItem, Product, User, Review, Order, Coupon, Category, Notification, Banner } from '../types';
import { baseReviews, baseOrders, getCouponByCode, baseProducts, attachReviewData, mockUsers, categories, baseBanners } from '../services/mockData';

interface AppContextType {
  cart: CartItem[];
  wishlist: Product[];
  user: User | null;
  reviews: Review[];
  orders: Order[];
  products: Product[];
  categories: Category[];
  notifications: Notification[];
  banners: Banner[];
  updateBannerImage: (bannerId: string, newImageUrl: string) => void;
  addNotification: (message: string, target: 'user' | 'admin', link?: string) => void;
  markAsRead: (notificationId: number) => void;
  markAllAsRead: (target: 'user' | 'admin') => void;
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
  login: (user: User) => void;
  logout: () => void;
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
  const [cart, setCart] = useState<CartItem[]>(() => getInitialState<CartItem[]>('cart', []));
  const [wishlist, setWishlist] = useState<Product[]>(() => getInitialState<Product[]>('wishlist', []));
  const [user, setUser] = useState<User | null>(() => getInitialState<User | null>('user', null));
  const [isQuietZoneActive, setIsQuietZoneActive] = useState<boolean>(() => getInitialState<boolean>('quietZone', false));
  
  // Centralized data state
  const [reviews, setReviews] = useState<Review[]>(() => getInitialState<Review[]>('reviews', baseReviews));
  const [orders, setOrders] = useState<Order[]>(() => getInitialState<Order[]>('orders', baseOrders));
  const [products, setProducts] = useState<Product[]>(() => getInitialState<Product[]>('products', []));
  const [notifications, setNotifications] = useState<Notification[]>(() => getInitialState<Notification[]>('notifications', []));
  const [banners, setBanners] = useState<Banner[]>(() => getInitialState<Banner[]>('banners', baseBanners));

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => getInitialState<Coupon | null>('appliedCoupon', null));

  // Initialize products with review data if not already in local storage
  useEffect(() => {
    const initialProducts = getInitialState<Product[]>('products', []);
    if (initialProducts.length === 0) {
        const productsWithReviews = baseProducts.map(p => attachReviewData(p, reviews));
        setProducts(productsWithReviews);
    }
  }, []); // Run only once on mount

  // Recalculate review data for products when reviews change
  const updateProductsWithReviews = useCallback(() => {
    setProducts(prevProducts => {
        const baseProductMap = new Map(prevProducts.map(p => [p.id, { ...p, reviews: [], rating: 0, reviewCount: 0 }]));
        baseProducts.forEach(bp => {
            if (baseProductMap.has(bp.id)) {
                const existing = baseProductMap.get(bp.id);
                baseProductMap.set(bp.id, { ...existing, ...bp });
            } else {
                baseProductMap.set(bp.id, { ...bp, reviews: [], rating: 0, reviewCount: 0 });
            }
        });

        const updatedProducts = Array.from(baseProductMap.values()).map(p => attachReviewData(p as Omit<Product, 'reviews' | 'rating' | 'reviewCount'>, reviews));
        return updatedProducts;
    });
  }, [reviews]);

  useEffect(() => {
    updateProductsWithReviews();
  }, [reviews, updateProductsWithReviews]);


  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('quietZone', JSON.stringify(isQuietZoneActive)); }, [isQuietZoneActive]);
  useEffect(() => { localStorage.setItem('reviews', JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem('orders', JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem('products', JSON.stringify(products)); }, [products]);
  useEffect(() => { localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon)); }, [appliedCoupon]);
  useEffect(() => { localStorage.setItem('notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('banners', JSON.stringify(banners)); }, [banners]);

  const addNotification = (message: string, target: 'user' | 'admin', link?: string) => {
      const newNotification: Notification = {
          id: Date.now(),
          message,
          target,
          link,
          read: false,
          timestamp: new Date().toISOString(),
      };
      setNotifications(prev => [newNotification, ...prev]);
  };

  const markAsRead = (notificationId: number) => {
      setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
  };
  
  const markAllAsRead = (target: 'user' | 'admin') => {
      setNotifications(prev => prev.map(n => n.target === target ? { ...n, read: true } : n));
  };

  const addReview = (productId: number, orderId: string, rating: number, comment: string) => {
    if (!user) return;
    
    const newReview: Review = {
        id: Date.now(),
        productId,
        author: user.name,
        rating,
        comment,
        date: new Date().toISOString().split('T')[0],
        verifiedBuyer: true,
        acknowledged: false,
    };
    
    setReviews(prev => [newReview, ...prev]);
    
    setOrders(prevOrders => prevOrders.map(order => {
        if (order.id === orderId) {
            return {
                ...order,
                reviewedProducts: { ...order.reviewedProducts, [productId]: true }
            };
        }
        return order;
    }));

    const productName = products.find(p => p.id === productId)?.name || 'a product';
    addNotification(`New review for "${productName}" from ${user.name}.`, 'admin', '/admin/reviews');
  };

  const deleteReview = (reviewId: number) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId));
  };

  const acknowledgeReview = (reviewId: number) => {
    setReviews(prev => prev.map(review => 
      review.id === reviewId ? { ...review, acknowledged: true } : review
    ));
  };

  const fulfillOrder = (orderId: string, trackingProvider: string, trackingNumber: string) => {
    setOrders(prevOrders => prevOrders.map(order => 
      order.id === orderId ? { ...order, status: 'Shipped', trackingProvider, trackingNumber } : order
    ));
    addNotification(`Your order #${orderId.slice(-4)} has shipped! Tracking: ${trackingNumber}`, 'user', '/profile');
    addNotification(`Order #${orderId.slice(-4)} marked as shipped.`, 'admin', '/admin/orders');
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(prevOrders => prevOrders.map(order => 
      order.id === orderId ? { ...order, status } : order
    ));
    addNotification(`Your order #${orderId.slice(-4)} has been updated to: ${status}.`, 'user', '/profile');
    addNotification(`Order #${orderId.slice(-4)} status updated to ${status}.`, 'admin', '/admin/orders');
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prevProducts => prevProducts.map(p => 
      p.id === updatedProduct.id ? updatedProduct : p
    ));
  };
  
  const addProduct = (newProductData: Omit<Product, 'id' | 'reviews' | 'rating' | 'reviewCount'>) => {
      const newProduct = {
          ...newProductData,
          id: Date.now(),
          reviews: [],
          rating: 0,
          reviewCount: 0
      };
      setProducts(prev => [...prev, newProduct]);
  };

  const deleteProduct = (productId: number) => {
      setProducts(prev => prev.filter(p => p.id !== productId));
  };
  
  const addMultipleProducts = (newProductsData: Omit<Product, 'id' | 'reviews' | 'rating' | 'reviewCount'>[]) => {
      const newProducts = newProductsData.map(p => ({
          ...p,
          id: Date.now() + Math.random(), // simple unique id generation
          reviews: [],
          rating: 0,
          reviewCount: 0
      }));
      setProducts(prev => [...prev, ...newProducts]);
  };
  
  const addOrder = (items: CartItem[], total: number) => {
      if (!user) return;

      const newOrder: Order = {
          id: `LM-${Date.now().toString().slice(-6)}`,
          date: new Date().toISOString().split('T')[0],
          items: items,
          total: total,
          status: 'Processing',
          customerName: user.name,
          reviewedProducts: {},
          paymentMethod: 'Prepaid' // Defaulting to Prepaid
      };

      setOrders(prevOrders => [newOrder, ...prevOrders]);
      addNotification(`New order #${newOrder.id.slice(-4)} received from ${user.name}!`, 'admin', '/admin/dashboard');
  };


  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity: Math.min(quantity, product.stock) } : item
        )
      );
    }
  };
  
  const removeCoupon = () => {
    setAppliedCoupon(null);
  };
  
  const clearCart = () => {
      setCart([]);
      removeCoupon();
  };
  
  const toggleWishlist = (product: Product) => {
    setWishlist(prev => {
        const isInWishlist = prev.some(item => item.id === product.id);
        if (isInWishlist) {
            return prev.filter(item => item.id !== product.id);
        } else {
            return [...prev, product];
        }
    });
  };
  
  const isInWishlist = (productId: number) => wishlist.some(item => item.id === productId);

  const login = (user: User) => setUser(user);
  const logout = () => setUser(null);
  
  const toggleQuietZone = () => setIsQuietZoneActive(prev => !prev);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const wishlistCount = wishlist.length;

  const applyCoupon = (couponCode: string): { success: boolean; message: string } => {
    const coupon = getCouponByCode(couponCode);
    if (!coupon) {
      return { success: false, message: "Invalid coupon code." };
    }

    if (coupon.minPurchase && cartTotal < coupon.minPurchase) {
        return { success: false, message: `Minimum purchase of ₹${coupon.minPurchase} required.` };
    }
    
    if (coupon.applicableProductIds) {
        const isApplicable = cart.some(item => coupon.applicableProductIds!.includes(item.id));
        if (!isApplicable) {
            return { success: false, message: "Coupon not applicable to items in your cart." };
        }
    }
    
    setAppliedCoupon(coupon);
    return { success: true, message: "Coupon applied successfully!" };
  };
  
  const { cartDiscount, cartFinalTotal } = React.useMemo(() => {
    let discount = 0;
    if (appliedCoupon && cart.length > 0) {
        const isApplicable = !appliedCoupon.minPurchase || cartTotal >= appliedCoupon.minPurchase;

        if (isApplicable) {
            if (appliedCoupon.applicableProductIds) {
                const applicableTotal = cart
                    .filter(item => appliedCoupon.applicableProductIds!.includes(item.id))
                    .reduce((total, item) => total + item.price * item.quantity, 0);

                if (appliedCoupon.discountType === 'percentage') {
                    discount = (applicableTotal * appliedCoupon.discountValue) / 100;
                } else {
                    discount = appliedCoupon.discountValue;
                }
                discount = Math.min(discount, applicableTotal);

            } else {
                if (appliedCoupon.discountType === 'percentage') {
                    discount = (cartTotal * appliedCoupon.discountValue) / 100;
                } else {
                    discount = appliedCoupon.discountValue;
                }
            }
        }
    }
    discount = Math.min(discount, cartTotal);
    const finalTotal = cartTotal - discount;

    return { cartDiscount: discount, cartFinalTotal: finalTotal };

  }, [cart, cartTotal, appliedCoupon]);

  const updateBannerImage = (bannerId: string, newImageUrl: string) => {
    setBanners(prevBanners => 
      prevBanners.map(banner => 
        banner.id === bannerId ? { ...banner, imageUrl: newImageUrl } : banner
      )
    );
    addNotification(`Banner image for "${banners.find(b => b.id === bannerId)?.name}" was updated.`, 'admin', '/admin/appearance');
  };

  return (
    <AppContext.Provider value={{
      cart,
      wishlist,
      user,
      reviews,
      orders,
      products,
      categories,
      notifications,
      banners,
      updateBannerImage,
      addNotification,
      markAsRead,
      markAllAsRead,
      addReview,
      deleteReview,
      acknowledgeReview,
      updateOrderStatus,
      fulfillOrder,
      updateProduct,
      addProduct,
      deleteProduct,
      addMultipleProducts,
      addOrder,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
      appliedCoupon,
      cartDiscount,
      cartFinalTotal,
      applyCoupon,
      removeCoupon,
      toggleWishlist,
      isInWishlist,
      wishlistCount,
      login,
      logout,
      isQuietZoneActive,
      toggleQuietZone
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};