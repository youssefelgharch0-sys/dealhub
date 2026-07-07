import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Phone, Mail, MapPin, Clock, Send, Shield, Globe, Award, HelpCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// ================= FAQ VIEW COMPONENT =================
export const FAQView: React.FC = () => {
  const { language, t } = useApp();
  const isRTL = language === 'ar';

  const faqs = [
    {
      q: isRTL ? 'كم يستغرق شحن الطلبات؟' : 'How long does shipping take?',
      a: isRTL
        ? 'يستغرق الشحن عادة من 2 إلى 3 أيام عمل داخل دول الخليج العربي، وقد يختلف بحسب المدينة والمنطقة.'
        : 'Shipping usually takes between 2 to 3 working days within the Gulf region. Local city orders might arrive sooner.',
    },
    {
      q: isRTL ? 'هل تتوفر خدمة الدفع عند الاستلام؟' : 'Do you support Cash on Delivery (COD)?',
      a: isRTL
        ? 'نعم، ندعم خدمة الدفع عند الاستلام كطريقة دفع مريحة وآمنة لجميع عملائنا مجاناً وبدون رسوم إضافية.'
        : 'Yes, we support Cash on Delivery (COD) as a convenient and 100% secure payment option for all our clients.',
    },
    {
      q: isRTL ? 'ما هي سياسة الاسترجاع والاستبدال؟' : 'What is your refund and return policy?',
      a: isRTL
        ? 'نقدم سياسة استرجاع مرنة مدتها 30 يوماً من تاريخ استلام الشحنة، شريطة أن يكون المنتج في حالته وتغليفه الأصلي.'
        : 'We offer a flexible 30-day money back guarantee. The item must be unused and in its original premium packaging.',
    },
    {
      q: isRTL ? 'هل جميع المنتجات أصلية؟' : 'Are all listed products genuine?',
      a: isRTL
        ? 'بكل تأكيد. جميع المنتجات المتوفرة على منصة DealHub أصلية 100% ويتم استيرادها وتوريدها مباشرة من الماركات والموزعين الرسميين.'
        : 'Absolutely. Every single product available on DealHub is 100% genuine, directly sourced from official manufacturers or certified dealers.',
    },
  ];

  const [openIdx, setOpenIdx] = useState<number | null>(null);

  return (
    <div
      className="max-w-3xl mx-auto px-4 py-8 md:py-16 space-y-12 animate-fade-in"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-slate-50 tracking-tight">
          {t('faqTitle')}
        </h1>
        <p className="text-sm text-slate-500 max-w-lg mx-auto">
          {t('faqSubtitle')}
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs transition"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base"
                style={{ textAlign: isRTL ? 'right' : 'left' }}
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-indigo-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 text-xs md:text-sm text-slate-500 dark:text-slate-400 border-t border-slate-50 dark:border-slate-850 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};


// ================= ABOUT US VIEW COMPONENT =================
export const AboutView: React.FC = () => {
  const { language, t } = useApp();
  const isRTL = language === 'ar';

  const values = [
    {
      icon: Shield,
      title: isRTL ? 'أمان تام ومضمون' : 'Absolute Security',
      desc: isRTL ? 'حماية بياناتك ومدفوعاتك هي أولويتنا القصوى دائماً.' : 'Protecting your data and financial payments is our absolute priority.',
    },
    {
      icon: Globe,
      title: isRTL ? 'تغطية عالمية ومحلية' : 'Global Catalogs',
      desc: isRTL ? 'نبحث حول العالم لنوفر أفضل الابتكارات وأحدث المنتجات.' : 'We search the globe to compile the finest technology innovations.',
    },
    {
      icon: Award,
      title: isRTL ? 'الجودة الفائقة المعتمدة' : 'Premium Quality',
      desc: isRTL ? 'كل منتج يخضع لاختبار جودة دقيق قبل وضعه في الكتالوج.' : 'Each item undergoes strict auditing before hitting our store.',
    },
  ];

  return (
    <div
      className="max-w-5xl mx-auto px-4 py-8 md:py-16 space-y-16 animate-fade-in"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <span className="text-xs font-extrabold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-3.5 py-1.5 rounded-full inline-block">
            {isRTL ? 'قصتنا ورؤيتنا' : 'Our Story'}
          </span>
          <h1 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-slate-50 leading-tight">
            {isRTL ? 'نهتم بتقديم أرقى تجربة تسوق رقمية استثنائية' : 'We deliver the absolute pinnacle of digital ecommerce'}
          </h1>
          <p className="text-sm md:text-base text-slate-500 leading-relaxed dark:text-slate-400">
            {isRTL
              ? 'تأسست DealHub في عام 2026 برؤية واحدة واضحة: وهي توفير أفضل الأجهزة والملابس ومستلزمات المعيشة بأسعار تنافسية ممتازة دون المساومة على الجودة والخدمة الراقية.'
              : 'DealHub was founded in 2026 with a singular, clear vision: to provide premium technology, clothing, and lifestyle essential products at highly accessible prices without compromising premium service quality.'}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
            {isRTL
              ? 'نسعى لتمكين عملائنا وتزويدهم بأرقى التكنولوجيات التي تجعل حياتهم اليومية أكثر ذكاءً ومرونة وعصرية، بدعم كامل على مدار الساعة ومستودعات شحن محلي فائق السرعة.'
              : 'We empower customers with beautiful tools that improve lifestyle comfort, supported by highly localized express logistics warehouses and continuous customer support.'}
          </p>
        </div>

        <div className="aspect-video lg:aspect-square bg-slate-100 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm relative">
          <img
            src="https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&q=80"
            alt="DealHub Team Workspace"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Corporate Values */}
      <div className="space-y-8 pt-8 border-t border-slate-100 dark:border-slate-850">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-950 dark:text-slate-50">
            {isRTL ? 'قيمنا الأساسية الراسخة' : 'Our Corporate Core Values'}
          </h2>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {isRTL ? 'نؤمن بتمثيل الجودة والتميز والشفافية التامة في كل خطوة.' : 'We believe in executing pristine operations and transparency.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl text-center space-y-4">
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full w-fit mx-auto">
                <v.icon className="w-6 h-6" />
              </div>
              <h4 className="font-extrabold text-slate-800 dark:text-slate-100 text-base">{v.title}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


// ================= CONTACT US VIEW COMPONENT =================
export const ContactView: React.FC = () => {
  const { language, showToast, t } = useApp();
  const isRTL = language === 'ar';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() === '' || email.trim() === '' || message.trim() === '') return;
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast(t('messageSentSuccess'), 'success');
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    }, 1200);
  };

  const contactCards = [
    {
      icon: Phone,
      title: t('phone'),
      val: '+971 4 123 4567',
      desc: isRTL ? 'فريق الدعم متاح 24/7' : 'Support team active 24/7',
    },
    {
      icon: Mail,
      title: t('email'),
      val: 'support@dealhub.com',
      desc: isRTL ? 'نرد خلال 4 ساعات عمل' : 'Response within 4 business hours',
    },
    {
      icon: MapPin,
      title: t('ourLocation'),
      val: isRTL ? 'برج الخليج، دبي، الإمارات' : 'Gulf Tower, Dubai, UAE',
      desc: isRTL ? 'المكتب المالي الرئيسي' : 'Corporate Headquarters',
    },
    {
      icon: Clock,
      title: t('workingHours'),
      val: isRTL ? 'الأحد - الخميس (9ص - 6م)' : 'Sunday - Thursday (9am - 6pm)',
      desc: isRTL ? 'الدعم الرقمي متوفر دائماً' : 'Digital chat support is always live',
    },
  ];

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-16 animate-fade-in"
      style={{ direction: isRTL ? 'rtl' : 'ltr' }}
    >
      <div className="text-center space-y-3 max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-black text-slate-950 dark:text-slate-50 tracking-tight">
          {t('getInTouch')}
        </h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400">
          {t('contactSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact details list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 h-fit">
          {contactCards.map((c, idx) => (
            <div
              key={idx}
              className="flex items-start gap-4 p-5 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl"
            >
              <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-xl">
                <c.icon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {c.title}
                </span>
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 block">
                  {c.val}
                </span>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Message form */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl p-6 md:p-8">
          <form onSubmit={handleSendMessage} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  {t('fullName')} *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-11 text-xs px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
                />
              </div>

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
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {isRTL ? 'الموضوع' : 'Subject'}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full h-11 text-xs px-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                {isRTL ? 'الرسالة' : 'Message'} *
              </label>
              <textarea
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full text-xs p-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 h-12 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-full transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-indigo-500/10 cursor-pointer text-sm whitespace-nowrap"
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? t('processing') : t('sendMessage')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
