import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, ShoppingBag, Settings, LogOut, Phone, MapPin, Mail, ChevronRight, Calendar, CircleDot } from 'lucide-react';

export const UserDashboardView: React.FC = () => {
  const {
    user,
    orders,
    logout,
    updateProfile,
    userSubView,
    setUserSubView,
    language,
    t,
    formatPrice,
  } = useApp();

  const isRTL = language === 'ar';

  // Profile Form States
  const [profileName, setProfileName] = useState(user?.name || '');
  const [profileEmail, setProfileEmail] = useState(user?.email || '');
  const [profilePhone, setProfilePhone] = useState(user?.phone || '');
  const [profileAddress, setProfileAddress] = useState(user?.address || '');
  const [profileArAddress, setProfileArAddress] = useState(user?.arAddress || '');

  // Active expanded order ID state
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(profileName, profileEmail, profilePhone, profileAddress, profileArAddress);
  };

  // Filter orders for logged-in user
  const userOrders = orders.filter((o) => o.userId === user?.id || o.userId === 'usr-guest');

  const sidebarItems = [
    { label: t('myProfile'), subview: 'profile' as const, icon: User },
    { label: t('myOrders'), subview: 'orders' as const, icon: ShoppingBag },
    { label: t('profileSettings'), subview: 'settings' as const, icon: Settings },
  ];

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-400 font-bold mb-4">{isRTL ? 'الرجاء تسجيل الدخول أولاً للوصول للوحة التحكم' : 'Please log in to view your dashboard'}</p>
        <button
          onClick={() => {
            const context = useApp();
            context.setCurrentView('login');
          }}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-semibold"
        >
          {t('login')}
        </button>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* SIDEBAR NAVIGATION */}
        <aside className="w-full lg:w-64 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 h-fit">
          {/* User Profile Summary */}
          <div className="flex items-center gap-3.5 pb-5 mb-5 border-b border-slate-100 dark:border-slate-800">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
              alt={user.name}
              className="w-12 h-12 rounded-full object-cover border border-slate-200 dark:border-slate-850"
            />
            <div className="space-y-0.5 truncate max-w-[150px]">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">{user.name}</h3>
              <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-bold px-2 py-0.5 rounded-full">
                {user.role === 'admin' ? t('adminPanel') : t('activeUser')}
              </span>
            </div>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = userSubView === item.subview;
              return (
                <button
                  key={item.subview}
                  onClick={() => setUserSubView(item.subview)}
                  className={`flex items-center gap-3 w-full px-4 py-3 text-xs font-bold rounded-xl transition ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                  style={{ textAlign: isRTL ? 'right' : 'left' }}
                >
                  <Icon className="w-4 h-4 text-slate-400" />
                  {item.label}
                </button>
              );
            })}

            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 text-xs font-bold text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition"
              style={{ textAlign: isRTL ? 'right' : 'left' }}
            >
              <LogOut className="w-4 h-4 text-rose-400" />
              {t('logout')}
            </button>
          </nav>
        </aside>

        {/* SUBVIEW CONTAINER */}
        <main className="flex-1">
          {/* PROFILE SUBVIEW */}
          {userSubView === 'profile' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-8">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                  {t('myProfile')}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRTL ? 'حافظ على بياناتك وعنوان شحنك محدثاً لضمان سرعة التوصيل' : 'Keep your contact detail up to date to guarantee fast shipping'}
                </p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      {t('fullName')}
                    </label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full h-11 text-xs px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      {t('emailAddress')}
                    </label>
                    <input
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full h-11 text-xs px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      {t('phoneNumber')}
                    </label>
                    <input
                      type="tel"
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full h-11 text-xs px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      {isRTL ? 'تاريخ الانضمام' : 'Date Joined'}
                    </label>
                    <div className="w-full h-11 text-xs px-4 bg-slate-100/60 dark:bg-slate-950/60 text-slate-400 border border-slate-200 dark:border-slate-850 rounded-xl flex items-center">
                      {user.joinedDate}
                    </div>
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      {isRTL ? 'عنوان الشارع بالتفصيل (الإنجليزي)' : 'Detailed Street Address (English)'}
                    </label>
                    <input
                      type="text"
                      value={profileAddress}
                      onChange={(e) => setProfileAddress(e.target.value)}
                      className="w-full h-11 text-xs px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      {isRTL ? 'عنوان الشارع بالتفصيل (العربي)' : 'Detailed Street Address (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={profileArAddress}
                      onChange={(e) => setProfileArAddress(e.target.value)}
                      className="w-full h-11 text-xs px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition shadow-md hover:shadow-indigo-500/10"
                >
                  {t('saveChanges')}
                </button>
              </form>
            </div>
          )}

          {/* ORDERS SUBVIEW */}
          {userSubView === 'orders' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                  {t('myOrders')}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRTL ? 'تتبع فواتيرك وحالات شحن طلباتك مباشرة' : 'Monitor invoices and delivery steps in real-time'}
                </p>
              </div>

              <div className="space-y-4">
                {userOrders.length === 0 ? (
                  <p className="text-slate-400 text-center py-8 font-semibold">{t('noOrdersYet')}</p>
                ) : (
                  userOrders.map((order) => {
                    const isExpanded = expandedOrderId === order.id;

                    let statusBg = 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
                    if (order.status === 'delivered') {
                      statusBg = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400';
                    } else if (order.status === 'processing' || order.status === 'shipped') {
                      statusBg = 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400';
                    }

                    return (
                      <div
                        key={order.id}
                        className="border border-slate-100 dark:border-slate-800 rounded-xl overflow-hidden transition hover:border-slate-200"
                      >
                        {/* Summary Bar */}
                        <div
                          onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                          className="p-5 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50 dark:bg-slate-950/30 cursor-pointer"
                        >
                          <div className="space-y-1">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                              {t('orderId')}: <span className="text-slate-800 dark:text-slate-200 font-extrabold">{order.orderNumber}</span>
                            </span>
                            <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {order.date}
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <span className="text-xs text-slate-400 block font-medium">{t('orderTotal')}</span>
                              <span className="text-sm font-black text-indigo-600 dark:text-indigo-400">{formatPrice(order.total)}</span>
                            </div>
                            <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-full ${statusBg}`}>
                              {order.status === 'pending' && t('statusPending')}
                              {order.status === 'processing' && t('statusProcessing')}
                              {order.status === 'shipped' && t('statusShipped')}
                              {order.status === 'delivered' && t('statusDelivered')}
                              {order.status === 'cancelled' && t('statusCancelled')}
                            </span>
                          </div>
                        </div>

                        {/* Expanded Items */}
                        {isExpanded && (
                          <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
                            <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                              {isRTL ? 'محتويات الشحنة' : 'Package Content'}
                            </h4>

                            <div className="space-y-3">
                              {order.items.map((item, idx) => {
                                const name = isRTL ? item.product.arName : item.product.name;
                                return (
                                  <div key={idx} className="flex justify-between items-center text-xs">
                                    <div className="flex items-center gap-3">
                                      <img src={item.product.image} alt={name} className="w-8 h-8 rounded object-cover border" />
                                      <div>
                                        <h5 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{name}</h5>
                                        {item.selectedColor && (
                                          <span className="text-[10px] text-slate-400">Color: {item.selectedColor}</span>
                                        )}
                                      </div>
                                    </div>
                                    <span className="font-semibold text-slate-600 dark:text-slate-400">
                                      {item.quantity} x {formatPrice(item.product.price)}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>

                            {/* Shipping metadata details */}
                            <div className="pt-4 border-t border-slate-50 dark:border-slate-850 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-500">
                              <div className="space-y-1">
                                <span className="font-bold text-slate-700 dark:text-slate-300 block">{isRTL ? 'عنوان التوصيل:' : 'Delivery Address:'}</span>
                                <p>{order.shippingAddress}</p>
                              </div>
                              <div className="space-y-1">
                                <span className="font-bold text-slate-700 dark:text-slate-300 block">{isRTL ? 'بيانات الاتصال:' : 'Contact Info:'}</span>
                                <p>{order.contactPhone}</p>
                                <p className="text-[10px] text-slate-400">{isRTL ? 'طريقة الدفع:' : 'Payment:'} {order.paymentMethod}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* SETTINGS SUBVIEW */}
          {userSubView === 'settings' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-slate-100">
                  {t('profileSettings')}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isRTL ? 'تحكم في تفضيلات واجهة المستخدم الخاصة بك' : 'Configure layout and dashboard preferences'}
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      {isRTL ? 'تفعيل الإشعارات بالبريد الإلكتروني' : 'Enable Email Newsletters'}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {isRTL ? 'استقبل كوبونات حصرية وتنبيهات بصفة مستمرة' : 'Receive automatic alerts for discount coupons'}
                    </p>
                  </div>
                  <input type="checkbox" defaultChecked className="accent-indigo-600 scale-105" />
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-950/50 rounded-xl">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                      {isRTL ? 'التوصيل السريع المفضل' : 'Express Delivery Preference'}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {isRTL ? 'تفضيل الاستلام الفائق عند التوفر تلقائياً' : 'Always select express shipping if available'}
                    </p>
                  </div>
                  <input type="checkbox" className="accent-indigo-600 scale-105" />
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
