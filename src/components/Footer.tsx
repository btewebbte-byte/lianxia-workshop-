'use client';

import Link from 'next/link';
import { useI18n } from '@/lib/i18n';

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🦞</span>
              </div>
              <span className="text-xl font-bold">{t('footer.company')}</span>
            </div>
            <p className="text-gray-400">
              {t('footer.tagline')}
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.services')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>{t('footer.consulting')}</li>
              <li>{t('footer.contract')}</li>
              <li>{t('footer.defi')}</li>
              <li>{t('footer.ai')}</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <span className="text-gray-500">{t('footer.telegram')}</span>{' '}
                <a href="https://t.me/nibulai666" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors">
                  {t('contact.wechat.detail')}
                </a>
              </li>
              <li>{t('footer.email')} nibulai12345@163.com</li>
              <li>{t('footer.hours')} 7x24</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.crypto')}</h3>
            <ul className="space-y-2 text-gray-400">
              <li>{t('footer.bsc')}</li>
              <li className="text-xs break-all">0x7393eB772Bc632F6655c3abC235D2202CeaCbbb6</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} {t('footer.company')}. {t('footer.copyright')}.</p>
        </div>
      </div>
    </footer>
  );
}
