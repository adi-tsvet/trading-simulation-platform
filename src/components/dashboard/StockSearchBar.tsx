"use client"

import { useState, useRef, useEffect, useCallback } from "react"

export interface StockSearchResult {
  symbol: string
  name: string
  type: "Stock" | "ETF"
  price: number
  changePercent: number
}

interface StockSearchBarProps {
  onSelectStock: (asset: StockSearchResult) => void
}

export default function StockSearchBar({ onSelectStock }: StockSearchBarProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<StockSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Fetch results dynamically from backend API
  const fetchSearchResults = useCallback(async (searchQuery: string) => {
    try {
      const response = await fetch(`/api/stocks/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data: StockSearchResult[] = await response.json()
        setResults(data)
      } else {
        setResults([])
      }
    } catch (error) {
      console.error("Failed to fetch search results:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle input changes: set query & UI status directly in user event handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)

    if (value.trim()) {
      setIsLoading(true)
      setIsOpen(true)
    } else {
      setIsLoading(false)
      setIsOpen(false)
      setResults([])
    }
  }

  // Effect only handles async debounce timing
  useEffect(() => {
    const trimmed = query.trim()
    if (!trimmed) return

    const timer = setTimeout(() => {
      fetchSearchResults(trimmed)
    }, 300)

    return () => clearTimeout(timer)
  }, [query, fetchSearchResults])

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (asset: StockSearchResult) => {
    onSelectStock(asset)
    setQuery("")
    setResults([])
    setIsOpen(false)
    setIsLoading(false)
  }

  return (
    <div ref={searchRef} className="relative w-full md:w-96">
      <div className="flex gap-2">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search ticker or ETF (e.g. NVDA, SPY)"
            value={query}
            onChange={handleInputChange}
            onFocus={() => query.trim() !== "" && setIsOpen(true)}
            className="w-full bg-[#131A29] border border-gray-800 rounded-xl px-4 py-2 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
          />

          {isLoading && (
            <div className="absolute right-3 top-2.5">
              <svg
                className="animate-spin h-4 w-4 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          )}
        </div>

        <button
          onClick={() => results.length > 0 && handleSelect(results[0])}
          disabled={isLoading || results.length === 0}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:text-gray-500 text-white font-medium text-sm rounded-xl transition-colors shrink-0"
        >
          Search
        </button>
      </div>

      {/* Search Dropdown */}
      {isOpen && query.trim() !== "" && (
        <div className="absolute left-0 right-0 top-12 bg-[#131A29] border border-gray-700 rounded-xl shadow-2xl z-50 overflow-hidden divide-y divide-gray-800/80">
          {isLoading ? (
            <div className="p-6 flex items-center justify-center gap-3 text-xs text-gray-400">
              <svg
                className="animate-spin h-4 w-4 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Searching market assets...</span>
            </div>
          ) : results.length > 0 ? (
            results.map((asset) => (
              <div
                key={asset.symbol}
                onClick={() => handleSelect(asset)}
                className="p-3 hover:bg-gray-800/60 cursor-pointer transition-colors flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{asset.symbol}</span>
                    <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded">
                      {asset.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 line-clamp-1">{asset.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono font-semibold text-white">
                    ${asset.price.toFixed(2)}
                  </p>
                  <p
                    className={`text-xs font-mono font-medium ${
                      asset.changePercent >= 0 ? "text-emerald-400" : "text-red-400"
                    }`}
                  >
                    {asset.changePercent >= 0 ? "+" : ""}
                    {asset.changePercent.toFixed(2)}%
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-xs text-gray-400">
              No matching assets found for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  )
}