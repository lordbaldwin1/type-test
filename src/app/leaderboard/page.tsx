import { auth } from "@clerk/nextjs/server";
import { addEmptyTimeLimit15Game, onBoardUser } from "~/server/db/actions";
import LeaderboardTableToggle from "./_components/leaderboard-table-toggle";
import {
  getUserById,
  getUserPosition,
  getTopUsers,
  getTotalPlayersCount,
  getTimeLimit15Games,
  getUserBestTime15,
  getUserRank15,
} from "~/server/db/queries";

export default async function Leaderboard() {
  const { userId } = await auth();

  let user = userId ? await getUserById(userId) : undefined;

  // If user doesn't exist but userId does, onboard them and refetch
  if (!user && userId) {
    await onBoardUser(userId);
    // Refetch the user after onboarding
    user = await getUserById(userId);
  }

  // Run independent queries in parallel
  const [userList, totalPlayers, timeLimit15Games] = await Promise.all([
    getTopUsers(),
    getTotalPlayersCount(),
    getTimeLimit15Games(),
  ]);

  // Run user-specific queries in parallel if user exists
  let userPosition: { rank: number } | undefined = undefined;
  let userBestTime = null;
  let userRank15 = undefined;

  if (userId && user) {
    const [positionResult, bestTimeResult] = await Promise.all([
      getUserPosition(user.averageWpm),
      getUserBestTime15(userId),
    ]);

    userPosition = positionResult;
    userBestTime = bestTimeResult;

    if (!userBestTime) {
      await addEmptyTimeLimit15Game(userId);
      userBestTime = await getUserBestTime15(userId);
    }



    // Get user's rank on 15s leaderboard if they have a best time
    if (userBestTime && userBestTime.wpm !== null) {
      userRank15 = await getUserRank15(userBestTime.wpm);
    }
  }

  return (
    <div className="animate-in fade-in duration-500 font-mono px-4 py-8 overflow-x-auto">
      <div className="mx-auto max-w-7xl">
        <LeaderboardTableToggle
          users={userList}
          totalPlayers={totalPlayers}
          userBestTime={userBestTime}
          userRank={userRank15}
          user={user}
          userPosition={userPosition}
          games={timeLimit15Games}
          userId={userId}
        />
      </div>
    </div>
  );
}
