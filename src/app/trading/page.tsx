"use client";

import { useState } from "react";

type Exchange = "binance" | "okx" | "bybit" | "bitget" | "gate";
type TradingMode = "manual" | "auto";

interface ExchangeConfig {
  name: string;
  icon: string;
  color: string;
  apiPlaceholder: string;
  supported: boolean;
}

interface Strategy {
  id: string;
  name: string;
  description: string;
  risk: "low" | "medium" | "high";
  performance: string;
}

const exchanges: Record<Exchange, ExchangeConfig> = {
  binance: {
    name: "Binance",
    icon: "₿",
    color: "from-yellow-400 to-yellow-600",
    apiPlaceholder: "Binance API Key",
    supported: true,
  },
  okx: {
    name: "OKX",
    icon: "◯",
    color: "from-blue-500 to-blue-700",
    apiPlaceholder: "OKX API Key",
    supported: true,
  },
  bybit: {
    name: "Bybit",
    icon: "▣",
    color: "from-amber-400 to-amber-600",
    apiPlaceholder: "Bybit API Key",
    supported: true,
  },
  bitget: {
    name: "Bitget",
    icon: "◇",
    color: "from-green-400 to-green-600",
    apiPlaceholder: "Bitget API Key",
    supported: true,
  },
  gate: {
    name: "Gate.io",
    icon: "◈",
    color: "from-blue-400 to-cyan-500",
    apiPlaceholder: "Gate.io API Key",
    supported: true,
  },
};

const strategies: Strategy[] = [
  {
    id: "grid",
    name: "网格策略",
    description: "在价格区间内自动低买高卖，适合震荡行情",
    risk: "low",
    performance: "日化 0.5-2%",
  },
  {
    id: "dca",
    name: "定投策略",
    description: "定期定额买入，均摊成本，长期持有",
    risk: "low",
    performance: "日化 0.1-0.5%",
  },
  {
    id: "momentum",
    name: "动量策略",
    description: "追涨杀跌，趋势跟踪，顺势而为",
    risk: "medium",
    performance: "日化 1-5%",
  },
  {
    id: "套利",
    name: "套利策略",
    description: "跨交易所价差套利，对冲风险",
    risk: "low",
    performance: "日化 0.3-1%",
  },
];

export default function TradingPage() {
  const [selectedExchanges, setSelectedExchanges] = useState<Exchange[]>([]);
  const [tradingMode, setTradingMode] = useState<TradingMode>("manual");
  const [apiKeys, setApiKeys] = useState<Record<string, { apiKey: string; secretKey: string; passphrase: string }>>({});
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [showApiModal, setShowApiModal] = useState<Exchange | null>(null);
  const [selectedStrategy, setSelectedStrategy] = useState<string | null>(null);
  const [orderBook, setOrderBook] = useState<{ bids: [number, number][]; asks: [number, number][] }>({
    bids: [[95000, 1.5], [94900, 2.3], [94800, 1.8], [94700, 0.9], [94600, 1.2]],
    asks: [[95100, 2.1], [95200, 1.6], [95300, 2.8], [95400, 1.1], [95500, 0.7]],
  });
  const [manualOrder, setManualOrder] = useState<{ type: "buy" | "sell"; amount: string; price: string }>({ type: "buy", amount: "", price: "" });

  const toggleExchange = (exchange: Exchange) => {
    setSelectedExchanges((prev) =>
      prev.includes(exchange) ? prev.filter((e) => e !== exchange) : [...prev, exchange]
    );
  };

  const handleConnect = (exchange: Exchange) => {
    setShowApiModal(exchange);
  };

  const handleApiSubmit = (exchange: Exchange, keys: { apiKey: string; secretKey: string; passphrase: string }) => {
    setApiKeys((prev) => ({ ...prev, [exchange]: keys }));
    setConnected((prev) => ({ ...prev, [exchange]: true }));
    setShowApiModal(null);
  };

  const handleManualOrder = (type: "buy" | "sell") => {
    if (!manualOrder.amount) return;
    alert(`${type === "buy" ? "买入" : "卖出"}订单已提交\n数量: ${manualOrder.amount}\n价格: ${manualOrder.price || "市价"}`);
    setManualOrder({ type: "buy", amount: "", price: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">
      <Navbar />
      
      {/* Header */}
      <div className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">
                智能交易<span className="text-blue-400">终端</span>
              </h1>
              <p className="text-gray-400 mt-2">连接主流交易所，一个平台管理所有仓位</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                系统运行中
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Trading Mode Selector */}
          <div className="bg-gradient-to-r from-blue-900/50 to-cyan-900/50 rounded-2xl p-2 border border-blue-500/30">
            <div className="flex">
              <button
                onClick={() => setTradingMode("manual")}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${
                  tradingMode === "manual"
                    ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>📊</span> 手动交易
                </span>
              </button>
              <button
                onClick={() => setTradingMode("auto")}
                className={`flex-1 py-4 px-6 rounded-xl font-semibold transition-all ${
                  tradingMode === "auto"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <span>🤖</span> 自动策略
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Exchange Connection */}
            <div className="lg:col-span-1 space-y-6">
              {/* Exchange Connection Card */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400">
                    🔗
                  </span>
                  连接交易所
                </h2>
                
                <div className="space-y-3">
                  {(Object.keys(exchanges) as Exchange[]).map((exchange) => {
                    const config = exchanges[exchange];
                    const isSelected = selectedExchanges.includes(exchange);
                    const isConnected = connected[exchange];
                    
                    return (
                      <div
                        key={exchange}
                        className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "border-blue-500 bg-blue-500/10"
                            : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                        } ${isConnected ? "border-green-500/50 bg-green-500/5" : ""}`}
                        onClick={() => !isConnected && toggleExchange(exchange)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center text-white font-bold`}>
                              {config.icon}
                            </div>
                            <div>
                              <div className="text-white font-medium">{config.name}</div>
                              <div className="text-xs text-gray-500">
                                {isConnected ? (
                                  <span className="text-green-400">✓ 已连接</span>
                                ) : isSelected ? (
                                  <span className="text-blue-400">已选择</span>
                                ) : (
                                  "点击选择"
                                )}
                              </div>
                            </div>
                          </div>
                          {!isConnected && isSelected && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleConnect(exchange);
                              }}
                              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                              导入API
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Connected Exchanges Status */}
              {Object.entries(connected).length > 0 && (
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-green-500/30">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <span className="text-green-400">✓</span> 已连接平台
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(connected).map(([exchange, isConn]) => {
                      if (!isConn) return null;
                      const config = exchanges[exchange as Exchange];
                      return (
                        <div key={exchange} className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center text-white text-sm font-bold`}>
                              {config.icon}
                            </div>
                            <span className="text-white">{config.name}</span>
                          </div>
                          <span className="text-green-400 text-sm">在线</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Center/Right Column - Trading Interface */}
            <div className="lg:col-span-2 space-y-6">
              {tradingMode === "manual" ? (
                <>
                  {/* Manual Trading Card */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center text-cyan-400">
                        📊
                      </span>
                      手动下单
                    </h2>

                    {/* Trading Pair */}
                    <div className="bg-slate-700/50 rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                            ₿
                          </div>
                          <div>
                            <div className="text-2xl font-bold text-white">BTC/USDT</div>
                            <div className="text-gray-400">Binance</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-bold text-white">$95,234.50</div>
                          <div className="text-green-400">+$1,234.56 (+1.31%)</div>
                        </div>
                      </div>
                    </div>

                    {/* Order Book */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-slate-700/30 rounded-xl p-4">
                        <div className="text-sm text-gray-400 mb-2">买入订单簿</div>
                        <div className="space-y-1">
                          {orderBook.bids.map(([price, amount], i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-green-400">${price.toLocaleString()}</span>
                              <span className="text-gray-300">{amount} BTC</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="bg-slate-700/30 rounded-xl p-4">
                        <div className="text-sm text-gray-400 mb-2">卖出订单簿</div>
                        <div className="space-y-1">
                          {orderBook.asks.map(([price, amount], i) => (
                            <div key={i} className="flex justify-between text-sm">
                              <span className="text-red-400">${price.toLocaleString()}</span>
                              <span className="text-gray-300">{amount} BTC</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Buy/Sell Buttons */}
                    <div className="flex gap-4 mb-6">
                      <button
                        onClick={() => setManualOrder({ ...manualOrder, type: "buy" })}
                        className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
                          manualOrder.type === "buy"
                            ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30"
                            : "bg-slate-700 text-gray-400 hover:bg-slate-600"
                        }`}
                      >
                        买入 BTC
                      </button>
                      <button
                        onClick={() => setManualOrder({ ...manualOrder, type: "sell" })}
                        className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all ${
                          manualOrder.type === "sell"
                            ? "bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30"
                            : "bg-slate-700 text-gray-400 hover:bg-slate-600"
                        }`}
                      >
                        卖出 BTC
                      </button>
                    </div>

                    {/* Order Form */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">数量 (BTC)</label>
                        <input
                          type="number"
                          value={manualOrder.amount}
                          onChange={(e) => setManualOrder({ ...manualOrder, amount: e.target.value })}
                          placeholder="0.00"
                          className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-sm text-gray-400 mb-2 block">价格 (USDT)</label>
                        <input
                          type="number"
                          value={manualOrder.price}
                          onChange={(e) => setManualOrder({ ...manualOrder, price: e.target.value })}
                          placeholder="市价"
                          className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => handleManualOrder(manualOrder.type)}
                      className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all ${
                        manualOrder.type === "buy"
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                          : "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white"
                      }`}
                    >
                      {manualOrder.type === "buy" ? "买入" : "卖出"} BTC
                    </button>
                  </div>

                  {/* Recent Orders */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
                    <h3 className="text-lg font-bold text-white mb-4">近期订单</h3>
                    <div className="space-y-3">
                      {[
                        { type: "buy", amount: "0.5", price: "94,500", time: "10:23:45", status: "已完成" },
                        { type: "sell", amount: "0.3", price: "96,200", time: "09:15:30", status: "已完成" },
                        { type: "buy", amount: "0.1", price: "93,800", time: "08:45:12", status: "已完成" },
                      ].map((order, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-xl">
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              order.type === "buy" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                            }`}>
                              {order.type === "buy" ? "买入" : "卖出"}
                            </span>
                            <span className="text-white">{order.amount} BTC</span>
                            <span className="text-gray-400">@ ${order.price}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-gray-500 text-sm">{order.time}</span>
                            <span className="text-green-400 text-sm">{order.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Auto Strategy Card */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                      <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400">
                        🤖
                      </span>
                      自动策略
                    </h2>
                    <p className="text-gray-400 mb-6">
                      选择一个或多个策略，AI将自动执行交易。选择策略后系统会根据市场行情自动调整参数。
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {strategies.map((strategy) => (
                        <div
                          key={strategy.id}
                          className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                            selectedStrategy === strategy.id
                              ? "border-green-500 bg-green-500/10"
                              : "border-slate-700 bg-slate-700/30 hover:border-slate-600"
                          }`}
                          onClick={() => setSelectedStrategy(strategy.id)}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center text-white">
                                {strategy.id === "grid" && "📊"}
                                {strategy.id === "dca" && "💰"}
                                {strategy.id === "momentum" && "🚀"}
                                {strategy.id === "套利" && "⚡"}
                              </div>
                              <div>
                                <div className="text-white font-semibold">{strategy.name}</div>
                                <div className={`text-xs ${
                                  strategy.risk === "low" ? "text-green-400" :
                                  strategy.risk === "medium" ? "text-yellow-400" : "text-red-400"
                                }`}>
                                  风险: {strategy.risk === "low" ? "低" : strategy.risk === "medium" ? "中" : "高"}
                                </div>
                              </div>
                            </div>
                            {selectedStrategy === strategy.id && (
                              <span className="text-green-400">✓</span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm mb-3">{strategy.description}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">预期收益</span>
                            <span className="text-green-400 font-medium">{strategy.performance}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      disabled={!selectedStrategy}
                      className={`w-full mt-6 py-4 rounded-xl font-bold text-lg transition-all ${
                        selectedStrategy
                          ? "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                          : "bg-slate-700 text-gray-500 cursor-not-allowed"
                      }`}
                    >
                      启动策略
                    </button>
                  </div>

                  {/* Strategy Stats */}
                  <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
                    <h3 className="text-lg font-bold text-white mb-6">策略运行状态</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-green-400">+12.5%</div>
                        <div className="text-gray-400 text-sm mt-1">总收益率</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-blue-400">156</div>
                        <div className="text-gray-400 text-sm mt-1">累计交易</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-white">78.5%</div>
                        <div className="text-gray-400 text-sm mt-1">胜率</div>
                      </div>
                      <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                        <div className="text-3xl font-bold text-cyan-400">2.35</div>
                        <div className="text-gray-400 text-sm mt-1">盈亏比</div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Market Overview */}
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
                <h3 className="text-lg font-bold text-white mb-4">市场概览</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { name: "BTC", price: "$95,234", change: "+1.31%", up: true },
                    { name: "ETH", price: "$3,456", change: "+2.45%", up: true },
                    { name: "SOL", price: "$178.90", change: "-0.82%", up: false },
                    { name: "DOGE", price: "$0.234", change: "+5.67%", up: true },
                  ].map((coin, i) => (
                    <div key={i} className="bg-slate-700/50 rounded-xl p-4">
                      <div className="text-gray-400 text-sm">{coin.name}</div>
                      <div className="text-white font-bold mt-1">{coin.price}</div>
                      <div className={`text-sm mt-1 ${coin.up ? "text-green-400" : "text-red-400"}`}>
                        {coin.change}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Import Modal */}
      {showApiModal && (
        <ApiModal
          exchange={showApiModal}
          config={exchanges[showApiModal]}
          onClose={() => setShowApiModal(null)}
          onSubmit={(keys) => handleApiSubmit(showApiModal, keys)}
        />
      )}
    </div>
  );
}

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md z-50 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🦞</span>
              </div>
              <span className="text-xl font-bold text-white">链虾工坊</span>
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="/" className="text-gray-300 hover:text-white transition-colors">
              首页
            </a>
            <a href="/services" className="text-gray-300 hover:text-white transition-colors">
              服务
            </a>
            <a href="/cases" className="text-gray-300 hover:text-white transition-colors">
              案例
            </a>
            <a href="/about" className="text-gray-300 hover:text-white transition-colors">
              关于
            </a>
            <a 
              href="/trading" 
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full hover:opacity-90 transition-opacity"
            >
              智能交易
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function ApiModal({
  exchange,
  config,
  onClose,
  onSubmit,
}: {
  exchange: Exchange;
  config: ExchangeConfig;
  onClose: () => void;
  onSubmit: (keys: { apiKey: string; secretKey: string; passphrase: string }) => void;
}) {
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [passphrase, setPassphrase] = useState("");

  const handleSubmit = () => {
    if (!apiKey || !secretKey) return;
    onSubmit({ apiKey, secretKey, passphrase });
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-slate-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center text-white font-bold`}>
              {config.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">导入 {config.name} API</h3>
              <p className="text-xs text-gray-500">安全连接您的账户</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">API Key</label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="请输入 API Key"
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Secret Key</label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              placeholder="请输入 Secret Key"
              className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          {exchange === "okx" && (
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Passphrase</label>
              <input
                type="password"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="请输入 Passphrase"
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
              />
            </div>
          )}
        </div>

        <div className="mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-yellow-400 text-sm">
            ⚠️ 请确保API权限只开启交易权限，不要开启提币权限
          </p>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleSubmit}
            disabled={!apiKey || !secretKey}
            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            连接
          </button>
        </div>
      </div>
    </div>
  );
}
