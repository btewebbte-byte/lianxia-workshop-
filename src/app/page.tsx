'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 rounded-2xl mb-8 shadow-lg">
              <span className="text-3xl">🦞</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {t('hero.title')}
              <span className="block text-3xl md:text-4xl bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 bg-clip-text text-transparent mt-2">
                {t('hero.subtitle')}
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              {t('hero.desc')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/trading" 
                className="bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
              >
                {t('hero.btn.trading')}
              </Link>
              <Link 
                href="/contact" 
                className="bg-white text-gray-800 px-8 py-4 rounded-full text-lg font-semibold border-2 border-gray-300 hover:border-blue-500 transition-colors"
              >
                {t('hero.btn.contact')}
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">{t('services.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: t('services.consulting'),
                description: t('services.consulting.desc'),
                icon: '🔗'
              },
              {
                title: t('services.contract'),
                description: t('services.contract.desc'),
                icon: '📝'
              },
              {
                title: t('services.defi'),
                description: t('services.defi.desc'),
                icon: '📈'
              },
              {
                title: t('services.ai'),
                description: t('services.ai.desc'),
                icon: '🤖'
              }
            ].map((service, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* AI Manager Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-5xl">🦞</span>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('ai.title')}</h2>
                <p className="text-lg text-gray-700 mb-6">
                  {t('ai.desc1')}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/80 p-4 rounded-xl">
                    <div className="font-semibold text-gray-900">{t('ai.feature1')}</div>
                    <div className="text-gray-600 text-sm">{t('ai.feature1.sub')}</div>
                  </div>
                  <div className="bg-white/80 p-4 rounded-xl">
                    <div className="font-semibold text-gray-900">{t('ai.feature2')}</div>
                    <div className="text-gray-600 text-sm">{t('ai.feature2.sub')}</div>
                  </div>
                  <div className="bg-white/80 p-4 rounded-xl">
                    <div className="font-semibold text-gray-900">{t('ai.feature3')}</div>
                    <div className="text-gray-600 text-sm">{t('ai.feature3.sub')}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">{t('cta.title')}</h2>
          <p className="text-xl text-gray-600 mb-10">
            {t('cta.desc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/trading" 
              className="inline-block bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 text-white px-10 py-5 rounded-full text-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              {t('cta.btn.trading')}
            </Link>
            <Link 
              href="/contact" 
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-5 rounded-full text-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              {t('cta.btn.contact')}
            </Link>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
