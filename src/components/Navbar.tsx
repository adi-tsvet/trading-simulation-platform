"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface User {
  id: string
  name?: string
  email: string
  role: "TRADER" | "ADMIN"
  virtualCash: number
}

export default function Navbar() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      } else {
        setUser(null)
      }
    }

    checkUser()

    window.addEventListener("storage", checkUser)
    return () => window.removeEventListener("storage", checkUser)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  return (
    <nav className="h-16 bg-[#0D131D] border-b border-gray-800 text-white flex items-center justify-between px-6">
      <Link href={user ? "/dashboard" : "/"} className="text-xl font-bold text-blue-500">
        TradingSim
      </Link>

      <div className="flex items-center space-x-6 text-sm text-gray-300">
        {user ? (
          <>
            <Link href="/dashboard" className="hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link href="/holdings" className="hover:text-white transition-colors">
              Holdings
            </Link>

            {user.role === "ADMIN" && (
              <Link href="/admin" className="hover:text-white transition-colors font-semibold text-purple-400">
                Admin Controls
              </Link>
            )}
          </>
        ) : (
          <span className="text-gray-500">Please sign in</span>
        )}
      </div>

      <div className="flex items-center space-x-4">
        {user ? (
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center gap-2">
                <p className="text-xs text-gray-300 font-medium">{user.name || user.email}</p>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                    user.role === "ADMIN"
                      ? "bg-purple-500/20 text-purple-400 border border-purple-500/30"
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                  }`}
                >
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-green-400 font-semibold mt-0.5">
                ${user.virtualCash?.toLocaleString()}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white rounded-lg text-xs font-semibold transition-all border border-red-500/30"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            href="/"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  )
}