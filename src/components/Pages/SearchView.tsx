import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../Shop/ProductCard';
import { Search, SlidersHorizontal, RefreshCw, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

export const SearchView: React.FC = () => {
  const {
    products,
    language,
    searchQuery,
    setSearchQuery,
    t,
  } = useApp();

  const isRTL = language === 'ar';
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Sync local input with global query when global query changes
  React.useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleRefineSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localQuery);
  };

  // Filter products based on search query
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) {
      return [];
    }
    const lowerQuery = searchQuery.toLowerCase().trim();
    return products
      .filter((product) => {
        const matchesName =
          product.name.toLowerCase().includes(lowerQuery) ||
          product.arName.toLowerCase().includes(lowerQuery);
        const matchesDesc =
          product.description.toLowerCase().includes(lowerQuery) ||
          product.arDescription.toLowerCase().includes(lowerQuery);
        return matchesName || matchesDesc;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.price - b.price;
        if (sortBy === 'price-desc') return b.price - a.price;
        if (sortBy === 'rating') return b.rating - a.rating;
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, searchQuery, sortBy]);

  // Recommended products (Featured products as fallback)
  const recommendations = useMemo(() => {
    return products.filter((p) => p.isFeatured).slice(0, 4);
  }, [products]);

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Header and Refinement Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-xs space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-50 tracking-tight">
            {isRTL ? 'نتائج البحث' : 'Search Results'}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {searchQuery.trim() ? (
              isRTL ? (
                <>
                  لقد وجدنا <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{searchResults.length}</span> منتجاً يطابق "<span className="font-semibold text-slate-800 dark:text-slate-200">{searchQuery}</span>"
                </>
              ) : (
                <>
                  Found <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{searchResults.length}</span> products matching "<span className="font-semibold text-slate-800 dark:text-slate-200">{searchQuery}</span>"
                </>
              )
            ) : (
              isRTL ? 'الرجاء كتابة كلمة للبحث عنها' : 'Please enter a query to search'
            )}
          </p>
        </div>

        {/* Refinement Search input */}
        <form onSubmit={handleRefineSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="w-full h-12 px-4 pl-11 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 text-sm transition-all text-slate-800 dark:text-slate-100"
            />
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-3.5" />
          </div>
          <button
            type="submit"
            className="h-12 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition cursor-pointer text-sm whitespace-nowrap"
          >
            {isRTL ? 'تحديث البحث' : 'Refine Search'}
          </button>
        </form>
      </div>

      {/* Main Results area */}
      {searchResults.length > 0 ? (
        <div className="space-y-6">
          {/* Filter/Sort top bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl border border-slate-100/50 dark:border-slate-800/50">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {isRTL ? 'ترتيب النتائج المعروضة:' : 'Ordering displayed results:'}
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                {t('sortBy')}:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 text-xs px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
              >
                <option value="featured">{t('sortFeatured')}</option>
                <option value="price-asc">{t('sortPriceAsc')}</option>
                <option value="price-desc">{t('sortPriceDesc')}</option>
                <option value="rating">{t('sortRating')}</option>
              </select>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {/* No results placeholder card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {isRTL ? 'لم نجد أي نتائج متطابقة' : 'No exact matches found'}
              </h3>
              <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
                {isRTL
                  ? 'حاول مراجعة الأخطاء الإملائية، أو استخدم كلمات دلالية أعم وأشمل لتوسيع نطاق بحثك'
                  : "We couldn't find any products matching your term. Try checking spelling or using more generic search terms."}
              </p>
            </div>
            <button
              onClick={() => {
                setLocalQuery('');
                setSearchQuery('');
              }}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              {isRTL ? 'إعادة ضبط البحث' : 'Reset Search'}
            </button>
          </div>

          {/* Suggested / Featured Products section */}
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-slate-50">
                {isRTL ? 'منتجات نقترحها لك' : 'Recommended for You'}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {recommendations.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
