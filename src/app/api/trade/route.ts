import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const { userId, symbol, type, quantity, price } = await req.json()

    if (!userId || !symbol || !quantity || !price) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const totalCost = quantity * price

    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    if (type === "BUY") {
      if (user.virtualCash < totalCost) {
        return NextResponse.json({ error: "Insufficient virtual funds" }, { status: 400 })
      }

      // Deduct cash and update holdings
      await prisma.user.update({
        where: { id: userId },
        data: { virtualCash: { decrement: totalCost } },
      })

      const existingHolding = await prisma.holding.findUnique({
        where: { userId_symbol: { userId, symbol } },
      })

      if (existingHolding) {
        const newQty = existingHolding.quantity + quantity
        const newAvg = (existingHolding.avgPrice * existingHolding.quantity + totalCost) / newQty

        await prisma.holding.update({
          where: { id: existingHolding.id },
          data: { quantity: newQty, avgPrice: newAvg },
        })
      } else {
        await prisma.holding.create({
          data: { userId, symbol, assetType: "STOCK", quantity, avgPrice: price },
        })
      }
    } else if (type === "SELL") {
      const existingHolding = await prisma.holding.findUnique({
        where: { userId_symbol: { userId, symbol } },
      })

      if (!existingHolding || existingHolding.quantity < quantity) {
        return NextResponse.json({ error: "Insufficient stock quantity to sell" }, { status: 400 })
      }

      // Add cash and decrement holding
      await prisma.user.update({
        where: { id: userId },
        data: { virtualCash: { increment: totalCost } },
      })

      if (existingHolding.quantity === quantity) {
        await prisma.holding.delete({ where: { id: existingHolding.id } })
      } else {
        await prisma.holding.update({
          where: { id: existingHolding.id },
          data: { quantity: { decrement: quantity } },
        })
      }
    }

    // Record Transaction
    await prisma.transaction.create({
      data: { userId, symbol, type, quantity, price, total: totalCost },
    })

    const updatedUser = await prisma.user.findUnique({ where: { id: userId } })
    return NextResponse.json({ user: updatedUser })
  } catch (error) {
    return NextResponse.json({ error: "Transaction failed" }, { status: 500 })
  }
}