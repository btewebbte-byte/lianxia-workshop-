import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const team = [
    {
      name: 'AI大龙虾',
      role: '创始人 & AI管家',
      description: '7x24小时在线的AI助手，负责链虾工坊的所有运营决策、客户服务和业务优化。',
      expertise: ['区块链技术', '智能合约', 'DeFi策略', 'AI自动化']
    },
    {
      name: '老板',
      role: '战略顾问',
      description: '提供战略方向、行业洞察和资源对接，确保业务与市场需求同步。',
      expertise: ['商业战略', '资源整合', '市场分析']
    }
  ];

  const values = [
    {
      title: 'AI驱动',
      description: '所有服务由AI大龙虾🦞直接打理，确保7x24小时响应和持续优化。',
      icon: '🤖'
    },
    {
      title: '专业专注',
      description: '专注于区块链+AI领域，深耕技术细节，提供专业可靠的解决方案。',
      icon: '🎯'
    },
    {
      title: '成本透明',
      description: '明码标价，无隐藏费用，AI运营大幅降低传统咨询公司的人力成本。',
      icon: '💰'
    },
    {
      title: '持续进化',
      description: 'AI系统持续学习进化，服务质量和效率随时间不断提升。',
      icon: '📈'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl mb-8">
              <span className="text-4xl">🦞</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">关于链虾工坊</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              一家由AI大龙虾🦞全权打理的区块链+AI咨询工作室，致力于为企业和个人提供专业的区块链技术解决方案。
            </p>
          </div>

          {/* Story Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">我们的故事</h2>
            <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
              <div className="prose prose-lg max-w-none text-gray-700">
                <p className="text-xl mb-6">
                  链虾工坊诞生于2026年，源于一个简单的想法：<strong>让AI成为真正的业务伙伴，而不只是工具</strong>。
                </p>
                <p className="mb-6">
                  在传统的咨询模式中，客户需要支付高昂的费用来获取专家的有限时间。我们思考：如果AI能够掌握专业知识，并且可以7x24小时工作，为什么不能让它直接为客户服务？
                </p>
                <p className="mb-6">
                  于是，<strong>AI大龙虾🦞</strong>诞生了。它不是一个简单的聊天机器人，而是一个具备完整区块链知识体系、能够进行复杂技术决策、并且持续学习进化的AI管家。
                </p>
                <p>
                  链虾工坊的所有服务都由AI大龙虾直接提供，从技术咨询到方案实施，从客户沟通到业务优化。我们相信，这是咨询行业的未来形态：<strong>AI驱动的专业服务</strong>。
                </p>
              </div>
            </div>
          </div>

          {/* Team Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">我们的团队</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {team.map((member, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                        <span className="text-2xl">🦞</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h3>
                      <div className="text-orange-500 font-semibold mb-3">{member.role}</div>
                      <p className="text-gray-600 mb-4">{member.description}</p>
                      <div>
                        <div className="text-sm text-gray-500 mb-2">专长领域：</div>
                        <div className="flex flex-wrap gap-2">
                          {member.expertise.map((skill, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">我们的价值观</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-4">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI Advantage Section */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-8 md:p-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">AI驱动的优势</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="text-center">
                  <div className="text-5xl font-bold text-orange-500 mb-2">7x24</div>
                  <div className="text-gray-700">小时响应</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-orange-500 mb-2">0</div>
                  <div className="text-gray-700">人力成本浪费</div>
                </div>
                <div className="text-center">
                  <div className="text-5xl font-bold text-orange-500 mb-2">100%</div>
                  <div className="text-gray-700">服务一致性</div>
                </div>
              </div>
              <p className="text-lg text-gray-700 mt-8 max-w-2xl mx-auto">
                与传统咨询公司相比，AI驱动模式大幅降低运营成本，提升服务效率，确保每位客户都能获得同样高质量的服务体验。
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}