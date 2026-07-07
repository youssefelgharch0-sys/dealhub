export interface Product {
  id: string;
  name: string;
  arName: string;
  description: string;
  arDescription: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  stock: number;
  specs: Record<string, string>;
  arSpecs: Record<string, string>;
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  arName: string;
  slug: string;
  image: string;
  icon: string; // Lucide icon name
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  avatar?: string;
  address?: string;
  arAddress?: string;
  phone?: string;
  joinedDate: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userName: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  contactPhone: string;
  paymentMethod: string;
  couponCode?: string;
  date: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minPurchase: number;
  expiryDate: string;
  active: boolean;
}

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export type ViewType =
  | 'home'
  | 'shop'
  | 'categories'
  | 'product-details'
  | 'search'
  | 'wishlist'
  | 'cart'
  | 'checkout'
  | 'order-success'
  | 'login'
  | 'register'
  | 'user-dashboard'
  | 'contact'
  | 'about'
  | 'faq'
  | 'admin-dashboard';

export type UserSubView = 'profile' | 'orders' | 'settings';

export type AdminSubView =
  | 'dashboard'
  | 'products'
  | 'categories'
  | 'orders'
  | 'customers'
  | 'coupons'
  | 'reviews'
  | 'analytics'
  | 'settings';
