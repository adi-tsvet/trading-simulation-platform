"use client"

import { useState } from "react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface PricePoint {
  time: string
  price: number
}

interface StockChartProps {
  symbol: string
  currentPrice: number
  priceChange: number
  data: PricePoint[]
  timeframe: string
  onTimeframeChange: (tf: string) => void
}

const TIMEFRAMES = ["1D", "5D", "1M", "6M", "YTD", "1Y", "5Y"]

export default function StockChart({
  symbol,
  currentPrice,
  priceChange,
  data,
  timeframe,
  onTimeframeChange,
}: StockChartProps) {
  const isPositive = priceChange >= 0
  const chartColor = isPositive ? "#22c55e" : "#ef4444"

  // Calculate dynamic domain min/max so graph fills vertical space nicely
  const prices = data.map((d) => d.price)
  const minPrice = prices.length ? Math.min(...prices) * 0.995 : 0
  const maxPrice = prices.length ? Math.max(...prices) * 1.005 : 100

  return (
    <div className="bg-[#131A29] p-6 rounded-2xl border border-gray-800 shadow-lg space-y-4">
      {/* Timeframe Selector Header */}
      <div className="flex justify-between items-center border-b border-gray-800/80 pb-4">
        <div>
          <span className="text-xs uppercase font-semibold text-gray-400 tracking-wider">
            Price Chart
          </span>
        </div>
        <div className="flex gap-1 bg-[#0B0F17] p-1 rounded-xl border border-gray-800">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf}
              onClick={() => onTimeframeChange(tf)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                timeframe === tf
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts Area Chart */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id={`color-${symbol}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={chartColor} stopOpacity={0.35} />
                <stop offset="95%" stopColor={chartColor} stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <XAxis
              dataKey="time"
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              stroke="#6b7280"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(val) => `$${val.toFixed(0)}`}
            />

            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const pData = payload[0].payload as PricePoint
                  return (
                    <div className="bg-[#0B0F17]/95 border border-gray-700 p-2.5 rounded-xl shadow-xl backdrop-blur-md">
                      <p className="text-[#9CA3AF] text-xs">{pData.time}</p>
                      <p className="text-white font-mono font-bold text-sm mt-0.5">
                        ${pData.price.toFixed(2)} USD
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />

            <Area
              type="monotone"
              dataKey="price"
              stroke={chartColor}
              strokeWidth={2}
              fillOpacity={1}
              fill={`url(#color-${symbol})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}