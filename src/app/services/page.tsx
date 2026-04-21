'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function ServicesPage() {
  const { t } = useI18n();

  const services = [
    {
      category: 'nav.services',
      items: [
        {
          title: t('services.consulting'),
          description: t('services.consulting.desc'),
          price: '$500起',
          features: ['services.consulting.feature1', 'services.consulting.feature2', 'services.consulting.feature3']
        },
        {
          title: t('services.contract'),
          description: t('services.contract.desc'),
          price: '$800起',
          features: ['services.contract.feature1', 'services.contract.feature2', 'services.contract.feature3']
        },
        {
          title: 'Security Audit',
          description: 'Smart Contract Security Audit',
          price: '$1,000起',
          features: ['Static Analysis', 'Dynamic Testing', 'Audit Report']
        }
      ]
    },
    {
      category: 'DeFi Strategy',
      items: [
        {
          title: 'Liquidity Mining',
          description: 'LP Mining Yield Optimization',
          price: '$600起',
          features: ['Yield Simulation', 'Risk Assessment', 'Strategy Implementation']
        },
        {
          title: 'Yield Aggregator',
          description: 'Multi-protocol Yield Aggregation',
          price: '$1,200起',
          features: ['Protocol Integration', 'Risk Control', 'UI Design']
        },
        {
          title: 'Trading Bot',
          description: 'Quant Trading & Arbitrage Bot',
          price: '$1,500起',
          features: ['Backtesting', 'Live Deployment', 'Monitoring']
        }
      ]
    },
    {
      category: 'AI Automation',
      items: [
        {
          title: t('services.ai'),
          description: t('services.ai.desc'),
          price: '$400起',
          features: ['Process Analysis', 'Automation Design', 'Deployment']
        },
        {
          title: 'Data Analysis',
          description: 'On-chain Data Analytics & Reports',
          price: '$300起',
          features: ['Data Collection', 'Modeling', 'Reporting']
        },
        {
          title: 'AI Customer Service',
          description: 'Intelligent Bot, Multi-channel',
          price: '$800起',
          features: ['Dialogue Design', 'Integration', 'Optimization']
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">{t('services.title')}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t('ai.desc1')}
            </p>
          </div>

          {services.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">{category.category}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.items.map((service, serviceIndex) => (
                  <div key={serviceIndex} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                    <h3 className="text-2xl font-semibold text-gray-900 mb-4">{service.title}</h3>
                    <p className="text-gray-600 mb-6">{service.description}</p>
                    
                    <div className="mb-6">
                      <div className="text-sm text-gray-500 mb-2">Includes:</div>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center text-gray-700">
                            <span className="text-green-500 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="border-t pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="text-2xl font-bold text-gray-900">{service.price}</div>
                          <div className="text-sm text-gray-500">USDT</div>
                        </div>
                        <Link 
                          href="/contact" 
                          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                        >
                          {t('contact.form.submit')}
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-8 md:p-12 mt-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Custom Solutions</h2>
              <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                {t('ai.desc1')}
              </p>
              <Link 
                href="/contact" 
                className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity"
              >
                {t('cta.btn.contact')}
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
