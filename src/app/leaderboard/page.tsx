import { auth } from "@clerk/nextjs/server";
import { getUsername } from "~/server/db/queries";
import UsernameDialog from "./_components/username-dialog";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import LeaderboardTable from "./_components/leaderboard-table";
import { count, desc, eq, sql } from "drizzle-orm";
import UserStats from "./_components/user-stats";

export default async function Leaderboard() {
  const { userId } = await auth();
  const username = await getUsername(userId);

  // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
  const showModal = (!username && userId) || username === "Anonymous";
  // Leaderboard plan:
  // Fetch 50 users sorted by averageWpm
  // Display
  // Show user their position below in case they are not in the top 50
  const user = userId
    ? await db.query.users.findFirst({
        where: eq(users.id, userId),
      })
    : undefined;

  let userPosition: { rank: number } | undefined = undefined;
  if (userId && user) {
    try {
      const higherRankedUsers = await db
        .select({ count: count() })
        .from(users)
        .where(sql`${users.averageWpm} > ${user.averageWpm}`);
      userPosition = { rank: (higherRankedUsers[0]?.count ?? 0) + 1 };
    } catch (error) {
      console.error("Error calculating user position:", error);
      userPosition = undefined;
    }
  }

  const userList = await db
    .select()
    .from(users)
    .orderBy(desc(users.averageWpm))
    .limit(50);
  const totalPlayers = await db.select({ count: count() }).from(users);

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-8 items-center font-mono">
      <h1 className="text-3xl font-bold">Global Leaderboard</h1>
      <div className="relative flex w-full justify-center">
        <div className="relative">
          <UserStats
            userPosition={userPosition}
            user={user}
            totalPlayers={totalPlayers?.[0]?.count ?? 0}
          />
          {showModal && (
            <div className="absolute left-full top-0 ml-2">
              <UsernameDialog />
            </div>
          )}
        </div>
      </div>
      <LeaderboardTable
        users={userList}
        totalPlayers={totalPlayers?.[0]?.count ?? 0}
      />
    </div>
  );
}
