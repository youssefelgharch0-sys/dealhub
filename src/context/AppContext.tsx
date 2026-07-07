import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  User,
  CartItem,
  Order,
  Review,
  Coupon,
  Toast,
  ViewType,
  AdminSubView,
  UserSubView,
} from '../types';
import {
  initialCategories,
  initialProducts,
  initialCoupons,
  initialReviews,
  defaultUser,
  defaultAdmin,
  initialOrders,
} from '../data/mockData';
import { translations } from '../data/translations';

interface AppContextType {
  // Navigation
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  selectedProductId: string | null;
  setSelectedProductId: (id: string | null) => void;
  adminSubView: AdminSubView;
  setAdminSubView: (view: AdminSubView) => void;
  userSubView: UserSubView;
  setUserSubView: (view: UserSubView) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategorySlug: string | null;
  setSelectedCategorySlug: (slug: string | null) => void;

  // Language & Theme
  language: 'en' | 'ar';
  setLanguage: (lang: 'en' | 'ar') => void;
  t: (key: keyof typeof translations['en']) => string;
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Auth
  user: User | null;
  login: (email: string, role: 'customer' | 'admin') => boolean;
  register: (name: string, email: string) => boolean;
  logout: () => void;
  updateProfile: (name: string, email: string, phone: string, address: string, arAddress: string) => void;

  // Products & Categories CRUD
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: string) => void;
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (productId: string, color?: string, size?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, color?: string, size?: string) => void;
  clearCart: () => void;
  getCartTotal: () => { subtotal: number; itemsCount: number };

  // Wishlist
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Coupons
  coupons: Coupon[];
  addCoupon: (coupon: Omit<Coupon, 'id'>) => void;
  deleteCoupon: (id: string) => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;

  // Reviews
  reviews: Review[];
  addProductReview: (productId: string, rating: number, comment: string) => void;

  // Orders
  orders: Order[];
  createOrder: (details: { shippingAddress: string; contactPhone: string; paymentMethod: string; notes?: string }) => Order | null;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;

  // Toasts
  toasts: Toast[];
  showToast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;

  // Price formatting
  formatPrice: (price: number) => string;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation states
  const [currentView, setCurrentView] = useState<ViewType>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [adminSubView, setAdminSubView] = useState<AdminSubView>('dashboard');
  const [userSubView, setUserSubView] = useState<UserSubView>('profile');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string | null>(null);

  // Localization and theme
  const [language, setLanguageState] = useState<'en' | 'ar'>('en');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Core Data
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [user, setUser] = useState<User | null>(defaultUser); // Initial mock customer
  const [coupons, setCoupons] = useState<Coupon[]>(initialCoupons);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Load from local storage
  useEffect(() => {
    const storedLang = localStorage.getItem('dealhub_lang') as 'en' | 'ar';
    if (storedLang) setLanguageState(storedLang);

    const storedTheme = localStorage.getItem('dealhub_theme') as 'light' | 'dark';
    if (storedTheme) setTheme(storedTheme);

    const storedUser = localStorage.getItem('dealhub_user');
    if (storedUser) {
      if (storedUser === 'null') setUser(null);
      else setUser(JSON.parse(storedUser));
    }

    const storedCart = localStorage.getItem('dealhub_cart');
    if (storedCart) setCart(JSON.parse(storedCart));

    const storedWishlist = localStorage.getItem('dealhub_wishlist');
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));

    const storedProducts = localStorage.getItem('dealhub_products');
    if (storedProducts) setProducts(JSON.parse(storedProducts));

    const storedCategories = localStorage.getItem('dealhub_categories');
    if (storedCategories) setCategories(JSON.parse(storedCategories));

    const storedCoupons = localStorage.getItem('dealhub_coupons');
    if (storedCoupons) setCoupons(JSON.parse(storedCoupons));

    const storedOrders = localStorage.getItem('dealhub_orders');
    if (storedOrders) setOrders(JSON.parse(storedOrders));

    const storedReviews = localStorage.getItem('dealhub_reviews');
    if (storedReviews) setReviews(JSON.parse(storedReviews));
  }, []);

  // Sync to local storage
  const setLanguage = (lang: 'en' | 'ar') => {
    setLanguageState(lang);
    localStorage.setItem('dealhub_lang', lang);
  };

  useEffect(() => {
    localStorage.setItem('dealhub_theme', theme);
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const t = (key: keyof typeof translations['en']): string => {
    const dict = translations[language];
    return (dict[key] || translations['en'][key] || key) as string;
  };

  // Toast utility
  const showToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Auth Methods
  const login = (email: string, role: 'customer' | 'admin'): boolean => {
    if (role === 'admin') {
      setUser(defaultAdmin);
      localStorage.setItem('dealhub_user', JSON.stringify(defaultAdmin));
      showToast('Admin logged in successfully', 'success');
      setCurrentView('admin-dashboard');
      return true;
    } else {
      const customer = { ...defaultUser, email };
      setUser(customer);
      localStorage.setItem('dealhub_user', JSON.stringify(customer));
      showToast(`Welcome back, ${customer.name}!`, 'success');
      setCurrentView('home');
      return true;
    }
  };

  const register = (name: string, email: string): boolean => {
    const customer: User = {
      id: 'usr-' + Math.random().toString(36).substring(2, 9),
      name,
      email,
      role: 'customer',
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setUser(customer);
    localStorage.setItem('dealhub_user', JSON.stringify(customer));
    showToast('Account registered successfully', 'success');
    setCurrentView('home');
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.setItem('dealhub_user', 'null');
    showToast('Logged out successfully', 'info');
    setCurrentView('home');
  };

  const updateProfile = (name: string, email: string, phone: string, address: string, arAddress: string) => {
    if (!user) return;
    const updated = { ...user, name, email, phone, address, arAddress };
    setUser(updated);
    localStorage.setItem('dealhub_user', JSON.stringify(updated));
    showToast(t('profileUpdateSuccess'), 'success');
  };

  // Products CRUD
  const addProduct = (p: Omit<Product, 'id' | 'rating' | 'reviewsCount'>) => {
    const newProd: Product = {
      ...p,
      id: 'prod-' + Math.random().toString(36).substring(2, 9),
      rating: 5.0,
      reviewsCount: 0,
    };
    const updated = [newProd, ...products];
    setProducts(updated);
    localStorage.setItem('dealhub_products', JSON.stringify(updated));
    showToast('Product added successfully', 'success');
  };

  const updateProduct = (p: Product) => {
    const updated = products.map(item => item.id === p.id ? p : item);
    setProducts(updated);
    localStorage.setItem('dealhub_products', JSON.stringify(updated));
    showToast('Product updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(item => item.id !== id);
    setProducts(updated);
    localStorage.setItem('dealhub_products', JSON.stringify(updated));
    showToast('Product deleted successfully', 'success');
  };

  // Categories CRUD
  const addCategory = (c: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...c,
      id: 'cat-' + Math.random().toString(36).substring(2, 9),
    };
    const updated = [...categories, newCat];
    setCategories(updated);
    localStorage.setItem('dealhub_categories', JSON.stringify(updated));
    showToast('Category added successfully', 'success');
  };

  const updateCategory = (c: Category) => {
    const updated = categories.map(item => item.id === c.id ? c : item);
    setCategories(updated);
    localStorage.setItem('dealhub_categories', JSON.stringify(updated));
    showToast('Category updated successfully', 'success');
  };

  const deleteCategory = (id: string) => {
    const updated = categories.filter(item => item.id !== id);
    setCategories(updated);
    localStorage.setItem('dealhub_categories', JSON.stringify(updated));
    showToast('Category deleted successfully', 'success');
  };

  // Cart Methods
  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    const updated = [...cart];
    const existingIndex = updated.findIndex(
      item =>
        item.product.id === product.id &&
        item.selectedColor === color &&
        item.selectedSize === size
    );

    if (existingIndex > -1) {
      updated[existingIndex].quantity += quantity;
    } else {
      updated.push({ product, quantity, selectedColor: color, selectedSize: size });
    }

    setCart(updated);
    localStorage.setItem('dealhub_cart', JSON.stringify(updated));
    showToast(`${language === 'ar' ? product.arName : product.name} ${t('addedToCart')}`, 'success');
  };

  const removeFromCart = (productId: string, color?: string, size?: string) => {
    const updated = cart.filter(
      item =>
        !(
          item.product.id === productId &&
          item.selectedColor === color &&
          item.selectedSize === size
        )
    );
    setCart(updated);
    localStorage.setItem('dealhub_cart', JSON.stringify(updated));
    showToast('Item removed from cart', 'info');
  };

  const updateCartQuantity = (productId: string, quantity: number, color?: string, size?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, color, size);
      return;
    }
    const updated = cart.map(item => {
      if (
        item.product.id === productId &&
        item.selectedColor === color &&
        item.selectedSize === size
      ) {
        return { ...item, quantity };
      }
      return item;
    });
    setCart(updated);
    localStorage.setItem('dealhub_cart', JSON.stringify(updated));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.setItem('dealhub_cart', JSON.stringify([]));
    setAppliedCoupon(null);
  };

  const getCartTotal = () => {
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    return { subtotal, itemsCount };
  };

  // Wishlist Methods
  const toggleWishlist = (product: Product) => {
    const exists = wishlist.some(item => item.id === product.id);
    let updated: Product[];
    if (exists) {
      updated = wishlist.filter(item => item.id !== product.id);
      showToast(`${language === 'ar' ? product.arName : product.name} ${t('removedFromWishlist')}`, 'info');
    } else {
      updated = [...wishlist, product];
      showToast(`${language === 'ar' ? product.arName : product.name} ${t('addedToWishlist')}`, 'success');
    }
    setWishlist(updated);
    localStorage.setItem('dealhub_wishlist', JSON.stringify(updated));
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some(item => item.id === productId);
  };

  // Coupons
  const addCoupon = (c: Omit<Coupon, 'id'>) => {
    const newC: Coupon = {
      ...c,
      id: 'coup-' + Math.random().toString(36).substring(2, 9),
    };
    const updated = [...coupons, newC];
    setCoupons(updated);
    localStorage.setItem('dealhub_coupons', JSON.stringify(updated));
    showToast('Coupon added successfully', 'success');
  };

  const deleteCoupon = (id: string) => {
    const updated = coupons.filter(c => c.id !== id);
    setCoupons(updated);
    localStorage.setItem('dealhub_coupons', JSON.stringify(updated));
    showToast('Coupon deleted successfully', 'success');
  };

  const applyCoupon = (code: string): boolean => {
    const trimmed = code.trim().toUpperCase();
    const coupon = coupons.find(c => c.code === trimmed && c.active);
    const { subtotal } = getCartTotal();

    if (coupon && subtotal >= coupon.minPurchase) {
      setAppliedCoupon(coupon);
      showToast(t('couponSuccess'), 'success');
      return true;
    }
    showToast(t('couponError'), 'error');
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  // Reviews
  const addProductReview = (productId: string, rating: number, comment: string) => {
    const newReview: Review = {
      id: 'rev-' + Math.random().toString(36).substring(2, 9),
      productId,
      userName: user ? user.name : 'Anonymous Guest',
      userAvatar: user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80',
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    localStorage.setItem('dealhub_reviews', JSON.stringify(updatedReviews));

    // Update product rating and reviewsCount
    const productReviews = updatedReviews.filter(r => r.productId === productId);
    const averageRating = parseFloat(
      (productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length).toFixed(1)
    );

    const updatedProducts = products.map(p => {
      if (p.id === productId) {
        return {
          ...p,
          rating: averageRating,
          reviewsCount: productReviews.length,
        };
      }
      return p;
    });

    setProducts(updatedProducts);
    localStorage.setItem('dealhub_products', JSON.stringify(updatedProducts));
    showToast(t('reviewSuccess'), 'success');
  };

  // Orders
  const createOrder = (details: {
    shippingAddress: string;
    contactPhone: string;
    paymentMethod: string;
    notes?: string;
  }): Order | null => {
    if (cart.length === 0) {
      showToast('Cart is empty', 'error');
      return null;
    }

    const { subtotal } = getCartTotal();
    const shipping = subtotal > 150 ? 0 : 10;
    let discount = 0;

    if (appliedCoupon) {
      if (appliedCoupon.discountType === 'percentage') {
        discount = parseFloat(((subtotal * appliedCoupon.value) / 100).toFixed(2));
      } else {
        discount = appliedCoupon.value;
      }
    }

    const total = parseFloat((subtotal + shipping - discount).toFixed(2));
    const orderNumber = 'DH-' + Math.floor(10000 + Math.random() * 90000);

    const newOrder: Order = {
      id: 'ord-' + Math.random().toString(36).substring(2, 9),
      orderNumber,
      userId: user?.id || 'usr-guest',
      userName: user?.name || 'Guest Customer',
      items: [...cart],
      subtotal,
      shipping,
      discount,
      total,
      status: 'pending',
      shippingAddress: details.shippingAddress,
      contactPhone: details.contactPhone,
      paymentMethod: details.paymentMethod,
      couponCode: appliedCoupon?.code,
      date: new Date().toISOString().split('T')[0],
    };

    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('dealhub_orders', JSON.stringify(updated));

    // Reduce product stocks
    const updatedProducts = products.map(p => {
      const cartItem = cart.find(item => item.product.id === p.id);
      if (cartItem) {
        return {
          ...p,
          stock: Math.max(0, p.stock - cartItem.quantity),
        };
      }
      return p;
    });
    setProducts(updatedProducts);
    localStorage.setItem('dealhub_products', JSON.stringify(updatedProducts));

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    const updated = orders.map(ord => ord.id === orderId ? { ...ord, status } : ord);
    setOrders(updated);
    localStorage.setItem('dealhub_orders', JSON.stringify(updated));
    showToast(`Order status updated to ${status}`, 'success');
  };

  const formatPrice = (price: number): string => {
    if (language === 'ar') {
      return `${price.toFixed(2)} د.م.`;
    }
    return `${price.toFixed(2)} MAD`;
  };

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedProductId,
        setSelectedProductId,
        adminSubView,
        setAdminSubView,
        userSubView,
        setUserSubView,
        searchQuery,
        setSearchQuery,
        selectedCategorySlug,
        setSelectedCategorySlug,
        language,
        setLanguage,
        t,
        theme,
        toggleTheme,
        user,
        login,
        register,
        logout,
        updateProfile,
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        getCartTotal,
        wishlist,
        toggleWishlist,
        isInWishlist,
        coupons,
        addCoupon,
        deleteCoupon,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        reviews,
        addProductReview,
        orders,
        createOrder,
        updateOrderStatus,
        toasts,
        showToast,
        dismissToast,
        formatPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
