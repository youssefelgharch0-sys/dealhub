import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle, ArrowRight, ShoppingBag, Truck } from 'lucide-react';
import { motion } from 'motion/react';

export const OrderSuccessView: React.FC = () => {
  const { language, setCurrentView, setUserSubView, t } = useApp();
  const isRTL = language === 'ar';
  const [orderNum, setOrderNum] = useState('DH-93215');

  useEffect(() => {
    const lastNum = localStorage.getItem('dealhub_last_order_num');
    if (lastNum) {
      setOrderNum(lastNum);
    }
  }, []);

  return (
    <div
      className="max-w-xl mx-auto px-4 py-16 md:py-24 text-center space-y-8 animate-fade-in"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Animated Tick Icon */}
      <div className="flex justify-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ type: 'spring', damping: 15, stiffness: 200, duration: 0.6 }}
          className="w-20 h-20 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/10 border border-emerald-100 dark:border-emerald-900"
        >
          <CheckCircle className="w-10 h-10" />
        </motion.div>
      </div>

      <div className="space-y-3">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-slate-50">
          {t('orderSuccessTitle')}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('orderSuccessSubtitle')}{' '}
          <span className="font-extrabold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-3 py-1 rounded-md">
            {orderNum}
          </span>
        </p>
      </div>

      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 space-y-4 max-w-sm mx-auto">
        <p className="leading-relaxed">
          {t('orderSuccessDesc')}
        </p>
        <div className="flex items-center justify-center gap-2 text-indigo-600 font-bold">
          <Truck className="w-4 h-4" />
          <span>{isRTL ? 'التوصيل المتوقع خلال 2-3 أيام عمل' : 'Expected delivery: 2-3 working days'}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 max-w-xs sm:max-w-md mx-auto">
        <button
          onClick={() => {
            setUserSubView('orders');
            setCurrentView('user-dashboard');
          }}
          className="w-full sm:w-auto h-12 px-8 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition shadow-md flex items-center justify-center gap-2"
        >
          <ShoppingBag className="w-4 h-4" />
          {t('trackOrder')}
        </button>

        <button
          onClick={() => setCurrentView('shop')}
          className="w-full sm:w-auto h-12 px-8 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 font-semibold rounded-full hover:bg-slate-50 dark:hover:bg-slate-900 transition flex items-center justify-center gap-1.5"
        >
          {t('continueShopping')}
          <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
        </button>
      </div>
    </div>
  );
};
