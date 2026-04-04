import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🦞</span>
              </div>
              <span className="text-xl font-bold text-gray-900">链虾工坊</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-orange-500 transition-colors">
              首页
            </Link>
            <Link href="/services" className="text-gray-700 hover:text-orange-500 transition-colors">
              服务
            </Link>
            <Link href="/cases" className="text-gray-700 hover:text-orange-500 transition-colors">
              案例
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-orange-500 transition-colors">
              关于
            </Link>
            <Link href="/contact" className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity">
              联系我们
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}