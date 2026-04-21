'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useI18n, Language } from '@/lib/i18n';

type Interval = '1m' | '5m' | '15m' | '1h' | '4h' | '1d';

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

interface TradeRecord {
  time: string;
  side: string;
  reason: string;
  price: string;
  amount: string;
  pnl?: number;
  pnl_pct?: number;
  confidence?: number;
}

interface BotStatus {
  running: boolean;
  symbol: string;
  interval: string;
  confidence: number;
  rsi: number;
  macd_signal: string;
  bb_position: string;
  position: 'none' | 'long' | 'short';
  entry_price?: number;
  leverage: number;
  stop_loss: number;
  take_profit: number;
  daily_loss: number;
  daily_max_loss: number;
  consecutive_losses: number;
  paused: boolean;
  last_update: string;
}

interface StrategyIndicators {
  rsi: number;
  macd: number;
  macd_signal: number;
  macd_hist: number;
  bb_upper: number;
  bb_middle: number;
  bb_lower: number;
  bb_position: number;
  support: number;
  resistance: number;
  confidence: number;
  signal: 'buy' | 'sell' | 'hold';
}

// 币安合约全部交易对（搜索用）
const ALL_FUTURES_PAIRS = [
  'BTCUSDT','ETHUSDT','BNBUSDT','XRPUSDT','SOLUSDT','ADAUSDT','DOGEUSDT',
  'AVAXUSDT','DOTUSDT','MATICUSDT','LINKUSDT','LTCUSDT','SHIBUSDT','TRXUSDT',
  'TONUSDT','ATOMUSDT','UNIUSDT','XLMUSDT','ETCUSDT','NEARUSDT','APTUSDT',
  'FILUSDT','ICPUSDT','ARBUSDT','OPUSDT','INJUSDT','SANDUSDT','MANAUSDT',
  'AAVEUSDT','GRTUSDT','FTMUSDT','ALGOUSDT','EGLDUSDT','THETAUSDT','AXSUSDT',
  'MKRUSDT','SNXUSDT','RUNEUSDT','KAVAUSDT','ZILUSDT','ENJUSDT','BATUSDT',
  '1INCHUSDT','CHZUSDT','ENSUSDT','LRCUSDT','Qt','XMRUSDT','NEOUSDT','IOTAUSDT'
].map(s => ({ symbol: s, base: s.replace('USDT',''), quote: 'USDT' }));

const INTERVALS: Interval[] = ['1m', '5m', '15m', '1h', '4h', '1d'];

export default function TradingPage() {
  const { t } = useI18n();

  // Bot state
  const [botStatus, setBotStatus] = useState<BotStatus>({
    running: false,
    symbol: 'BTCUSDT',
    interval: '1h',
    confidence: 0,
    rsi: 50,
    macd_signal: 'hold',
    bb_position: 'middle',
    position: 'none',
    leverage: 10,
    stop_loss: -5,
    take_profit: 10,
    daily_loss: 0,
    daily_max_loss: 1,
    consecutive_losses: 0,
    paused: false,
    last_update: '--',
  });

  const [indicators, setIndicators] = useState<StrategyIndicators | null>(null);
  const [ticker, setTicker] = useState<Ticker | null>(null);
  const [candlesticks, setCandlesticks] = useState<Candlestick[]>([]);
  const [tradeLog, setTradeLog] = useState<TradeRecord[]>([]);
  const [selectedPair, setSelectedPair] = useState({ symbol: 'BTCUSDT', base: 'BTC', quote: 'USDT' });
  const [interval, setIntervalState] = useState<Interval>('1h');
  const [leverage, setLeverage] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSymbolDropdown, setShowSymbolDropdown] = useState(false);

  const botRef = useRef<boolean>(false);
  const intervalRef = useRef<ReturnType<typeof globalThis.setInterval> | null>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const filteredPairs = ALL_FUTURES_PAIRS.filter(p =>
    p.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.base.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 20);

  // 获取行情数据
  const fetchData = useCallback(async () => {
    try {
      const [tickerRes, klineRes, botRes] = await Promise.all([
        fetch(`/api/order?symbol=${selectedPair.symbol}&exchange=binance&type=futures`),
        fetch(`/api/kline?symbol=${selectedPair.symbol}&interval=${interval}&type=futures`),
        fetch(`/api/botstatus?symbol=${selectedPair.symbol}`),
      ]);

      const tickerData = await tickerRes.json();
      const klineData = await klineRes.json();
      const botData = await botRes.json();

      if (!tickerData.error) setTicker(tickerData);
      if (Array.isArray(klineData)) setCandlesticks(klineData);
      if (botData.running !== undefined) {
        setBotStatus(prev => ({ ...prev, ...botData, leverage, interval }));
      }
      if (botData.indicators) setIndicators(botData.indicators);
      if (botData.tradeLog) setTradeLog(botData.tradeLog);
    } catch (e) {
      console.error('Fetch error:', e);
    }
  }, [selectedPair.symbol, interval, leverage]);

  // 初始加载 + 切换交易对时刷新
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // K线图画图
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

    const prices = candlesticks.flatMap(c => [c.high, c.low]);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 1;

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
    });

    // 标注布林带
    if (indicators) {
      const { bb_upper, bb_lower } = indicators;
      const upperY = padding + (1 - (bb_upper - minPrice) / priceRange) * chartHeight;
      const lowerY = padding + (1 - (bb_lower - minPrice) / priceRange) * chartHeight;
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.6)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(padding, upperY);
      ctx.lineTo(width - padding, upperY);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(padding, lowerY);
      ctx.lineTo(width - padding, lowerY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

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
  }, [candlesticks, indicators, ticker]);

  // Canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current && canvasRef.current) {
        canvasRef.current.width = chartRef.current.clientWidth;
        canvasRef.current.height = 380;
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 启动机器人
  const handleStart = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/botstatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'start',
          symbol: selectedPair.symbol,
          interval,
          leverage,
        }),
      });
      const data = await res.json();
      if (data.success) {
        botRef.current = true;
        setBotStatus(prev => ({ ...prev, running: true, symbol: selectedPair.symbol, interval, leverage }));
        // 启动轮询
        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = globalThis.setInterval(fetchData, 10000); // 每10秒刷新
      }
    } catch (e) {
      console.error('Start error:', e);
    }
    setIsLoading(false);
  };

  // 停止机器人
  const handleStop = async () => {
    setIsLoading(true);
    try {
      await fetch('/api/botstatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'stop' }),
      });
      botRef.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      setBotStatus(prev => ({ ...prev, running: false }));
    } catch (e) {
      console.error('Stop error:', e);
    }
    setIsLoading(false);
  };

  // 清理
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const getSignalColor = (signal: string) => {
    if (signal === 'buy') return 'text-green-400';
    if (signal === 'sell') return 'text-red-400';
    return 'text-gray-400';
  };

  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return 'text-green-400';
    if (conf >= 60) return 'text-yellow-400';
    return 'text-red-400';
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
              <p className='text-gray-400 mt-1'>
                {t('trading.subtitle')}
              </p>
            </div>
            <div className='flex items-center gap-3'>
              <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold ${botStatus.running ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                <span className={`w-2 h-2 rounded-full animate-pulse ${botStatus.running ? 'bg-green-400' : 'bg-red-400'}`}></span>
                {botStatus.running ? '运行中' : '已停止'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className='px-4 sm:px-6 lg:px-8 pb-12'>
        <div className='max-w-7xl mx-auto space-y-6'>

          {/* 控制面板 */}
          <div className='bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700'>
            <div className='flex flex-wrap items-center gap-4'>
              {/* 币种搜索 */}
              <div className='relative'>
                <label className='text-xs text-gray-400 block mb-1'>{t('trading.selectSymbol')}</label>
                <div className='relative'>
                  <input
                    type='text'
                    value={searchQuery || selectedPair.symbol}
                    onChange={e => { setSearchQuery(e.target.value); setShowSymbolDropdown(true); }}
                    onFocus={() => setShowSymbolDropdown(true)}
                    onBlur={() => setTimeout(() => setShowSymbolDropdown(false), 200)}
                    className='bg-slate-700 text-white px-4 py-2 rounded-xl border border-slate-600 w-48 focus:outline-none focus:border-blue-500'
                    placeholder='搜索币种...'
                  />
                  {showSymbolDropdown && (
                    <div className='absolute top-full mt-1 left-0 w-64 bg-slate-800 border border-slate-600 rounded-xl shadow-xl z-50 max-h-64 overflow-y-auto'>
                      {filteredPairs.length === 0 && <div className='p-3 text-gray-400 text-sm'>无结果</div>}
                      {filteredPairs.map(pair => (
                        <div key={pair.symbol} className='flex items-center justify-between px-4 py-2 hover:bg-slate-700 cursor-pointer' onMouseDown={() => {
                          setSelectedPair(pair);
                          setSearchQuery('');
                          setShowSymbolDropdown(false);
                        }}>
                          <span className='text-white font-bold'>{pair.base}</span>
                          <span className='text-yellow-400 text-xs'>futures</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* 周期选择 */}
              <div>
                <label className='text-xs text-gray-400 block mb-1'>K线周期</label>
                <div className='flex gap-1'>
                  {INTERVALS.map(int => (
                    <button key={int} onClick={() => setIntervalState(int)} className={`px-3 py-2 rounded-lg text-xs font-medium transition-colors ${interval === int ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-400 hover:bg-slate-600'}`}>
                      {int}
                    </button>
                  ))}
                </div>
              </div>

              {/* 杠杆 */}
              <div>
                <label className='text-xs text-gray-400 block mb-1'>{t('trading.leverage')}: {leverage}x</label>
                <input type='range' min='1' max='125' value={leverage} onChange={e => setLeverage(parseInt(e.target.value))} className='w-24 accent-blue-500' />
              </div>

              {/* 启动/停止按钮 */}
              <div className='ml-auto flex gap-3 items-end'>
                {!botStatus.running ? (
                  <button onClick={handleStart} disabled={isLoading} className='bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all disabled:opacity-50 shadow-lg shadow-green-500/30'>
                    ▶ 启动策略
                  </button>
                ) : (
                  <button onClick={handleStop} disabled={isLoading} className='bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all disabled:opacity-50 shadow-lg shadow-red-500/30'>
                    ⏹ 停止策略
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* 左侧 - 指标与状态 */}
            <div className='space-y-4'>
              {/* 策略信号 */}
              <div className='bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700'>
                <h3 className='text-sm font-bold text-gray-400 mb-3'>📊 多指标综合置信度</h3>
                <div className='text-center mb-4'>
                  <div className={`text-5xl font-bold ${getConfidenceColor(indicators?.confidence || 0)}`}>
                    {indicators?.confidence?.toFixed(1) || '0.0'}%
                  </div>
                  <div className={`text-lg font-bold mt-1 ${getSignalColor(indicators?.signal || 'hold')}`}>
                    {indicators?.signal === 'buy' ? '📈 买入信号' : indicators?.signal === 'sell' ? '📉 卖出信号' : '⏸ 观望'}
                  </div>
                </div>
                <div className='space-y-2 text-sm'>
                  <div className='flex justify-between'><span className='text-gray-400'>RSI(14)</span><span className={indicators?.rsi && indicators.rsi < 30 ? 'text-green-400' : indicators?.rsi && indicators.rsi > 70 ? 'text-red-400' : 'text-white'}>{indicators?.rsi?.toFixed(1) || '--'}</span></div>
                  <div className='flex justify-between'><span className='text-gray-400'>MACD</span><span className={indicators?.macd && indicators.macd > indicators.macd_signal ? 'text-green-400' : 'text-red-400'}>{indicators?.macd?.toFixed(2) || '--'}</span></div>
                  <div className='flex justify-between'><span className='text-gray-400'>MACD Signal</span><span className='text-cyan-400'>{indicators?.macd_signal?.toFixed(2) || '--'}</span></div>
                  <div className='flex justify-between'><span className='text-gray-400'>布林带位置</span><span className={indicators?.bb_position && indicators.bb_position < 0.2 ? 'text-green-400' : indicators?.bb_position && indicators.bb_position > 0.8 ? 'text-red-400' : 'text-white'}>{indicators?.bb_position?.toFixed(3) || '--'}</span></div>
                  <div className='flex justify-between'><span className='text-gray-400'>布林上轨</span><span className='text-purple-400'>${indicators?.bb_upper?.toFixed(2) || '--'}</span></div>
                  <div className='flex justify-between'><span className='text-gray-400'>布林下轨</span><span className='text-purple-400'>${indicators?.bb_lower?.toFixed(2) || '--'}</span></div>
                  <div className='flex justify-between'><span className='text-gray-400'>支撑位</span><span className='text-green-400'>${indicators?.support?.toFixed(2) || '--'}</span></div>
                  <div className='flex justify-between'><span className='text-gray-400'>阻力位</span><span className='text-red-400'>${indicators?.resistance?.toFixed(2) || '--'}</span></div>
                </div>
              </div>

              {/* 风险状态 */}
              <div className='bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700'>
                <h3 className='text-sm font-bold text-gray-400 mb-3'>🛡️ 风险状态</h3>
                <div className='space-y-3 text-sm'>
                  <div>
                    <div className='flex justify-between mb-1'>
                      <span className='text-gray-400'>今日亏损</span>
                      <span className={botStatus.daily_loss >= botStatus.daily_max_loss ? 'text-red-400 font-bold' : 'text-white'}>${botStatus.daily_loss.toFixed(2)} / ${botStatus.daily_max_loss}</span>
                    </div>
                    <div className='w-full bg-slate-700 rounded-full h-2'>
                      <div className='bg-red-500 h-2 rounded-full transition-all' style={{ width: `${Math.min(100, (botStatus.daily_loss / botStatus.daily_max_loss) * 100)}%` }}></div>
                    </div>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>连续亏损</span>
                    <span className={botStatus.consecutive_losses >= 3 ? 'text-red-400 font-bold' : 'text-white'}>{botStatus.consecutive_losses}次</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>持仓状态</span>
                    <span className={botStatus.position === 'none' ? 'text-gray-400' : botStatus.position === 'long' ? 'text-green-400' : 'text-red-400'}>
                      {botStatus.position === 'none' ? '空仓' : botStatus.position === 'long' ? '做多' : '做空'}
                    </span>
                  </div>
                  {botStatus.entry_price && (
                    <div className='flex justify-between'>
                      <span className='text-gray-400'>开仓价</span>
                      <span className='text-white'>${botStatus.entry_price.toFixed(2)}</span>
                    </div>
                  )}
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>杠杆</span>
                    <span className='text-yellow-400'>{botStatus.leverage}x</span>
                  </div>
                  <div className='flex justify-between'>
                    <span className='text-gray-400'>止损/止盈</span>
                    <span className='text-white'>{botStatus.stop_loss}% / +{botStatus.take_profit}%</span>
                  </div>
                  {botStatus.paused && (
                    <div className='bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-2 text-center'>
                      <span className='text-yellow-400 text-xs'>⚠️ 连续亏损触发暂停</span>
                    </div>
                  )}
                </div>
              </div>

              {/* 当前行情 */}
              {ticker && (
                <div className='bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700'>
                  <h3 className='text-sm font-bold text-gray-400 mb-3'>💹 {selectedPair.base} 实时行情</h3>
                  <div className='text-2xl font-bold text-white mb-1'>${ticker.price.toFixed(2)}</div>
                  <div className={`text-sm font-bold ${ticker.priceChangePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {ticker.priceChangePercent >= 0 ? '▲' : '▼'} {Math.abs(ticker.priceChangePercent).toFixed(2)}%
                  </div>
                  <div className='grid grid-cols-2 gap-2 mt-3 text-xs'>
                    <div className='bg-slate-700/50 rounded-lg p-2'><div className='text-gray-400'>24h高</div><div className='text-green-400'>${ticker.high.toFixed(2)}</div></div>
                    <div className='bg-slate-700/50 rounded-lg p-2'><div className='text-gray-400'>24h低</div><div className='text-red-400'>${ticker.low.toFixed(2)}</div></div>
                    <div className='bg-slate-700/50 rounded-lg p-2 col-span-2'><div className='text-gray-400'>24h成交量</div><div className='text-cyan-400'>{(ticker.volume / 1000).toFixed(1)}K</div></div>
                  </div>
                </div>
              )}
            </div>

            {/* 中间 - K线图 */}
            <div className='lg:col-span-2 space-y-4'>
              {/* K线图 */}
              <div className='bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700'>
                <div className='flex items-center justify-between mb-3'>
                  <h3 className='text-lg font-bold text-white'>📊 {selectedPair.base}/{selectedPair.quote} K线</h3>
                  <span className='text-xs text-gray-400'>周期: {interval}</span>
                </div>
                <div ref={chartRef} className='w-full rounded-xl overflow-hidden'>
                  <canvas ref={canvasRef} className='w-full' height={380} />
                </div>
              </div>

              {/* 交易日志 */}
              <div className='bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700'>
                <h3 className='text-lg font-bold text-white mb-4'>📋 交易日志</h3>
                {tradeLog.length === 0 ? (
                  <div className='text-center text-gray-500 py-8'>暂无交易记录</div>
                ) : (
                  <div className='overflow-x-auto'>
                    <table className='w-full text-sm'>
                      <thead>
                        <tr className='text-gray-400 border-b border-slate-700'>
                          <th className='text-left py-2 px-2'>时间</th>
                          <th className='text-left py-2 px-2'>方向</th>
                          <th className='text-left py-2 px-2'>原因</th>
                          <th className='text-left py-2 px-2'>价格</th>
                          <th className='text-left py-2 px-2'>数量</th>
                          <th className='text-left py-2 px-2'>置信度</th>
                          <th className='text-left py-2 px-2'>盈亏</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tradeLog.slice(0, 20).map((trade, i) => (
                          <tr key={i} className='border-b border-slate-700/50 hover:bg-slate-700/30'>
                            <td className='py-2 px-2 text-gray-400 text-xs'>{new Date(trade.time).toLocaleString()}</td>
                            <td className='py-2 px-2'>
                              <span className={`px-2 py-0.5 rounded text-xs font-bold ${trade.side === 'buy' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {trade.side === 'buy' ? '买入' : '卖出'}
                              </span>
                            </td>
                            <td className='py-2 px-2 text-gray-300 text-xs'>{trade.reason}</td>
                            <td className='py-2 px-2 text-white'>${trade.price}</td>
                            <td className='py-2 px-2 text-white'>{trade.amount}</td>
                            <td className='py-2 px-2'>
                              {trade.confidence ? (
                                <span className={`text-xs font-bold ${trade.confidence >= 75 ? 'text-green-400' : 'text-yellow-400'}`}>{trade.confidence}%</span>
                              ) : <span className='text-gray-500'>--</span>}
                            </td>
                            <td className='py-2 px-2'>
                              {trade.pnl !== undefined ? (
                                <span className={trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}>{trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(2)} ({trade.pnl_pct?.toFixed(2)}%)</span>
                              ) : <span className='text-gray-500'>--</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* 币种快捷选择 */}
              <div className='bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-slate-700'>
                <h3 className='text-lg font-bold text-white mb-4'>{t('trading.selectSymbol')}</h3>
                <div className='grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2'>
                  {ALL_FUTURES_PAIRS.slice(0, 40).map(pair => (
                    <button key={pair.symbol} onClick={() => { setSelectedPair(pair); setSearchQuery(''); }} className={`py-2 px-2 rounded-lg text-xs font-bold transition-all ${selectedPair.symbol === pair.symbol ? 'bg-blue-500 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'}`}>
                      {pair.base}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
