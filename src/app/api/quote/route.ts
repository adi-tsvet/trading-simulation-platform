import { NextResponse } from "next/server"

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY || "YOUR_FINNHUB_API_KEY"

// Finnhub Quote API response schema:
// c: Current price
// d: Change
// dp: Percent change
// h: High price of the day
// l: Low price of the day
// o: Open price of the day
// pc: Previous close price
interface FinnhubQuoteResponse {
  c: number
  d: number
  dp: number
  h: number
  l: number
  o: number
  pc: number
}

interface FinnhubSearchResult {
  symbol?: string
  displaySymbol?: string
  description: string
  type: string
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get("q")

  if (!q || !q.trim()) {
    return NextResponse.json([])
  }

  try {
    // 1. Fetch matching search results from Finnhub Search Endpoint
    const searchRes = await fetch(
      `https://finnhub.io/api/v1/search?q=${encodeURIComponent(q)}&token=${FINNHUB_API_KEY}`,
      { cache: "no-store" }
    )

    if (!searchRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch search results from Finnhub" },
        { status: searchRes.status }
      )
    }

    const searchData = await searchRes.json()
    const searchResults: FinnhubSearchResult[] = (searchData.result || []).slice(0, 8)

    // 2. Fetch live quote data for each ticker concurrently using Finnhub's /quote endpoint
    const formattedResults = await Promise.all(
      searchResults.map(async (item) => {
        const symbol = item.symbol || item.displaySymbol || ""

        let price = 0
        let change = 0
        let changePercent = 0
        let high = 0
        let low = 0
        let open = 0
        let previousClose = 0

        if (symbol) {
          try {
            const quoteRes = await fetch(
              `https://finnhub.io/api/v1/quote?symbol=${encodeURIComponent(symbol)}&token=${FINNHUB_API_KEY}`,
              { cache: "no-store" }
            )

            if (quoteRes.ok) {
              const quoteData: FinnhubQuoteResponse = await quoteRes.json()

              price = quoteData.c ?? 0
              change = quoteData.d ?? 0
              changePercent = quoteData.dp ?? 0
              high = quoteData.h ?? 0
              low = quoteData.l ?? 0
              open = quoteData.o ?? 0
              previousClose = quoteData.pc ?? 0
            }
          } catch (e) {
            console.error(`Error fetching Finnhub quote for ${symbol}:`, e)
          }
        }

        return {
          symbol,
          name: item.description,
          type: item.type === "ETP" ? "ETF" : "Stock",
          price,
          change,
          changePercent,
          high,
          low,
          open,
          previousClose,
        }
      })
    )

    return NextResponse.json(formattedResults)
  } catch (error) {
    console.error("Finnhub search/quote error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}