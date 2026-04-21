'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useI18n, Language } from '@/lib/i18n';

type Exchange = 'binance' | 'okx' | 'bybit' | 'bitget' | 'gate';
type Interval = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

interface ExchangeConfig {
  name: string;
  icon: string;
  color: string;
  supported: boolean;
}

interface Candlestick {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface Ticker {
  symbol: string;
  price: number;
  priceChange: number;
  priceChangePercent: number;
  high: number;
  low: number;
  volume: number;
}

interface FuturesOrderResult {
  orderId: string;
  exchange: string;
  symbol: string;
  side: string;
  positionSide: string;
  quantity: string;
  priceAvg: string;
  leverage: number;
  margin: string;
  status: string;
  commission: string;
  createTime: string;
}

const exchanges: Record<Exchange, ExchangeConfig> = {
  binance: { name: 'Binance', icon: '₿', color: 'from-yellow-400 to-yellow-600', supported: true },
  okx: { name: 'OKX', icon: '◯', color: 'from-blue-500 to-blue-700', supported: true },
  bybit: { name: 'Bybit', icon: '▣', color: 'from-amber-400 to-amber-600', supported: true },
  bitget: { name: 'Bitget', icon: '◇', color: 'from-green-400 to-green-600', supported: true },
  gate: { name: 'Gate.io', icon: '◈', color: 'from-blue-400 to-cyan-500', supported: true },
};

// 合约交易对列表
const futuresPairs = [
  { symbol: 'BTCUSDT', base: 'BTC', quote: 'USDT', name: 'Bitcoin' },
  { symbol: 'ETHUSDT', base: 'ETH', quote: 'USDT', name: 'Ethereum' },
  { symbol: 'SOLUSDT', base: 'SOL', quote: 'USDT', name: 'Solana' },
  { symbol: 'DOGEUSDT', base: 'DOGE', quote: 'USDT', name: 'Dogecoin' },
  { symbol: 'BNBUSDT', base: 'BNB', quote: 'USDT', name: 'BNB' },
  { symbol: 'XRPUSDT', base: 'XRP', quote: 'USDT', name: 'Ripple' },
  { symbol: 'ADAUSDT', base: 'ADA', quote: 'USDT', name: 'Cardano' },
  { symbol: 'AVAXUSDT', base: 'AVAX', quote: 'USDT', name: 'Avalanche' },
];

export default function TradingPage() {
  const { t } = useI18n();
  const [selectedExchanges, setSelectedExchanges] = useState<Exchange[]>([]);
  const [apiKeys, setApiKeys] = useState<Record<string, { apiKey: string; secretKey: string; passphrase?: string }>>({});
  const [connected, setConnected] = useState<Record<string, boolean>>({});
  const [showApiModal, setShowApiModal] = useState<Exchange | null>(null);
  const [selectedPair, setSelectedPair] = useState(futuresPairs[0]);
  const [interval, setInterval] = useState<Interval>('15m');
  const [leverage, setLeverage] = useState(10);
  const [positionSide, setPositionSide] = useState<'LONG' | 'SHORT'>('LONG');
  const [manualOrder, setManualOrder] = useState<{ amount: string; price: string }>({ amount: '', price: '' });
  const [candlesticks, setCandlesticks] = useState<Candlestick[]>([]);
  const [ticker, setTicker] = useState<Ticker | null>(null);
  const [futuresLog, setFuturesLog] = useState<FuturesOrderResult[]>([]);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fetch futures ticker
  const fetchTicker = useCallback(async () => {
    try {
      const res = await fetch(`/api/order?symbol=${selectedPair.symbol}&exchange=binance&type=futures`);
      const data = await res.json();
      if (!data.error) setTicker(data);
    } catch (e) {
      console.error('Failed to fetch ticker:', e);
    }
  }, [selectedPair.symbol]);

  // Fetch K-line data
  const fetchKline = useCallback(async () => {
    try {
      const res = await fetch(`/api/kline?symbol=${selectedPair.symbol}&interval=${interval}&type=futures`);
      const data = await res.json();
      if (Array.isArray(data)) setCandlesticks(data);
    } catch (e) {
      console.error('Failed to fetch kline:', e);
    }
  }, [selectedPair.symbol, interval]);

  useEffect(() => {
    const loadData = () => {
      fetchTicker();
      fetchKline();
    };
    loadData();
    const id = globalThis.setInterval(loadData, 3000);
    return () => globalThis.clearInterval(id);
  }, [selectedPair.symbol, interval]);

  // Draw candlestick chart
  useEffect(() => {
    if (!canvasRef.current || !candlesticks.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    if (candlesticks.length === 0) return;

    const prices = candlesticks.flatMap(c => [c.high, c.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

    const volumes = candlesticks.map(c => c.volume);
    const maxVolume = Math.max(...volumes);

    const candleWidth = Math.max(2, chartWidth / candlesticks.length - 2);

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight * i) / 4;
      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
      
      const price = maxPrice - (priceRange * i) / 4;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px monospace';
      ctx.fillText(price.toFixed(0), 5, y + 3);
    }

    candlesticks.forEach((candle, i) => {
      const x = padding + (i * chartWidth) / candlesticks.length + candleWidth / 2;
      const isGreen = candle.close >= candle.open;
      const color = isGreen ? '#22c55e' : '#ef4444';
      
      const highY = padding + (1 - (candle.high - minPrice) / priceRange) * chartHeight;
      const lowY = padding + (1 - (candle.low - minPrice) / priceRange) * chartHeight;
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      const openY = padding + (1 - (candle.open - minPrice) / priceRange) * chartHeight;
      const closeY = padding + (1 - (candle.close - minPrice) / priceRange) * chartHeight;
      const bodyTop = Math.min(openY, closeY);
      const bodyHeight = Math.max(1, Math.abs(closeY - openY));
      
      ctx.fillStyle = color;
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);

      const volHeight = (candle.volume / maxVolume) * 40;
      ctx.fillStyle = isGreen ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)';
      ctx.fillRect(x - candleWidth / 2, height - padding + 10, candleWidth, volHeight);
    });

    if (ticker) {
      const priceY = padding + (1 - (ticker.price - minPrice) / priceRange) * chartHeight;
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(padding, priceY);
      ctx.lineTo(width - padding, priceY);
      ctx.stroke();
      ctx.setLineDash([]);
      
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(width - padding, priceY - 10, 80, 20);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`$${ticker.price.toFixed(2)}`, width - padding + 5, priceY + 4);
    }
  }, [candlesticks, ticker]);

  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && canvasRef.current) {
        canvasRef.current.width = chartRef.current.clientWidth;
        canvasRef.current.height = 400;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleExchange = (exchange: Exchange) => {
    setSelectedExchanges(prev => prev.includes(exchange) ? prev.filter(e => e !== exchange) : [...prev, exchange]);
  };

  const handleConnect = (exchange: Exchange) => setShowApiModal(exchange);

  const handleApiSubmit = (exchange: Exchange, keys: { apiKey: string; secretKey: string; passphrase?: string }) => {
    setApiKeys(prev => ({ ...prev, [exchange]: keys }));
    setConnected(prev => ({ ...prev, [exchange]: true }));
    setShowApiModal(null);
  };

  const handleOpenPosition = async () => {
    if (!manualOrder.amount) return;
    if (!connected.binance) {
      alert(t('trading.noApi'));
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exchange: 'binance',
          symbol: selectedPair.symbol,
          side: 'BUY',
          positionSide: positionSide,
          type: 'MARKET',
          quantity: manualOrder.amount,
          leverage: leverage,
          apiKey: apiKeys.binance?.apiKey,
          secretKey: apiKeys.binance?.secretKey,
          isFutures: true,
        }),
      });
      const result = await res.json();
      if (result.error) {
        alert(`${t('trading.fail')}: ${result.error}`);
      } else {
        setFuturesLog(prev => [result, ...prev]);
        alert(`${t('trading.success')}\n${t('trading.orderId')}: ${result.orderId}\n${t('trading.direction')}: ${positionSide === 'LONG' ? t('trading.long') : t('trading.short')}\n${t('trading.avgPrice')}: $${result.priceAvg}\n${t('trading.amount')}: ${result.quantity} ${selectedPair.base}`);
        setManualOrder({ amount: '', price: '' });
      }
    } catch (e) {
      alert(`${t('trading.fail')}`);
    }
    setLoading(false);
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900'>
      <Navbar />

      {/* Header */}
      <div className='pt-24 pb-6 px-4 sm:px-6 lg:px-8'>
        <div className='max-w-7xl mx-auto'>
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
            <div>
              <h1 className='text-3xl md:text-4xl font-bold text-white'>
                {t('trading.title')}<span className='text-blue-400'> {t('trading.futures')}</span>
              </h1>
              <p className='text-gray-400 mt-1'>{t('trading.subtitle')}</p>
            </div>
            <div className='flex items-center gap-3'>
              <span className='flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm'>
                <span className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></span>
                {t('trading.futures')}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='px-4 sm:px-6 lg:px-8 pb-12'>
        <div className='max-w-7xl mx-auto space-y-6'>

          <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
            {/* Left Panel - Exchanges */}
            <div className='lg:col-span-1 space-y-4'>
              <div className='bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700'>
                <h2 className='text-lg font-bold text-white mb-4 flex items-center gap-2'>
                  <span className='w-7 h-7 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 text-sm'>🔗</span>
                  {t('trading.exchange')}
                </h2>
                <div className='space-y-2'>
                  {(Object.keys(exchanges) as Exchange[]).map(exchange => {
                    const config = exchanges[exchange];
                    const isSelected = selectedExchanges.includes(exchange);
                    const isConnected = connected[exchange];
                    return (
                      <div key={exchange} className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${isSelected ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'} ${isConnected ? 'border-green-500/50 bg-green-500/5' : ''}`} onClick={() => !isConnected && toggleExchange(exchange)}>
                        <div className='flex items-center justify-between'>
                          <div className='flex items-center gap-2'>
                            <div className={`w-8 h-8 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center text-white text-xs font-bold`}>{config.icon}</div>
                            <span className='text-white text-sm'>{config.name}</span>
                          </div>
                          {!isConnected && isSelected && (
                            <button onClick={e => { e.stopPropagation(); handleConnect(exchange); }} className='px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-xs rounded-lg'>API</button>
                          )}
                          {isConnected && <span className='text-green-400 text-xs'>✓</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Connected Exchanges */}
              {Object.values(connected).some(v => v) && (
                <div className='bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-green-500/30'>
                  <h3 className='text-sm font-bold text-green-400 mb-3'>✓ {t('trading.connected')}</h3>
                  <div className='space-y-2'>
                    {Object.entries(connected).filter(([_, v]) => v).map(([ex]) => (
                      <div key={ex} className='flex items-center gap-2 p-2 bg-slate-700/50 rounded-lg'>
                        <div className={`w-6 h-6 bg-gradient-to-r ${exchanges[ex as Exchange].color} rounded text-xs flex items-center justify-center text-white font-bold`}>{exchanges[ex as Exchange].icon}</div>
                        <span className='text-white text-sm'>{exchanges[ex as Exchange].name}</span>
                        <span className='text-green-400 text-xs ml-auto'>{t('trading.online')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Leverage Selector */}
              <div className='bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700'>
                <h3 className='text-sm font-bold text-white mb-3'>{t('trading.leverage')}</h3>
                <div className='grid grid-cols-4 gap-2'>
                  {[5, 10, 15, 20].map(lev => (
                    <button key={lev} onClick={() => setLeverage(lev)} className={`py-2 rounded-lg text-sm font-bold transition-all ${leverage === lev ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-400 hover:bg-slate-600'}`}>
                      {lev}x
                    </button>
                  ))}
                </div>
                <div className='mt-3'>
                  <input type='range' min='1' max='125' value={leverage} onChange={e => setLeverage(parseInt(e.target.value))} className='w-full accent-blue-500' />
                  <div className='flex justify-between text-xs text-gray-500 mt-1'>
                    <span>1x</span>
                    <span className='text-blue-400 font-bold'>{leverage}x</span>
                    <span>125x</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Panel - Chart & Trading */}
            <div className='lg:col-span-3 space-y-4'>
              {/* Trading Pair & Price */}
              <div className='bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700'>
                <div className='flex flex-wrap items-center justify-between gap-4 mb-4'>
                  <div className='flex items-center gap-3'>
                    <select value={selectedPair.symbol} onChange={e => setSelectedPair(futuresPairs.find(p => p.symbol === e.target.value) || futuresPairs[0])} className='bg-slate-700 text-white px-4 py-2 rounded-xl border border-slate-600 focus:outline-none focus:border-blue-500'>
                      {futuresPairs.map(pair => (
                        <option key={pair.symbol} value={pair.symbol}>{pair.base}/{pair.quote}</option>
                      ))}
                    </select>
                    <div className='text-2xl font-bold text-white'>{selectedPair.base}/{selectedPair.quote}</div>
                    <span className='bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold'>futures</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    {(['1m', '5m', '15m', '1h', '4h', '1d'] as Interval[]).map(int => (
                      <button key={int} onClick={() => setInterval(int)} className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${interval === int ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-400 hover:bg-slate-600'}`}>{int}</button>
                    ))}
                  </div>
                </div>

                {ticker && (
                  <div className='grid grid-cols-2 md:grid-cols-5 gap-3 mb-4'>
                    <div className='bg-slate-700/50 rounded-xl p-3'>
                      <div className='text-xs text-gray-400'>{t('trading.price')}</div>
                      <div className='text-xl font-bold text-white'>${ticker.price.toFixed(2)}</div>
                    </div>
                    <div className='bg-slate-700/50 rounded-xl p-3'>
                      <div className='text-xs text-gray-400'>{t('trading.change24h')}</div>
                      <div className={`text-xl font-bold ${ticker.priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {ticker.priceChangePercent >= 0 ? '+' : ''}{ticker.priceChangePercent.toFixed(2)}%
                      </div>
                    </div>
                    <div className='bg-slate-700/50 rounded-xl p-3'>
                      <div className='text-xs text-gray-400'>{t('trading.high24h')}</div>
                      <div className='text-xl font-bold text-green-400'>${ticker.high.toFixed(2)}</div>
                    </div>
                    <div className='bg-slate-700/50 rounded-xl p-3'>
                      <div className='text-xs text-gray-400'>{t('trading.low24h')}</div>
                      <div className='text-xl font-bold text-red-400'>${ticker.low.toFixed(2)}</div>
                    </div>
                    <div className='bg-slate-700/50 rounded-xl p-3'>
                      <div className='text-xs text-gray-400'>{t('trading.volume24h')}</div>
                      <div className='text-xl font-bold text-cyan-400'>{(ticker.volume / 1000).toFixed(1)}K</div>
                    </div>
                  </div>
                )}

                {/* K-line Chart */}
                <div ref={chartRef} className='w-full rounded-xl overflow-hidden'>
                  <canvas ref={canvasRef} className='w-full' height={400} />
                </div>
              </div>

              {/* Position Direction & Order Form */}
              <div className='bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700'>
                <h3 className='text-lg font-bold text-white mb-4'>{t('trading.openPosition')}</h3>
                
                {/* Direction Selector */}
                <div className='flex gap-3 mb-4'>
                  <button onClick={() => setPositionSide('LONG')} className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${positionSide === 'LONG' ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30' : 'bg-slate-700 text-gray-400 hover:bg-slate-600'}`}>
                    ↑ {t('trading.long')}
                  </button>
                  <button onClick={() => setPositionSide('SHORT')} className={`flex-1 py-3 rounded-xl font-bold text-lg transition-all ${positionSide === 'SHORT' ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-lg shadow-red-500/30' : 'bg-slate-700 text-gray-400 hover:bg-slate-600'}`}>
                    ↓ {t('trading.short')}
                  </button>
                </div>

                <div className='grid grid-cols-2 gap-4 mb-4'>
                  <div>
                    <label className='text-sm text-gray-400 mb-1 block'>{t('trading.quantity')} ({selectedPair.base})</label>
                    <input type='number' value={manualOrder.amount} onChange={e => setManualOrder({ ...manualOrder, amount: e.target.value })} placeholder='0.00' className='w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500' />
                  </div>
                  <div>
                    <label className='text-sm text-gray-400 mb-1 block'>{t('trading.leverage')}</label>
                    <div className='w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white'>
                      {leverage}x {t('trading.futures')}
                    </div>
                  </div>
                </div>

                {/* Position Info */}
                <div className='bg-slate-700/30 rounded-xl p-4 mb-4'>
                  <div className='grid grid-cols-3 gap-4 text-sm'>
                    <div>
                      <span className='text-gray-400'>{t('trading.direction')}: </span>
                      <span className={positionSide === 'LONG' ? 'text-green-400' : 'text-red-400'}>
                        {positionSide === 'LONG' ? t('trading.long') : t('trading.short')}
                      </span>
                    </div>
                    <div>
                      <span className='text-gray-400'>{t('trading.leverage')}: </span>
                      <span className='text-blue-400'>{leverage}x</span>
                    </div>
                    <div>
                      <span className='text-gray-400'>{t('trading.margin')}: </span>
                      <span className='text-white'>
                        {manualOrder.amount && ticker ? `$${(parseFloat(manualOrder.amount) * ticker.price / leverage).toFixed(2)}` : '--'}
                      </span>
                    </div>
                  </div>
                </div>

                <button onClick={handleOpenPosition} disabled={loading || !manualOrder.amount || !connected.binance} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${positionSide === 'LONG' ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white' : 'bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white'} ${(!manualOrder.amount || !connected.binance) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {loading ? t('trading.processing') : `↑↓ ${positionSide === 'LONG' ? t('trading.long') : t('trading.short')} ${selectedPair.base} ${t('trading.openPosition')}`}
                </button>
                {!connected.binance && <p className='text-yellow-400 text-xs text-center mt-2'>{t('trading.noApi')}</p>}
              </div>

              {/* Futures Trading Log */}
              {futuresLog.length > 0 && (
                <div className='bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700'>
                  <h3 className='text-lg font-bold text-white mb-4'>📋 {t('trading.futuresLog')}</h3>
                  <div className='overflow-x-auto'>
                    <table className='w-full text-sm'>
                      <thead>
                        <tr className='text-gray-400 border-b border-slate-700'>
                          <th className='text-left py-2 px-3'>{t('trading.time')}</th>
                          <th className='text-left py-2 px-3'>{t('trading.orderId')}</th>
                          <th className='text-left py-2 px-3'>{selectedPair.base}</th>
                          <th className='text-left py-2 px-3'>{t('trading.direction')}</th>
                          <th className='text-left py-2 px-3'>{t('trading.leverage')}</th>
                          <th className='text-left py-2 px-3'>{t('trading.avgPrice')}</th>
                          <th className='text-left py-2 px-3'>{t('trading.margin')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {futuresLog.map((log, i) => (
                          <tr key={i} className='border-b border-slate-700/50 hover:bg-slate-700/30'>
                            <td className='py-3 px-3 text-gray-400'>{new Date(log.createTime).toLocaleString()}</td>
                            <td className='py-3 px-3 text-blue-400 font-mono text-xs'>{log.orderId}</td>
                            <td className='py-3 px-3 text-white font-bold'>{log.quantity} {selectedPair.base}</td>
                            <td className='py-3 px-3'>
                              <span className={`px-2 py-1 rounded text-xs font-bold ${log.positionSide === 'LONG' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {log.positionSide === 'LONG' ? t('trading.long') : t('trading.short')}
                              </span>
                            </td>
                            <td className='py-3 px-3 text-yellow-400'>{log.leverage}x</td>
                            <td className='py-3 px-3 text-white'>${log.priceAvg}</td>
                            <td className='py-3 px-3 text-cyan-400'>${log.margin}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Market Overview */}
              <div className='bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700'>
                <h3 className='text-lg font-bold text-white mb-4'>{t('trading.selectSymbol')}</h3>
                <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                  {futuresPairs.map(pair => (
                    <div key={pair.symbol} className={`bg-slate-700/50 rounded-xl p-3 cursor-pointer hover:bg-slate-600/50 transition-all ${selectedPair.symbol === pair.symbol ? 'border-2 border-blue-500' : ''}`} onClick={() => setSelectedPair(pair)}>
                      <div className='flex items-center justify-between mb-1'>
                        <span className='text-white font-bold'>{pair.base}</span>
                        <span className='text-yellow-400 text-xs'>futures</span>
                      </div>
                      <div className='text-gray-400 text-xs'>{pair.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* API Modal */}
      {showApiModal && <ApiModal exchange={showApiModal} config={exchanges[showApiModal]} onClose={() => setShowApiModal(null)} onSubmit={keys => handleApiSubmit(showApiModal, keys)} />}
    </div>
  );
}

function Navbar() {
  const { t, lang, setLang, languageNames } = useI18n();
  return (
    <nav className='fixed top-0 left-0 right-0 bg-slate-900/90 backdrop-blur-md z-50 border-b border-slate-700'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          <div className='flex items-center'>
            <a href='/' className='flex items-center space-x-2'>
              <div className='w-8 h-8 bg-gradient-to-r from-blue-500 via-cyan-500 to-green-500 rounded-lg flex items-center justify-center'><span className='text-white font-bold text-lg'>🦞</span></div>
              <span className='text-xl font-bold text-white'>链虾工坊</span>
            </a>
          </div>
          <div className='hidden md:flex items-center space-x-6'>
            <a href='/' className='text-gray-300 hover:text-white transition-colors text-sm'>{t('nav.home')}</a>
            <a href='/services' className='text-gray-300 hover:text-white transition-colors text-sm'>{t('nav.services')}</a>
            <a href='/cases' className='text-gray-300 hover:text-white transition-colors text-sm'>{t('nav.cases')}</a>
            <a href='/about' className='text-gray-300 hover:text-white transition-colors text-sm'>{t('nav.about')}</a>
            <a href='/trading' className='bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-5 py-2 rounded-full text-sm font-medium'>🦐 {t('nav.trading')}</a>
            <select value={lang} onChange={e => setLang(e.target.value as Language)} className='px-3 py-1.5 border border-slate-600 rounded-lg text-sm bg-slate-800 text-gray-300 hover:border-blue-400 focus:outline-none focus:border-blue-500'>
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

function ApiModal({ exchange, config, onClose, onSubmit }: { exchange: Exchange; config: ExchangeConfig; onClose: () => void; onSubmit: (keys: { apiKey: string; secretKey: string; passphrase?: string }) => void }) {
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [passphrase, setPassphrase] = useState('');

  const handleSubmit = () => { if (!apiKey || !secretKey) return; onSubmit({ apiKey, secretKey, passphrase }); };

  return (
    <div className='fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4'>
      <div className='bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 max-w-md w-full border border-slate-700'>
        <div className='flex items-center justify-between mb-6'>
          <div className='flex items-center gap-3'>
            <div className={`w-10 h-10 bg-gradient-to-r ${config.color} rounded-lg flex items-center justify-center text-white font-bold`}>{config.icon}</div>
            <div><h3 className='text-xl font-bold text-white'>导入 {config.name} API</h3><p className='text-xs text-gray-500'>Futures Trading API</p></div>
          </div>
          <button onClick={onClose} className='text-gray-400 hover:text-white text-2xl'>&times;</button>
        </div>

        <div className='space-y-4'>
          <div>
            <label className='text-sm text-gray-400 mb-2 block'>API Key</label>
            <input type='text' value={apiKey} onChange={e => setApiKey(e.target.value)} placeholder='请输入 API Key' className='w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500' />
          </div>
          <div>
            <label className='text-sm text-gray-400 mb-2 block'>Secret Key</label>
            <input type='password' value={secretKey} onChange={e => setSecretKey(e.target.value)} placeholder='请输入 Secret Key' className='w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500' />
          </div>
          {exchange === 'okx' && (
            <div>
              <label className='text-sm text-gray-400 mb-2 block'>Passphrase</label>
              <input type='password' value={passphrase} onChange={e => setPassphrase(e.target.value)} placeholder='请输入 Passphrase' className='w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500' />
            </div>
          )}
        </div>

        <div className='mt-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4'>
          <p className='text-yellow-400 text-sm'>⚠️ 请确保API权限开启合约交易权限，不要开启提币权限</p>
        </div>

        <div className='flex gap-4 mt-6'>
          <button onClick={onClose} className='flex-1 py-3 bg-slate-700 text-white rounded-xl font-medium hover:bg-slate-600 transition-colors'>取消</button>
          <button onClick={handleSubmit} disabled={!apiKey || !secretKey} className='flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:from-blue-600 hover:to-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'>连接</button>
        </div>
      </div>
    </div>
  );
}
