import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ userId: null });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id: true,
      currentLevel: true,
      totalXp: true,
    },
  });

  if (!user) {
    return NextResponse.json({ userId: null });
  }

  return NextResponse.json({
    userId: user.id,
    currentLevel: user.currentLevel,
    totalXp: user.totalXp,
  });
} 