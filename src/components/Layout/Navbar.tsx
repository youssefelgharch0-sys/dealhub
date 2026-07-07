import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Heart,
  ShoppingCart,
  User as UserIcon,
  Globe,
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  Info,
  PhoneCall,
  HelpCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    language,
    setLanguage,
    t,
    theme,
    toggleTheme,
    user,
    logout,
    cart,
    wishlist,
    searchQuery,
    setSearchQuery,
    setSelectedCategorySlug,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const isRTL = language === 'ar';
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setCurrentView('search');
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { label: t('home'), view: 'home' as const },
    { label: t('shop'), view: 'shop' as const, action: () => { setSelectedCategorySlug(null); } },
    { label: t('categories'), view: 'categories' as const },
    { label: t('about'), view: 'about' as const },
    { label: t('contact'), view: 'contact' as const },
    { label: t('faq'), view: 'faq' as const },
  ];

  return (
    <header
      className="sticky top-0 z-40 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur border-b border-slate-100 dark:border-slate-900 transition-colors duration-200"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          {/* Mobile Menu Trigger & Logo */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 text-slate-600 dark:text-slate-300 md:hidden hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg"
            >
              <Menu className="w-6 h-6" />
            </button>

            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setCurrentView('home');
              }}
              className="flex items-center gap-2 font-black text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent hover:opacity-95 transition"
            >
              {t('brand')}
            </a>
          </div>

          {/* Desktop Navigation Link Row */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 space-x-reverse">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (link.action) link.action();
                  setCurrentView(link.view);
                }}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  currentView === link.view
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-950/20'
                    : 'text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Search Bar - Center */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex items-center flex-1 max-w-xs lg:max-w-md relative"
          >
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-10 px-4 pl-10 pr-4 text-sm bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800/80 rounded-full focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all"
            />
            <button
              type="submit"
              className="absolute left-3.5 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          {/* Right Icons: Lang, Theme, Wish, Cart, User */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Lang Switcher */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full transition relative group"
              title={language === 'en' ? 'العربية' : 'English'}
            >
              <Globe className="w-5 h-5" />
              <span className="absolute bottom-1 right-1 text-[9px] font-bold bg-indigo-600 text-white rounded-md px-1 py-0.2 scale-75">
                {language.toUpperCase()}
              </span>
            </button>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full transition"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            {/* Wishlist Icon */}
            <button
              onClick={() => setCurrentView('wishlist')}
              className={`p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full transition relative ${
                currentView === 'wishlist' ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <Heart className="w-5 h-5" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold text-white bg-rose-500 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Cart Icon */}
            <button
              onClick={() => setCurrentView('cart')}
              className={`p-2 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full transition relative ${
                currentView === 'cart' ? 'text-indigo-600' : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold text-white bg-indigo-600 rounded-full flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* User Dropdown Button / Profile */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-1.5 p-1 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full md:rounded-lg transition"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                    alt={user.name}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-slate-200 dark:border-slate-800"
                  />
                  <ChevronDown className="w-4 h-4 hidden md:block text-slate-500" />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentView('login')}
                  className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full transition"
                  title={t('login')}
                >
                  <UserIcon className="w-5 h-5" />
                </button>
              )}

              {/* User Dropdown Panel */}
              <AnimatePresence>
                {userDropdownOpen && user && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setUserDropdownOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className={`absolute z-20 top-full mt-2 w-56 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 rounded-2xl shadow-xl overflow-hidden ${
                        isRTL ? 'left-0' : 'right-0'
                      }`}
                    >
                      <div className="p-4 border-b border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/30">
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          {user.name}
                        </p>
                        <p className="text-xs text-slate-400 truncate mt-0.5">
                          {user.email}
                        </p>
                      </div>
                      <div className="p-1.5 space-y-0.5">
                        <button
                          onClick={() => {
                            setCurrentView('user-dashboard');
                            setUserDropdownOpen(false);
                          }}
                          className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-xl transition text-left"
                          style={{ textAlign: isRTL ? 'right' : 'left' }}
                        >
                          <ShoppingBag className="w-4 h-4 text-slate-400" />
                          {t('userDashboard')}
                        </button>

                        {user.role === 'admin' && (
                          <button
                            onClick={() => {
                              setCurrentView('admin-dashboard');
                              setUserDropdownOpen(false);
                            }}
                            className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-amber-600 dark:text-amber-400 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 rounded-xl transition text-left"
                            style={{ textAlign: isRTL ? 'right' : 'left' }}
                          >
                            <LayoutDashboard className="w-4 h-4 text-amber-500" />
                            {t('adminDashboard')}
                          </button>
                        )}

                        <button
                          onClick={() => {
                            logout();
                            setUserDropdownOpen(false);
                          }}
                          className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 rounded-xl transition text-left"
                          style={{ textAlign: isRTL ? 'right' : 'left' }}
                        >
                          <LogOut className="w-4 h-4" />
                          {t('logout')}
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: isRTL ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isRTL ? '100%' : '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className={`fixed inset-y-0 z-[110] w-full max-w-xs bg-white dark:bg-slate-950 shadow-2xl flex flex-col p-6 transition-colors duration-200 ${
                isRTL ? 'right-0' : 'left-0'
              }`}
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                  {t('brand')}
                </span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Search */}
              <form onSubmit={handleSearchSubmit} className="relative mb-6">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full h-10 px-4 pl-10 pr-4 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-full focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 transition-all"
                />
                <button type="submit" className="absolute left-3.5 top-3 text-slate-400">
                  <Search className="w-4 h-4" />
                </button>
              </form>

              {/* Links */}
              <div className="flex flex-col gap-1.5 flex-1">
                {navLinks.map((link) => (
                  <button
                    key={link.label}
                    onClick={() => {
                      if (link.action) link.action();
                      setCurrentView(link.view);
                      setMobileMenuOpen(false);
                    }}
                    className={`flex items-center gap-3 w-full px-4 py-3 text-base font-semibold rounded-xl text-left transition-colors ${
                      currentView === link.view
                        ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                    style={{ textAlign: isRTL ? 'right' : 'left' }}
                  >
                    {link.label}
                  </button>
                ))}

                {user && (
                  <>
                    <button
                      onClick={() => {
                        setCurrentView('user-dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-base font-semibold text-indigo-600 dark:text-indigo-400 rounded-xl transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
                      style={{ textAlign: isRTL ? 'right' : 'left' }}
                    >
                      {t('userDashboard')}
                    </button>
                    {user.role === 'admin' && (
                      <button
                        onClick={() => {
                          setCurrentView('admin-dashboard');
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-base font-semibold text-amber-500 rounded-xl transition-colors hover:bg-slate-50 dark:hover:bg-slate-900"
                        style={{ textAlign: isRTL ? 'right' : 'left' }}
                      >
                        {t('adminDashboard')}
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Footer inside mobile menu - clean login link or simple greeting */}
              <div className="border-t border-slate-100 dark:border-slate-900 pt-6 mt-auto space-y-4">
                {!user ? (
                  <button
                    onClick={() => {
                      setCurrentView('login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition shadow-md"
                  >
                    {t('login')}
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full h-11 border border-slate-200 dark:border-slate-800 hover:bg-rose-50/50 dark:hover:bg-rose-950/20 text-rose-500 rounded-xl font-semibold transition"
                  >
                    {t('logout')}
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};
