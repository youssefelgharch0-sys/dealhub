import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../Shop/ProductCard';
import { SlidersHorizontal, Grid, List, Search, Star, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ShopView: React.FC = () => {
  const {
    products,
    categories,
    language,
    selectedCategorySlug,
    setSelectedCategorySlug,
    searchQuery,
    setSearchQuery,
    t,
  } = useApp();

  const isRTL = language === 'ar';

  // Filters State
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(300);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;

  // Handle Category Sync from other pages
  useMemo(() => {
    if (selectedCategorySlug) {
      const category = categories.find((c) => c.slug === selectedCategorySlug);
      if (category) {
        setSelectedCategoryId(category.id);
      }
    } else {
      setSelectedCategoryId('all');
    }
  }, [selectedCategorySlug, categories]);

  // Combined product filter logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category Filter
        if (selectedCategoryId !== 'all' && product.categoryId !== selectedCategoryId) {
          return false;
        }
        // Search Filter
        if (searchQuery.trim() !== '') {
          const lowerQuery = searchQuery.toLowerCase();
          const matchesName = product.name.toLowerCase().includes(lowerQuery) ||
                              product.arName.toLowerCase().includes(lowerQuery);
          const matchesDesc = product.description.toLowerCase().includes(lowerQuery) ||
                              product.arDescription.toLowerCase().includes(lowerQuery);
          if (!matchesName && !matchesDesc) {
            return false;
          }
        }
        // Price Range Filter
        if (product.price < minPrice || product.price > maxPrice) {
          return false;
        }
        // Rating Filter
        if (product.rating < minRating) {
          return false;
        }
        return true;
      })
      .sort((a, b) => {
        // Sort Logic
        if (sortBy === 'price-asc') {
          return a.price - b.price;
        }
        if (sortBy === 'price-desc') {
          return b.price - a.price;
        }
        if (sortBy === 'rating') {
          return b.rating - a.rating;
        }
        // Default Featured
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategoryId, searchQuery, minPrice, maxPrice, minRating, sortBy]);

  // Paginated Products
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const resetFilters = () => {
    setSelectedCategoryId('all');
    setSelectedCategorySlug(null);
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(300);
    setMinRating(0);
    setSortBy('featured');
    setCurrentPage(1);
  };

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        {/* DESKTOP SIDEBAR FILTERS (Hidden on Mobile) */}
        <aside className="hidden lg:block w-64 flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 h-fit sticky top-24">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <SlidersHorizontal className="w-4.5 h-4.5 text-indigo-600" />
              {t('filterBy')}
            </h3>
            <button
              onClick={resetFilters}
              className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              {t('clearAll')}
            </button>
          </div>

          <div className="space-y-6">
            {/* Search Input Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                {t('search')}
              </h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t('searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full text-xs h-9 px-3.5 pl-8 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                {t('categories')}
              </h4>
              <div className="space-y-1.5">
                <button
                  onClick={() => {
                    setSelectedCategoryId('all');
                    setSelectedCategorySlug(null);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    selectedCategoryId === 'all'
                      ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                  style={{ textAlign: isRTL ? 'right' : 'left' }}
                >
                  {isRTL ? 'جميع المنتجات' : 'All Products'}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategoryId(cat.id);
                      setSelectedCategorySlug(cat.slug);
                      setCurrentPage(1);
                    }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                      selectedCategoryId === cat.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                    style={{ textAlign: isRTL ? 'right' : 'left' }}
                  >
                    {isRTL ? cat.arName : cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                  {t('priceRange')}
                </h4>
                <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                  ${minPrice} - ${maxPrice}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="300"
                step="5"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(parseInt(e.target.value));
                  setCurrentPage(1);
                }}
                className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Ratings Filter */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                {t('rating')}
              </h4>
              <div className="space-y-1">
                {[0, 4.5, 4.7, 4.8].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => {
                      setMinRating(rating);
                      setCurrentPage(1);
                    }}
                    className={`flex items-center gap-2 w-full px-2 py-1 rounded transition text-xs ${
                      minRating === rating
                        ? 'text-indigo-600 font-bold'
                        : 'text-slate-500 hover:text-indigo-600'
                    }`}
                  >
                    {rating === 0 ? (
                      <span>{isRTL ? 'أي تقييم' : 'Any Rating'}</span>
                    ) : (
                      <>
                        <div className="flex items-center text-amber-400">
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </div>
                        <span>{rating} {isRTL ? 'وأكثر' : '& up'}</span>
                      </>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN PRODUCT AREA */}
        <main className="flex-1 space-y-6">
          {/* Controls top-bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden h-10 px-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-slate-200 transition"
              >
                <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
                {t('filterBy')}
              </button>

              <p className="text-sm text-slate-500 dark:text-slate-400">
                {isRTL ? 'تم العثور على ' : 'Found '}
                <span className="font-extrabold text-slate-800 dark:text-slate-200">
                  {filteredProducts.length}
                </span>{' '}
                {t('item')}
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                {t('sortBy')}:
              </span>
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 text-xs px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
              >
                <option value="featured">{t('sortFeatured')}</option>
                <option value="price-asc">{t('sortPriceAsc')}</option>
                <option value="price-desc">{t('sortPriceDesc')}</option>
                <option value="rating">{t('sortRating')}</option>
              </select>
            </div>
          </div>

          {/* Active filter pills */}
          {(selectedCategoryId !== 'all' || searchQuery !== '' || minRating > 0 || maxPrice < 300) && (
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-xs text-slate-400 font-medium">{isRTL ? 'التصفيات النشطة:' : 'Active Filters:'}</span>
              {selectedCategoryId !== 'all' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full">
                  {categories.find(c => c.id === selectedCategoryId)?.[isRTL ? 'arName' : 'name']}
                </span>
              )}
              {searchQuery !== '' && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full truncate max-w-[150px]">
                  "{searchQuery}"
                </span>
              )}
              {minRating > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full">
                  ★ {minRating}+
                </span>
              )}
              {maxPrice < 300 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 text-xs font-semibold rounded-full">
                  &lt; ${maxPrice}
                </span>
              )}
              <button onClick={resetFilters} className="text-xs text-rose-500 font-bold hover:underline">
                {isRTL ? 'مسح الكل' : 'Reset'}
              </button>
            </div>
          )}

          {/* Product Grid Area */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl py-16">
              <p className="text-center text-slate-400 dark:text-slate-500 font-semibold">{t('noItems')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* PAGINATION PANEL */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-8">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center border text-sm font-semibold transition ${
                  currentPage === 1
                    ? 'border-slate-100 text-slate-300 dark:border-slate-850 cursor-not-allowed'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200'
                }`}
              >
                &lt;
              </button>
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-9 h-9 rounded-xl text-sm font-bold transition ${
                      currentPage === pageNumber
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
                        : 'border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center border text-sm font-semibold transition ${
                  currentPage === totalPages
                    ? 'border-slate-100 text-slate-300 dark:border-slate-850 cursor-not-allowed'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-200'
                }`}
              >
                &gt;
              </button>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE SHEET FILTER OVERLAY */}
      <AnimatePresence>
        {showMobileFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="fixed inset-0 z-50 bg-black/50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-slate-900 rounded-t-3xl p-6 max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                  {t('filterBy')}
                </h3>
                <button
                  onClick={() => {
                    resetFilters();
                    setShowMobileFilters(false);
                  }}
                  className="text-xs font-bold text-rose-500"
                >
                  {t('clearAll')}
                </button>
              </div>

              {/* Filters content for mobile */}
              <div className="space-y-6 pb-12">
                {/* Search */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {t('search')}
                  </h4>
                  <input
                    type="text"
                    placeholder={t('searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-xs h-10 px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl"
                  />
                </div>

                {/* Categories */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                    {t('categories')}
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategoryId('all')}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                        selectedCategoryId === 'all'
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {isRTL ? 'الكل' : 'All'}
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedCategoryId(cat.id)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
                          selectedCategoryId === cat.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}
                      >
                        {isRTL ? cat.arName : cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      {t('priceRange')}
                    </h4>
                    <span className="text-xs font-bold text-indigo-600">
                      ${minPrice} - ${maxPrice}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    step="5"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full h-12 bg-indigo-600 text-white font-bold rounded-xl shadow-md mt-auto"
              >
                {isRTL ? 'عرض النتائج' : 'Show Results'}
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
