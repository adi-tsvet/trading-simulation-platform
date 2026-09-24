import { NextResponse } from "next/server"

// Ensure process.env.FINNHUB_API_KEY is defined in your .env.local file
const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || "YOUR_FINNHUB_API_KEY"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")

  if (!q || !q.trim()) {
    return NextResponse.json([])
  }

  try {
    // 1. Call Finnhub Symbol Search Endpoint
    const res = await fetch(
      `https://finnhub.io/api/v1/search?q=${encodeURIComponent(q)}&token=${FINNHUB_API_KEY}`,
      { cache: "no-store" }
    )

    if (!res.ok) {
      return NextResponse.json({ error: "Failed to fetch from Finnhub" }, { status: res.status })
    }

    const data = await res.json()

    // 2. Map Finnhub response format to match frontend interface
    // Finnhub returns { count: number, result: [{ description, displaySymbol, symbol, type }] }
    const formattedResults = (data.result || []).slice(0, 8).map((item: { symbol?: string; displaySymbol?: string; description: string; type: string }) => ({
      symbol: item.symbol || item.displaySymbol,
      name: item.description,
      type: item.type === "ETP" ? "ETF" : "Stock",
      // Finnhub search endpoint only returns metadata. 
      // Default price to 0 or fetch quotes separately if required.
      price: 0,
      changePercent: 0,
    }))

    return NextResponse.json(formattedResults)
  } catch (error) {
    console.error("Finnhub search error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}