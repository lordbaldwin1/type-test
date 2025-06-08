import { auth } from "@clerk/nextjs/server";
import UsernameDialog from "./_components/username-dialog";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import LeaderboardTable from "./_components/leaderboard-table";
import { count, desc, eq, gt, sql } from "drizzle-orm";
import UserStats from "./_components/user-stats";
import { onBoardUser } from "~/server/db/actions";
export default async function Leaderboard() {
  const { userId } = await auth();
 
  let user = userId
    ? await db.query.users.findFirst({
        where: eq(users.id, userId),
      })
    : undefined;

  // If user doesn't exist but userId does, onboard them and refetch
  if (!user && userId) {
    await onBoardUser(userId);
    // Refetch the user after onboarding
    user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });
  }

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
    .where(gt(users.totalGames, 0))
    .limit(50);
  const totalPlayers = await db.select({ count: count() }).from(users);

  return (
    <div className="mx-auto flex max-w-4xl mt-8 flex-col gap-8 items-center font-mono animate-in fade-in duration-500">
      <h1 className="text-3xl font-bold">Global Leaderboard</h1>
      <div className="relative flex w-full justify-center">
        <div className="relative">
          <UserStats
            userPosition={userPosition}
            user={user}
            totalPlayers={totalPlayers?.[0]?.count ?? 0}
          />
          <div className="absolute left-full top-0 ml-2">
            <UsernameDialog isAnonymous={user?.stayAnonymous ?? false} />
          </div>
        </div>
      </div>
      <LeaderboardTable
        users={userList}
        totalPlayers={totalPlayers?.[0]?.count ?? 0}
      />
    </div>
  );
}
