import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Product, Category, Order, Coupon, Review } from '../../types';
import {
  LayoutDashboard,
  ShoppingBag,
  FolderOpen,
  DollarSign,
  ShoppingCart,
  Users,
  Percent,
  MessageSquare,
  Plus,
  Trash2,
  Edit,
  Sliders,
  CheckCircle,
  TrendingUp,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    orders,
    updateOrderStatus,
    coupons,
    addCoupon,
    deleteCoupon,
    reviews,
    language,
    adminSubView,
    setAdminSubView,
    t,
    formatPrice,
  } = useApp();

  const isRTL = language === 'ar';

  // Modal / Form States
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  const [showCouponModal, setShowCouponModal] = useState(false);

  // Forms Binding State
  const [prodName, setProdName] = useState('');
  const [prodArName, setProdArName] = useState('');
  const [prodPrice, setProdPrice] = useState(0);
  const [prodOrigPrice, setProdOrigPrice] = useState(0);
  const [prodCategory, setProdCategory] = useState('');
  const [prodStock, setProdStock] = useState(10);
  const [prodDesc, setProdDesc] = useState('');
  const [prodArDesc, setProdArDesc] = useState('');
  const [prodImage, setProdImage] = useState('');

  const [catName, setCatName] = useState('');
  const [catArName, setCatArName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catImage, setCatImage] = useState('');

  const [coupCode, setCoupCode] = useState('');
  const [coupType, setCoupType] = useState<'percentage' | 'fixed'>('percentage');
  const [coupVal, setCoupVal] = useState(10);
  const [coupMin, setCoupMin] = useState(50);

  // Stats computed
  const stats = useMemo(() => {
    const totalSales = orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.total : sum, 0);
    const activeCouponsCount = coupons.filter(c => c.active).length;
    return {
      sales: totalSales.toFixed(2),
      ordersCount: orders.length,
      productsCount: products.length,
      couponsCount: activeCouponsCount,
    };
  }, [orders, coupons, products]);

  // Product CRUD Handlers
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setProdName('');
    setProdArName('');
    setProdPrice(99.99);
    setProdOrigPrice(129.99);
    setProdCategory(categories[0]?.id || 'cat-1');
    setProdStock(15);
    setProdDesc('');
    setProdArDesc('');
    setProdImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80');
    setShowProductModal(true);
  };

  const handleOpenEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdArName(p.arName);
    setProdPrice(p.price);
    setProdOrigPrice(p.originalPrice || 0);
    setProdCategory(p.categoryId);
    setProdStock(p.stock);
    setProdDesc(p.description);
    setProdArDesc(p.arDescription);
    setProdImage(p.image);
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const productPayload = {
      name: prodName,
      arName: prodArName,
      price: prodPrice,
      originalPrice: prodOrigPrice > 0 ? prodOrigPrice : undefined,
      categoryId: prodCategory,
      stock: prodStock,
      description: prodDesc,
      arDescription: prodArDesc,
      image: prodImage,
      images: [prodImage],
      specs: editingProduct?.specs || { 'Warranty': '1 Year' },
      arSpecs: editingProduct?.arSpecs || { 'الضمان': 'سنة واحدة' },
    };

    if (editingProduct) {
      updateProduct({
        ...editingProduct,
        ...productPayload,
      });
    } else {
      addProduct(productPayload);
    }
    setShowProductModal(false);
  };

  // Category CRUD Handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatArName('');
    setCatSlug('');
    setCatImage('https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&q=80');
    setShowCategoryModal(true);
  };

  const handleOpenEditCategory = (c: Category) => {
    setEditingCategory(c);
    setCatName(c.name);
    setCatArName(c.arName);
    setCatSlug(c.slug);
    setCatImage(c.image);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: catName,
      arName: catArName,
      slug: catSlug || catName.toLowerCase().replace(/\s+/g, '-'),
      image: catImage,
      icon: editingCategory?.icon || 'Cpu',
    };

    if (editingCategory) {
      updateCategory({
        ...editingCategory,
        ...payload,
      });
    } else {
      addCategory(payload);
    }
    setShowCategoryModal(false);
  };

  // Coupon Handlers
  const handleSaveCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    addCoupon({
      code: coupCode.toUpperCase(),
      discountType: coupType,
      value: coupVal,
      minPurchase: coupMin,
      expiryDate: '2027-12-31',
      active: true,
    });
    setShowCouponModal(false);
    setCoupCode('');
  };

  const sidebarItems = [
    { label: t('overview'), subview: 'dashboard' as const, icon: LayoutDashboard },
    { label: t('productsCRUD'), subview: 'products' as const, icon: ShoppingBag },
    { label: t('categoriesCRUD'), subview: 'categories' as const, icon: FolderOpen },
    { label: t('allOrders'), subview: 'orders' as const, icon: ShoppingCart },
    { label: t('coupons'), subview: 'coupons' as const, icon: Percent },
    { label: t('reviewsManager'), subview: 'reviews' as const, icon: MessageSquare },
  ];

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* ADMIN SIDEBAR */}
        <aside className="w-full lg:w-64 flex-shrink-0 bg-slate-900 text-slate-300 dark:bg-slate-950 border border-slate-800 rounded-2xl p-5 h-fit">
          <div className="pb-5 mb-5 border-b border-slate-850">
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-widest block mb-1">
              {isRTL ? 'منطقة المشرفين' : 'Internal Administration'}
            </span>
            <h3 className="font-extrabold text-sm text-white">{t('adminPanel')}</h3>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = adminSubView === item.subview;
              return (
                <button
                  key={item.subview}
                  onClick={() => setAdminSubView(item.subview)}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-xs font-bold rounded-xl transition ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-500 border-l-4 border-amber-500'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                  style={{ textAlign: isRTL ? 'right' : 'left' }}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* ADMIN MAIN VIEW PANEL */}
        <main className="flex-1 space-y-8">
          {/* 1. OVERVIEW DASHBOARD */}
          {adminSubView === 'dashboard' && (
            <div className="space-y-8">
              {/* Stats Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: t('totalSales'), val: formatPrice(parseFloat(stats.sales)), icon: DollarSign, color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' },
                  { label: t('totalOrders'), val: stats.ordersCount, icon: ShoppingCart, color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20' },
                  { label: t('totalProducts'), val: stats.productsCount, icon: ShoppingBag, color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20' },
                  { label: t('activeCoupons'), val: stats.couponsCount, icon: Percent, color: 'text-violet-500 bg-violet-50 dark:bg-violet-950/20' },
                ].map((card, index) => (
                  <div key={index} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 p-6 rounded-2xl flex items-center justify-between shadow-xs">
                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{card.label}</span>
                      <span className="text-2xl font-black text-slate-900 dark:text-slate-50">{card.val}</span>
                    </div>
                    <div className={`p-3.5 rounded-xl ${card.color}`}>
                      <card.icon className="w-5.5 h-5.5" />
                    </div>
                  </div>
                ))}
              </div>

              {/* Graphic Chart bar representation (HTML/SVG) */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-50 dark:border-slate-800/80">
                  <h4 className="font-bold text-slate-850 dark:text-slate-100 text-sm flex items-center gap-2">
                    <TrendingUp className="w-4.5 h-4.5 text-indigo-600" />
                    {t('salesTrend')}
                  </h4>
                  <span className="text-xs text-slate-400 font-semibold">{isRTL ? 'آخر 30 يوماً' : 'Last 30 Days'}</span>
                </div>

                <div className="h-44 flex items-end gap-3 pt-6 px-4">
                  {[45, 62, 58, 75, 90, 85, 110, 125, 115, 140, 155, 185].map((h, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                      <div
                        className="w-full bg-gradient-to-t from-indigo-500 to-violet-500 rounded-t-lg group-hover:from-amber-500 group-hover:to-orange-500 transition-all duration-300 relative"
                        style={{ height: `${(h / 190) * 100}%` }}
                      >
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow transition-all whitespace-nowrap z-10">
                          ${h}k
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-bold">M{i+1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Orders sub-section */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-4">
                <h4 className="font-bold text-slate-850 dark:text-slate-100 text-sm">{t('recentOrders')}</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                    <thead>
                      <tr className="border-b border-slate-50 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                        <th className="pb-3">{t('orderId')}</th>
                        <th className="pb-3">{isRTL ? 'العميل' : 'Customer'}</th>
                        <th className="pb-3">{t('orderDate')}</th>
                        <th className="pb-3">{t('orderTotal')}</th>
                        <th className="pb-3">{t('orderStatus')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="border-b border-slate-50 dark:border-slate-850 hover:bg-slate-50/50">
                          <td className="py-3 font-bold text-indigo-600 dark:text-indigo-400">{o.orderNumber}</td>
                          <td className="py-3 font-semibold text-slate-800 dark:text-slate-200">{o.userName}</td>
                          <td className="py-3 text-slate-400">{o.date}</td>
                          <td className="py-3 font-bold text-slate-800 dark:text-slate-100">{formatPrice(o.total)}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                              o.status === 'delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. PRODUCTS CRUD */}
          {adminSubView === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl">
                <div>
                  <h3 className="font-black text-lg text-slate-800 dark:text-slate-100">{t('productsCRUD')}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{isRTL ? 'قائمة كاملة بالمنتجات مع صلاحيات التعديل والحذف' : 'List of all products in inventory'}</p>
                </div>
                <button
                  onClick={handleOpenAddProduct}
                  className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  {t('addProduct')}
                </button>
              </div>

              {/* Products Table */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                    <thead>
                      <tr className="border-b border-slate-50 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/50 dark:bg-slate-950/20">
                        <th className="p-4">{t('productName')}</th>
                        <th className="p-4">{t('price')}</th>
                        <th className="p-4">{t('stock')}</th>
                        <th className="p-4">{t('category')}</th>
                        <th className="p-4 text-center">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id} className="border-b border-slate-50 dark:border-slate-850 hover:bg-slate-50/50">
                          <td className="p-4 flex items-center gap-3">
                            <img src={p.image} alt={p.name} className="w-9 h-9 rounded object-cover border" />
                            <div className="space-y-0.5 max-w-[180px]">
                              <span className="font-bold text-slate-800 dark:text-slate-100 block truncate">{isRTL ? p.arName : p.name}</span>
                              <span className="text-[10px] text-slate-400">ID: {p.id}</span>
                            </div>
                          </td>
                          <td className="p-4 font-extrabold text-indigo-600 dark:text-indigo-400">{formatPrice(p.price)}</td>
                          <td className="p-4 font-semibold text-slate-500">
                            <span className={p.stock <= 5 ? 'text-rose-500 font-bold' : ''}>{p.stock} units</span>
                          </td>
                          <td className="p-4">
                            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-[10px] font-bold">
                              {categories.find(c => c.id === p.categoryId)?.[isRTL ? 'arName' : 'name']}
                            </span>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-2 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 dark:bg-slate-950 rounded-lg transition"
                                title={t('editProduct')}
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteProduct(p.id)}
                                className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 dark:bg-slate-950 rounded-lg transition"
                                title={t('deleteProduct')}
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 3. CATEGORIES CRUD */}
          {adminSubView === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl">
                <div>
                  <h3 className="font-black text-lg text-slate-800 dark:text-slate-100">{t('categoriesCRUD')}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{isRTL ? 'قائمة الفئات الأساسية في المتجر لتعديلها' : 'List of shop categories'}</p>
                </div>
                <button
                  onClick={handleOpenAddCategory}
                  className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  {t('addCategory')}
                </button>
              </div>

              {/* Categories Table */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                    <thead>
                      <tr className="border-b border-slate-50 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/50 dark:bg-slate-950/20">
                        <th className="p-4">{isRTL ? 'اسم الفئة' : 'Category Name'}</th>
                        <th className="p-4">Slug</th>
                        <th className="p-4 text-center">{t('actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((c) => (
                        <tr key={c.id} className="border-b border-slate-50 dark:border-slate-850 hover:bg-slate-50/50">
                          <td className="p-4 flex items-center gap-3">
                            <img src={c.image} alt={c.name} className="w-9 h-9 rounded-full object-cover border" />
                            <span className="font-bold text-slate-800 dark:text-slate-100">{isRTL ? c.arName : c.name}</span>
                          </td>
                          <td className="p-4 font-mono text-slate-500 font-semibold">{c.slug}</td>
                          <td className="p-4">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleOpenEditCategory(c)}
                                className="p-2 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 dark:bg-slate-950 rounded-lg transition"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => deleteCategory(c.id)}
                                className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 dark:bg-slate-950 rounded-lg transition"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 4. ORDERS STATUS MANAGER */}
          {adminSubView === 'orders' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl">
                <h3 className="font-black text-lg text-slate-800 dark:text-slate-100">{t('allOrders')}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{isRTL ? 'إدارة حالات الطلبيات وتحديث خطوات التوصيل والشحن' : 'Update order delivery status immediately'}</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                    <thead>
                      <tr className="border-b border-slate-50 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/50 dark:bg-slate-950/20">
                        <th className="p-4">{t('orderId')}</th>
                        <th className="p-4">{isRTL ? 'العميل' : 'Customer'}</th>
                        <th className="p-4">{t('orderTotal')}</th>
                        <th className="p-4">{t('orderDate')}</th>
                        <th className="p-4 text-center">{t('orderStatus')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id} className="border-b border-slate-50 dark:border-slate-850 hover:bg-slate-50/50">
                          <td className="p-4 font-bold text-indigo-600">{o.orderNumber}</td>
                          <td className="p-4 font-semibold text-slate-800 dark:text-slate-100">
                            <div>
                              <p>{o.userName}</p>
                              <span className="text-[10px] text-slate-400 font-medium block">{o.contactPhone}</span>
                            </div>
                          </td>
                          <td className="p-4 font-extrabold text-indigo-600 dark:text-indigo-400">{formatPrice(o.total)}</td>
                          <td className="p-4 text-slate-500">{o.date}</td>
                          <td className="p-4">
                            <div className="flex justify-center">
                              <select
                                value={o.status}
                                onChange={(e) => updateOrderStatus(o.id, e.target.value as Order['status'])}
                                className={`h-9 px-3 text-[11px] font-bold rounded-lg border focus:outline-none ${
                                  o.status === 'delivered' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 text-slate-700'
                                }`}
                              >
                                <option value="pending">{t('statusPending')}</option>
                                <option value="processing">{t('statusProcessing')}</option>
                                <option value="shipped">{t('statusShipped')}</option>
                                <option value="delivered">{t('statusDelivered')}</option>
                                <option value="cancelled">{t('statusCancelled')}</option>
                              </select>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 5. COUPONS CREATOR */}
          {adminSubView === 'coupons' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl">
                <div>
                  <h3 className="font-black text-lg text-slate-800 dark:text-slate-100">{t('coupons')}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{isRTL ? 'قائمة بالكوبونات النشطة في المتجر مع أداة إضافة جديدة' : 'Manage discount promotional codes'}</p>
                </div>
                <button
                  onClick={() => setShowCouponModal(true)}
                  className="h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full text-xs flex items-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4" />
                  {t('addCoupon')}
                </button>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
                <table className="w-full text-xs text-left" style={{ textAlign: isRTL ? 'right' : 'left' }}>
                  <thead>
                    <tr className="border-b border-slate-50 dark:border-slate-800 text-slate-400 font-bold bg-slate-50/50 dark:bg-slate-950/20">
                      <th className="p-4">Code</th>
                      <th className="p-4">Type</th>
                      <th className="p-4">Value</th>
                      <th className="p-4">Min. Purchase</th>
                      <th className="p-4 text-center">{t('actions')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {coupons.map((c) => (
                      <tr key={c.id} className="border-b border-slate-50 dark:border-slate-850 hover:bg-slate-50/50">
                        <td className="p-4 font-extrabold text-indigo-600 dark:text-indigo-400 font-mono tracking-wider">{c.code}</td>
                        <td className="p-4 font-semibold text-slate-500 capitalize">{c.discountType}</td>
                        <td className="p-4 font-bold text-slate-800 dark:text-slate-100">
                          {c.discountType === 'percentage' ? `${c.value}%` : formatPrice(c.value)}
                        </td>
                        <td className="p-4 text-slate-400">{formatPrice(c.minPurchase)}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => deleteCoupon(c.id)}
                            className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 6. REVIEWS MANAGER */}
          {adminSubView === 'reviews' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 rounded-2xl">
                <h3 className="font-black text-lg text-slate-800 dark:text-slate-100">{t('reviewsManager')}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{isRTL ? 'آراء العملاء وتقييمات المنتجات النشطة للمراجعة' : 'Customer comments and feedback submitted'}</p>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-6">
                {reviews.map((rev) => (
                  <div key={rev.id} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-950/30 border border-slate-100/50 dark:border-slate-850 rounded-xl">
                    <img src={rev.userAvatar} alt={rev.userName} className="w-9 h-9 rounded-full object-cover" />
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-bold text-xs text-slate-850 dark:text-slate-100">{rev.userName}</h5>
                        <span className="text-[10px] text-slate-400">{rev.date}</span>
                      </div>
                      <p className="text-[10px] text-indigo-600 font-bold uppercase">
                        Product: {products.find(p => p.id === rev.productId)?.[isRTL ? 'arName' : 'name']}
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed italic">"{rev.comment}"</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ================= MODALS SECTION ================= */}
      {/* A. PRODUCT CRUD MODAL */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6 shadow-2xl">
            <h3 className="font-black text-lg text-slate-900 dark:text-slate-50">
              {editingProduct ? t('editProduct') : t('addProduct')}
            </h3>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Product Name (EN)</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    className="w-full h-10 text-xs px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Product Name (AR)</label>
                  <input
                    type="text"
                    required
                    value={prodArName}
                    onChange={(e) => setProdArName(e.target.value)}
                    className="w-full h-10 text-xs px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={prodPrice}
                    onChange={(e) => setProdPrice(parseFloat(e.target.value))}
                    className="w-full h-10 text-xs px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Original Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={prodOrigPrice}
                    onChange={(e) => setProdOrigPrice(parseFloat(e.target.value))}
                    className="w-full h-10 text-xs px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category</label>
                  <select
                    value={prodCategory}
                    onChange={(e) => setProdCategory(e.target.value)}
                    className="w-full h-10 text-xs px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{isRTL ? c.arName : c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Stock</label>
                  <input
                    type="number"
                    required
                    value={prodStock}
                    onChange={(e) => setProdStock(parseInt(e.target.value))}
                    className="w-full h-10 text-xs px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Image URL</label>
                  <input
                    type="text"
                    required
                    value={prodImage}
                    onChange={(e) => setProdImage(e.target.value)}
                    className="w-full h-10 text-xs px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description (EN)</label>
                  <textarea
                    rows={2}
                    required
                    value={prodDesc}
                    onChange={(e) => setProdDesc(e.target.value)}
                    className="w-full text-xs p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl resize-none"
                  />
                </div>

                <div className="space-y-1.5 md:col-span-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description (AR)</label>
                  <textarea
                    rows={2}
                    required
                    value={prodArDesc}
                    onChange={(e) => setProdArDesc(e.target.value)}
                    className="w-full text-xs p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl resize-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3.5 pt-4">
                <button
                  type="button"
                  onClick={() => setShowProductModal(false)}
                  className="px-5 h-10 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* B. CATEGORY CRUD MODAL */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-6 shadow-2xl">
            <h3 className="font-black text-lg text-slate-900 dark:text-slate-50">
              {editingCategory ? t('editCategory') : t('addCategory')}
            </h3>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category Name (EN)</label>
                <input
                  type="text"
                  required
                  value={catName}
                  onChange={(e) => setCatName(e.target.value)}
                  className="w-full h-10 text-xs px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category Name (AR)</label>
                <input
                  type="text"
                  required
                  value={catArName}
                  onChange={(e) => setCatArName(e.target.value)}
                  className="w-full h-10 text-xs px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Slug (Unique)</label>
                <input
                  type="text"
                  placeholder="electronics"
                  value={catSlug}
                  onChange={(e) => setCatSlug(e.target.value)}
                  className="w-full h-10 text-xs px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Image URL</label>
                <input
                  type="text"
                  required
                  value={catImage}
                  onChange={(e) => setCatImage(e.target.value)}
                  className="w-full h-10 text-xs px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3.5 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-5 h-10 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* C. COUPONS ADD MODAL */}
      {showCouponModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-6 shadow-2xl">
            <h3 className="font-black text-lg text-slate-900 dark:text-slate-50">
              {t('addCoupon')}
            </h3>

            <form onSubmit={handleSaveCoupon} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Promo Code</label>
                <input
                  type="text"
                  required
                  placeholder="DEAL50"
                  value={coupCode}
                  onChange={(e) => setCoupCode(e.target.value)}
                  className="w-full h-10 text-xs px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Type</label>
                <select
                  value={coupType}
                  onChange={(e) => setCoupType(e.target.value as any)}
                  className="w-full h-10 text-xs px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount ($)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Discount Value</label>
                <input
                  type="number"
                  required
                  value={coupVal}
                  onChange={(e) => setCoupVal(parseInt(e.target.value))}
                  className="w-full h-10 text-xs px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Min. Required Purchase ($)</label>
                <input
                  type="number"
                  required
                  value={coupMin}
                  onChange={(e) => setCoupMin(parseInt(e.target.value))}
                  className="w-full h-10 text-xs px-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                />
              </div>

              <div className="flex justify-end gap-3.5 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCouponModal(false)}
                  className="px-5 h-10 border border-slate-200 text-slate-600 rounded-xl text-xs font-semibold"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="px-5 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold"
                >
                  {t('save')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
