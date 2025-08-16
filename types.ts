
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
  reviews: Review[];
  rating?: number;
  reviewCount?: number;
  gender: 'Men' | 'Women' | 'Kids' | 'Unisex';
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

export interface Review {
  id: number;
  author: string;
  rating: number;
  comment: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Shipped' | 'Delivered';
}