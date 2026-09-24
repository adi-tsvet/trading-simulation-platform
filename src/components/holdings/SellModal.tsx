"use client"

import { useState } from "react"
import { Holding } from "./HoldingCard"

interface SellModalProps {
  holding: Holding
  onClose: () => void
  onConfirmSell: (holding: Holding, quantity: number) => void
}

export default function SellModal({ holding, onClose, onConfirmSell }: SellModalProps) {
  const [sellQty, setSellQty] = useState<number>(1)
  const [isConfirmingStep, setIsConfirmingStep] = useState(false)

  const totalProceeds = sellQty * holding.currentPrice

  const handleProceedToConfirm = (e: React.FormEvent) => {
    e.preventDefault()
    if (sellQty > 0 && sellQty <= holding.quantity) {
      setIsConfirmingStep(true)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#131A29] border border-gray-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-4">
          <div>
            <h3 className="text-lg font-bold">Sell {holding.symbol}</h3>
            <p className="text-xs text-gray-400">You currently own {holding.quantity} shares</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        {!isConfirmingStep ? (
          /* Step 1: Input Quantity */
          <form onSubmit={handleProceedToConfirm} className="space-y-5">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Market Price:</span>
              <span className="font-mono text-white font-bold">${holding.currentPrice.toFixed(2)}</span>
            </div>

            <div className="space-y-2">
              <label className="text-xs text-gray-400 font-medium">Quantity to Sell</label>
              <input
                type="number"
                min="1"
                max={holding.quantity}
                value={sellQty}
                onChange={(e) =>
                  setSellQty(
                    Math.min(
                      holding.quantity,
                      Math.max(1, parseInt(e.target.value) || 0)
                    )
                  )
                }
                className="w-full bg-[#0B0F17] border border-gray-700 rounded-xl px-4 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-gray-800">
              <span className="text-xs text-gray-400">Estimated Total Proceeds</span>
              <span className="font-mono text-base font-bold text-emerald-400">
                ${totalProceeds.toFixed(2)}
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="w-1/2 py-2.5 bg-gray-800 hover:bg-gray-700 rounded-xl text-xs font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-1/2 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
              >
                Review Sell Order
              </button>
            </div>
          </form>
        ) : (
          /* Step 2: Confirmation Warning Prompt */
          <div className="space-y-5">
            <div className="bg-red-950/40 border border-red-800/60 p-4 rounded-xl space-y-2 text-left">
              <p className="text-xs font-bold uppercase tracking-wider text-red-400">Confirm Order Execution</p>
              <p className="text-sm text-gray-200">
                Are you sure you want to sell <span className="font-bold text-white">{sellQty} share(s)</span> of{" "}
                <span className="font-bold text-white">{holding.symbol}</span> for{" "}
                <span className="font-mono font-bold text-emerald-400">${totalProceeds.toFixed(2)}</span>?
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsConfirmingStep(false)}
                className="w-1/2 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => onConfirmSell(holding, sellQty)}
                className="w-1/2 py-2.5 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md"
              >
                Yes, Sell Now
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}