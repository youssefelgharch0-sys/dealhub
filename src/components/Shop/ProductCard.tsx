import React from 'react';
import { Product } from '../../types';
import { useApp } from '../../context/AppContext';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    language,
    setCurrentView,
    setSelectedProductId,
    addToCart,
    toggleWishlist,
    isInWishlist,
    t,
    formatPrice,
  } = useApp();

  const isRTL = language === 'ar';
  const name = isRTL ? product.arName : product.name;
  const isFavorite = isInWishlist(product.id);

  // Calculate discount percentage
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group flex flex-col bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs hover:shadow-lg dark:hover:shadow-indigo-950/10 transition-all duration-300"
    >
      {/* Card Image and badging container */}
      <div className="relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-950">
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <span className={`absolute top-3 z-10 px-3 py-1 text-[11px] font-bold text-white bg-rose-500 rounded-full shadow-sm ${
            isRTL ? 'right-3' : 'left-3'
          }`}>
            -{discountPercent}%
          </span>
        )}

        {/* Wishlist Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          className={`absolute top-3 z-10 w-9 h-9 rounded-full bg-white/90 dark:bg-slate-900/95 backdrop-blur-xs shadow-xs flex items-center justify-center text-slate-500 hover:text-rose-500 hover:scale-110 active:scale-95 transition-all duration-200 ${
            isRTL ? 'left-3' : 'right-3'
          }`}
        >
          <Heart
            className={`w-4.5 h-4.5 transition-colors ${
              isFavorite ? 'fill-rose-500 text-rose-500' : 'text-slate-500 dark:text-slate-400'
            }`}
          />
        </button>

        {/* Product image link */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setSelectedProductId(product.id);
            setCurrentView('product-details');
          }}
          className="block w-full h-full"
        >
          <img
            src={product.image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </a>

        {/* Quick actions hover overlay */}
        <div className="absolute inset-0 bg-black/10 dark:bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
          <button
            onClick={() => {
              setSelectedProductId(product.id);
              setCurrentView('product-details');
            }}
            className="w-10 h-10 rounded-full bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition shadow-md"
            title={t('quickView')}
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`w-10 h-10 rounded-full text-slate-800 dark:text-slate-100 flex items-center justify-center transition shadow-md ${
              product.stock <= 0
                ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-white dark:bg-slate-900 hover:bg-indigo-600 hover:text-white'
            }`}
            title={t('addToCart')}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Product Card Details */}
      <div className="flex flex-col flex-1 p-5">
        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1.5 block">
          {product.categoryId === 'cat-1' && (language === 'ar' ? 'إلكترونيات' : 'Electronics')}
          {product.categoryId === 'cat-2' && (language === 'ar' ? 'ملابس وأزياء' : 'Fashion')}
          {product.categoryId === 'cat-3' && (language === 'ar' ? 'منزل ومطبخ' : 'Home & Kitchen')}
          {product.categoryId === 'cat-4' && (language === 'ar' ? 'جمال وعناية' : 'Beauty & Care')}
          {product.categoryId === 'cat-5' && (language === 'ar' ? 'رياضة وأنشطة' : 'Sports & Outdoors')}
        </span>

        {/* Title */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setSelectedProductId(product.id);
            setCurrentView('product-details');
          }}
          className="text-base font-bold text-slate-800 dark:text-slate-100 line-clamp-1 hover:text-indigo-600 dark:hover:text-indigo-400 transition mb-2 block"
        >
          {name}
        </a>

        {/* Rating and Reviews count */}
        <div className="flex items-center gap-1.5 mb-4">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
          </div>
          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
            {product.rating}
          </span>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            ({product.reviewsCount})
          </span>
        </div>

        {/* Price and Add button footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-50 dark:border-slate-800/80">
          <div className="flex flex-col">
            <span className="text-lg font-black text-indigo-600 dark:text-indigo-400">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-slate-400 dark:text-slate-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={product.stock <= 0}
            className={`px-3.5 py-2 rounded-full font-semibold text-xs flex items-center gap-1.5 transition-colors ${
              product.stock <= 0
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white dark:bg-indigo-950/30 dark:text-indigo-400 dark:hover:bg-indigo-600 dark:hover:text-white'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {product.stock <= 0 ? t('outOfStock') : t('addToCart')}
          </button>
        </div>
      </div>
    </motion.div>
  );
};
