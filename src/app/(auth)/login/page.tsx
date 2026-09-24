"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await signIn("credentials", {
      email,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError("Failed to sign in. Please check your credentials.")
    } else {
      // Redirect admins to admin page, regular users to dashboard
      if (email.toLowerCase().includes("admin")) {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
      router.refresh()
    }
  }

  const quickLogin = (selectedEmail: string) => {
    setEmail(selectedEmail)
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 text-white">
      <div className="w-full max-w-md bg-slate-800 border border-slate-700 rounded-lg p-8 shadow-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-indigo-400">TradingSim Login</h1>
          <p className="text-sm text-slate-400 mt-1">
            Access your virtual stock portfolio & simulation engine
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/50 text-rose-400 text-sm rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trader@example.com"
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 py-2.5 rounded font-bold text-white transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In / Register"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-700">
          <p className="text-xs text-slate-400 mb-3 text-center font-medium">
            Quick Testing Accounts (Click to fill)
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => quickLogin("trader@example.com")}
              className="flex-1 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-xs text-slate-200 transition-colors"
            >
              Trader Account
            </button>
            <button
              type="button"
              onClick={() => quickLogin("admin@example.com")}
              className="flex-1 py-1.5 bg-amber-950/60 hover:bg-amber-900/60 border border-amber-600/30 rounded text-xs text-amber-300 transition-colors"
            >
              Admin Account
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}