import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const symbol = searchParams.get('symbol') || 'btcusdt';
  const interval = searchParams.get('interval') || '1m';
  const type = searchParams.get('type') || 'spot';

  try {
    let url: string;
    if (type === 'futures') {
      url = `https://fapi.binance.com/fapi/v1/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=100`;
    } else {
      url = `https://api.binance.com/api/v3/klines?symbol=${symbol.toUpperCase()}&interval=${interval}&limit=100`;
    }

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const text = await response.text();
      return NextResponse.json({ error: `Binance API error: ${response.status} - ${text}` }, { status: 502 });
    }

    const data = await response.json();

    const candlesticks = data.map((k: any[]) => ({
      time: k[0] / 1000,
      open: parseFloat(k[1]),
      high: parseFloat(k[2]),
      low: parseFloat(k[3]),
      close: parseFloat(k[4]),
      volume: parseFloat(k[5]),
    }));

    return NextResponse.json(candlesticks);
  } catch (error: any) {
    return NextResponse.json({ error: `Network error: ${error.message}` }, { status: 500 });
  }
}
