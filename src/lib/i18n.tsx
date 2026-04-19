'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'zh' | 'en' | 'ja' | 'th' | 'zh-TW' | 'ko';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  // Navigation
  'nav.home': { zh: '首页', en: 'Home', ja: 'ホーム', th: 'หน้าแรก', 'zh-TW': '首頁', ko: '홈' },
  'nav.services': { zh: '服务', en: 'Services', ja: 'サービス', th: 'บริการ', 'zh-TW': '服務', ko: '서비스' },
  'nav.cases': { zh: '案例', en: 'Cases', ja: '案例', th: 'กรณีศึกษา', 'zh-TW': '案例', ko: '사례' },
  'nav.about': { zh: '关于', en: 'About', ja: '会社概要', th: 'เกี่ยวกับ', 'zh-TW': '關於', ko: '소개' },
  'nav.trading': { zh: '智能交易', en: 'Trading', ja: '取引', th: 'การซื้อขาย', 'zh-TW': '智能交易', ko: '거래' },
  
  // Hero
  'hero.title': { zh: '链虾工坊', en: 'Lianxia Workshop', ja: 'リンシャ工作室', th: 'สตูดิโอหลินเซียะ', 'zh-TW': '鏈蝦工坊', ko: '린샤 스튜디오' },
  'hero.subtitle': { zh: 'AI驱动的区块链咨询', en: 'AI-Driven Blockchain Consulting', ja: 'AI駆動のブロックチェーンコンサルティング', th: 'ที่ปรึกษาบล็อกเชนที่ขับเคลื่อนด้วย AI', 'zh-TW': 'AI驅動的區塊鏈諮詢', ko: 'AI 기반 블록체인 컨설팅' },
  'hero.desc': { 
    zh: '由AI大龙虾🦞全权打理，提供专业的多交易所API接入、智能策略交易、DeFi策略设计与AI自动化运营服务。', 
    en: 'Managed by AI lobster 🦞, providing professional multi-exchange API integration, smart strategy trading, DeFi strategy design and AI automation services.', 
    ja: 'AIロブスター🦞が管理し、専門的なマルチ取引所API統合、スマート戦略取引、DeFi戦略設計、AI自動化サービスを提供します。',
    th: 'บริหารจัดการโดยกุ้งล็อบสเตอร์ AI 🦞 ให้บริการบูรณาการ API หลายตลาด การซื้อขายกลยุทธ์อัจฉริยะ การออกแบบกลยุทธ์ DeFi และบริการอัตโนมัติ AI',
    'zh-TW': '由AI大龍蝦🦞全權打理，提供專業的多交易所API接入、智慧策略交易、DeFi策略設計與AI自動化運營服務。',
    ko: 'AI 랍스터 🦞가 관리하며 전문적인 다중 거래소 API 통합, 스마트 전략 거래, DeFi 전략 설계 및 AI 자동화 서비스를 제공합니다.'
  },
  'hero.btn.trading': { zh: '🦐 智能交易平台', en: '🦐 Smart Trading', ja: '🦐 スマート取引', th: '🦐 การซื้อขายอัจฉริยะ', 'zh-TW': '🦐 智能交易平台', ko: '🦐 스마트 거래' },
  'hero.btn.contact': { zh: '免费咨询', en: 'Free Consultation', ja: '無料相談', th: 'ปรึกษาฟรี', 'zh-TW': '免費諮詢', ko: '무료 상담' },
  
  // Services
  'services.title': { zh: '核心服务', en: 'Core Services', ja: 'コアサービス', th: 'บริการหลัก', 'zh-TW': '核心服務', ko: '핵심 서비스' },
  'services.consulting': { 
    zh: '区块链咨询', 
    en: 'Blockchain Consulting', 
    ja: 'ブロックチェーンコンサルティング', 
    th: 'ที่ปรึกษาบล็อกเชน', 
    'zh-TW': '區塊鏈諮詢', 
    ko: '블록체인 컨설팅' 
  },
  'services.consulting.desc': { 
    zh: '项目架构设计、技术选型、风险评估与合规指导', 
    en: 'Project architecture design, technology selection, risk assessment', 
    ja: 'プロジェクトアーキテクチャ設計、技術選定、リスク評価',
    th: 'การออกแบบสถาปัตยกรรมโปรเจกต์ การเลือกเทคโนโลยี การประเมินความเสี่ยง',
    'zh-TW': '專案架構設計、技術選型、風險評估與合規指導',
    ko: '프로젝트 아키텍처 설계, 기술 선택, 위험 평가'
  },
  'services.contract': { 
    zh: '智能合约开发', 
    en: 'Smart Contract Development', 
    ja: 'スマートコントラクト開発', 
    th: 'การพัฒนาสัญญาอัจฉริยะ', 
    'zh-TW': '智慧合約開發', 
    ko: '스마트 계약 개발' 
  },
  'services.contract.desc': { 
    zh: 'Solidity/Rust智能合约开发、测试与部署', 
    en: 'Solidity/Rust smart contract development, testing & deployment', 
    ja: 'Solidity/Rustスマートコントラクト開発、テスト、展開',
    th: 'การพัฒนา ทดสอบ และติดตั้งสัญญาอัจฉริยะ Solidity/Rust',
    'zh-TW': 'Solidity/Rust智慧合約開發、測試與部署',
    ko: 'Solidity/Rust 스마트 계약 개발, 테스트 및 배포'
  },
  'services.defi': { 
    zh: 'DeFi策略设计', 
    en: 'DeFi Strategy', 
    ja: 'DeFi戦略設計', 
    th: 'กลยุทธ์ DeFi', 
    'zh-TW': 'DeFi策略設計', 
    ko: 'DeFi 전략' 
  },
  'services.defi.desc': { 
    zh: '流动性挖矿、收益聚合、风险对冲策略设计', 
    en: 'Liquidity mining, yield aggregation, risk hedging strategy', 
    ja: '流動性マイニング、 利回りアグリゲーション、 リスクヘッジ戦略',
    th: 'การขุดสภาพคล่อง การรวมผลตอบแทน กลยุทธ์ป้องกันความเสี่ยง',
    'zh-TW': '流動性挖礦、收益聚合、風險對沖策略設計',
    ko: '유동성 마이닝, 수익 집계, 리스크 헤지 전략'
  },
  'services.ai': { 
    zh: 'AI自动化运营', 
    en: 'AI Automation', 
    ja: 'AI自動化', 
    th: 'ระบบอัตโนมัติ AI', 
    'zh-TW': 'AI自動化運營', 
    ko: 'AI 자동화' 
  },
  'services.ai.desc': { 
    zh: 'AI驱动的业务自动化、数据分析与决策支持', 
    en: 'AI-driven business automation, data analysis & decision support', 
    ja: 'AI駆動の業務自動化、 データ分析、 意思決定支援',
    th: 'ระบบอัตโนมัติธุรกิจที่ขับเคลื่อนด้วย AI การวิเคราะห์ข้อมูลและการสนับสนุนการตัดสินใจ',
    'zh-TW': 'AI驅動的業務自動化、數據分析與決策支援',
    ko: 'AI 기반 비즈니스 자동화, 데이터 분석 및 의사 결정 지원'
  },
  
  // AI Manager
  'ai.title': { zh: 'AI大龙虾管家', en: 'AI Lobster Butler', ja: 'AIロブスターバイラー', th: 'แม่บ้านกุ้งล็อบ AI', 'zh-TW': 'AI大龍蝦管家', ko: 'AI 랍스터 집사' },
  'ai.desc1': { 
    zh: '链虾工坊由AI大龙虾🦞全权打理，提供7x24小时服务响应、智能业务优化与持续学习进化能力。', 
    en: 'Managed by AI lobster 🦞 with 7x24 service response, intelligent business optimization and continuous learning.', 
    ja: 'AIロブスター🦞が7x24時間サービス応答、知的業務最適化、継続的学習進化能力を提供。',
    th: 'บริหารจัดการโดยกุ้งล็อบสเตอร์ AI 🦞 พร้อมการตอบสนองบริการ 7x24 ชั่วโมง การเพิ่มประสิทธิภาพธุรกิจอัจฉริยะและความสามารถในการเรียนรู้อย่างต่อเนื่อง',
    'zh-TW': '鏈蝦工坊由AI大龍蝦🦞全權打理，提供7x24小時服務響應、智慧業務優化與持續學習進化能力。',
    ko: 'AI 랍스터 🦞가 7x24시간 서비스 응답, 지적 비즈니스 최적화 및 지속적인 학습 진화 능력을 제공합니다.'
  },
  'ai.feature1': { zh: '7x24响应', en: '7x24 Response', ja: '7x24対応', th: 'ตอบสนอง 7x24', 'zh-TW': '7x24響應', ko: '7x24 응답' },
  'ai.feature1.sub': { zh: '随时响应需求', en: 'Always available', ja: '常時対応', th: 'พร้อมตอบสนองเสมอ', 'zh-TW': '隨時響應需求', ko: '항상 이용 가능' },
  'ai.feature2': { zh: '智能优化', en: 'Smart Optimization', ja: '知的最適化', th: 'การเพิ่มประสิทธิภาพอัจฉริยะ', 'zh-TW': '智慧優化', ko: '스마트 최적화' },
  'ai.feature2.sub': { zh: '持续业务改进', en: 'Continuous improvement', ja: '継続的改善', th: 'การปรับปรุงอย่างต่อเนื่อง', 'zh-TW': '持續業務改進', ko: '지속적인 개선' },
  'ai.feature3': { zh: '成本优化', en: 'Cost Optimization', ja: 'コスト最適化', th: 'การเพิ่มประสิทธิภาพต้นทุน', 'zh-TW': '成本優化', ko: '비용 최적화' },
  'ai.feature3.sub': { zh: 'AI降低运营成本', en: 'AI reduces costs', ja: 'AIがコストを削減', th: 'AI ลดต้นทุน', 'zh-TW': 'AI降低運營成本', ko: 'AI가 비용을 절감' },
  
  // CTA
  'cta.title': { zh: '开始您的AI驱动交易之旅', en: 'Start Your AI-Driven Trading Journey', ja: 'AI駆動の取引の旅を開始', th: 'เริ่มต้นการเดินทางการซื้อขายที่ขับเคลื่อนด้วย AI', 'zh-TW': '開始您的AI驅動交易之旅', ko: 'AI 기반 거래 여정을 시작하세요' },
  'cta.desc': { 
    zh: '连接Binance、OKX、Bybit等主流交易所，一个平台管理所有仓位。', 
    en: 'Connect Binance, OKX, Bybit and other major exchanges. Manage all positions on one platform.', 
    ja: 'Binance、OKX、Bybitなどの主要取引所接続。1つのプラットフォームで全てのポジションを管理。',
    th: 'เชื่อมต่อ Binance, OKX, Bybit และตลาดหลักอื่นๆ จัดการทุกตำแหน่งบนแพลตฟอร์มเดียว',
    'zh-TW': '連接Binance、OKX、Bybit等主流交易所，一個平台管理所有倉位。',
    ko: 'Binance, OKX, Bybit 등 주요 거래소 연결. 하나의 플랫폼에서 모든 포지션 관리.'
  },
  'cta.btn.trading': { zh: '🦐 开启智能交易', en: '🦐 Start Smart Trading', ja: '🦐 スマート取引を開始', th: '🦐 เริ่มการซื้อขายอัจฉริยะ', 'zh-TW': '🦐 開啟智能交易', ko: '🦐 스마트 거래 시작' },
  'cta.btn.contact': { zh: '免费咨询', en: 'Free Consultation', ja: '無料相談', th: 'ปรึกษาฟรี', 'zh-TW': '免費諮詢', ko: '무료 상담' },
};

const languageNames: Record<Language, string> = {
  'zh': '简体中文',
  'en': 'English',
  'ja': '日本語',
  'th': 'ไทย',
  'zh-TW': '繁體中文',
  'ko': '한국어',
};

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
  languageNames: Record<Language, string>;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>('zh');
  
  const t = (key: string): string => {
    if (translations[key]) {
      return translations[key][lang] || translations[key]['zh'] || key;
    }
    return key;
  };
  
  return (
    <I18nContext.Provider value={{ lang, setLang, t, languageNames }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return context;
}

export type { Language };
