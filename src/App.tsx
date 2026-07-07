import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import { ToastContainer } from './components/UI/Toast';

// Views
import { HomeView } from './components/Pages/HomeView';
import { ShopView } from './components/Pages/ShopView';
import { CategoriesView } from './components/Pages/CategoriesView';
import { ProductDetailsView } from './components/Pages/ProductDetailsView';
import { SearchView } from './components/Pages/SearchView';
import { WishlistView } from './components/Pages/WishlistView';
import { CartView } from './components/Pages/CartView';
import { CheckoutView } from './components/Pages/CheckoutView';
import { OrderSuccessView } from './components/Pages/OrderSuccessView';
import { AuthView } from './components/Pages/AuthView';
import { UserDashboardView } from './components/Pages/UserDashboardView';
import { AdminDashboardView } from './components/Pages/AdminDashboardView';
import { AboutView, ContactView, FAQView } from './components/Pages/InfoPages';

const MainAppContent: React.FC = () => {
  const { currentView, theme, language } = useApp();

  const isRTL = language === 'ar';

  // Apply dark mode class to html document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Apply text direction and lang attribute to body
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language, isRTL]);

  // View router switcher
  const renderActiveView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView />;
      case 'shop':
        return <ShopView />;
      case 'categories':
        return <CategoriesView />;
      case 'product-details':
        return <ProductDetailsView />;
      case 'search':
        return <SearchView />;
      case 'wishlist':
        return <WishlistView />;
      case 'cart':
        return <CartView />;
      case 'checkout':
        return <CheckoutView />;
      case 'order-success':
        return <OrderSuccessView />;
      case 'login':
        return <AuthView initialMode="login" />;
      case 'register':
        return <AuthView initialMode="register" />;
      case 'user-dashboard':
        return <UserDashboardView />;
      case 'admin-dashboard':
        return <AdminDashboardView />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'faq':
        return <FAQView />;
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-850 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      <Navbar />
      <div className="flex-grow pt-16">
        {renderActiveView()}
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
