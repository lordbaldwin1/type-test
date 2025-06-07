import type { User } from "~/server/db/schema";


export default function UserStats({ userPosition, user, totalPlayers }: { userPosition: { rank: number } | undefined, user: User | undefined, totalPlayers: number }) {
  return (
    userPosition && user && (
      <div className="bg-muted flex flex-row gap-2 rounded-lg p-2">
        <p className="text-muted-foreground border-border border-r pr-2 text-sm">
          {userPosition?.rank} / {totalPlayers}
        </p>
        <p className="text-muted-foreground border-border border-r pr-2 text-sm">
          {user.username}
        </p>
        <p className="text-muted-foreground border-border border-r pr-2 text-sm">
          {user.averageWpm.toFixed(2)} wpm
        </p>
        <p className="text-muted-foreground text-sm">
          {user.averageAccuracy.toFixed(2)}% accuracy
        </p>
      </div>
    )
  );
}
