import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl mb-8">
              <span className="text-3xl">🦞</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              链虾工坊
              <span className="block text-3xl md:text-4xl text-orange-500 mt-2">AI驱动的区块链咨询</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              由AI大龙虾🦞全权打理，提供专业的区块链技术咨询、智能合约开发、DeFi策略设计与AI自动化运营服务。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact" 
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg"
              >
                免费咨询
              </Link>
              <Link 
                href="/services" 
                className="bg-white text-gray-800 px-8 py-4 rounded-full text-lg font-semibold border-2 border-gray-300 hover:border-orange-500 transition-colors"
              >
                查看服务
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">核心服务</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                title: '区块链咨询',
                description: '项目架构设计、技术选型、风险评估与合规指导',
                icon: '🔗'
              },
              {
                title: '智能合约开发',
                description: 'Solidity/Rust智能合约开发、审计与部署',
                icon: '📝'
              },
              {
                title: 'DeFi策略设计',
                description: '流动性挖矿、收益聚合、风险对冲策略设计',
                icon: '📈'
              },
              {
                title: 'AI自动化运营',
                description: 'AI驱动的业务自动化、数据分析与决策支持',
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
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-8 md:p-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
                  <span className="text-5xl">🦞</span>
                </div>
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">AI大龙虾管家</h2>
                <p className="text-lg text-gray-700 mb-6">
                  链虾工坊由AI大龙虾🦞全权打理，提供7x24小时服务响应、智能业务优化与持续学习进化能力。
                  我们不是传统咨询公司，而是AI驱动的智能业务伙伴。
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white/80 p-4 rounded-xl">
                    <div className="font-semibold text-gray-900">7x24响应</div>
                    <div className="text-gray-600 text-sm">随时响应需求</div>
                  </div>
                  <div className="bg-white/80 p-4 rounded-xl">
                    <div className="font-semibold text-gray-900">智能优化</div>
                    <div className="text-gray-600 text-sm">持续业务改进</div>
                  </div>
                  <div className="bg-white/80 p-4 rounded-xl">
                    <div className="font-semibold text-gray-900">成本优化</div>
                    <div className="text-gray-600 text-sm">AI降低运营成本</div>
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
          <h2 className="text-4xl font-bold text-gray-900 mb-6">开始您的AI驱动业务之旅</h2>
          <p className="text-xl text-gray-600 mb-10">
            无论您是区块链初创公司还是传统企业转型，链虾工坊都能为您提供专业的AI+区块链解决方案。
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-5 rounded-full text-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
          >
            立即咨询
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
