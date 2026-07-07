import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast, language } = useApp();

  const isRTL = language === 'ar';

  return (
    <div
      className={`fixed z-50 flex flex-col gap-2 max-w-sm w-full p-4 pointer-events-none ${
        isRTL
          ? 'left-0 top-0 sm:left-4 sm:top-4'
          : 'right-0 top-0 sm:right-4 sm:top-4'
      }`}
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <AnimatePresence>
        {toasts.map((toast) => {
          let bgColor = 'bg-slate-800 text-white';
          let Icon = Info;

          if (toast.type === 'success') {
            bgColor = 'bg-emerald-600 text-white';
            Icon = CheckCircle;
          } else if (toast.type === 'error') {
            bgColor = 'bg-rose-600 text-white';
            Icon = AlertCircle;
          }

          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border border-white/10 pointer-events-auto ${bgColor}`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="text-sm font-medium flex-1">{toast.message}</div>
              <button
                onClick={() => dismissToast(toast.id)}
                className="hover:opacity-80 transition p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
