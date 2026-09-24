import Link from "next/link"

const SAMPLE_ASSETS = [
  { symbol: "AAPL", name: "Apple Inc.", type: "Stock", sector: "Technology" },
  { symbol: "MSFT", name: "Microsoft Corp.", type: "Stock", sector: "Technology" },
  { symbol: "NVDA", name: "NVIDIA Corp.", type: "Stock", sector: "Semiconductors" },
  { symbol: "VOO", name: "Vanguard S&P 500 ETF", type: "ETF", sector: "Index" },
  { symbol: "QQQ", name: "Invesco QQQ Trust", type: "ETF", sector: "Tech Index" },
]

export default function MarketsPage() {
  return (
    <div className="max-w-7xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Stock & ETF Screener</h1>

      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 uppercase text-xs text-slate-400">
              <tr>
                <th className="p-3">Symbol</th>
                <th className="p-3">Asset Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Sector</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {SAMPLE_ASSETS.map((asset) => (
                <tr key={asset.symbol}>
                  <td className="p-3 font-semibold text-white">{asset.symbol}</td>
                  <td className="p-3">{asset.name}</td>
                  <td className="p-3">{asset.type}</td>
                  <td className="p-3">{asset.sector}</td>
                  <td className="p-3">
                    <Link
                      href={`/trade/${asset.symbol}`}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-xs text-white font-medium"
                    >
                      Trade
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}