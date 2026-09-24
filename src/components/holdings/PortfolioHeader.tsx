"use client"

import { Holding } from "./HoldingCard"

interface PortfolioHeaderProps {
  holdings: Holding[]
}

export default function PortfolioHeader({ holdings }: PortfolioHeaderProps) {
  const totalPortfolioValue = holdings.reduce(
    (acc, item) => acc + item.quantity * item.currentPrice,
    0
  )
  const totalCostBasis = holdings.reduce(
    (acc, item) => acc + item.quantity * item.avgPrice,
    0
  )
  const totalProfitLoss = totalPortfolioValue - totalCostBasis
  const totalReturnPercent = totalCostBasis > 0 ? (totalProfitLoss / totalCostBasis) * 100 : 0

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-800 pb-6">
      <div>
        <h1 className="text-3xl font-bold">Your Portfolio Holdings</h1>
        <p className="text-gray-400 text-sm mt-1">Manage, inspect, and sell your investments</p>
      </div>

      <div className="flex gap-6 bg-[#131A29] p-4 rounded-2xl border border-gray-800">
        <div>
          <p className="text-xs uppercase text-gray-400">Total Value</p>
          <p className="text-xl font-mono font-bold text-white mt-0.5">
            ${totalPortfolioValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="border-l border-gray-800 pl-6">
          <p className="text-xs uppercase text-gray-400">Total Return</p>
          <p className={`text-xl font-mono font-bold mt-0.5 ${totalProfitLoss >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {totalProfitLoss >= 0 ? "+" : ""}${totalProfitLoss.toFixed(2)} ({totalReturnPercent.toFixed(2)}%)
          </p>
        </div>
      </div>
    </div>
  )
}