"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navbar() {
  const pathname = usePathname()

  const navItem = (href: string, label: string) => {
    const active = pathname === href
    return (
      <Link
        href={href}
        className={`px-3 py-2 rounded-md text-sm font-medium ${
          active
            ? "bg-slate-800 text-white"
            : "text-slate-300 hover:bg-slate-700 hover:text-white"
        }`}
      >
        {label}
      </Link>
    )
  }

  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            <span className="text-xl font-bold text-indigo-400">TradingSim</span>
            <div className="flex gap-2">
              {navItem("/dashboard", "Dashboard")}
              {navItem("/markets", "Markets & ETFs")}
              {navItem("/admin", "Admin Controls")}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}