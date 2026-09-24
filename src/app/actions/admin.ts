"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// Utility function to ensure user is ADMIN
async function verifyAdminRole(adminId: string) {
  const admin = await prisma.user.findUnique({ where: { id: adminId } });
  if (admin?.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin privileges required.");
  }
}

export async function adjustUserBalance(
  adminUserId: string,
  targetUserId: string,
  amount: number,
  operation: "DEPOSIT" | "WITHDRAW" | "RESET"
) {
  await verifyAdminRole(adminUserId);

  if (operation === "RESET") {
    await prisma.user.update({
      where: { id: targetUserId },
      data: { virtualCash: amount }, // defaults to initial balance e.g., $100,000
    });
  } else if (operation === "DEPOSIT") {
    await prisma.user.update({
      where: { id: targetUserId },
      data: { virtualCash: { increment: amount } },
    });
  } else if (operation === "WITHDRAW") {
    await prisma.user.update({
      where: { id: targetUserId },
      data: { virtualCash: { decrement: amount } },
    });
  }

  revalidatePath("/admin");
  revalidatePath("/dashboard");
  return { success: true };
}