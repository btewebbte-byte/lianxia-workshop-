import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { exchange, apiKey, secretKey, passphrase, symbol, side, positionSide, type, quantity, leverage, price, isFutures } = body;

    if (!exchange || !symbol || !side || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Futures Trading - Real API call to Binance USDT-M Futures
    if (isFutures && exchange === 'binance') {
      const timestamp = Date.now();
      
      // Build signed request for futures order
      const queryString = `symbol=${symbol.toUpperCase()}&side=${side}&positionSide=${positionSide}&type=${type || 'MARKET'}&quantity=${quantity}&timestamp=${timestamp}`;
      
      // For demo: simulate successful futures order
      // In production, you would sign with HMAC SHA256 and call:
      // https://fapi.binance.com/fapi/v1/order
      const orderResult = {
        orderId: `F${Date.now()}`,
        exchange: 'binance',
        symbol: symbol,
        side: side,
        positionSide: positionSide,
        quantity: quantity,
        leverage: leverage || 10,
        priceAvg: (Math.random() * 100000 + 90000).toFixed(2),
        margin: (parseFloat(quantity) * (Math.random() * 100000 + 90000) / (leverage || 10)).toFixed(2),
        status: 'FILLED',
        commission: (parseFloat(quantity) * 0.0002).toFixed(6),
        createTime: new Date().toISOString(),
      };
      
      return NextResponse.json(orderResult);
    }

    // Spot Trading (original logic)
    let orderResult: any = null;

    if (exchange === 'binance') {
      orderResult = {
        orderId: `BN${Date.now()}`,
        exchange: 'binance',
        symbol: symbol,
        side: side,
        quantity: quantity,
        price: price || 'MARKET',
        status: 'FILLED',
        filledQty: quantity,
        priceAvg: (Math.random() * 100000 + 90000).toFixed(2),
        commission: (parseFloat(quantity) * 0.0001).toFixed(6),
        createTime: new Date().toISOString(),
      };
    } else if (exchange === 'okx') {
      orderResult = {
        orderId: `OKX${Date.now()}`,
        exchange: 'okx',
        symbol: symbol,
        side: side,
        quantity: quantity,
        price: price || 'MARKET',
        status: 'FILLED',
        filledQty: quantity,
        priceAvg: (Math.random() * 100000 + 90000).toFixed(2),
        commission: (parseFloat(quantity) * 0.0006).toFixed(6),
        createTime: new Date().toISOString(),
      };
    } else {
      return NextResponse.json({ error: 'Unsupported exchange' }, { status: 400 });
    }

    return NextResponse.json(orderResult);
  } catch (error) {
    return NextResponse.json({ error: 'Order failed' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const exchange = searchParams.get('exchange');
  const symbol = searchParams.get('symbol') || 'BTCUSDT';
  const type = searchParams.get('type') || 'spot';

  try {
    // Futures ticker from Binance USDT-M Futures
    if (type === 'futures') {
      const response = await fetch(
        `https://fapi.binance.com/fapi/v1/ticker/24hr?symbol=${symbol.toUpperCase()}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch futures ticker');
      }
      
      const data = await response.json();
      
      return NextResponse.json({
        symbol: data.symbol,
        price: parseFloat(data.lastPrice),
        priceChange: parseFloat(data.priceChange),
        priceChangePercent: parseFloat(data.priceChangePercent),
        high: parseFloat(data.highPrice),
        low: parseFloat(data.lowPrice),
        volume: parseFloat(data.volume),
        quoteVolume: parseFloat(data.quoteVolume),
        timestamp: Date.now(),
      });
    }

    // Spot ticker
    const response = await fetch(
      `https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol.toUpperCase()}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch price');
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      symbol: data.symbol,
      price: parseFloat(data.lastPrice),
      priceChange: parseFloat(data.priceChange),
      priceChangePercent: parseFloat(data.priceChangePercent),
      high: parseFloat(data.highPrice),
      low: parseFloat(data.lowPrice),
      volume: parseFloat(data.volume),
      quoteVolume: parseFloat(data.quoteVolume),
      timestamp: Date.now(),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch price' }, { status: 500 });
  }
}
