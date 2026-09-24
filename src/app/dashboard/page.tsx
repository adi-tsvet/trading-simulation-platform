"use client"

import { useState } from "react"
import StockChart from "@/components/dashboard/StockChart"
import StockStats from "@/components/dashboard/StockStats"
import TradeInlineBar from "@/components/dashboard/TradeInlineBar"
import StockSearchBar, { StockSearchResult } from "@/components/dashboard/StockSearchBar"
import FavoritesWatchlist from "@/components/dashboard/FavoritesWatchlist"

const INITIAL_FAVORITES: StockSearchResult[] = [
  { symbol: "AAPL", name: "Apple Inc.", type: "Stock", price: 232.50, changePercent: 1.96 },
  { symbol: "NVDA", name: "NVIDIA Corporation", type: "Stock", price: 128.15, changePercent: 3.42 },
  { symbol: "TSLA", name: "Tesla, Inc.", type: "Stock", price: 245.80, changePercent: -1.15 },
]

const MOCK_CHART_DATA = [
  { time: "Mar 2026", price: 188.50 },
  { time: "Apr 2026", price: 182.20 },
  { time: "May 2026", price: 202.50 },
  { time: "Jun 2026", price: 236.00 },
  { time: "Jul 2026", price: 210.40 },
  { time: "Aug 2026", price: 195.10 },
  { time: "Sep 2026", price: 228.03 },
  { time: "Today", price: 232.50 },
]

const MOCK_STATS = {
  open: 228.03,
  high: 234.95,
  low: 224.02,
  mktCap: "3.43T",
  peRatio: 28.51,
  fiftyTwoWkHigh: 237.23,
  fiftyTwoWkLow: 164.27,
  dividend: "0.44%",
}

export default function DashboardPage() {
  const [activeAsset, setActiveAsset] = useState<StockSearchResult>({
    symbol: "AAPL",
    name: "Apple Inc.",
    type: "Stock",
    price: 232.50,
    changePercent: 1.96,
  })

  const [favorites, setFavorites] = useState<StockSearchResult[]>(INITIAL_FAVORITES)
  const [timeframe, setTimeframe] = useState("5Y")

  const isFavorite = favorites.some((f) => f.symbol === activeAsset.symbol)

  const toggleFavorite = () => {
    if (isFavorite) {
      setFavorites(favorites.filter((f) => f.symbol !== activeAsset.symbol))
    } else {
      setFavorites([...favorites, activeAsset])
    }
  }

  const handleTrade = (type: "BUY" | "SELL", qty: number) => {
    alert(`${type} order executed for ${qty} shares of ${activeAsset.symbol}`)
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Top Bar Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Trading Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">Welcome back, Adnan Ali</p>
          </div>

          <StockSearchBar onSelectStock={setActiveAsset} />
        </div>

        {/* Grid Structure */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Pane */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Header info */}
            <div className="flex justify-between items-end bg-[#131A29] p-6 rounded-2xl border border-gray-800">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-extrabold">{activeAsset.symbol}</h2>
                  <button
                    onClick={toggleFavorite}
                    className={`text-xl transition-transform hover:scale-110 ${
                      isFavorite ? "text-yellow-400" : "text-gray-600 hover:text-yellow-400"
                    }`}
                  >
                    ★
                  </button>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {activeAsset.name} • Real-time Quote
                </p>
              </div>

              <div className="text-right">
                <p className="text-3xl font-mono font-extrabold">
                  ${activeAsset.price.toFixed(2)}
                </p>
                <p
                  className={`text-sm font-semibold mt-0.5 ${
                    activeAsset.changePercent >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {activeAsset.changePercent >= 0 ? "+" : ""}
                  {(activeAsset.price * (activeAsset.changePercent / 100)).toFixed(2)} (
                  {activeAsset.changePercent.toFixed(2)}%)
                </p>
              </div>
            </div>

            {/* Price Chart */}
            <StockChart
              symbol={activeAsset.symbol}
              currentPrice={activeAsset.price}
              priceChange={activeAsset.changePercent}
              data={MOCK_CHART_DATA}
              timeframe={timeframe}
              onTimeframeChange={setTimeframe}
            />

            {/* Inline Trade Action Bar */}
            <TradeInlineBar
              symbol={activeAsset.symbol}
              currentPrice={activeAsset.price}
              userCash={10000}
              onExecuteTrade={handleTrade}
            />

            {/* Key Fundamentals Stats */}
            <StockStats stats={MOCK_STATS} />
          </div>

          {/* Side Watchlist Column */}
          <div className="space-y-6">
            <FavoritesWatchlist
              favorites={favorites}
              activeSymbol={activeAsset.symbol}
              onSelectFavorite={setActiveAsset}
              onRemoveFavorite={(symbol) =>
                setFavorites(favorites.filter((f) => f.symbol !== symbol))
              }
            />
          </div>

        </div>
      </div>
    </div>
  )
}