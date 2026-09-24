"use client"

import { useState } from "react"
import { executeTrade } from "@/app/actions/trading"
import { use } from "react"

export default function TradePage({ params }: { params: Promise<{ symbol: string }> }) {
  const resolvedParams = use(params)
  const symbol = resolvedParams.symbol.toUpperCase()
  const [quantity, setQuantity] = useState(1)
  const [orderType, setOrderType] = useState<"BUY" | "SELL">("BUY")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const simulatedPrice = 150.0 // Replace with fetched API price

  async function handleOrder(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    // Simulated user ID - replace with active session user ID
    const res = await executeTrade("user_id_here", symbol, "Stock", orderType, quantity, simulatedPrice)
    setLoading(false)

    if (res.success) {
      setMessage(`Successfully executed ${orderType} order for ${quantity} share(s) of ${symbol}!`)
    } else {
      setMessage(`Error: ${res.error}`)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-2">Trade {symbol}</h1>
      <p className="text-slate-400 mb-6">Market Price: ${simulatedPrice.toFixed(2)}</p>

      <form onSubmit={handleOrder} className="bg-slate-800 p-6 rounded-lg border border-slate-700 max-w-md">
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => setOrderType("BUY")}
            className={`flex-1 py-2 font-bold rounded ${
              orderType === "BUY" ? "bg-emerald-600 text-white" : "bg-slate-700 text-slate-300"
            }`}
          >
            BUY
          </button>
          <button
            type="button"
            onClick={() => setOrderType("SELL")}
            className={`flex-1 py-2 font-bold rounded ${
              orderType === "SELL" ? "bg-rose-600 text-white" : "bg-slate-700 text-slate-300"
            }`}
          >
            SELL
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-slate-400 mb-2">Quantity</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
          />
        </div>

        <div className="text-sm text-slate-400 mb-6">
          Estimated Total: <span className="font-bold text-white">${(quantity * simulatedPrice).toFixed(2)}</span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded font-bold text-white transition-colors"
        >
          {loading ? "Processing..." : `Execute ${orderType}`}
        </button>

        {message && <p className="mt-4 text-sm font-medium text-amber-400">{message}</p>}
      </form>
    </div>
  )
}