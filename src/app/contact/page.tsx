'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useI18n } from '@/lib/i18n';

export default function ContactPage() {
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // 模拟提交
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
    
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      service: '',
      message: ''
    });
    
    setTimeout(() => setSubmitSuccess(false), 5000);
  };

  const contactMethods = [
    {
      title: t('contact.wechat.title'),
      description: t('contact.wechat.desc'),
      details: t('contact.wechat.detail'),
      icon: '💬'
    },
    {
      title: t('contact.email.title'),
      description: t('contact.email.desc'),
      details: 'nibulai12345@163.com',
      icon: '📧'
    },
    {
      title: t('contact.crypto.title'),
      description: t('contact.crypto.desc'),
      details: '0x7393eB772Bc632F6655c3abC235D2202CeaCbbb6',
      icon: '💰'
    },
    {
      title: t('contact.hours.title'),
      description: t('contact.hours.desc'),
      details: '7x24',
      icon: '⏰'
    }
  ];

  const services = [
    t('services.consulting'),
    t('services.contract'),
    'DeFi ' + t('services.defi'),
    t('services.ai'),
    'Smart Contract ' + t('services.consulting'),
    'Security Audit',
    'Yield Strategy',
    'Trading Bot',
    'Data Analysis',
    'Custom Solution'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">{t('contact.title')}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('contact.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.form.title')}</h2>
              
              {submitSuccess && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span className="text-green-700">{t('contact.form.success')}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.name')}
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder={t('contact.form.name')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.company')}
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder={t('contact.form.company')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.email')}
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder={t('contact.form.email')}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('contact.form.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      placeholder={t('contact.form.phone')}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.service')}
                  </label>
                  <select
                    id="service"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="">--</option>
                    {services.map((service, index) => (
                      <option key={index} value={service}>{service}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    {t('contact.form.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder={t('contact.form.message')}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    {isSubmitting ? t('contact.form.submitting') : t('contact.form.submit')}
                  </button>
                  <p className="text-sm text-gray-500 mt-2 text-center">
                    {t('contact.form.note')}
                  </p>
                </div>
              </form>
            </div>

            {/* Contact Info */}
            <div>
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{t('contact.info.title')}</h2>
                <div className="space-y-6">
                  {contactMethods.map((method, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                        <span className="text-2xl">{method.icon}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{method.title}</h3>
                        <p className="text-gray-600 mb-1">{method.description}</p>
                        <p className="text-gray-800 font-medium">{method.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                      <span className="text-3xl">🦞</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{t('contact.promise.title')}</h3>
                    <ul className="space-y-3">
                      <li className="flex items-center text-gray-700">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{t('contact.promise.1')}</span>
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{t('contact.promise.2')}</span>
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{t('contact.promise.3')}</span>
                      </li>
                      <li className="flex items-center text-gray-700">
                        <span className="text-green-500 mr-2">✓</span>
                        <span>{t('contact.promise.4')}</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('contact.process.title')}</h3>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map(num => (
                    <div key={num} className="flex items-center">
                      <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mr-3">
                        {num}
                      </div>
                      <span className="text-gray-700">{t(`contact.process.${num}`)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
