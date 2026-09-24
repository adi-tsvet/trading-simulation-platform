"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AuthPage() {
  const router = useRouter()
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setError("")
  setLoading(true)

  try {
    const endpoint = isLogin ? "/api/login" : "/api/register"
    const payload = isLogin ? { email } : { name, email }

    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.error || "Authentication failed")
    }

    // Save active user info locally & redirect to dashboard
    localStorage.setItem("user", JSON.stringify(data.user))
    router.push("/dashboard")
  } catch (err: unknown) {
    setError(err instanceof Error ? err.message : "An error occurred")
  } finally {
    setLoading(false)
  }
}

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#0B0F17] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 bg-[#131A29] rounded-2xl border border-gray-800 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-gray-400 text-sm mt-2">
            {isLogin
              ? "Sign in to manage your trading simulation portfolio"
              : "Start with $100,000 in virtual cash to practice trading"}
          </p>
        </div>

        {/* Form Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl bg-[#0B0F17] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label className="block text-xs text-gray-400 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="trader@example.com"
              className="w-full px-4 py-3 rounded-xl bg-[#0B0F17] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 font-semibold rounded-xl transition-all shadow-lg shadow-blue-500/20 disabled:opacity-50 mt-2"
          >
            {loading ? "Processing..." : isLogin ? "Sign In" : "Get Started"}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="mt-6 text-center text-sm text-gray-400">
          {isLogin ? "Don't have an account? " : "Already registered? "}
          <button
            onClick={() => {
              setIsLogin(!isLogin)
              setError("")
            }}
            className="text-blue-400 font-semibold hover:underline"
          >
            {isLogin ? "Register now" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  )
}