import "./globals.css"
import { Navbar } from "@/components/Navbar"

export const metadata = {
  title: "Trading Simulation Platform",
  description: "Virtual Stock and ETF trading simulation platform built in Next.js",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 min-h-screen font-sans">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}