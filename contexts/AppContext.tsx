
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { CartItem, Product, User, Review, Order } from '../types';
import { baseReviews, mockOrders } from '../services/mockData';

interface AppContextType {
  cart: CartItem[];
  wishlist: Product[];
  user: User | null;
  reviews: Review[];
  orders: Order[];
  addReview: (productId: number, orderId: string, rating: number, comment: string) => void;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
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
  const [reviews, setReviews] = useState<Review[]>(() => getInitialState<Review[]>('reviews', baseReviews));
  const [orders, setOrders] = useState<Order[]>(() => getInitialState<Order[]>('orders', mockOrders));

  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('user', JSON.stringify(user)); }, [user]);
  useEffect(() => { localStorage.setItem('quietZone', JSON.stringify(isQuietZoneActive)); }, [isQuietZoneActive]);
  useEffect(() => { localStorage.setItem('reviews', JSON.stringify(reviews)); }, [reviews]);
  useEffect(() => { localStorage.setItem('orders', JSON.stringify(orders)); }, [orders]);


  const addReview = (productId: number, orderId: string, rating: number, comment: string) => {
    if (!user) return; // Must be logged in
    
    const newReview: Review = {
        id: Date.now(),
        productId,
        author: user.name,
        rating,
        comment,
        date: new Date().toISOString().split('T')[0],
        verifiedBuyer: true,
    };
    
    setReviews(prev => [...prev, newReview]);
    
    // Mark product as reviewed in the specific order
    setOrders(prevOrders => prevOrders.map(order => {
        if (order.id === orderId) {
            return {
                ...order,
                reviewedProducts: {
                    ...order.reviewedProducts,
                    [productId]: true,
                }
            };
        }
        return order;
    }));
  };

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => setCart([]);
  
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

  return (
    <AppContext.Provider value={{
      cart,
      wishlist,
      user,
      reviews,
      orders,
      addReview,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      cartCount,
      cartTotal,
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