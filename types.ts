

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
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
}

export interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
  verifiedBuyer: boolean;
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
  addresses: Address[];
  birthday?: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
  reviewedProducts: { [productId: number]: boolean };
  customerName: string;
}

export interface Coupon {
  id: number;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minPurchase?: number;
  applicableProductIds?: number[]; // for product-specific coupons
}