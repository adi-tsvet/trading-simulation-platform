"use client"

export interface Holding {
  id: string
  symbol: string
  name: string
  quantity: number
  avgPrice: number
  currentPrice: number
}

interface HoldingCardProps {
  holding: Holding
  onOpenSellModal: (holding: Holding) => void
}

export default function HoldingCard({ holding, onOpenSellModal }: HoldingCardProps) {
  const currentTotalValue = holding.quantity * holding.currentPrice
  const totalCost = holding.quantity * holding.avgPrice
  const profitLoss = currentTotalValue - totalCost
  const returnPct = totalCost > 0 ? (profitLoss / totalCost) * 100 : 0

  return (
    <div className="bg-[#131A29] rounded-2xl border border-gray-800 p-6 flex flex-col justify-between shadow-lg space-y-6 hover:border-gray-700 transition-colors">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-white">{holding.symbol}</h2>
            <p className="text-xs text-gray-400">{holding.name}</p>
          </div>
          <span className="px-2.5 py-1 rounded-lg bg-blue-600/10 border border-blue-500/30 text-blue-400 text-xs font-mono font-semibold">
            {holding.quantity} Shares
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-gray-800/80">
          <div>
            <p className="text-gray-400">Avg Buy Price</p>
            <p className="font-mono font-bold text-white mt-0.5">${holding.avgPrice?.toFixed(2) ?? "0.00"}</p>
          </div>
          <div>
            <p className="text-gray-400">Current Price</p>
            <p className="font-mono font-bold text-white mt-0.5">${holding.currentPrice?.toFixed(2) ?? "0.00"}</p>
          </div>
          <div>
            <p className="text-gray-400">Market Value</p>
            <p className="font-mono font-bold text-emerald-400 mt-0.5">
              ${currentTotalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Unrealized P/L</p>
            <p className={`font-mono font-bold mt-0.5 ${profitLoss >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {profitLoss >= 0 ? "+" : ""}${profitLoss.toFixed(2)} ({returnPct.toFixed(2)}%)
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={() => onOpenSellModal(holding)}
        className="w-full py-2.5 bg-red-600/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/30 hover:border-transparent rounded-xl text-xs font-bold transition-all shadow-md"
      >
        Sell {holding.symbol}
      </button>
    </div>
  )
}