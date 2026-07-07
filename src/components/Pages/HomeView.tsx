import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../Shop/ProductCard';
import {
  Truck,
  ShieldCheck,
  Headphones,
  RotateCcw,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'motion/react';

export const HomeView: React.FC = () => {
  const {
    t,
    language,
    setCurrentView,
    categories,
    products,
    setSelectedCategorySlug,
    showToast,
  } = useApp();

  const isRTL = language === 'ar';
  const featured = products.filter((p) => p.isFeatured).slice(0, 4);
  const newArrivals = products.slice(0, 4);

  const guarantees = [
    {
      icon: Truck,
      title: isRTL ? 'شحن مجاني وسريع' : 'Free Express Shipping',
      desc: isRTL ? 'للطلبات الأكثر من $150' : 'On all orders over $150',
    },
    {
      icon: ShieldCheck,
      title: isRTL ? 'حماية مشفرة 100%' : '100% Secure Checkout',
      desc: isRTL ? 'مدفوعات آمنة ومضمونة' : 'Encrypted payment gateways',
    },
    {
      icon: Headphones,
      title: isRTL ? 'دعم متواصل 24/7' : '24/7 Active Support',
      desc: isRTL ? 'متاحون دائماً لخدمتكم' : 'Chat or call at any hour',
    },
    {
      icon: RotateCcw,
      title: isRTL ? 'استرجاع سهل وسلس' : '30-Day Easy Returns',
      desc: isRTL ? 'ضمان استرداد الأموال' : 'No questions asked policy',
    },
  ];

  return (
    <div className="space-y-16 md:space-y-24 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 md:mt-8 px-8 py-16 md:py-24 shadow-xl">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl" />
          <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-violet-500 rounded-full mix-blend-screen filter blur-3xl" />
        </div>

        <div className="relative max-w-3xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold text-xs uppercase tracking-wider rounded-full"
          >
            <Sparkles className="w-4 h-4" />
            {isRTL ? 'عروض نهاية الموسم الكبرى' : 'Grand Season Sale'}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight"
          >
            {t('heroTitle')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-300 leading-relaxed max-w-2xl"
          >
            {t('heroSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4 flex flex-wrap gap-4"
          >
            <button
              onClick={() => {
                setSelectedCategorySlug(null);
                setCurrentView('shop');
              }}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-full transition-all flex items-center gap-2 group shadow-lg shadow-indigo-600/30 active:scale-95 cursor-pointer"
            >
              {t('shopNow')}
              <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
            <div className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-full">
              <span className="text-sm font-semibold text-slate-200">
                {isRTL ? 'استخدم كود الخصم:' : 'Use Promo Code:'}{' '}
                <span className="text-amber-400 font-bold tracking-wider">DEAL20</span>
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 2. Brand Guarantees */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {guarantees.map((g, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-6 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl transition"
            >
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <g.icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 dark:text-slate-100 text-base mb-1">
                  {g.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {g.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Explore Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
              {t('exploreCategories')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isRTL ? 'تسوق فئاتنا المخصصة لأجلك مباشرة' : 'Direct catalog navigation designed for your shopping comfort'}
            </p>
          </div>
          <button
            onClick={() => setCurrentView('categories')}
            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            {isRTL ? 'عرض الكل' : 'View All'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.slice(0, 5).map((cat) => {
            const catName = isRTL ? cat.arName : cat.name;
            return (
              <a
                key={cat.id}
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedCategorySlug(cat.slug);
                  setCurrentView('shop');
                }}
                className="group flex flex-col items-center p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl hover:shadow-lg transition-all duration-300 text-center"
              >
                <div className="w-20 h-20 rounded-full overflow-hidden bg-slate-50 mb-4 border border-slate-100 dark:border-slate-800 relative">
                  <img
                    src={cat.image}
                    alt={catName}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm group-hover:text-indigo-600 transition">
                  {catName}
                </h3>
              </a>
            );
          })}
        </div>
      </section>

      {/* 4. Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
              {t('featuredProducts')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isRTL ? 'المنتجات الأعلى تقييماً وطلباً هذا الأسبوع' : 'The highest rated and most popular products of the week'}
            </p>
          </div>
          <button
            onClick={() => {
              setSelectedCategorySlug(null);
              setCurrentView('shop');
            }}
            className="text-sm font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            {isRTL ? 'تصفح المتجر' : 'Explore Shop'}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* 5. Special Promotional Banner */}
      <section className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 py-12 px-8 md:px-16 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl relative overflow-hidden">
        <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-white/5 rounded-full filter blur-xl" />
        <div className="space-y-2 max-w-xl text-center md:text-left">
          <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-3.5 py-1 rounded-full text-indigo-100">
            {isRTL ? 'كوبون العميل الجديد' : 'New Customer Offer'}
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight pt-1">
            {isRTL
              ? 'احصل على خصم 20% فوري على طلبك القادم!'
              : 'Claim Flat 20% Off Instantly on Your Next Purchase!'}
          </h2>
          <p className="text-indigo-100 text-sm">
            {isRTL
              ? 'طبق كود DEAL20 عند الدفع. متاح لجميع الطلبات أكثر من $50.'
              : 'Apply code DEAL20 during checkout. Eligible on all cart values over $50.'}
          </p>
        </div>
        <button
          onClick={() => {
            setSelectedCategorySlug(null);
            setCurrentView('shop');
            showToast('Code DEAL20 copied! Apply at checkout', 'success');
          }}
          className="px-8 py-4 bg-white hover:bg-slate-50 text-indigo-600 font-bold rounded-full transition-all shadow-md cursor-pointer whitespace-nowrap"
        >
          {isRTL ? 'تسوق ووفّر الآن' : 'Shop & Save Now'}
        </button>
      </section>

      {/* 6. New Arrivals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
              {t('newArrivals')}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {isRTL ? 'أحدث الإضافات والكتالوجات الممتازة المضافة حديثاً' : 'The latest additions and premium catalog updates added recently'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
