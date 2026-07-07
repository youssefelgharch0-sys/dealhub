import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Star, ShoppingCart, Heart, Shield, RefreshCw, Send, Check } from 'lucide-react';
import { ProductCard } from '../Shop/ProductCard';

export const ProductDetailsView: React.FC = () => {
  const {
    selectedProductId,
    products,
    categories,
    reviews,
    addProductReview,
    addToCart,
    toggleWishlist,
    isInWishlist,
    language,
    t,
    formatPrice,
  } = useApp();

  const isRTL = language === 'ar';

  // Find Product
  const product = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || products[0];
  }, [selectedProductId, products]);

  const relatedProducts = useMemo(() => {
    return products
      .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
      .slice(0, 4);
  }, [product, products]);

  const productReviews = useMemo(() => {
    return reviews.filter((r) => r.productId === product.id);
  }, [product, reviews]);

  // View state
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [selectedImage, setSelectedImage] = useState<string>(product.image);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');

  // Review Form State
  const [ratingInput, setRatingInput] = useState<number>(5);
  const [commentInput, setCommentInput] = useState<string>('');
  const [reviewName, setReviewName] = useState<string>('');

  const name = isRTL ? product.arName : product.name;
  const description = isRTL ? product.arDescription : product.description;
  const specs = isRTL ? product.arSpecs : product.specs;
  const isFavorite = isInWishlist(product.id);

  // Sync state if product changes
  React.useEffect(() => {
    setSelectedImage(product.image);
    setQuantity(1);
    setSelectedColor('');
    setSelectedSize('');
    setCommentInput('');
    setRatingInput(5);
  }, [product]);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentInput.trim() === '') return;
    addProductReview(product.id, ratingInput, commentInput);
    setCommentInput('');
  };

  const colors = ['#000000', '#4F46E5', '#EF4444', '#10B981', '#F59E0B'];
  const sizes = ['S', 'M', 'L', 'XL'];

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-16"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Product Top section (Image block + Control block) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-3xl overflow-hidden relative">
            <img
              src={selectedImage}
              alt={name}
              className="w-full h-full object-cover transition duration-300"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-slate-50 dark:bg-slate-950 transition ${
                    selectedImage === img
                      ? 'border-indigo-600 scale-102'
                      : 'border-slate-100 dark:border-slate-850 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Meta Controls */}
        <div className="space-y-6">
          <span className="text-xs font-extrabold uppercase bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-3.5 py-1.5 rounded-full inline-block">
            {product.categoryId === 'cat-1' && t('categories')}
            {product.categoryId === 'cat-2' && (isRTL ? 'أزياء وملابس' : 'Fashion & Apparel')}
            {product.categoryId === 'cat-3' && (isRTL ? 'منزل ومطبخ' : 'Home & Kitchen')}
            {product.categoryId === 'cat-4' && (isRTL ? 'جمال وعناية' : 'Beauty & Care')}
            {product.categoryId === 'cat-5' && (isRTL ? 'رياضة وأنشطة' : 'Sports & Outdoors')}
          </span>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-950 dark:text-slate-50 leading-tight">
            {name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-4 py-1">
            <div className="flex items-center gap-1.5">
              <div className="flex items-center text-amber-500">
                <Star className="w-4.5 h-4.5 fill-current" />
              </div>
              <span className="text-sm font-black text-slate-800 dark:text-slate-100">
                {product.rating}
              </span>
              <span className="text-xs text-slate-400">
                ({productReviews.length} {t('reviews')})
              </span>
            </div>
            <span className="text-slate-200 dark:text-slate-800">|</span>
            <span
              className={`text-xs font-bold ${
                product.stock > 0 ? 'text-emerald-600' : 'text-rose-500'
              }`}
            >
              {product.stock > 0 ? `${t('inStock')} (${product.stock})` : t('outOfStock')}
            </span>
          </div>

          {/* Pricing */}
          <div className="bg-slate-50 dark:bg-slate-950/50 rounded-2xl p-5 border border-slate-100/80 dark:border-slate-900/80 flex items-center justify-between animate-pulse-subtle">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">
                {isRTL ? 'السعر الحالي (شاملاً الضريبة)' : 'Current Price (VAT incl.)'}
              </span>
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
                {formatPrice(product.price)}
              </span>
            </div>
            {product.originalPrice && (
              <div className="text-right">
                <span className="text-xs text-slate-400 font-medium block">
                  {t('originalPrice')}
                </span>
                <span className="text-lg text-slate-400 line-through font-semibold">
                  {formatPrice(product.originalPrice)}
                </span>
              </div>
            )}
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {description}
          </p>

          {/* Swatch options */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            {/* Color Swatch */}
            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {t('color')}
              </span>
              <div className="flex gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setSelectedColor(c)}
                    className="w-8 h-8 rounded-full border border-slate-200/50 flex items-center justify-center transition hover:scale-105"
                    style={{ backgroundColor: c }}
                  >
                    {selectedColor === c && <Check className="w-4.5 h-4.5 text-white mix-blend-difference" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Sizes */}
            {product.categoryId === 'cat-2' && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {t('size')}
                </span>
                <div className="flex gap-2">
                  {sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`h-9 px-4 rounded-xl font-bold text-xs border transition ${
                        selectedSize === s
                          ? 'bg-indigo-600 text-white border-indigo-600'
                          : 'border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons (Quantity, Add to Cart, Wishlist) */}
          <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800/80">
            {/* Quantity */}
            <div className="flex items-center h-12 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full px-2.5">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200/50 dark:hover:bg-slate-900 rounded-full"
              >
                -
              </button>
              <span className="w-10 text-center font-bold text-sm text-slate-800 dark:text-slate-100">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-slate-200/50 dark:hover:bg-slate-900 rounded-full"
              >
                +
              </button>
            </div>

            {/* Add to Cart button */}
            <button
              onClick={() => addToCart(product, quantity, selectedColor, selectedSize)}
              disabled={product.stock <= 0}
              className="flex-1 h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-150 disabled:text-slate-400 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-500/10 cursor-pointer"
            >
              <ShoppingCart className="w-5 h-5" />
              {product.stock <= 0 ? t('outOfStock') : t('addToCart')}
            </button>

            {/* Wishlist toggle heart button */}
            <button
              onClick={() => toggleWishlist(product)}
              className={`w-12 h-12 border rounded-full flex items-center justify-center transition ${
                isFavorite
                  ? 'border-rose-100 bg-rose-50 text-rose-500 hover:bg-rose-100'
                  : 'border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Secure purchase assurances */}
          <div className="grid grid-cols-2 gap-4 pt-6 text-slate-400 dark:text-slate-500 text-xs font-semibold">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              {isRTL ? 'ضمان أصلي 100%' : '100% Genuine Guarantee'}
            </span>
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-indigo-500" />
              {isRTL ? 'استبدال واسترجاع بمرونة' : 'Easy Returns & Exchange'}
            </span>
          </div>
        </div>
      </div>

      {/* Product Information Tabs (specs, description, interactive reviews) */}
      <div className="space-y-6">
        <div className="flex border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('desc')}
            className={`pb-4 px-6 font-bold text-sm border-b-2 transition ${
              activeTab === 'desc'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {t('description')}
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-4 px-6 font-bold text-sm border-b-2 transition ${
              activeTab === 'specs'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {t('specifications')}
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`pb-4 px-6 font-bold text-sm border-b-2 transition ${
              activeTab === 'reviews'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-400 hover:text-slate-600'
            }`}
          >
            {t('reviews')} ({productReviews.length})
          </button>
        </div>

        {/* Tab contents */}
        <div className="min-h-40 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 md:p-8">
          {activeTab === 'desc' && (
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {description}
            </p>
          )}

          {activeTab === 'specs' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(specs || {}).map(([key, val]) => (
                <div key={key} className="flex justify-between py-2 border-b border-slate-50 dark:border-slate-800/50">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{key}</span>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{val}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-8">
              {/* Form to submit review */}
              <div className="p-5 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-900/60 rounded-xl space-y-4">
                <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200">
                  {t('writeReview')}
                </h4>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">{t('rating')}:</span>
                    <div className="flex gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRatingInput(star)}
                          className="hover:scale-110 active:scale-95 transition"
                        >
                          <Star className={`w-5 h-5 ${ratingInput >= star ? 'fill-current' : 'text-slate-300 dark:text-slate-700'}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      required
                      placeholder={t('reviewNamePlaceholder')}
                      value={reviewName}
                      onChange={(e) => setReviewName(e.target.value)}
                      className="h-10 text-xs px-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none"
                    />
                    <div className="flex relative">
                      <input
                        type="text"
                        required
                        placeholder={t('reviewCommentPlaceholder')}
                        value={commentInput}
                        onChange={(e) => setCommentInput(e.target.value)}
                        className="h-10 text-xs px-4 pr-12 flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg absolute right-0 top-0 flex items-center justify-center transition"
                      >
                        <Send className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Reviews listing */}
              <div className="space-y-6">
                {productReviews.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    {isRTL ? 'لا توجد تقييمات بعد. كن أول من يكتب تقييماً!' : 'No reviews yet. Be the first to write one!'}
                  </p>
                ) : (
                  productReviews.map((rev) => (
                    <div key={rev.id} className="flex gap-4 p-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/30 transition">
                      <img
                        src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80'}
                        alt={rev.userName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center justify-between">
                          <h5 className="font-bold text-sm text-slate-800 dark:text-slate-100">{rev.userName}</h5>
                          <span className="text-[11px] text-slate-400">{rev.date}</span>
                        </div>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-slate-200 dark:text-slate-800'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{rev.comment}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-8">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-50">
              {t('relatedProducts')}
            </h2>
            <div className="w-12 h-1 bg-indigo-600 rounded-full mt-2" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
