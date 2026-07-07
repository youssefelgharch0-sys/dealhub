import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Mail, Lock, User as UserIcon, Shield, ArrowRight } from 'lucide-react';

interface AuthViewProps {
  initialMode?: 'login' | 'register';
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login' }) => {
  const { login, register, language, t } = useApp();
  const isRTL = language === 'ar';

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'admin'>('customer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'login') {
      if (email.trim() === '') return;
      login(email, role);
    } else {
      if (name.trim() === '' || email.trim() === '') return;
      register(name, email);
    }
  };

  const handleQuickLogin = (selectedRole: 'customer' | 'admin') => {
    if (selectedRole === 'admin') {
      setEmail('admin@dealhub.com');
      login('admin@dealhub.com', 'admin');
    } else {
      setEmail('youssef@dealhub.com');
      login('youssef@dealhub.com', 'customer');
    }
  };

  return (
    <div
      className="max-w-md w-full mx-auto px-4 py-12 md:py-20 animate-fade-in"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8 space-y-6 shadow-xl shadow-slate-100/10 dark:shadow-none">
        {/* Toggle tabs */}
        <div className="flex bg-slate-50 dark:bg-slate-950 p-1.5 rounded-2xl">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {t('login')}
          </button>
          <button
            onClick={() => setMode('register')}
            className={`flex-1 py-3 text-xs font-bold rounded-xl transition ${
              mode === 'register'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 shadow-xs'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {t('register')}
          </button>
        </div>

        {/* Brand logo details */}
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-black text-slate-950 dark:text-slate-50">
            {mode === 'login' ? t('login') : t('register')}
          </h2>
          <p className="text-xs text-slate-400">
            {isRTL
              ? 'أهلاً بك في منصتنا الرائدة، تفضل بإدخال بياناتك'
              : 'Welcome to DealHub, please enter your credentials'}
          </p>
        </div>

        {/* Main form */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {mode === 'register' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {t('fullName')}
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={isRTL ? 'الاسم الثلاثي' : 'Youssef El Gharch'}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 text-xs px-4 pl-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500"
                />
                <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {t('emailAddress')}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="youssef@dealhub.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 text-xs px-4 pl-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              {isRTL ? 'كلمة المرور' : 'Password'}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 text-xs px-4 pl-10 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {mode === 'login' && (
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                {isRTL ? 'نوع الصلاحية' : 'Access Role'}
              </label>
              <div className="flex bg-slate-50 dark:bg-slate-950 p-1 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setRole('customer')}
                  className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition ${
                    role === 'customer'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {isRTL ? 'عميل متسوق' : 'Customer'}
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex-1 py-2 text-[11px] font-bold rounded-lg transition ${
                    role === 'admin'
                      ? 'bg-amber-600 text-white'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {isRTL ? 'مشرف مسؤول' : 'Administrator'}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/10 cursor-pointer pt-1"
          >
            <span>{mode === 'login' ? t('login') : t('register')}</span>
            <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
          </button>
        </form>

        {/* Demo shortcuts helper block */}
        <div className="pt-6 border-t border-slate-50 dark:border-slate-800 space-y-3">
          <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 text-center uppercase tracking-wider">
            {isRTL ? 'روابط الدخول السريع للمعاينة' : 'Quick demo login shortcuts'}
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => handleQuickLogin('customer')}
              className="py-2.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-100 dark:border-slate-850 rounded-xl text-[11px] font-bold text-slate-600 dark:text-slate-300 transition"
            >
              🚀 {isRTL ? 'دخول العميل' : 'Customer Demo'}
            </button>
            <button
              onClick={() => handleQuickLogin('admin')}
              className="py-2.5 bg-amber-50/40 hover:bg-amber-50 dark:bg-amber-950/15 border border-amber-100/50 dark:border-amber-900/30 rounded-xl text-[11px] font-bold text-amber-700 dark:text-amber-400 transition"
            >
              👑 {isRTL ? 'دخول المسؤول' : 'Admin Demo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
