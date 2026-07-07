import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Trash2, ShoppingBag, Percent, ArrowRight, X } from 'lucide-react';
import { EmptyState } from '../UI/Skeletons';

export const CartView: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    getCartTotal,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    language,
    setCurrentView,
    t,
    formatPrice,
  } = useApp();

  const isRTL = language === 'ar';
  const { subtotal, itemsCount } = getCartTotal();

  const [couponCodeInput, setCouponCodeInput] = useState('');

  const shipping = subtotal > 150 ? 0 : subtotal === 0 ? 0 : 10.0;

  // Calculate discount
  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = parseFloat(((subtotal * appliedCoupon.value) / 100).toFixed(2));
    } else {
      discount = appliedCoupon.value;
    }
  }

  const grandTotal = subtotal + shipping - discount;

  const handleApplyCouponSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCodeInput.trim() === '') return;
    const success = applyCoupon(couponCodeInput);
    if (success) setCouponCodeInput('');
  };

  if (cart.length === 0) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 animate-fade-in"
        style={{ direction: isRTL ? 'rtl' : 'ltr' }}
      >
        <EmptyState
          title={t('emptyCart')}
          description={
            isRTL
              ? 'سلتك فارغة تماماً من المنتجات حالياً. تصفح الكتالوج المتميز وأضف المنتجات لسلتك لبدء تجربة تسوق رائعة اليوم.'
              : 'Your cart is looking a bit light. Explore our catalog and add items to your cart to begin shopping with us!'
          }
          actionText={t('continueShopping')}
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
          {t('cart')}
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          {isRTL
            ? `لديك ${itemsCount} منتج في سلة تسوقك حالياً`
            : `You have ${itemsCount} item(s) in your shopping cart`}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Item list */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => {
            const name = isRTL ? item.product.arName : item.product.name;
            return (
              <div
                key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex gap-4 hover:shadow-xs transition duration-200"
              >
                {/* Product Image */}
                <img
                  src={item.product.image}
                  alt={name}
                  className="w-16 h-16 sm:w-24 sm:h-24 rounded-xl object-cover border border-slate-100 dark:border-slate-800 flex-shrink-0"
                />

                {/* Info and Actions Area */}
                <div className="flex-1 flex flex-col justify-between min-w-0 gap-2">
                  <div className="space-y-1">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-extrabold text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-snug truncate hover:text-indigo-600 transition">
                        {name}
                      </h3>
                      <button
                        onClick={() =>
                          removeFromCart(item.product.id, item.selectedColor, item.selectedSize)
                        }
                        className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-slate-50 dark:hover:bg-slate-950 rounded-full transition flex-shrink-0"
                        title={isRTL ? 'إزالة' : 'Remove item'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-0.5">
                      {item.selectedColor && (
                        <span className="inline-flex items-center gap-1.5 text-[10px] bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-full px-2 py-0.5 font-bold text-slate-500">
                          {t('color')}:{' '}
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-slate-200"
                            style={{ backgroundColor: item.selectedColor }}
                          />
                        </span>
                      )}
                      {item.selectedSize && (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-slate-50 dark:bg-slate-950 border dark:border-slate-800 rounded-full px-2 py-0.5 font-bold text-slate-500">
                          {t('size')}: {item.selectedSize}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Quantity and Price row */}
                  <div className="flex items-center justify-between gap-3 pt-1 mt-auto">
                    {/* Quantity selectors */}
                    <div className="flex items-center h-8 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-full px-1.5">
                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.product.id,
                            item.quantity - 1,
                            item.selectedColor,
                            item.selectedSize
                          )
                        }
                        className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800 transition text-xs"
                      >
                        -
                      </button>
                      <span className="w-6 text-center font-bold text-xs text-slate-800 dark:text-slate-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateCartQuantity(
                            item.product.id,
                            item.quantity + 1,
                            item.selectedColor,
                            item.selectedSize
                          )
                        }
                        className="w-6 h-6 flex items-center justify-center font-bold text-slate-600 rounded-full hover:bg-slate-200/50 dark:hover:bg-slate-800 transition text-xs"
                      >
                        +
                      </button>
                    </div>

                    {/* Total Price */}
                    <span className="text-xs sm:text-sm font-black text-indigo-600 dark:text-indigo-400">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Checkout Summary Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 pb-3 border-b border-slate-50 dark:border-slate-800">
              {t('cartSummary')}
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between font-semibold text-slate-500">
                <span>{t('subtotal')}</span>
                <span className="text-slate-800 dark:text-slate-100">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between font-semibold text-slate-500">
                <span>{t('shipping')}</span>
                <span className="text-slate-800 dark:text-slate-100">
                  {shipping === 0 ? (
                    <span className="text-emerald-600 uppercase font-bold text-[10px]">
                      {isRTL ? 'مجاني' : 'Free'}
                    </span>
                  ) : (
                    formatPrice(shipping)
                  )}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between font-bold text-rose-500">
                  <span>{t('discount')}</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}

              {/* Shipping free goal bar */}
              {subtotal < 150 ? (
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100/50 p-3 rounded-xl space-y-1.5 mt-2">
                  <p className="text-[10px] font-semibold text-amber-800 dark:text-amber-400">
                    {isRTL
                      ? `أضف بقيمة ${formatPrice(150 - subtotal)} للحصول على شحن مجاني!`
                      : `Add ${formatPrice(150 - subtotal)} more for FREE shipping!`}
                  </p>
                  <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500"
                      style={{ width: `${(subtotal / 150) * 100}%` }}
                    />
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 p-3 rounded-xl border border-emerald-100/30 text-[10px] font-bold text-emerald-800 dark:text-emerald-400 text-center">
                  🎉 {isRTL ? 'لقد حصلت على شحن مجاني متميز!' : 'You unlocked FREE Premium Shipping!'}
                </div>
              )}

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between text-base font-black text-slate-800 dark:text-slate-100">
                <span>{t('total')}</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Promo coupon application form */}
            <form onSubmit={handleApplyCouponSubmit} className="pt-4 border-t border-slate-100 dark:border-slate-800">
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/30 rounded-xl">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-xs font-extrabold text-emerald-800 dark:text-emerald-400">
                        {appliedCoupon.code}
                      </span>
                      <p className="text-[9px] text-slate-400">
                        {appliedCoupon.discountType === 'percentage'
                          ? `-${appliedCoupon.value}% discount applied`
                          : `-${formatPrice(appliedCoupon.value)} discount applied`}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={removeCoupon}
                    className="p-1 hover:bg-emerald-100/50 rounded-full text-emerald-700 dark:text-emerald-400 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('couponPlaceholder')}
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="h-10 px-3.5 flex-1 text-xs bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="h-10 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl transition"
                  >
                    {t('applyCoupon')}
                  </button>
                </div>
              )}
            </form>

            {/* Checkout Action Button */}
            <button
              onClick={() => setCurrentView('checkout')}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-500/10 cursor-pointer"
            >
              {t('checkout')}
              <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
