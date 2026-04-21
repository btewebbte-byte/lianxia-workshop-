import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// ==================== Bot状态 ====================
interface BotState {
  running: boolean;
  symbol: string;
  interval: string;
  leverage: number;
  exchange: string;
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
  signal: string;
  daily_loss: number;
  daily_loss_date: string;
  consecutive_losses: number;
  paused: boolean;
  paused_until?: number;
  last_trade_time?: number;
  trade_log: TradeRecord[];
  last_update: string;
  apiKey?: string;
  secretKey?: string;
  passphrase?: string;
}

interface TradeRecord {
  time: string;
  side: string;
  reason: string;
  price: string;
  amount: string;
  orderId?: string;
  exchange?: string;
  symbol?: string;
  pnl?: number;
  pnl_pct?: number;
  confidence?: number;
  leverage?: number;
  margin?: number;
  status?: string;
  stop_loss?: number;
  take_profit?: number;
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

// 全局Bot状态（Vercel serverless中状态不持久，每次请求重新初始化）
let botState: BotState = {
  running: false,
  symbol: 'BTCUSDT',
  interval: '1h',
  leverage: 10,
  exchange: 'binance',
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

// ==================== 工具函数 ====================
function hmacSHA256(secret: string, message: string): string {
  return crypto.createHmac('sha256', secret).update(message).digest('hex');
}

async function binanceFuturesOrder(
  apiKey: string,
  secretKey: string,
  symbol: string,
  side: 'BUY' | 'SELL',
  positionSide: 'LONG' | 'SHORT',
  orderType: 'MARKET' | 'LIMIT',
  quantity: string,
  leverage: number,
  price?: string
): Promise<any> {
  const timestamp = Date.now();
  const params: Record<string, string> = {
    symbol: symbol.toUpperCase(),
    side,
    positionSide,
    type: orderType,
    quantity,
    leverage: leverage.toString(),
    timestamp: timestamp.toString(),
  };
  if (orderType === 'LIMIT' && price) {
    params.price = price;
    params.timeInForce = 'GTC';
  }
  const queryString = Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&');
  const signature = hmacSHA256(secretKey, queryString);
  const url = `https://fapi.binance.com/fapi/v1/order?${queryString}&signature=${signature}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'X-MBX-APIKEY': apiKey },
  });
  return await res.json();
}

async function binanceSetLeverage(apiKey: string, secretKey: string, symbol: string, leverage: number): Promise<any> {
  const timestamp = Date.now();
  const params = { symbol: symbol.toUpperCase(), leverage: leverage.toString(), timestamp: timestamp.toString() };
  const queryString = Object.entries(params).map(([k, v]) => `${k}=${v}`).join('&');
  const signature = hmacSHA256(secretKey, queryString);
  const url = `https://fapi.binance.com/fapi/v1/leverage?${queryString}&signature=${signature}`;
  return await (await fetch(url, { method: 'POST', headers: { 'X-MBX-APIKEY': apiKey } })).json();
}

async function okxFuturesOrder(
  apiKey: string,
  secretKey: string,
  passphrase: string,
  symbol: string,
  side: 'buy' | 'sell',
  posSide: 'long' | 'short',
  ordType: 'market',
  sz: string,
  lever: number
): Promise<any> {
  const timestamp = new Date().toISOString();
  const method = 'POST';
  const path = '/api/v5/trade/order';
  const body = JSON.stringify({
    instId: symbol.replace('USDT', '-USDT-SWAP').toUpperCase(),
    tdMode: 'cross',
    side,
    posSide,
    ordType,
    sz,
    lever: lever.toString(),
  });
  const message = timestamp + method + path + body;
  const sign = crypto.createHmac('sha256', secretKey).update(message).digest('base64');
  const key = crypto.createHmac('sha256', crypto.createHash('sha256').update(secretKey).digest('hex')).update(timestamp + method + path + body).digest('base64');
  const res = await fetch(`https://www.okx.com${path}`, {
    method,
    headers: {
      'OK-ACCESS-KEY': apiKey,
      'OK-ACCESS-SIGN': sign,
      'OK-ACCESS-TIMESTAMP': timestamp,
      'OK-ACCESS-PASSPHRASE': passphrase,
      'Content-Type': 'application/json',
    },
    body,
  });
  return await res.json();
}

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
    if (arr.length === 0) return arr[0];
    const k = 2 / (span + 1);
    let emaVal = arr[0];
    for (let i = 1; i < arr.length; i++) emaVal = arr[i] * k + emaVal * (1 - k);
    return emaVal;
  };
  if (closes.length < slow + signal) return { macd: 0, signal: 0, hist: 0 };
  const emaFast = ema(closes, fast);
  const emaSlow = ema(closes, slow);
  const macd = emaFast - emaSlow;
  const histArr = [];
  for (let i = slow; i < closes.length; i++) {
    const ef = ema(closes.slice(0, i + 1), fast);
    const es = ema(closes.slice(0, i + 1), slow);
    histArr.push(ef - es);
  }
  const sig = ema(histArr, signal);
  return { macd, signal: sig, hist: macd - sig };
}

function computeBollingerBands(closes: number[], period: number = 20, stdDev: number = 2) {
  if (closes.length < period) return { upper: closes[closes.length - 1] * 1.02, middle: closes[closes.length - 1], lower: closes[closes.length - 1] * 0.98 };
  const slice = closes.slice(-period);
  const middle = slice.reduce((a, b) => a + b, 0) / period;
  const variance = slice.reduce((sum, val) => sum + Math.pow(val - middle, 2), 0) / period;
  const std = Math.sqrt(variance);
  return { upper: middle + std * stdDev, middle, lower: middle - std * stdDev };
}

function computeSupportResistance(highs: number[], lows: number[], lookback: number = 50) {
  return {
    support: Math.min(...lows.slice(-lookback)),
    resistance: Math.max(...highs.slice(-lookback)),
  };
}

function computeConfidence(
  rsi: number, macd: number, macdSignal: number, macdHist: number,
  bbUpper: number, bbLower: number, currentPrice: number,
  support: number, resistance: number
): { confidence: number; signal: 'buy' | 'sell' | 'hold' } {
  let totalScore = 0;
  if (rsi < 30) totalScore += 25;
  else if (rsi < 40) totalScore += 15;
  else if (rsi > 80) totalScore -= 20;
  else if (rsi > 70) totalScore -= 10;
  else totalScore += 5;

  if (macd > macdSignal && macdHist > 0) totalScore += 25;
  else if (macd > macdSignal) totalScore += 15;
  else if (macd < macdSignal && macdHist < 0) totalScore -= 15;
  else if (macd < macdSignal) totalScore -= 5;

  const bbRange = bbUpper - bbLower;
  if (bbRange > 0) {
    if (currentPrice <= bbLower) totalScore += 20;
    else if (currentPrice < bbLower * 1.02) totalScore += 10;
    else if (currentPrice >= bbUpper) totalScore -= 15;
    else if (currentPrice > bbUpper * 0.98) totalScore -= 5;
  }

  if (support > 0) {
    const dist = ((currentPrice - support) / support) * 100;
    if (dist < 1.0) totalScore += 15;
    else if (dist < 2.0) totalScore += 8;
    else if (dist > 5 && currentPrice > resistance * 0.98) totalScore -= 10;
  }

  let confidence = Math.max(0, Math.min(100, 50 + totalScore));
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
  } catch { return []; }
}

async function fetchFuturesTicker(symbol: string): Promise<any> {
  try {
    const url = `https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${symbol.toUpperCase()}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch { return null; }
}

async function runBotCycle(): Promise<void> {
  if (!botState.running) return;

  const today = new Date().toISOString().split('T')[0];
  if (botState.daily_loss_date !== today) {
    botState.daily_loss = 0;
    botState.daily_loss_date = today;
    botState.consecutive_losses = 0;
  }

  if (botState.paused && botState.paused_until && Date.now() < botState.paused_until) return;
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
  if (botState.last_trade_time && (Date.now() - botState.last_trade_time) < 5 * 60 * 1000) return;

  // 止损止盈检查
  if (botState.position !== 'none' && botState.entry_price && botState.entry_amount) {
    const pnlPct = (currentPrice - botState.entry_price) / botState.entry_price * 100 * (botState.position === 'short' ? -1 : 1);
    const stopLoss = -5;
    const takeProfit = 10;

    if (pnlPct <= stopLoss || pnlPct >= takeProfit || signal === 'sell') {
      const reason = pnlPct <= stopLoss ? '止损' : pnlPct >= takeProfit ? '止盈' : '技术卖出';
      const pnl = (currentPrice - botState.entry_price) * botState.entry_amount * (botState.position === 'short' ? -1 : 1);
      const margin = (botState.entry_amount * botState.entry_price) / botState.leverage;

      botState.trade_log.unshift({
        time: new Date().toISOString(),
        side: botState.position === 'long' ? 'sell' : 'buy',
        reason,
        price: currentPrice.toFixed(2),
        amount: botState.entry_amount.toFixed(4),
        orderId: `CLOSE-${Date.now()}`,
        exchange: botState.exchange,
        symbol: botState.symbol,
        pnl,
        pnl_pct: pnlPct,
        confidence,
        leverage: botState.leverage,
        margin,
        status: 'FILLED',
        stop_loss: stopLoss,
        take_profit: takeProfit,
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
    if (!botState.apiKey || !botState.secretKey) {
      // 没有API密钥，只记录模拟信号
      botState.trade_log.unshift({
        time: new Date().toISOString(),
        side: 'buy',
        reason: `买入信号 (置信度${confidence.toFixed(1)}%) - 无API密钥`,
        price: currentPrice.toFixed(2),
        amount: '0',
        exchange: botState.exchange,
        symbol: botState.symbol,
        confidence,
        status: 'SIGNAL_ONLY',
      });
      botState.last_trade_time = Date.now();
      return;
    }

    try {
      const tradeValue = 10; // 每笔10 USDT
      const amount = tradeValue / currentPrice;
      const quantity = amount.toFixed(3);

      let orderResult: any = null;

      if (botState.exchange === 'binance') {
        // 先设置杠杆
        await binanceSetLeverage(botState.apiKey, botState.secretKey, botState.symbol, botState.leverage);
        // 市价开多
        orderResult = await binanceFuturesOrder(
          botState.apiKey, botState.secretKey,
          botState.symbol, 'BUY', 'LONG', 'MARKET', quantity, botState.leverage
        );
      } else if (botState.exchange === 'okx') {
        orderResult = await okxFuturesOrder(
          botState.apiKey, botState.secretKey, botState.passphrase || '',
          botState.symbol, 'buy', 'long', 'market', quantity, botState.leverage
        );
      }

      const margin = (parseFloat(quantity) * currentPrice) / botState.leverage;
      const orderId = orderResult?.orderId || orderResult?.data?.[0]?.ordId || `SIM-${Date.now()}`;

      botState.position = 'long';
      botState.entry_price = currentPrice;
      botState.entry_amount = parseFloat(quantity);

      botState.trade_log.unshift({
        time: new Date().toISOString(),
        side: 'buy',
        reason: `买入信号 (置信度${confidence.toFixed(1)}%)`,
        price: currentPrice.toFixed(2),
        amount: quantity,
        orderId: orderId.toString(),
        exchange: botState.exchange,
        symbol: botState.symbol,
        confidence,
        leverage: botState.leverage,
        margin,
        status: orderResult?.code === 0 || orderResult?.code === undefined ? 'OPEN_PENDING' : 'ERROR',
      });

      botState.last_trade_time = Date.now();
    } catch (e: any) {
      botState.trade_log.unshift({
        time: new Date().toISOString(),
        side: 'buy',
        reason: `开仓失败: ${e.message}`,
        price: currentPrice.toFixed(2),
        amount: '0',
        exchange: botState.exchange,
        symbol: botState.symbol,
        confidence,
        status: 'ERROR',
      });
    }
  }
}

// ==================== API Handler ====================
export async function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;
  const symbol = sp.get('symbol') || botState.symbol;
  const interval = sp.get('interval') || botState.interval;
  const exchange = sp.get('exchange') || botState.exchange;

  if (botState.running) await runBotCycle();

  const ticker = await fetchFuturesTicker(symbol);

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
    signal: (botState.signal as 'buy' | 'sell' | 'hold') || 'hold',
  };

  return NextResponse.json({
    running: botState.running,
    symbol: botState.symbol,
    interval: botState.interval,
    leverage: botState.leverage,
    exchange: botState.exchange,
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
    const { action, symbol, interval, leverage, exchange, apiKey, secretKey, passphrase } = body;

    if (action === 'start') {
      botState.running = true;
      botState.symbol = symbol || botState.symbol;
      botState.interval = interval || botState.interval;
      botState.leverage = leverage || botState.leverage;
      botState.exchange = exchange || botState.exchange;
      if (apiKey) botState.apiKey = apiKey;
      if (secretKey) botState.secretKey = secretKey;
      if (passphrase) botState.passphrase = passphrase;
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
