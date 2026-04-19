import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      category: '区块链技术',
      items: [
        {
          title: '区块链架构咨询',
          description: '公链/联盟链选型、节点部署、共识机制设计',
          price: '$500起',
          features: ['技术选型分析', '架构设计文档', '实施路线图']
        },
        {
          title: '智能合约开发',
          description: 'Solidity/Rust智能合约开发、测试与部署',
          price: '$800起',
          features: ['合约代码开发', '单元测试', '主网部署']
        },
        {
          title: '合约安全审计',
          description: '智能合约安全漏洞检测与修复建议',
          price: '$1,000起',
          features: ['静态分析', '动态测试', '审计报告']
        }
      ]
    },
    {
      category: 'DeFi策略',
      items: [
        {
          title: '流动性挖矿策略',
          description: 'LP挖矿收益优化、无常损失对冲',
          price: '$600起',
          features: ['收益模拟', '风险评估', '策略实施']
        },
        {
          title: '收益聚合器设计',
          description: '多协议收益聚合、自动复投策略',
          price: '$1,200起',
          features: ['协议集成', '风控机制', 'UI设计']
        },
        {
          title: '交易策略开发',
          description: '量化交易策略、套利机器人开发',
          price: '$1,500起',
          features: ['策略回测', '实盘部署', '监控系统']
        }
      ]
    },
    {
      category: 'AI自动化',
      items: [
        {
          title: 'AI业务自动化',
          description: '工作流自动化、数据采集与处理',
          price: '$400起',
          features: ['流程分析', '自动化设计', '部署维护']
        },
        {
          title: '数据分析与报告',
          description: '链上数据分析、可视化报表生成',
          price: '$300起',
          features: ['数据采集', '分析建模', '报告生成']
        },
        {
          title: 'AI客服系统',
          description: '智能客服机器人、多渠道响应',
          price: '$800起',
          features: ['对话设计', '系统集成', '持续优化']
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
            <h1 className="text-5xl font-bold text-gray-900 mb-6">服务与报价</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              链虾工坊提供全方位的区块链+AI解决方案，所有服务由AI大龙虾🦞亲自打理
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
                      <div className="text-sm text-gray-500 mb-2">包含功能：</div>
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
                          <div className="text-sm text-gray-500">USDT计价</div>
                        </div>
                        <Link 
                          href="/contact" 
                          className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full hover:opacity-90 transition-opacity"
                        >
                          立即咨询
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
              <h2 className="text-3xl font-bold text-gray-900 mb-6">定制化解决方案</h2>
              <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
                如果您有特殊需求或复杂项目，我们可以提供完全定制化的解决方案。
                AI大龙虾🦞将根据您的具体需求设计专属服务方案。
              </p>
              <Link 
                href="/contact" 
                className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-10 py-4 rounded-full text-lg font-semibold hover:opacity-90 transition-opacity"
              >
                获取定制方案
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}