"use client"

import { useState } from "react"

interface TradeOrderPanelProps {
  symbol: string
  currentPrice: number
  userCash: number
  onExecuteTrade: (type: "BUY" | "SELL", quantity: number) => void
}

export default function TradeOrderPanel({
  symbol,
  currentPrice,
  userCash,
  onExecuteTrade,
}: TradeOrderPanelProps) {
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY")
  const [quantity, setQuantity] = useState<number>(1)

  const totalValue = quantity * currentPrice
  const canAfford = tradeType === "BUY" ? totalValue <= userCash : true

  return (
    <div className="bg-[#131A29] p-6 rounded-2xl border border-gray-800 shadow-lg space-y-5">
      {/* Buy / Sell Toggle Tabs */}
      <div className="grid grid-cols-2 p-1 bg-[#0B0F17] rounded-xl border border-gray-800">
        <button
          onClick={() => setTradeType("BUY")}
          className={`py-2 text-sm font-bold rounded-lg transition-all ${
            tradeType === "BUY" ? "bg-emerald-600 text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          Buy
        </button>
        <button
          onClick={() => setTradeType("SELL")}
          className={`py-2 text-sm font-bold rounded-lg transition-all ${
            tradeType === "SELL" ? "bg-red-600 text-white" : "text-gray-400 hover:text-white"
          }`}
        >
          Sell
        </button>
      </div>

      {/* Input Field */}
      <div className="space-y-2">
        <label className="text-xs text-gray-400 font-medium">Quantity</label>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
          className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Total Order Summary */}
      <div className="flex justify-between items-center text-sm pt-2">
        <span className="text-gray-400">Total Order Value</span>
        <span className="font-mono text-lg font-bold text-white">
          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      </div>

      {/* Execution Button */}
      <button
        onClick={() => onExecuteTrade(tradeType, quantity)}
        disabled={!canAfford}
        className={`w-full py-3 rounded-xl font-bold transition-all shadow-md ${
          tradeType === "BUY"
            ? "bg-emerald-600 hover:bg-emerald-500 text-white disabled:bg-gray-800 disabled:text-gray-600"
            : "bg-red-600 hover:bg-red-500 text-white disabled:bg-gray-800 disabled:text-gray-600"
        }`}
      >
        {!canAfford
          ? "Insufficient Cash Balance"
          : `Confirm ${tradeType} ${quantity} ${symbol}`}
      </button>
    </div>
  )
}