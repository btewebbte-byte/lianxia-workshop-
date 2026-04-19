'use client';

import Link from 'next/link';
import { useI18n, Language } from '@/lib/i18n';

export default function Navbar() {
  const { lang, setLang, t, languageNames } = useI18n();

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🦞</span>
              </div>
              <span className="text-xl font-bold text-gray-900">链虾工坊</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-500 transition-colors">
              {t('nav.home')}
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-blue-500 transition-colors">
              {t('nav.services')}
            </Link>
            <Link href="/cases" className="text-gray-700 hover:text-blue-500 transition-colors">
              {t('nav.cases')}
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-blue-500 transition-colors">
              {t('nav.about')}
            </Link>
            <Link 
              href="/trading" 
              className="bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity font-medium"
            >
              🦐 {t('nav.trading')}
            </Link>
            
            {/* Language Selector */}
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as Language)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white text-gray-700 hover:border-blue-400 focus:outline-none focus:border-blue-500"
            >
              {Object.entries(languageNames).map(([code, name]) => (
                <option key={code} value={code}>{name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}
