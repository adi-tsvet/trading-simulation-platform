import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { symbol: string } }
) {
  const symbol = params.symbol.toUpperCase()
  const apiKey = process.env.FINNHUB_API_KEY

  if (!apiKey) {
    // Fallback simulated price if API key is not configured
    const basePrices: Record<string, number> = {
      AAPL: 185.5,
      MSFT: 420.1,
      NVDA: 125.4,
      VOO: 480.2,
      QQQ: 460.8,
    }
    const currentPrice = basePrices[symbol] || 100.0
    return NextResponse.json({
      c: currentPrice,
      d: +(Math.random() * 4 - 2).toFixed(2),
      dp: +(Math.random() * 2 - 1).toFixed(2),
    })
  }

  try {
    const res = await fetch(
      `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`,
      { next: { revalidate: 30 } }
    )
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: "Failed to fetch price" }, { status: 500 })
  }
}