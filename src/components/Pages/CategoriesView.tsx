import React from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowRight, Cpu, Shirt, Home as HomeIcon, Sparkles, Trophy } from 'lucide-react';
import { motion } from 'motion/react';

export const CategoriesView: React.FC = () => {
  const { categories, language, setCurrentView, setSelectedCategorySlug, t } = useApp();
  const isRTL = language === 'ar';

  const iconsMap: Record<string, any> = {
    Cpu: Cpu,
    Shirt: Shirt,
    Home: HomeIcon,
    Sparkles: Sparkles,
    Trophy: Trophy,
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-12"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-950 dark:text-slate-50">
          {t('exploreCategories')}
        </h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
          {isRTL
            ? 'تصفح تشكيلتنا الشاملة والراقية من المنتجات المتنوعة مقسمة بعناية لتسهيل وصولك واختيارك'
            : 'Explore our wide range of premium products neatly structured to help you discover exactly what you need.'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((cat, idx) => {
          const catName = isRTL ? cat.arName : cat.name;
          const IconComponent = iconsMap[cat.icon] || Cpu;

          return (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="group relative h-72 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all cursor-pointer flex flex-col justify-end p-6 bg-slate-900"
              onClick={() => {
                setSelectedCategorySlug(cat.slug);
                setCurrentView('shop');
              }}
            >
              <div className="absolute inset-0">
                <img
                  src={cat.image}
                  alt={catName}
                  className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              </div>

              <div className="relative z-10 space-y-3">
                <div className="p-3 w-fit bg-white/10 backdrop-blur-md text-white rounded-xl">
                  <IconComponent className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-extrabold text-white flex items-center gap-2 group-hover:text-indigo-400 transition">
                    {catName}
                    <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1.5 ${isRTL ? 'rotate-180' : ''}`} />
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    {isRTL
                      ? `استكشف أفضل منتجات عائلة الـ ${catName} الحصرية`
                      : `Browse our curated collection of fine ${catName} items`}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
