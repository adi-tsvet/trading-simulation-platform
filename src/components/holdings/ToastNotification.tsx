"use client"

import { useEffect } from "react"

export interface ToastMessage {
  id: string
  type: "success" | "error"
  text: string
}

interface ToastNotificationProps {
  toast: ToastMessage | null
  onClose: () => void
}

export default function ToastNotification({ toast, onClose }: ToastNotificationProps) {
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      onClose()
    }, 4000)
    return () => clearTimeout(timer)
  }, [toast, onClose])

  if (!toast) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-center gap-3 px-5 py-3.5 rounded-xl border shadow-2xl backdrop-blur-md ${
          toast.type === "success"
            ? "bg-emerald-950/90 border-emerald-500/50 text-emerald-200"
            : "bg-red-950/90 border-red-500/50 text-red-200"
        }`}
      >
        <span className="text-lg">{toast.type === "success" ? "✓" : "✕"}</span>
        <p className="text-sm font-medium">{toast.text}</p>
        <button
          onClick={onClose}
          className="ml-4 text-xs opacity-60 hover:opacity-100 transition-opacity"
        >
          ✕
        </button>
      </div>
    </div>
  )
}