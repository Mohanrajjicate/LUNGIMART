

export interface Product {
  id: number;
  name: string;
  slug: string;
  category: Category;
  price: number;
  originalPrice?: number;
  images: string[];
  description: string;
  details: string[];
  stock: number;
  // These will now be populated dynamically
  reviews: Review[];
  rating?: number;
  reviewCount?: number;
  virtualCategories?: string[]; // e.g., ['best-selling', 'featured-products']
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  parentId?: number;
}

export interface Review {
  id: number;
  productId: number;
  userId: number; // Added userId
  author: string;
  rating: number;
  comment: string;
  date: string;
  verifiedBuyer: boolean;
  acknowledged: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Address {
  id: number;
  name: string;
  street: string;
  city: string;
  zip: string;
  isDefault?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string; // Added phone for OTP login
  addresses: Address[];
  birthday?: string;
}

export interface Order {
  id: string;
  userId: number; // Added userId
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered';
  reviewedProducts: { [productId: number]: boolean };
  customerName: string;
  paymentMethod: 'Prepaid' | 'COD';
  trackingProvider?: string;
  trackingNumber?: string;
}

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  applicableProductIds?: number[]; // for product-specific coupons
  trigger: 'none' | 'first_order' | 'birthday';
  isActive: boolean;
}

export interface Notification {
  id: number;
  message: string;
  target: 'user' | 'admin';
  read: boolean;
  timestamp: string;
  link?: string;
}

export interface Banner {
  id: string;
  name: string;
  imageUrl: string;
}