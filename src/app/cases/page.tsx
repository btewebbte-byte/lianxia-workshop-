import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function CasesPage() {
  const cases = [
    {
      title: 'DeFi收益聚合器开发',
      client: '某加密基金',
      challenge: '需要自动化管理多个DeFi协议的流动性挖矿，优化收益并降低无常损失风险。',
      solution: '开发定制化收益聚合器，集成5个主流DeFi协议，实现智能资金分配和自动复投。',
      results: [
        '年化收益率提升42%',
        '无常损失降低35%',
        '管理成本减少60%'
      ],
      tags: ['DeFi', '智能合约', '收益优化']
    },
    {
      title: 'NFT交易平台智能合约审计',
      client: 'NFT初创公司',
      challenge: '平台即将上线，需要确保智能合约安全，防止常见漏洞和攻击。',
      solution: '全面安全审计，包括静态分析、动态测试和手动代码审查，提供详细修复建议。',
      results: [
        '发现并修复12个安全漏洞',
        '通过3家第三方审计机构验证',
        '平台安全上线零事故'
      ],
      tags: ['NFT', '安全审计', '智能合约']
    },
    {
      title: '区块链供应链溯源系统',
      client: '传统制造企业',
      challenge: '需要透明、不可篡改的供应链追溯系统，提升产品可信度。',
      solution: '基于联盟链的溯源系统，实现从原材料到成品的全流程追踪。',
      results: [
        '溯源查询时间从小时级降至秒级',
        '供应链透明度提升90%',
        '客户信任度显著提高'
      ],
      tags: ['联盟链', '供应链', '溯源']
    },
    {
      title: 'AI驱动的交易策略开发',
      client: '量化交易团队',
      challenge: '需要开发基于机器学习的加密货币交易策略，实现稳定收益。',
      solution: '构建ML交易模型，集成链上数据和市场情绪分析，开发自动化交易系统。',
      results: [
        '策略回测年化收益68%',
        '实盘运行3个月收益32%',
        '最大回撤控制在15%以内'
      ],
      tags: ['量化交易', '机器学习', '自动化']
    },
    {
      title: 'DAO治理系统设计',
      client: 'DeFi社区',
      challenge: '社区需要去中心化治理系统，实现公平投票和资金管理。',
      solution: '设计并开发基于智能合约的DAO治理系统，支持提案、投票和资金分配。',
      results: [
        '治理参与率提升至75%',
        '提案处理效率提高3倍',
        '社区满意度达92%'
      ],
      tags: ['DAO', '治理', '社区']
    },
    {
      title: '跨链桥安全增强',
      client: '跨链协议项目',
      challenge: '现有跨链桥存在安全风险，需要全面安全评估和加固。',
      solution: '深度安全审计，设计多重签名和监控机制，实施漏洞修复方案。',
      results: [
        '安全等级达到行业领先水平',
        '通过CertiK全面审计',
        '用户资产零损失'
      ],
      tags: ['跨链', '安全', '基础设施']
    }
  ];

  const testimonials = [
    {
      quote: 'AI大龙虾提供的DeFi策略让我们的基金收益率大幅提升，而且7x24小时的服务响应速度远超传统咨询公司。',
      author: '某加密基金负责人',
      role: '资产管理总监'
    },
    {
      quote: '合约审计非常专业细致，发现了很多我们忽略的安全隐患。现在我们的NFT平台运行非常稳定。',
      author: 'NFT项目创始人',
      role: '技术负责人'
    },
    {
      quote: '链虾工坊的AI驱动模式让我们以传统咨询1/3的成本获得了更好的服务体验，强烈推荐！',
      author: '制造企业CIO',
      role: '首席信息官'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Navbar />
      
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-900 mb-6">成功案例</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              探索链虾工坊为各行业客户提供的区块链+AI解决方案，见证AI驱动的专业服务成果。
            </p>
          </div>

          {/* Cases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {cases.map((caseItem, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="p-8">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {caseItem.tags.map((tag, idx) => (
                      <span key={idx} className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{caseItem.title}</h3>
                  <div className="text-gray-500 mb-4">客户：{caseItem.client}</div>
                  
                  <div className="mb-6">
                    <div className="text-sm text-gray-500 mb-2">挑战：</div>
                    <p className="text-gray-700">{caseItem.challenge}</p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="text-sm text-gray-500 mb-2">解决方案：</div>
                    <p className="text-gray-700">{caseItem.solution}</p>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-2">成果：</div>
                    <ul className="space-y-2">
                      {caseItem.results.map((result, idx) => (
                        <li key={idx} className="flex items-center text-gray-700">
                          <span className="text-green-500 mr-2">✓</span>
                          {result}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Testimonials */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">客户评价</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                  <div className="text-4xl text-gray-200 mb-4">"</div>
                  <p className="text-gray-700 italic mb-6">{testimonial.quote}</p>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.author}</div>
                    <div className="text-gray-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Process Section */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">AI驱动的工作流程</h2>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                链虾工坊采用独特的AI驱动工作模式，确保每个项目都获得最优解决方案。
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">需求分析</h3>
                <p className="text-gray-600">AI大龙虾深度理解客户需求，进行技术可行性分析。</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">2</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">方案设计</h3>
                <p className="text-gray-600">基于海量案例数据，生成最优技术方案和架构设计。</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">3</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">实施执行</h3>
                <p className="text-gray-600">AI指导开发过程，确保代码质量和项目进度。</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-white">4</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">持续优化</h3>
                <p className="text-gray-600">项目交付后持续监控优化，确保长期稳定运行。</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">开始您的成功案例</h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              无论您的项目规模大小，AI大龙虾都能为您提供专业的区块链+AI解决方案。
            </p>
            <a 
              href="/contact" 
              className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-5 rounded-full text-xl font-semibold hover:opacity-90 transition-opacity shadow-lg"
            >
              立即咨询
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}