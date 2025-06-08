import { db } from "~/server/db";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import { onBoardUser } from "./actions";

export const getUsername = async (userId: string | null) => {
  if (!userId) return null;
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  if (!user?.username) {
    await onBoardUser(userId);
  }
  return user?.username;
};
