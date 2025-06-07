import { auth } from "@clerk/nextjs/server";
import { getUsername } from "~/server/db/queries";
import UsernameDialog from "./_components/username-dialog";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import LeaderboardTable from "./_components/leaderboard-table";
import { count, desc, eq, sql } from "drizzle-orm";


export default async function Leaderboard() {
    const { userId } = await auth();
    const username = await getUsername(userId);

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const showModal = (!username && userId) || (username === "Anonymous");
    // Leaderboard plan:
    // Fetch 50 users sorted by averageWpm
    // Display
    // Show user their position below in case they are not in the top 50
    const user = userId ? await db.query.users.findFirst({
        where: eq(users.id, userId),
    }) : undefined;
    const userPosition = (userId && user) ? await db.select({
        rank: sql<number>`(SELECT COUNT(*) + 1 FROM ${users} u2 WHERE u2."averageWpm" > ${users}."averageWpm")`
    }).from(users).where(eq(users.id, userId)) : undefined;


    const userList = await db.select().from(users).orderBy(desc(users.averageWpm)).limit(50);
    const totalPlayers = await db.select({ count: count() }).from(users);

    return (
        <div>
            {showModal &&
                <UsernameDialog />
            }
            <LeaderboardTable users={userList} user={user} userPosition={userPosition?.[0] ?? undefined} totalPlayers={totalPlayers?.[0]?.count ?? 0} />
        </div>
    );
}