import { prisma } from "@/lib/prisma"
import Link from "next/link"

export const revalidate = 0

export default async function DashboardPage() {
  // Sample default user lookup (or from auth session)
  const user = await prisma.user.findFirst({
    include: { holdings: true, transactions: { take: 5, orderBy: { createdAt: "desc" } } },
  })

  if (!user) {
    return (
      <div className="p-8 text-center text-slate-300">
        No user profile found. Please run database seed or log in.
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Trader Dashboard</h1>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-slate-400 text-sm font-medium">Virtual Cash</h2>
          <p className="text-3xl font-bold text-emerald-400 mt-2">
            ${user.virtualCash.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-slate-400 text-sm font-medium">Active Holdings</h2>
          <p className="text-3xl font-bold text-indigo-400 mt-2">{user.holdings.length} Assets</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">
          <h2 className="text-slate-400 text-sm font-medium">Account Role</h2>
          <p className="text-3xl font-bold text-amber-400 mt-2">{user.role}</p>
        </div>
      </div>

      {/* Holdings Table */}
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6 mb-8">
        <h2 className="text-xl font-bold mb-4">Your Portfolio Holdings</h2>
        {user.holdings.length === 0 ? (
          <p className="text-slate-400">No active stock or ETF positions.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900 uppercase text-xs text-slate-400">
                <tr>
                  <th className="p-3">Symbol</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Shares</th>
                  <th className="p-3">Avg Cost</th>
                  <th className="p-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {user.holdings.map((h) => (
                  <tr key={h.id}>
                    <td className="p-3 font-semibold text-white">{h.symbol}</td>
                    <td className="p-3">{h.assetType}</td>
                    <td className="p-3">{h.quantity}</td>
                    <td className="p-3">${h.avgPrice.toFixed(2)}</td>
                    <td className="p-3">
                      <Link
                        href={`/trade/${h.symbol}`}
                        className="text-indigo-400 hover:underline"
                      >
                        Trade
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}