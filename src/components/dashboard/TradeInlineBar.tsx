"use client"

import { useState } from "react"

interface TradeInlineBarProps {
  symbol: string
  currentPrice: number
  userCash: number
  onExecuteTrade: (type: "BUY" | "SELL", quantity: number) => void
}

export default function TradeInlineBar({
  symbol,
  currentPrice,
  userCash,
  onExecuteTrade,
}: TradeInlineBarProps) {
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY")
  const [quantity, setQuantity] = useState<number>(1)

  const totalValue = quantity * currentPrice
  const canAfford = tradeType === "BUY" ? totalValue <= userCash : true

  return (
    <div className="bg-[#131A29] p-4 rounded-2xl border border-gray-800 shadow-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Toggle Buy / Sell Tabs */}
        <div className="flex bg-[#0B0F17] p-1 rounded-xl border border-gray-800 w-full sm:w-auto shrink-0">
          <button
            onClick={() => setTradeType("BUY")}
            className={`px-6 py-1.5 text-xs font-bold rounded-lg transition-all ${
              tradeType === "BUY"
                ? "bg-emerald-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Buy
          </button>
          <button
            onClick={() => setTradeType("SELL")}
            className={`px-6 py-1.5 text-xs font-bold rounded-lg transition-all ${
              tradeType === "SELL"
                ? "bg-red-600 text-white shadow-md"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Sell
          </button>
        </div>

        {/* Quantity Controls & Value Preview */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 font-medium">Qty:</span>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
              className="w-20 bg-[#0B0F17] border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-center font-mono font-bold text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="text-right">
            <p className="text-[10px] uppercase text-gray-400">Total</p>
            <p className="text-sm font-mono font-bold text-white">
              ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
          </div>

          {/* Execution Button */}
          <button
            onClick={() => onExecuteTrade(tradeType, quantity)}
            disabled={!canAfford}
            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all shadow-md shrink-0 ${
              tradeType === "BUY"
                ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-gray-800 disabled:text-gray-600"
                : "bg-red-600 hover:bg-red-500 text-white disabled:bg-gray-800 disabled:text-gray-600"
            }`}
          >
            {!canAfford ? "Low Cash" : `Confirm ${tradeType}`}
          </button>
        </div>

      </div>
    </div>
  )
}