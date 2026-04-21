import { NextRequest, NextResponse } from 'next/server';

// ==================== 内存中的Bot状态 ====================
interface BotState {
  running: boolean;
  symbol: string;
  interval: string;
  leverage: number;
  position: 'none' | 'long' | 'short';
  entry_price?: number;
  entry_amount?: number;
  confidence: number;
  rsi: number;
  macd: number;
  macd_signal: number;
  bb_upper: number;
  bb_lower: number;
  bb_position: number;
  support: number;
  resistance: number;
  signal: 'buy' | 'sell' | 'hold';
  daily_loss: number;
  daily_loss_date: string;
  consecutive_losses: number;
  paused: boolean;
  paused_until?: number;
  last_trade_time?: number;
  trade_log: TradeRecord[];
  last_update: string;
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

interface Indicators {
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

// 全局Bot状态
let botState: BotState = {
  running: false,
  symbol: 'BTCUSDT',
  interval: '1h',
  leverage: 10,
  position: 'none',
  confidence: 0,
  rsi: 50,
  macd: 0,
  macd_signal: 0,
  bb_upper: 0,
  bb_lower: 0,
  bb_position: 0.5,
  support: 0,
  resistance: 0,
  signal: 'hold',
  daily_loss: 0,
  daily_loss_date: new Date().toISOString().split('T')[0],
  consecutive_losses: 0,
  paused: false,
  trade_log: [],
  last_update: new Date().toISOString(),
};

// ==================== 技术指标计算 ====================
function computeRSI(closes: number[], period: number = 14): number {
  if (closes.length < period + 1) return 50;
  let gains = 0, losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff > 0) gains += diff;
    else losses += Math.abs(diff);
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - (100 / (1 + rs));
}

function computeMACD(closes: number[], fast: number = 12, slow: number = 26, signal: number = 9): { macd: number; signal: number; hist: number } {
  const ema = (arr: number[], span: number): number => {
    if (arr.length === 0) return 0;
    const k = 2 / (span + 1);
    let emaVal = arr[0];
    for (let i = 1; i < arr.length; i++) {
      emaVal = arr[i] * k + emaVal * (1 - k);
    }
    return emaVal;
  };

  if (closes.length < slow + signal) {
    return { macd: 0, signal: 0, hist: 0 };
  }

  const emaFast = ema(closes, fast);
  const emaSlow = ema(closes, slow);
  const macd = emaFast - emaSlow;

  // 计算信号线 (简化: 用macd的移动平均)
  const histArr = [];
  for (let i = slow; i < closes.length; i++) {
    const ef = ema(closes.slice(0, i + 1), fast);
    const es = ema(closes.slice(0, i + 1), slow);
    histArr.push(ef - es);
  }
  const sig = ema(histArr, signal);

  return { macd, signal: sig, hist: macd - sig };
}

function computeBollingerBands(closes: number[], period: number = 20, stdDev: number = 2): { upper: number; middle: number; lower: number } {
  if (closes.length < period) return { upper: closes[closes.length - 1] * 1.02, middle: closes[closes.length - 1], lower: closes[closes.length - 1] * 0.98 };
  const slice = closes.slice(-period);
  const middle = slice.reduce((a, b) => a + b, 0) / period;
  const variance = slice.reduce((sum, val) => sum + Math.pow(val - middle, 2), 0) / period;
  const std = Math.sqrt(variance);
  return {
    upper: middle + std * stdDev,
    middle,
    lower: middle - std * stdDev,
  };
}

function computeSupportResistance(highs: number[], lows: number[], lookback: number = 50): { support: number; resistance: number } {
  const recentHighs = highs.slice(-lookback);
  const recentLows = lows.slice(-lookback);
  return {
    support: Math.min(...recentLows),
    resistance: Math.max(...recentHighs),
  };
}

function computeConfidence(
  rsi: number,
  macd: number,
  macdSignal: number,
  macdHist: number,
  bbUpper: number,
  bbLower: number,
  currentPrice: number,
  support: number,
  resistance: number
): { confidence: number; signal: 'buy' | 'sell' | 'hold' } {
  let totalScore = 0;

  // RSI评分
  let rsiScore = 0;
  if (rsi < 30) rsiScore = 25;
  else if (rsi < 40) rsiScore = 15;
  else if (rsi > 80) rsiScore = -20;
  else if (rsi > 70) rsiScore = -10;
  else rsiScore = 5;

  // MACD评分
  let macdScore = 0;
  if (macd > macdSignal && macdHist > 0) macdScore = 25;
  else if (macd > macdSignal) macdScore = 15;
  else if (macd < macdSignal && macdHist < 0) macdScore = -15;
  else if (macd < macdSignal) macdScore = -5;

  // 布林带评分
  let bbScore = 0;
  const bbRange = bbUpper - bbLower;
  if (bbRange === 0) bbScore = 0;
  else {
    const bbPos = (currentPrice - bbLower) / bbRange;
    if (currentPrice <= bbLower) bbScore = 20;
    else if (currentPrice < bbLower * 1.02) bbScore = 10;
    else if (currentPrice >= bbUpper) bbScore = -15;
    else if (currentPrice > bbUpper * 0.98) bbScore = -5;
  }

  // 支撑/阻力评分
  let srScore = 0;
  if (support > 0) {
    const distToSupport = ((currentPrice - support) / support) * 100;
    if (distToSupport < 1.0) srScore = 15;
    else if (distToSupport < 2.0) srScore = 8;
    else if (distToSupport > 5 && currentPrice > resistance * 0.98) srScore = -10;
  }

  totalScore = rsiScore + macdScore + bbScore + srScore;
  let confidence = 50 + totalScore;
  confidence = Math.max(0, Math.min(100, confidence));

  // 信号判定
  let signal: 'buy' | 'sell' | 'hold' = 'hold';
  if (confidence >= 75 && rsi < 70 && macd > macdSignal) signal = 'buy';
  else if (confidence <= 30 || (rsi > 80 && macd < macdSignal)) signal = 'sell';

  return { confidence, signal };
}

async function fetchFuturesKlines(symbol: string, interval: string, limit: number = 100): Promise<any[]> {
  try {
    const url = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=${limit}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

async function fetchFuturesTicker(symbol: string): Promise<any> {
  try {
    const url = `https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${symbol.toUpperCase()}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

async function runBotCycle(): Promise<void> {
  if (!botState.running) return;

  const today = new Date().toISOString().split('T')[0];
  if (botState.daily_loss_date !== today) {
    botState.daily_loss = 0;
    botState.daily_loss_date = today;
    botState.consecutive_losses = 0;
  }

  // 检查暂停状态
  if (botState.paused && botState.paused_until && Date.now() < botState.paused_until) {
    return;
  }
  if (botState.paused && botState.paused_until && Date.now() >= botState.paused_until) {
    botState.paused = false;
    botState.paused_until = undefined;
    botState.consecutive_losses = 0;
  }

  const klines = await fetchFuturesKlines(botState.symbol, botState.interval, 100);
  if (!klines || klines.length === 0) return;

  const closes = klines.map((k: any) => parseFloat(k[4]));
  const highs = klines.map((k: any) => parseFloat(k[2]));
  const lows = klines.map((k: any) => parseFloat(k[3]));
  const currentPrice = closes[closes.length - 1];

  const rsi = computeRSI(closes, 14);
  const { macd, signal: macdSignal, hist: macdHist } = computeMACD(closes);
  const { upper: bbUpper, lower: bbLower } = computeBollingerBands(closes);
  const { support, resistance } = computeSupportResistance(highs, lows);

  const bbRange = bbUpper - bbLower;
  const bbPosition = bbRange > 0 ? (currentPrice - bbLower) / bbRange : 0.5;

  const { confidence, signal } = computeConfidence(rsi, macd, macdSignal, macdHist, bbUpper, bbLower, currentPrice, support, resistance);

  // 更新状态
  botState.confidence = confidence;
  botState.rsi = rsi;
  botState.macd = macd;
  botState.macd_signal = macdSignal;
  botState.bb_upper = bbUpper;
  botState.bb_lower = bbLower;
  botState.bb_position = bbPosition;
  botState.support = support;
  botState.resistance = resistance;
  botState.signal = signal;
  botState.last_update = new Date().toISOString();

  // 冷却检查
  if (botState.last_trade_time && (Date.now() - botState.last_trade_time) < 5 * 60 * 1000) {
    return; // 5分钟冷却
  }

  // 止损止盈检查
  if (botState.position !== 'none' && botState.entry_price) {
    const pnlPct = (currentPrice - botState.entry_price) / botState.entry_price * 100 * (botState.position === 'short' ? -1 : 1);
    const stopLoss = -5;
    const takeProfit = 10;

    if (pnlPct <= stopLoss || pnlPct >= takeProfit || signal === 'sell') {
      const reason = pnlPct <= stopLoss ? '止损' : pnlPct >= takeProfit ? '止盈' : '技术卖出';
      const pnl = (currentPrice - botState.entry_price) * (botState.entry_amount || 0) * (botState.position === 'short' ? -1 : 1);

      botState.trade_log.unshift({
        time: new Date().toISOString(),
        side: 'sell',
        reason,
        price: currentPrice.toFixed(2),
        amount: botState.entry_amount?.toFixed(4) || '0',
        pnl,
        pnl_pct: pnlPct,
        confidence,
      });

      if (pnl < 0) {
        botState.daily_loss += Math.abs(pnl);
        botState.consecutive_losses++;
        if (botState.consecutive_losses >= 3) {
          botState.paused = true;
          botState.paused_until = Date.now() + 24 * 60 * 60 * 1000;
        }
      } else {
        botState.consecutive_losses = 0;
      }

      botState.position = 'none';
      botState.entry_price = undefined;
      botState.entry_amount = undefined;
      botState.last_trade_time = Date.now();
      return;
    }
  }

  // 买入信号检查
  if (botState.position === 'none' && signal === 'buy' && confidence >= 75 && botState.daily_loss < 1) {
    const amount = (0.1 * botState.leverage) / currentPrice; // 固定金额开仓
    botState.position = 'long';
    botState.entry_price = currentPrice;
    botState.entry_amount = amount;

    botState.trade_log.unshift({
      time: new Date().toISOString(),
      side: 'buy',
      reason: `买入信号 (置信度${confidence.toFixed(1)}%)`,
      price: currentPrice.toFixed(2),
      amount: amount.toFixed(4),
      confidence,
    });

    botState.last_trade_time = Date.now();
  }
}

// ==================== API Handler ====================
export async function GET(request: NextRequest) {
  await runBotCycle();

  const ticker = await fetchFuturesTicker(botState.symbol);

  const indicators: Indicators = {
    rsi: botState.rsi,
    macd: botState.macd,
    macd_signal: botState.macd_signal,
    macd_hist: botState.macd - botState.macd_signal,
    bb_upper: botState.bb_upper,
    bb_middle: (botState.bb_upper + botState.bb_lower) / 2,
    bb_lower: botState.bb_lower,
    bb_position: botState.bb_position,
    support: botState.support,
    resistance: botState.resistance,
    confidence: botState.confidence,
    signal: botState.signal,
  };

  return NextResponse.json({
    running: botState.running,
    symbol: botState.symbol,
    interval: botState.interval,
    leverage: botState.leverage,
    position: botState.position,
    entry_price: botState.entry_price,
    confidence: botState.confidence,
    indicators,
    ticker,
    daily_loss: botState.daily_loss,
    daily_max_loss: 1,
    consecutive_losses: botState.consecutive_losses,
    paused: botState.paused,
    trade_log: botState.trade_log.slice(0, 50),
    last_update: botState.last_update,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, symbol, interval, leverage } = body;

    if (action === 'start') {
      botState.running = true;
      botState.symbol = symbol || botState.symbol;
      botState.interval = interval || botState.interval;
      botState.leverage = leverage || botState.leverage;
      botState.last_update = new Date().toISOString();
      return NextResponse.json({ success: true, message: 'Bot started', state: botState });
    }

    if (action === 'stop') {
      botState.running = false;
      botState.last_update = new Date().toISOString();
      return NextResponse.json({ success: true, message: 'Bot stopped', state: botState });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
