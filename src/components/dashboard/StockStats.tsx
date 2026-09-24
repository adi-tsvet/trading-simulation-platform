interface StockStatsProps {
  stats: {
    open: number
    high: number
    low: number
    mktCap: string
    peRatio: number
    fiftyTwoWkHigh: number
    fiftyTwoWkLow: number
    dividend: string
  }
}

export default function StockStats({ stats }: StockStatsProps) {
  const items = [
    { label: "Open", value: `$${stats.open.toFixed(2)}` },
    { label: "High", value: `$${stats.high.toFixed(2)}` },
    { label: "Low", value: `$${stats.low.toFixed(2)}` },
    { label: "Mkt cap", value: stats.mktCap },
    { label: "P/E ratio", value: stats.peRatio.toFixed(2) },
    { label: "52-wk high", value: `$${stats.fiftyTwoWkHigh.toFixed(2)}` },
    { label: "52-wk low", value: `$${stats.fiftyTwoWkLow.toFixed(2)}` },
    { label: "Dividend yield", value: stats.dividend },
  ]

  return (
    <div className="bg-[#131A29] p-6 rounded-2xl border border-gray-800 shadow-lg">
      <h3 className="text-xs uppercase font-semibold text-gray-400 tracking-wider mb-4">
        Key Statistics
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-y-4 gap-x-6 text-sm">
        {items.map((item) => (
          <div key={item.label} className="flex justify-between border-b border-gray-800/60 pb-2">
            <span className="text-gray-400">{item.label}</span>
            <span className="font-mono font-medium text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}