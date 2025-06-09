import type { User, Game } from "~/server/db/schema";

type MaxWpmGameWithUser = Game & { user: User };

export default function UserStats15({
  userBestTime,
  userRank,
  user,
  totalPlayers,
}: {
  userBestTime: MaxWpmGameWithUser | null;
  userRank: { rank: number } | undefined;
  user: User | undefined;
  totalPlayers: number;
}) {
  return (
    userBestTime &&
    user && (
      <div className="bg-muted flex flex-row lg:flex-col gap-2 lg:gap-1 rounded-lg p-2 lg:p-3">
        <p className="text-muted-foreground border-border border-r lg:border-r-0 lg:border-b lg:pb-1 pr-2 lg:pr-0 text-sm">
          {userRank?.rank} / {totalPlayers}
        </p>
        <p className="text-muted-foreground border-border border-r lg:border-r-0 lg:border-b lg:pb-1 pr-2 lg:pr-0 text-sm">
          {user.username ?? "Anonymous"}
        </p>
        <p className="text-muted-foreground border-border border-r lg:border-r-0 lg:border-b lg:pb-1 pr-2 lg:pr-0 text-sm">
          {userBestTime.wpm} wpm
        </p>
        <p className="text-muted-foreground border-border border-r lg:border-r-0 lg:border-b lg:pb-1 pr-2 lg:pr-0 text-sm">
          {userBestTime.accuracy}% acc
        </p>
        <p className="text-muted-foreground text-sm">
          {new Date(userBestTime.createdAt).toLocaleString()}
        </p>
      </div>
    )
  );
}
