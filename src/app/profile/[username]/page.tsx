import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    return notFound();
  }
  return (
    <div>
      <h1>Profile</h1>
      <p>{username}</p>
    </div>
  );
}
