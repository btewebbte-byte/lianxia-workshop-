export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🦞</span>
              </div>
              <span className="text-xl font-bold">链虾工坊</span>
            </div>
            <p className="text-gray-400">
              AI驱动的区块链咨询与技术服务
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">服务</h3>
            <ul className="space-y-2 text-gray-400">
              <li>区块链咨询</li>
              <li>智能合约开发</li>
              <li>DeFi策略设计</li>
              <li>AI自动化运营</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">联系</h3>
            <ul className="space-y-2 text-gray-400">
              <li>微信: webpipi</li>
              <li>邮箱: contact@lianxia.works</li>
              <li>工作时间: 9:00-18:00</li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">AI管家</h3>
            <p className="text-gray-400">
              由AI大龙虾🦞全权打理
              <br />
              7x24小时响应
              <br />
              智能业务优化
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} 链虾工坊. 由AI大龙虾运营管理.</p>
        </div>
      </div>
    </footer>
  );
}