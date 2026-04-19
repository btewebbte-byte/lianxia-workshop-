import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { exchange, apiKey, secretKey, passphrase, symbol, side, type, quantity, price } = body;

    // Validate required fields
    if (!exchange || !symbol || !side || !quantity) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Build order request based on exchange
    let orderResult: any = null;

    if (exchange === 'binance') {
      // Binance spot order
      const timestamp = Date.now();
      const params = new URLSearchParams({
        symbol: symbol.toUpperCase(),
        side: side.toUpperCase(),
        type: type || 'MARKET',
        quantity: quantity,
        timestamp: timestamp.toString(),
      });

      // In production, you would sign this with HMAC SHA256
      // For demo, we'll simulate the response
      orderResult = {
        exchange: 'binance',
        symbol: symbol,
        side: side,
        quantity: quantity,
        price: price || 'MARKET',
        orderId: `BN${Date.now()}`,
        status: 'FILLED',
        filledQty: quantity,
        priceAvg: (Math.random() * 100000 + 90000).toFixed(2),
        commission: (parseFloat(quantity) * 0.0001).toFixed(6),
        createTime: new Date().toISOString(),
      };
    } else if (exchange === 'okx') {
      // OKX order
      orderResult = {
        exchange: 'okx',
        symbol: symbol,
        side: side,
        quantity: quantity,
        price: price || 'MARKET',
        orderId: `OKX${Date.now()}`,
        status: 'FILLED',
        filledQty: quantity,
        priceAvg: (Math.random() * 100000 + 90000).toFixed(2),
        commission: (parseFloat(quantity) * 0.0006).toFixed(6),
        createTime: new Date().toISOString(),
      };
    } else if (exchange === 'bybit') {
      orderResult = {
        exchange: 'bybit',
        symbol: symbol,
        side: side,
        quantity: quantity,
        price: price || 'MARKET',
        orderId: `BB${Date.now()}`,
        status: 'FILLED',
        filledQty: quantity,
        priceAvg: (Math.random() * 100000 + 90000).toFixed(2),
        commission: (parseFloat(quantity) * 0.00075).toFixed(6),
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

  try {
    // Fetch current price from Binance
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
