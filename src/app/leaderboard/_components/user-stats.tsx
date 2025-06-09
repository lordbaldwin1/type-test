import type { User } from "~/server/db/schema";

export default function UserStats({
  userPosition,
  user,
  totalPlayers,
}: {
  userPosition: { rank: number } | undefined;
  user: User | undefined;
  totalPlayers: number;
}) {
  return (
    userPosition &&
    user && (
      <div className="bg-muted flex flex-row lg:flex-col gap-2 lg:gap-1 rounded-lg p-2 lg:p-3">
        <p className="text-muted-foreground border-border border-r lg:border-r-0 lg:border-b lg:pb-1 pr-2 lg:pr-0 text-sm">
          {userPosition?.rank} / {totalPlayers}
        </p>
        <p className="text-muted-foreground border-border border-r lg:border-r-0 lg:border-b lg:pb-1 pr-2 lg:pr-0 text-sm">
          {user.username}
        </p>
        <p className="text-muted-foreground border-border border-r lg:border-r-0 lg:border-b lg:pb-1 pr-2 lg:pr-0 text-sm">
          {user.averageWpm.toFixed(2)} ave .wpm
        </p>
        <p className="text-muted-foreground text-sm">
          {user.averageAccuracy.toFixed(2)}% ave. acc
        </p>
      </div>
    )
  );
}
