import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Truck, CreditCard, ShoppingBag, ArrowLeft } from 'lucide-react';

export const CheckoutView: React.FC = () => {
  const {
    cart,
    getCartTotal,
    appliedCoupon,
    createOrder,
    user,
    language,
    setCurrentView,
    showToast,
    t,
    formatPrice,
  } = useApp();

  const isRTL = language === 'ar';
  const { subtotal } = getCartTotal();

  // Form states initialized with current user profile if available
  const [fullName, setFullName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState((isRTL ? user?.arAddress : user?.address) || user?.address || '');
  const [city, setCity] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod or card
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync with user data if it changes
  useEffect(() => {
    if (user) {
      setFullName(user.name);
      setEmail(user.email);
      setPhone(user.phone || '');
      setAddress((isRTL ? user.arAddress : user.address) || user.address || '');
    }
  }, [user, isRTL]);

  const shipping = subtotal > 150 ? 0 : 10.0;

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discount = parseFloat(((subtotal * appliedCoupon.value) / 100).toFixed(2));
    } else {
      discount = appliedCoupon.value;
    }
  }

  const grandTotal = subtotal + shipping - discount;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      showToast('Your cart is empty', 'error');
      return;
    }

    if (!fullName.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim()) {
      showToast(isRTL ? 'الرجاء ملء الحقول الإلزامية الشاغرة' : 'Please fill all required shipping fields', 'error');
      return;
    }

    setIsSubmitting(true);

    // Simulate database write delay
    setTimeout(() => {
      const created = createOrder({
        shippingAddress: `${address}, ${city}`,
        contactPhone: phone,
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card',
        notes: notes,
      });

      setIsSubmitting(false);

      if (created) {
        showToast(isRTL ? 'تم تأكيد طلبك بنجاح!' : 'Order confirmed successfully!', 'success');
        // Store created order number in localStorage for the OrderSuccessView to read
        localStorage.setItem('dealhub_last_order_num', created.orderNumber);
        setCurrentView('order-success');
      }
    }, 1500);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-400 font-bold mb-4">{isRTL ? 'لا توجد منتجات لتأكيد طلبيتها حالياً' : 'No items in cart to checkout'}</p>
        <button onClick={() => setCurrentView('shop')} className="px-6 py-2.5 bg-indigo-600 text-white rounded-full font-semibold">
          {t('continueShopping')}
        </button>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8 animate-fade-in"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div className="flex items-center gap-3">
        <button
          onClick={() => setCurrentView('cart')}
          className="p-2 border border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-full transition text-slate-500"
        >
          <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-950 dark:text-slate-50">
            {isRTL ? 'إتمام الشراء والطلب' : 'Secure Checkout'}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            {isRTL ? 'خطوة واحدة بسيطة وتصلك شحنتك إلى باب منزلك' : 'Fill details below to complete your order safely'}
          </p>
        </div>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Form Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-6">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-800">
              {t('billingDetails')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 text-xs px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                />
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {t('emailAddress')} *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-11 text-xs px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {t('phoneNumber')} *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+971 50 123 4567"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-11 text-xs px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                />
              </div>

              {/* City */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {t('city')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={isRTL ? 'دبي، أبوظبي، إلخ' : 'Dubai, Abu Dhabi, Riyadh, etc.'}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-11 text-xs px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                />
              </div>

              {/* Address */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {t('streetAddress')} *
                </label>
                <input
                  type="text"
                  required
                  placeholder={isRTL ? 'اسم الشارع، رقم المبنى، الشقة' : 'Street name, building number, apartment'}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full h-11 text-xs px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                />
              </div>

              {/* Notes */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {t('orderNotes')}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full text-xs p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none resize-none"
                />
              </div>
            </div>
          </div>

          {/* Payment Swatches selection */}
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
            <h3 className="font-extrabold text-base text-slate-800 dark:text-slate-100 pb-3 border-b border-slate-50 dark:border-slate-800">
              {t('paymentMethod')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod('cod')}
                className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition ${
                  paymentMethod === 'cod'
                    ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20'
                    : 'border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950'
                }`}
                style={{ textAlign: isRTL ? 'right' : 'left' }}
              >
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-xl">
                  <Truck className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100 block">
                    {t('cashOnDelivery')}
                  </span>
                  <p className="text-[10px] text-slate-400">
                    {isRTL ? 'ادفع نقداً ومباشرة عند استلام الطلبية' : 'Pay in cash directly upon receipt'}
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`p-5 rounded-2xl border text-left flex items-start gap-4 transition ${
                  paymentMethod === 'card'
                    ? 'border-indigo-600 bg-indigo-50/20 dark:bg-indigo-950/20'
                    : 'border-slate-150 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950'
                }`}
                style={{ textAlign: isRTL ? 'right' : 'left' }}
              >
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 rounded-xl">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div className="space-y-0.5">
                  <span className="font-extrabold text-xs text-slate-800 dark:text-slate-100 block">
                    {t('creditCard')}
                  </span>
                  <p className="text-[10px] text-slate-400">
                    {isRTL ? 'ادفع إلكترونياً بأمان تام (معالج محاكاة)' : 'Simulated visa gateway for development'}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Checkout Summary info */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="font-bold text-base text-slate-800 dark:text-slate-200 pb-3 border-b border-slate-50 dark:border-slate-800">
              {isRTL ? 'مراجعة المشتريات' : 'Order Review'}
            </h3>

            {/* Micro items list */}
            <div className="max-h-52 overflow-y-auto space-y-3.5 pr-2">
              {cart.map((item, index) => {
                const name = isRTL ? item.product.arName : item.product.name;
                return (
                  <div key={index} className="flex gap-3 items-center justify-between text-xs">
                    <div className="flex gap-2.5 items-center">
                      <img src={item.product.image} alt={name} className="w-9 h-9 rounded object-cover" />
                      <div className="space-y-0.5 max-w-[120px]">
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1 leading-tight">{name}</h4>
                        <span className="text-[10px] text-slate-400">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-extrabold text-slate-800 dark:text-slate-200">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="border-t border-slate-50 dark:border-slate-800/80 pt-4 space-y-3 text-xs">
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

              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex justify-between text-base font-black text-slate-800 dark:text-slate-100">
                <span>{t('total')}</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
            </div>

            {/* Button to Submit order */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-250 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-500/10 cursor-pointer"
            >
              <ShieldCheck className="w-5 h-5" />
              {isSubmitting ? t('processing') : t('placeOrder')}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
