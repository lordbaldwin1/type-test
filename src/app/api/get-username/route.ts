import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import { eq } from "drizzle-orm";

interface UsernameResponse {
  username: string | null;
}

interface ErrorResponse {
  error: string;
}

export async function GET(): Promise<
  NextResponse<UsernameResponse | ErrorResponse>
> {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      username: true,
    },
  });

  return NextResponse.json(
    { username: user?.username ?? null },
    { status: 200 },
  );
}
