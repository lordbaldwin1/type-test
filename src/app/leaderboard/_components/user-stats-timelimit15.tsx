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
      <div className="bg-muted flex flex-row gap-2 rounded-lg p-2">
        <p className="text-muted-foreground border-border border-r pr-2 text-sm">
          {userRank?.rank} / {totalPlayers}
        </p>
        <p className="text-muted-foreground border-border border-r pr-2 text-sm">
          {user.username ?? "Anonymous"}
        </p>
        <p className="text-muted-foreground border-border border-r pr-2 text-sm">
          {userBestTime.wpm} wpm
        </p>
        <p className="text-muted-foreground text-sm border-border border-r pr-2">
          {userBestTime.accuracy}% acc
        </p>
        <p className="text-muted-foreground text-sm">
          {new Date(userBestTime.createdAt).toLocaleString()}
        </p>
      </div>
    )
  );
}
