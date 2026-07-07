import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProductCard } from '../Shop/ProductCard';
import { EmptyState } from '../UI/Skeletons';

export const WishlistView: React.FC = () => {
  const { wishlist, language, setCurrentView, t } = useApp();
  const isRTL = language === 'ar';

  if (wishlist.length === 0) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        <EmptyState
          title={isRTL ? 'قائمة المفضلة فارغة' : 'Your Wishlist is Empty'}
          description={
            isRTL
              ? 'تصفح تشكيلاتنا الواسعة من الأجهزة والملابس الأنيقة وأضف ما يحلو لك لقائمتك الخاصة هنا للعودة إليها لاحقاً'
              : 'Keep track of items you love by adding them to your wishlist. They will be saved here for your next purchase.'
          }
          actionText={isRTL ? 'تصفح المنتجات' : 'Browse Products'}
          onAction={() => setCurrentView('shop')}
        />
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 animate-fade-in"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-slate-50">
          {t('wishlist')}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isRTL
            ? `لديك ${wishlist.length} منتج في قائمة المفضلة الخاصة بك`
            : `You have ${wishlist.length} saved item(s) in your wishlist`}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
