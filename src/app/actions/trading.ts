"use server"

import { prisma } from "@/lib/prisma" // Your Prisma instance singleton
import { revalidatePath } from "next/cache"

export async function executeTrade(
  userId: string,
  symbol: string,
  assetType: string,
  type: "BUY" | "SELL",
  quantity: number,
  currentPrice: Float
) {
  const totalCost = quantity * currentPrice;

  // 1. Fetch user to check cash balance or holding quantity
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { holdings: true },
  });

  if (!user) throw new Error("User not found");

  if (type === "BUY") {
    if (user.virtualCash < totalCost) {
      return { success: false, error: "Insufficient virtual balance" };
    }

    // Deduct cash balance
    await prisma.user.update({
      where: { id: userId },
      data: { virtualCash: { decrement: totalCost } },
    });

    // Upsert holding
    const existingHolding = user.holdings.find((h) => h.symbol === symbol);
    if (existingHolding) {
      const newQty = existingHolding.quantity + quantity;
      const newAvgPrice =
        (existingHolding.avgPrice * existingHolding.quantity + totalCost) / newQty;

      await prisma.holding.update({
        where: { id: existingHolding.id },
        data: { quantity: newQty, avgPrice: newAvgPrice },
      });
    } else {
      await prisma.holding.create({
        data: { userId, symbol, assetType, quantity, avgPrice: currentPrice },
      });
    }
  } else if (type === "SELL") {
    const existingHolding = user.holdings.find((h) => h.symbol === symbol);
    if (!existingHolding || existingHolding.quantity < quantity) {
      return { success: false, error: "Not enough shares to sell" };
    }

    // Add cash balance
    await prisma.user.update({
      where: { id: userId },
      data: { virtualCash: { increment: totalCost } },
    });

    // Reduce or remove holding
    if (existingHolding.quantity === quantity) {
      await prisma.holding.delete({ where: { id: existingHolding.id } });
    } else {
      await prisma.holding.update({
        where: { id: existingHolding.id },
        data: { quantity: { decrement: quantity } },
      });
    }
  }

  // Record Transaction Audit Log
  await prisma.transaction.create({
    data: {
      userId,
      symbol,
      type,
      quantity,
      price: currentPrice,
      total: totalCost,
    },
  });

  revalidatePath("/dashboard");
  return { success: true };
}