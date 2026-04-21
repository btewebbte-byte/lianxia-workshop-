import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get('symbol') || 'btcusdt';
  const interval = searchParams.get('interval') || '1m';
  const type = searchParams.get('type') || 'spot';

  try {
    let data;
    
    if (type === 'futures') {
      // Binance USDT-M Futures K-lines
      const response = await fetch(
        `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=100`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch futures kline data');
      }
      
      data = await response.json();
    } else {
      // Binance Spot K-lines
      const response = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=100`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch kline data');
      }
      
      data = await response.json();
    }
    
    // Transform to candlestick format
    const candlesticks = data.map((k: any[]) => ({
      time: k[0] / 1000,
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
    }));

    return NextResponse.json(candlesticks);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
