"use client"

import { useState } from "react"
import { adjustUserBalance } from "@/app/actions/admin"

export default function AdminPage() {
  const [targetUserId, setTargetUserId] = useState("")
  const [amount, setAmount] = useState(10000)
  const [operation, setOperation] = useState<"DEPOSIT" | "WITHDRAW" | "RESET">("DEPOSIT")
  const [status, setStatus] = useState("")

  async function handleAdminAction(e: React.FormEvent) {
    e.preventDefault()
    setStatus("Executing...")

    // Admin user ID (Pass active admin session user ID)
    const res = await adjustUserBalance("admin_user_id", targetUserId, amount, operation)
    if (res.success) {
      setStatus(`Successfully performed ${operation} on user ${targetUserId}`)
    } else {
      setStatus("Failed to perform action.")
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Control Console</h1>

      <div className="bg-slate-800 p-6 rounded-lg border border-slate-700 max-w-lg">
        <h2 className="text-xl font-bold mb-4">Manage User Virtual Balance</h2>
        <form onSubmit={handleAdminAction} className="space-y-4">
          <div>
            <label className="block text-sm text-slate-400 mb-1">Target User ID</label>
            <input
              type="text"
              required
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              placeholder="e.g. user_cuid_123"
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Action</label>
            <select
              value={operation}
              onChange={(e) => setOperation(e.target.value as any)}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
            >
              <option value="DEPOSIT">Deposit Cash</option>
              <option value="WITHDRAW">Withdraw Cash</option>
              <option value="RESET">Reset to Fixed Amount</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1">Amount ($)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-amber-600 hover:bg-amber-500 py-2 rounded font-bold text-white transition-colors"
          >
            Apply Adjustment
          </button>
        </form>

        {status && <p className="mt-4 text-sm text-indigo-400">{status}</p>}
      </div>
    </div>
  )
}