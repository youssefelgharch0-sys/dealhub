import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Facebook, Twitter, Instagram, Youtube, Send } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, language, setCurrentView } = useApp();
  const [email, setEmail] = useState('');
  const isRTL = language === 'ar';

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() === '') return;
    alert(t('successSubscribe'));
    setEmail('');
  };

  return (
    <footer
      className="bg-slate-900 text-slate-300 dark:bg-slate-950/40 border-t border-slate-800 transition-colors"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      {/* Newsletter Panel */}
      <div className="border-b border-slate-800 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                {t('newsletterTitle')}
              </h3>
              <p className="text-sm text-slate-400">
                {t('newsletterSubtitle')}
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex max-w-md w-full relative">
              <input
                type="email"
                required
                placeholder={t('emailAddress')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full h-12 bg-slate-800 text-white border border-slate-700 focus:border-indigo-500 focus:outline-none rounded-full px-6 text-sm ${
                  isRTL ? 'pl-16' : 'pr-16'
                }`}
              />
              <button
                type="submit"
                className={`absolute h-10 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center transition top-1 ${
                  isRTL ? 'left-1' : 'right-1'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand & Desc */}
          <div className="space-y-4">
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
              {t('brand')}
            </span>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              {language === 'ar'
                ? 'منصة التجارة الإلكترونية الأكثر أماناً وسرعة للحصول على أفضل الأجهزة والمستلزمات الحياتية بأسعار مذهلة.'
                : 'The most secure, lightning-fast ecommerce platform delivering modern tech essentials and premium lifestyle goods.'}
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="w-9 h-9 rounded-full bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white flex items-center justify-center transition"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {language === 'ar' ? 'روابط سريعة' : 'Quick Links'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: t('home'), view: 'home' as const },
                { label: t('shop'), view: 'shop' as const },
                { label: t('categories'), view: 'categories' as const },
                { label: t('about'), view: 'about' as const },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView(item.view);
                    }}
                    className="hover:text-indigo-400 transition"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Customer Care */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {language === 'ar' ? 'العناية بالعملاء' : 'Customer Care'}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {[
                { label: t('contact'), view: 'contact' as const },
                { label: t('faq'), view: 'faq' as const },
                { label: language === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy', view: 'home' as const },
                { label: language === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions', view: 'home' as const },
              ].map((item, idx) => (
                <li key={idx}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentView(item.view);
                    }}
                    className="hover:text-indigo-400 transition"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Address */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              {language === 'ar' ? 'معلومات الاتصال' : 'Contact Info'}
            </h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>
                <span className="text-white block font-medium">
                  {language === 'ar' ? 'العنوان المالي الرئيسي:' : 'Headquarters:'}
                </span>
                {language === 'ar' ? 'برج الخليج، دبي، الإمارات العربية المتحدة' : 'Gulf Tower, Dubai, UAE'}
              </li>
              <li>
                <span className="text-white block font-medium">
                  {language === 'ar' ? 'البريد الإلكتروني:' : 'Email Support:'}
                </span>
                support@dealhub.com
              </li>
              <li>
                <span className="text-white block font-medium">
                  {language === 'ar' ? 'الرقم الموحد المالي:' : 'Hotline Phone:'}
                </span>
                +971 4 123 4567
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} {t('brand')}.{' '}
            {language === 'ar' ? 'جميع الحقوق محفوظة.' : 'All rights reserved.'}
          </p>
          <div className="flex items-center gap-4">
            <img
              src="https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?w=200&q=80"
              alt="Payment Methods"
              className="h-6 grayscale opacity-40 hover:opacity-70 transition duration-200 rounded object-contain"
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
