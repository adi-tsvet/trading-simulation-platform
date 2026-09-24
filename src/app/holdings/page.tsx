"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import HoldingCard, { Holding } from "@/components/holdings/HoldingCard"
import PortfolioHeader from "@/components/holdings/PortfolioHeader"
import SellModal from "@/components/holdings/SellModal"
import ToastNotification, { ToastMessage } from "@/components/holdings/ToastNotification"

interface LoggedInUser {
  id: string
  name?: string
  username: string
  email: string
  role: "TRADER" | "ADMIN"
}

export default function HoldingsPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null)
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedHolding, setSelectedHolding] = useState<Holding | null>(null)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  // Load active user from localStorage and fetch their holdings
  useEffect(() => {
    const loadUserAndHoldings = async () => {
      const storedUser = localStorage.getItem("user")

      if (!storedUser) {
        router.push("/")
        return
      }

      try {
        const parsedUser: LoggedInUser = JSON.parse(storedUser)
        setCurrentUser(parsedUser)

        // Fetch holdings dynamically for this parsedUser.id
        const response = await fetch(`/api/holdings?userId=${encodeURIComponent(parsedUser.id)}`)
        
        if (response.ok) {
          const data = await response.json()
          setHoldings(data)
        } else {
          console.error("Failed to fetch user holdings")
        }
      } catch (error) {
        console.error("Failed to parse user session or load holdings:", error)
        router.push("/")
      } finally {
        setIsLoading(false)
      }
    }

    loadUserAndHoldings()
  }, [router])

  const handleConfirmSell = async (holding: Holding, sellQty: number) => {
    if (!currentUser) return

    try {
      const response = await fetch("/api/holdings/sell", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          symbol: holding.symbol,
          quantity: sellQty,
        }),
      })

      if (response.ok) {
        if (sellQty >= holding.quantity) {
          setHoldings((prev) => prev.filter((h) => h.id !== holding.id))
        } else {
          setHoldings((prev) =>
            prev.map((h) =>
              h.id === holding.id ? { ...h, quantity: h.quantity - sellQty } : h
            )
          )
        }

        setToast({
          id: Date.now().toString(),
          type: "success",
          text: `Successfully sold ${sellQty} share(s) of ${holding.symbol}`,
        })
      }
    } catch (error) {
      setToast({
        id: Date.now().toString(),
        type: "error",
        text: `Failed to complete transaction for ${holding.symbol}`,
      })
    } finally {
      setSelectedHolding(null)
    }
  }

  if (isLoading || !currentUser) {
    return (
      <div className="min-h-screen bg-[#0B0F17] text-white flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading portfolio holdings...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <PortfolioHeader holdings={holdings} />

        {holdings.length === 0 ? (
          <div className="bg-[#131A29] rounded-2xl border border-gray-800 p-12 text-center text-gray-400">
            You do not own any assets yet. Buy stocks on the Dashboard to build your portfolio.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {holdings.map((item) => (
              <HoldingCard
                key={item.id}
                holding={item}
                onOpenSellModal={setSelectedHolding}
              />
            ))}
          </div>
        )}
      </div>

      {selectedHolding && (
        <SellModal
          holding={selectedHolding}
          onClose={() => setSelectedHolding(null)}
          onConfirmSell={handleConfirmSell}
        />
      )}

      <ToastNotification toast={toast} onClose={() => setToast(null)} />
    </div>
  )
}