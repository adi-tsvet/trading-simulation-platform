"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import React from "react"

interface Holding {
  id: string
  symbol: string
  assetType: string
  quantity: number
  avgPrice: number
  updatedAt: string
}

interface ManagedUser {
  id: string
  name?: string
  username: string
  email: string
  role: "TRADER" | "ADMIN"
  virtualCash: number
  createdAt: string
  holdings: Holding[]
}

export default function AdminPage() {
  const router = useRouter()
  const [adminUser, setAdminUser] = useState<ManagedUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [users, setUsers] = useState<ManagedUser[]>([])
  const [fetchingUsers, setFetchingUsers] = useState(true)
  
  // Cash editing state
  const [editingUserId, setEditingUserId] = useState<string | null>(null)
  const [newCashValue, setNewCashValue] = useState<string>("")
  const [updatingCash, setUpdatingCash] = useState(false)
  
  // Expanded holdings view state (tracks single expanded user)
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 1. Declare loadAllUsers FIRST using useCallback so it can be called safely in useEffect
  const loadAllUsers = useCallback(async () => {
    setFetchingUsers(true)
    setError(null)
    try {
      const res = await fetch("/api/admin/users")
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to load user accounts")
      }

      setUsers(data.users)
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setFetchingUsers(false)
    }
  }, [])

  // 2. useEffect now safely calls loadAllUsers after its declaration
  useEffect(() => {
    const checkAdminAuth = async () => {
      const storedUser = localStorage.getItem("user")

      if (!storedUser) {
        router.push("/")
        return
      }

      try {
        const parsedUser = JSON.parse(storedUser)

        if (parsedUser.role !== "ADMIN") {
          router.push("/dashboard")
          return
        }

        setAdminUser(parsedUser)
        await loadAllUsers()
      } catch (err) {
        console.error("Failed to parse user data", err)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    checkAdminAuth()
  }, [router, loadAllUsers])

  const handleUpdateCash = async (userId: string) => {
    const cashAmount = parseFloat(newCashValue)
    if (isNaN(cashAmount) || cashAmount < 0) {
      alert("Please enter a valid cash amount")
      return
    }

    setUpdatingCash(true)
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, virtualCash: cashAmount }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to update cash")
      }

      // Update cash in local state
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId ? { ...u, virtualCash: data.user.virtualCash } : u
        )
      )

      setEditingUserId(null)
      setNewCashValue("")
    } catch (err) {
      alert((err as Error).message)
    } finally {
      setUpdatingCash(false)
    }
  }

  if (loading || !adminUser || adminUser.role !== "ADMIN") {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-white flex items-center justify-center">
        <p className="text-gray-400 text-sm">Verifying admin credentials...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            Admin Console
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Manage user balances, track virtual cash allocations, and inspect user portfolios.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Users & Holdings Table */}
        <div className="bg-[#131A29] rounded-2xl border border-gray-800 p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">User Accounts ({users.length})</h2>
            <button
              onClick={loadAllUsers}
              className="px-4 py-2 text-xs bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
            >
              Refresh Data
            </button>
          </div>

          {fetchingUsers ? (
            <div className="py-12 text-center text-gray-400 text-sm">Loading user metrics...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-800 text-xs text-gray-400 uppercase tracking-wider">
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Virtual Cash</th>
                    <th className="py-3 px-4">Holdings Count</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/50 text-sm">
                  {users.map((u) => {
                    const isEditingCash = editingUserId === u.id
                    const isExpanded = expandedUserId === u.id

                    return (
                      <React.Fragment key={u.id}>
                        <tr className="hover:bg-gray-800/30 transition-colors">
                          <td className="py-4 px-4">
                            <div className="font-medium text-white">{u.name || u.username}</div>
                            <div className="text-xs text-gray-400">@{u.username} • {u.email}</div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                u.role === "ADMIN"
                                  ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                  : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                              }`}
                            >
                              {u.role}
                            </span>
                          </td>
                          <td className="py-4 px-4 font-mono font-medium text-emerald-400">
                            {isEditingCash ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={newCashValue}
                                  onChange={(e) => setNewCashValue(e.target.value)}
                                  placeholder={u.virtualCash.toString()}
                                  className="w-32 bg-[#0B0F17] border border-gray-700 rounded-lg px-2 py-1 text-white text-sm focus:outline-none focus:border-blue-500"
                                />
                                <button
                                  onClick={() => handleUpdateCash(u.id)}
                                  disabled={updatingCash}
                                  className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={() => setEditingUserId(null)}
                                  className="px-2.5 py-1 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              `$${u.virtualCash.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                            )}
                          </td>
                          <td className="py-4 px-4 text-gray-300">
                            {u.holdings.length} {u.holdings.length === 1 ? "asset" : "assets"}
                          </td>
                          <td className="py-4 px-4 text-right space-x-2">
                            <button
                              onClick={() => {
                                setEditingUserId(u.id)
                                setNewCashValue(u.virtualCash.toString())
                              }}
                              className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 rounded-lg text-xs transition-colors"
                            >
                              Edit Cash
                            </button>
                            <button
                              onClick={() => setExpandedUserId(isExpanded ? null : u.id)}
                              className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg text-xs transition-colors"
                            >
                              {isExpanded ? "Hide Holdings" : "View Holdings"}
                            </button>
                          </td>
                        </tr>

                        {/* Collapsible Holdings Table Row */}
                        {isExpanded && (
                          <tr className="bg-[#0B0F17]/50">
                            <td colSpan={5} className="p-4 border-b border-gray-800">
                              <div className="bg-[#0B0F17] p-4 rounded-xl border border-gray-800">
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                  Holdings Details for @{u.username}
                                </h3>
                                {u.holdings.length === 0 ? (
                                  <p className="text-xs text-gray-500 italic">
                                    This user currently holds no assets.
                                  </p>
                                ) : (
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-left text-xs">
                                      <thead>
                                        <tr className="border-b border-gray-800 text-gray-500">
                                          <th className="py-2 px-3">Symbol</th>
                                          <th className="py-2 px-3">Asset Type</th>
                                          <th className="py-2 px-3">Quantity</th>
                                          <th className="py-2 px-3">Avg Purchase Price</th>
                                          <th className="py-2 px-3">Total Invested Value</th>
                                        </tr>
                                      </thead>
                                      <tbody className="divide-y divide-gray-800/40">
                                        {u.holdings.map((h) => (
                                          <tr key={h.id}>
                                            <td className="py-2 px-3 font-bold text-white">
                                              {h.symbol}
                                            </td>
                                            <td className="py-2 px-3 text-gray-400">
                                              {h.assetType}
                                            </td>
                                            <td className="py-2 px-3 text-gray-300">
                                              {h.quantity}
                                            </td>
                                            <td className="py-2 px-3 font-mono text-gray-300">
                                              ${h.avgPrice.toFixed(2)}
                                            </td>
                                            <td className="py-2 px-3 font-mono text-emerald-400">
                                              ${(h.quantity * h.avgPrice).toLocaleString(
                                                undefined,
                                                { minimumFractionDigits: 2 }
                                              )}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}