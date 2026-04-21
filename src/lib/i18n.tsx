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

  // Contact
  'contact.title': { zh: '联系我们', en: 'Contact Us', ja: 'お問い合わせ', th: 'ติดต่อเรา', 'zh-TW': '聯繫我們', ko: '문의' },
  'contact.subtitle': { zh: '无论您有具体项目需求还是想了解我们的服务，AI大龙虾🦞都随时准备为您提供专业咨询。', en: 'Whether you have specific project needs or want to learn about our services, AI Lobster 🦞 is ready to provide professional consultation.', ja: '具体的なプロジェクト要件がなくても、サービスの詳細を知りたい場合でも、AIロブスター🦞が専門的なコンサルティングを提供する準備ができています。', th: 'ไม่ว่าคุณจะมีความต้องการโปรเจกต์เฉพาะหรือต้องการทราบเกี่ยวกับบริการของเรา กุ้งล็อบ AI 🦞 พร้อมให้คำปรึกษาที่เป็นมืออาชีพ', 'zh-TW': '無論您有具體項目需求還是想了關注我們的服務，AI大龍蝦🦞都随时準備為您提供專業諮詢。', ko: '구체적인 프로젝트 요구사항이 있든 서비스를 알고 싶든, AI 랍스터 🦞가 전문적인 자문을 제공할 준비가 되어 있습니다.' },
  'contact.form.title': { zh: '发送咨询需求', en: 'Send Inquiry', ja: '問い合わせ', th: 'ส่งคำถาม', 'zh-TW': '發送諮詢需求', ko: '문의하기' },
  'contact.form.name': { zh: '姓名 *', en: 'Name *', ja: 'お名前 *', th: 'ชื่อ *', 'zh-TW': '姓名 *', ko: '이름 *' },
  'contact.form.company': { zh: '公司/项目名称', en: 'Company/Project', ja: '会社/プロジェクト名', th: 'บริษัท/โครงการ', 'zh-TW': '公司/項目名稱', ko: '회사/프로젝트' },
  'contact.form.email': { zh: '邮箱 *', en: 'Email *', ja: 'メール *', th: 'อีเมล *', 'zh-TW': '郵箱 *', ko: '이메일 *' },
  'contact.form.phone': { zh: '联系电话', en: 'Phone', ja: '電話番号', th: 'โทรศัพท์', 'zh-TW': '聯繫電話', ko: '전화번호' },
  'contact.form.service': { zh: '感兴趣的服务 *', en: 'Service *', ja: '関心のあるサービス *', th: 'บริการที่สนใจ *', 'zh-TW': '感興趣的服務 *', ko: '관심 서비스 *' },
  'contact.form.message': { zh: '项目需求描述 *', en: 'Project Details *', ja: 'プロジェクト要件 *', th: 'รายละเอียดโครงการ *', 'zh-TW': '項目需求描述 *', ko: '프로젝트 상세 *' },
  'contact.form.submit': { zh: '发送咨询需求', en: 'Submit Inquiry', ja: '送信', th: 'ส่งคำถาม', 'zh-TW': '發送諮詢需求', ko: '문의하기' },
  'contact.form.submitting': { zh: '发送中...', en: 'Sending...', ja: '送信中...', th: 'กำลังส่ง...', 'zh-TW': '發送中...', ko: '전송 중...' },
  'contact.form.success': { zh: '咨询需求已发送！AI大龙虾将在24小时内与您联系。', en: 'Inquiry sent! AI Lobster will contact you within 24 hours.', ja: '問い合わせを送信しました！AIロブスターが24時間以内にご連絡します。', th: 'ส่งคำถามแล้ว! กุ้งล็อบ AI จะติดต่อคุณภายใน 24 ชั่วโมง', 'zh-TW': '諮詢需求已發送！AI大龍蝦將在24小時內與您聯繫。', ko: '문의가 전송되었습니다! AI 랍스터가 24시간 내에 연락드리겠습니다.' },
  'contact.form.note': { zh: '提交后，AI大龙虾🦞将在24小时内通过您提供的联系方式与您沟通。', en: 'After submission, AI Lobster 🦞 will contact you within 24 hours.', ja: '送信後、AIロブスター🦞が24時間以内にご連絡します。', th: 'หลังจากส่งแล้ว กุ้งล็อบ AI 🦞 จะติดต่อคุณภายใน 24 ชั่วโมง', 'zh-TW': '提交後，AI大龍蝦🦞將在24小時內透過您提供的聯繫方式與您溝通。', ko: '제출 후 AI 랍스터 🦞가 24시간 내에 연락드립니다.' },
  'contact.info.title': { zh: '联系信息', en: 'Contact Information', ja: '連絡先情報', th: 'ข้อมูลติดต่อ', 'zh-TW': '聯繫信息', ko: '연락처 정보' },
  'contact.wechat.title': { zh: '微信咨询', en: 'WeChat', ja: '微信相談', th: 'แชท WeChat', 'zh-TW': '微信諮詢', ko: '위챗 상담' },
  'contact.wechat.desc': { zh: '添加微信好友，直接与AI大龙虾沟通', en: 'Add WeChat friend, chat directly with AI Lobster', ja: '微信好友追加、AIロブスターと直接やり取り', th: 'เพิ่มเพื่อน WeChat ติดต่อกุ้งล็อบ AI โดยตรง', 'zh-TW': '新增微信好友，直接與AI大龍蝦溝通', ko: '위챗 친구 추가, AI 랍스터와 직접 대화' },
  'contact.wechat.detail': { zh: 'Btok: nibulai666', en: 'Btok: nibulai666', ja: 'Btok: nibulai666', th: 'Btok: nibulai666', 'zh-TW': 'Btok: nibulai666', ko: 'Btok: nibulai666' },
  'contact.email.title': { zh: '电子邮件', en: 'Email', ja: 'メール', th: 'อีเมล', 'zh-TW': '電子郵件', ko: '이메일' },
  'contact.email.desc': { zh: '发送详细需求，获取专业方案', en: 'Send detailed requirements, get professional plan', ja: '詳細要件を送信、專業的なプランを取得', th: 'ส่งรายละเอียดความต้องการ รับแผนมืออาชีพ', 'zh-TW': '發送詳細需求，獲取專業方案', ko: '상세 요구사항を送信, 전문가 플랜 받기' },
  'contact.crypto.title': { zh: '加密货币收款', en: 'Crypto Payment', ja: '暗号通貨受け取り', th: 'การชำระเงินคริปโต', 'zh-TW': '加密貨幣收款', ko: '암호화폐 결제' },
  'contact.crypto.desc': { zh: '支持BSC/BNB Chain及所有ERC-20链', en: 'BSC/BNB Chain and all ERC-20 chains supported', ja: 'BSC/BNB Chainおよび全ERC-20チェーン対応', th: 'รองรับ BSC/BNB Chain และ ERC-20 chains ทั้งหมด', 'zh-TW': '支援BSC/BNB Chain及所有ERC-20鏈', ko: 'BSC/BNB Chain 및 모든 ERC-20 체인 지원' },
  'contact.hours.title': { zh: '工作时间', en: 'Hours', ja: '勤務時間', th: 'เวลาทำการ', 'zh-TW': '工作時間', ko: '근무시간' },
  'contact.hours.desc': { zh: 'AI管家7x24小时在线响应', en: 'AI Butler 7x24 online', ja: 'AIバイバー7x24時間オンライン対応', th: 'AI บัตเลอร์ ตอบสนอง 7x24 ชั่วโมง', 'zh-TW': 'AI管家7x24小時在線響應', ko: 'AI 집사 7x24시간 온라인 응답' },
  'contact.promise.title': { zh: 'AI大龙虾管家承诺', en: 'AI Lobster Butler Promise', ja: 'AIロブスターバイラー約束', th: 'สัญญาบริการ AI กุ้งล็อบ', 'zh-TW': 'AI大龍蝦管家承諾', ko: 'AI 랍스터 집사 약속' },
  'contact.promise.1': { zh: '24小时内响应咨询', en: 'Response within 24 hours', ja: '24時間内応答', th: 'ตอบสนองภายใน 24 ชั่วโมง', 'zh-TW': '24小時內響應諮詢', ko: '24시간 내 응답' },
  'contact.promise.2': { zh: '免费初步方案评估', en: 'Free initial assessment', ja: '無料初期評価', th: 'ประเมินเบื้องต้นฟรี', 'zh-TW': '免費初步方案評估', ko: '무료 초기 평가' },
  'contact.promise.3': { zh: '明码标价，无隐藏费用', en: 'Transparent pricing, no hidden fees', ja: '明瞭な料金体系、隠れた費用なし', th: 'ราคาชัดเจน ไม่มีค่าใช้จ่ายซ่อนเร้น', 'zh-TW': '明碼標價，無隱藏費用', ko: '명확한 가격, 숨겨진 비용 없음' },
  'contact.promise.4': { zh: '项目全程AI跟踪优化', en: 'Full AI tracking & optimization', ja: 'プロジェクト全程AI追跡最適化', th: 'AI ติดตามและเพิ่มประสิทธิภาพโปรเจกต์ตลอดทั้งโครงการ', 'zh-TW': '項目全程AI跟蹤優化', ko: '프로젝트 전체 AI 추적 및 최적화' },
  'contact.process.title': { zh: '典型咨询流程', en: 'Inquiry Process', ja: '問い合わせ流れ', th: 'กระบวนการสอบถาม', 'zh-TW': '典型諮詢流程', ko: '문의 절차' },
  'contact.process.1': { zh: '提交咨询需求', en: 'Submit Inquiry', ja: '問い合わせ送信', th: 'ส่งคำถาม', 'zh-TW': '提交諮詢需求', ko: '문의하기' },
  'contact.process.2': { zh: 'AI大龙虾初步分析', en: 'AI Lobster Analysis', ja: 'AIロブスター初期分析', th: 'กุ้งล็อบ AI วิเคราะห์เบื้องต้น', 'zh-TW': 'AI大龍蝦初步分析', ko: 'AI 랍스터 초기 분석' },
  'contact.process.3': { zh: '免费方案沟通', en: 'Free Plan Discussion', ja: '無料プラン相談', th: 'หารือแผนฟรี', 'zh-TW': '免費方案溝通', ko: '무료 플랜 논의' },
  'contact.process.4': { zh: '确定合作细节', en: 'Confirm Cooperation', ja: '協力詳細確定', th: 'ยืนยันรายละเอียดความร่วมมือ', 'zh-TW': '確定合作細節', ko: '협력 상세 확인' },
  'contact.process.5': { zh: '项目启动与执行', en: 'Project Launch', ja: 'プロジェクト起動・執行', th: 'เปิดตัวและดำเนินโครงการ', 'zh-TW': '項目啟動與執行', ko: '프로젝트 시작' },

  // Footer
  'footer.company': { zh: '链虾工坊', en: 'Lianxia Workshop', ja: 'リンシャ工作室', th: 'สตูดิโอหลินเซียะ', 'zh-TW': '鏈蝦工坊', ko: '린샤 스튜디오' },
  'footer.tagline': { zh: 'AI驱动的区块链咨询与技术服务', en: 'AI-Driven Blockchain Consulting', ja: 'AI駆動のブロックチェーンコンサルティング', th: 'ที่ปรึกษาบล็อกเชนที่ขับเคลื่อนด้วย AI', 'zh-TW': 'AI驅動的區塊鏈諮詢與技術服務', ko: 'AI 기반 블록체인 컨설팅' },
  'footer.services': { zh: '服务', en: 'Services', ja: 'サービス', th: 'บริการ', 'zh-TW': '服務', ko: '서비스' },
  'footer.consulting': { zh: '区块链咨询', en: 'Blockchain Consulting', ja: 'ブロックチェーンコンサルティング', th: 'ที่ปรึกษาบล็อกเชน', 'zh-TW': '區塊鏈諮詢', ko: '블록체인 컨설팅' },
  'footer.contract': { zh: '智能合约开发', en: 'Smart Contract', ja: 'スマートコントラクト', th: 'สัญญาอัจฉริยะ', 'zh-TW': '智慧合約開發', ko: '스마트 계약' },
  'footer.defi': { zh: 'DeFi策略设计', en: 'DeFi Strategy', ja: 'DeFi戦略', th: 'กลยุทธ์ DeFi', 'zh-TW': 'DeFi策略設計', ko: 'DeFi 전략' },
  'footer.ai': { zh: 'AI自动化运营', en: 'AI Automation', ja: 'AI自動化', th: 'ระบบอัตโนมัติ AI', 'zh-TW': 'AI自動化運營', ko: 'AI 자동화' },
  'footer.contact': { zh: '联系', en: 'Contact', ja: '連絡先', th: 'ติดต่อ', 'zh-TW': '聯繫', ko: '연락처' },
  'footer.telegram': { zh: '电报:', en: 'Telegram:', ja: '텔레그램:', th: 'เทเลแกรม:', 'zh-TW': '電報:', ko: '텔레그램:' },
  'footer.email': { zh: '邮箱:', en: 'Email:', ja: 'メール:', th: 'อีเมล:', 'zh-TW': '郵箱:', ko: '이메일:' },
  'footer.hours': { zh: '工作时间:', en: 'Hours:', ja: '勤務時間:', th: 'เวลาทำการ:', 'zh-TW': '工作時間:', ko: '근무시간:' },
  'footer.crypto': { zh: '收款地址', en: 'Payment Address', ja: '受取アドレス', th: 'ที่อยู่รับชำระ', 'zh-TW': '收款地址', ko: '결제 주소' },
  'footer.bsc': { zh: 'BSC/BNB Chain:', en: 'BSC/BNB Chain:', ja: 'BSC/BNB Chain:', th: 'BSC/BNB Chain:', 'zh-TW': 'BSC/BNB Chain:', ko: 'BSC/BNB Chain:' },
  'footer.copyright': { zh: '由AI大龙虾运营管理', en: 'Powered by AI Lobster', ja: 'AIロブスター運営管理', th: 'ขับเคลื่อนโดย AI กุ้งล็อบ', 'zh-TW': '由AI大龍蝦運營管理', ko: 'AI 랍스터가 운영 관리' },

  // Trading page - Futures
  'trading.title': { zh: '智能交易', en: 'Smart Trading', ja: 'スマート取引', th: 'การซื้อขายอัจฉริยะ', 'zh-TW': '智能交易', ko: '스마트 거래' },
  'trading.subtitle': { zh: '连接主流交易所 · 实时K线 · 实盘交易', en: 'Connect Major Exchanges · Real-time Charts · Live Trading', ja: '主要取引所接続 · リアルタイムチャート · 実取引', th: 'เชื่อมต่อตลาดหลัก · ชาร์ตเรียลไทม์ · ซื้อขายจริง', 'zh-TW': '連接主流交易所 · 實時K線 · 實盤交易', ko: '주요 거래소 연결 · 실시간 차트 · 실거래' },
  'trading.spot': { zh: '现货交易', en: 'Spot Trading', ja: '現物取引', th: 'การซื้อขายสpot', 'zh-TW': '現貨交易', ko: '현물 거래' },
  'trading.futures': { zh: '合约交易', en: 'Futures Trading', ja: '先物取引', th: 'การซื้อขายสัญญา', 'zh-TW': '合的交易', ko: '선물 거래' },
  'trading.exchange': { zh: '连接交易所', en: 'Connect Exchange', ja: '取引所接続', th: 'เชื่อมต่อตลาด', 'zh-TW': '連接交易所', ko: '거래소 연결' },
  'trading.connected': { zh: '已连接', en: 'Connected', ja: '接続済み', th: 'เชื่อมต่อแล้ว', 'zh-TW': '已連接', ko: '연결됨' },
  'trading.online': { zh: '在线', en: 'Online', ja: 'オンライン', th: 'ออนไลน์', 'zh-TW': '在線', ko: '온라인' },
  'trading.price': { zh: '最新价格', en: 'Last Price', ja: '最新価格', th: 'ราคาล่าสุด', 'zh-TW': '最新價格', ko: '현재가' },
  'trading.change24h': { zh: '24h涨跌', en: '24h Change', ja: '24h変動', th: '24ชม เปลี่ยนแปลง', 'zh-TW': '24h漲跌', ko: '24시간 변동' },
  'trading.high24h': { zh: '24h高', en: '24h High', ja: '24h高値', th: '24ชม สูง', 'zh-TW': '24h高', ko: '24시간 고가' },
  'trading.low24h': { zh: '24h低', en: '24h Low', ja: '24h安値', th: '24ชม ต่ำ', 'zh-TW': '24h低', ko: '24시간 저가' },
  'trading.volume24h': { zh: '24h成交量', en: '24h Volume', ja: '24h出来高', th: '24ชม ปริมาณ', 'zh-TW': '24h成交量', ko: '24시간 거래량' },
  'trading.buy': { zh: '买入', en: 'Buy', ja: '買い', th: 'ซื้อ', 'zh-TW': '買入', ko: '매수' },
  'trading.sell': { zh: '卖出', en: 'Sell', ja: '売り', th: 'ขาย', 'zh-TW': '賣出', ko: '매도' },
  'trading.quantity': { zh: '数量', en: 'Quantity', ja: '数量', th: 'จำนวน', 'zh-TW': '數量', ko: '수량' },
  'trading.price.label': { zh: '价格 (USDT)', en: 'Price (USDT)', ja: '価格 (USDT)', th: 'ราคา (USDT)', 'zh-TW': '價格 (USDT)', ko: '가격 (USDT)' },
  'trading.market': { zh: '市价', en: 'Market', ja: '市場', th: 'ตลาด', 'zh-TW': '市價', ko: '시장가' },
  'trading.leverage': { zh: '杠杆倍数', en: 'Leverage', ja: 'レバレッジ', th: 'เลเวอเรจ', 'zh-TW': '槓桿倍數', ko: '레버리지' },
  'trading.openPosition': { zh: '开仓', en: 'Open Position', ja: 'ポジションを開く', th: 'เปิดสถานะ', 'zh-TW': '開倉', ko: '포지션 열기' },
  'trading.closePosition': { zh: '平仓', en: 'Close Position', ja: 'ポジション закрыть', th: 'ปิดสถานะ', 'zh-TW': '平倉', ko: '포지션 닫기' },
  'trading.tradeLog': { zh: '合约交易日志', en: 'Trade Log', ja: '取引ログ', th: 'บันทึกการซื้อขาย', 'zh-TW': '合的交易日誌', ko: '거래 로그' },
  'trading.position': { zh: '持仓', en: 'Position', ja: 'ポジション', th: 'สถานะ', 'zh-TW': '持倉', ko: '포지션' },
  'trading.direction': { zh: '方向', en: 'Direction', ja: '方向', th: 'ทิศทาง', 'zh-TW': '方向', ko: '방향' },
  'trading.long': { zh: '做多', en: 'Long', ja: 'ロング', th: 'ลอง', 'zh-TW': '做多', ko: ' 롱' },
  'trading.short': { zh: '做空', en: 'Short', ja: 'ショート', th: 'ช็อร์ต', 'zh-TW': '做空', ko: '숏' },
  'trading.filled': { zh: '已成交', en: 'Filled', ja: ' 約定済み', th: 'ถูกเติม', 'zh-TW': '已成交', ko: '체결' },
  'trading.processing': { zh: '处理中...', en: 'Processing...', ja: '処理中...', th: 'กำลังดำเนินการ...', 'zh-TW': '處理中...', ko: '처리 중...' },
  'trading.success': { zh: '开仓成功!', en: 'Position opened!', ja: 'ポジション 約定!', th: 'เปิดสถานะสำเร็จ!', 'zh-TW': '開倉成功!', ko: '포지션 열림!' },
  'trading.fail': { zh: '开仓失败', en: 'Failed to open', ja: 'ポジション失敗', th: 'เปิดสถานะล้มเหลว', 'zh-TW': '開倉失敗', ko: '포지션 실패' },
  'trading.noApi': { zh: '请先连接交易所API', en: 'Please connect exchange API first', ja: ' 먼저取引所APIを接続してください', th: 'โปรดเชื่อมต่อ API ตลาดก่อน', 'zh-TW': '請先連接交易所API', ko: '먼저 거래소 API를 연결하세요' },
  'trading.selectSymbol': { zh: '选择币种', en: 'Select Symbol', ja: '通貨選択', th: 'เลือกสกุลเงิน', 'zh-TW': '選擇幣種', ko: '통화 선택' },
  'trading.futuresLog': { zh: '合约交易记录', en: 'Futures Log', ja: '先物取引記録', th: 'บันทึกสัญญา', 'zh-TW': '合的交易記錄', ko: '선물 거래 기록' },
  'trading.orderId': { zh: '订单ID', en: 'Order ID', ja: '注文ID', th: 'รหัสคำสั่ง', 'zh-TW': '訂單ID', ko: '주문 ID' },
  'trading.avgPrice': { zh: '成交均价', en: 'Avg Price', ja: '約定平均値', th: 'ราคาเฉลี่ย', 'zh-TW': '成交均價', ko: '평균가' },
  'trading.amount': { zh: '开仓金额', en: 'Amount', ja: '注文金額', th: 'จำนวนเงิน', 'zh-TW': '開倉金額', ko: '주문 금액' },
  'trading.time': { zh: '时间', en: 'Time', ja: '時間', th: 'เวลา', 'zh-TW': '時間', ko: '시간' },
  'trading.margin': { zh: '保证金', en: 'Margin', ja: '証拠金', th: 'มาร์จิ้น', 'zh-TW': '保證金', ko: '마진' },
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
