"use client"

import { StockSearchResult } from "./StockSearchBar"

interface FavoritesWatchlistProps {
  favorites: StockSearchResult[]
  activeSymbol: string
  onSelectFavorite: (asset: StockSearchResult) => void
  onRemoveFavorite: (symbol: string) => void
}

export default function FavoritesWatchlist({
  favorites,
  activeSymbol,
  onSelectFavorite,
  onRemoveFavorite,
}: FavoritesWatchlistProps) {
  return (
    <div className="bg-[#131A29] p-6 rounded-2xl border border-gray-800 shadow-lg space-y-4">
      <div className="flex justify-between items-center border-b border-gray-800 pb-3">
        <h3 className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
          Favorites ({favorites.length})
        </h3>
      </div>

      {favorites.length === 0 ? (
        <p className="text-xs text-gray-500 italic py-4 text-center">
          No favorites added yet. Click the ★ next to any stock header to save it here.
        </p>
      ) : (
        <div className="space-y-2">
          {favorites.map((asset) => {
            const isActive = asset.symbol === activeSymbol
            return (
              <div
                key={asset.symbol}
                onClick={() => onSelectFavorite(asset)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                  isActive
                    ? "bg-blue-600/10 border-blue-500/50"
                    : "bg-[#0B0F17]/60 border-gray-800/80 hover:border-gray-700 hover:bg-[#0B0F17]"
                }`}
              >
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white text-sm">{asset.symbol}</span>
                    <span className="text-[10px] text-gray-400">({asset.type})</span>
                  </div>
                  <p className="text-xs text-gray-400 truncate max-w-[120px]">
                    {asset.name}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs font-mono font-bold text-white">
                      ${asset.price.toFixed(2)}
                    </p>
                    <p
                      className={`text-[11px] font-mono ${
                        asset.changePercent >= 0 ? "text-emerald-400" : "text-red-400"
                      }`}
                    >
                      {asset.changePercent >= 0 ? "+" : ""}
                      {asset.changePercent.toFixed(2)}%
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveFavorite(asset.symbol)
                    }}
                    className="text-gray-500 hover:text-red-400 text-sm p-1 transition-colors"
                    title="Remove from favorites"
                  >
                    ★
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}