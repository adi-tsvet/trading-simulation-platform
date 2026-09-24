import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { Prisma } from "@prisma/client"

// Define type based on Prisma query result including optional relations/fields
type HoldingWithUser = Prisma.HoldingGetPayload<{
  include: {
    user: {
      select: {
        id: true
        name: true
        email: true
      }
    }
  }
}> & {
  // Optional property overrides if these fields exist dynamically on your model
  currentPrice?: number
  price?: number
  avgCost?: number
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get("userId")

    // Fetch holdings: filtered by userId if provided, or all holdings for admin
    const rawHoldings: HoldingWithUser[] = await prisma.holding.findMany({
      where: userId ? { userId } : {},
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    // Safely map values without using `any`
    const holdings = rawHoldings.map((holding) => {
      const price = holding.currentPrice ?? holding.price ?? holding.avgCost ?? 0

      return {
        ...holding,
        currentPrice: Number(price),
        quantity: Number(holding.quantity ?? 0),
        avgCost: Number(holding.avgCost ?? price),
      }
    })

    return NextResponse.json(holdings)
  } catch (error) {
    console.error("Failed to fetch holdings:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}