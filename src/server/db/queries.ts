import { db } from "~/server/db";
import { users } from "./schema";
import { eq } from "drizzle-orm";

export const getUsername = async (userId: string | null) => {
  if (!userId) return null;
  const user = await db.query.users.findFirst({ where: eq(users.id, userId) });
  return user?.username;
};
