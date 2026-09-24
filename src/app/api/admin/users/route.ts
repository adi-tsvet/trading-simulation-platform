import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// GET /api/admin/users - Fetch all users with holdings
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        role: true,
        virtualCash: true,
        createdAt: true,
        holdings: {
          select: {
            id: true,
            symbol: true,
            assetType: true,
            quantity: true,
            avgPrice: true,
            updatedAt: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ users }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    )
  }
}

// PATCH /api/admin/users - Update user cash balance
export async function PATCH(req: Request) {
  try {
    const { userId, virtualCash } = await req.json()

    if (!userId || typeof virtualCash !== "number") {
      return NextResponse.json(
        { error: "Invalid user ID or virtual cash amount" },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { virtualCash },
      select: {
        id: true,
        username: true,
        virtualCash: true,
      },
    })

    return NextResponse.json({ user: updatedUser }, { status: 200 })
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update user cash" },
      { status: 500 }
    )
  }
}