import type { User } from "~/server/db/schema";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "~/components/ui/table";


export default function LeaderboardTable({ userList, user, userPosition, totalPlayers }: { userList: User[], user: User | undefined, userPosition: { rank: number } | undefined, totalPlayers: number }) {

    const userRank = userPosition?.rank;
    return (
        <div className="min-h-[100vh] flex flex-col items-center p-8 font-mono">
            <h1 className="text-3xl font-bold mb-6">Global Leaderboard</h1>
            {(userRank && user) && (
                <div className="mb-8 p-2 flex flex-row gap-2 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground border-r border-border pr-2">
                        {userRank} / {totalPlayers}
                    </p>
                    <p className="text-sm text-muted-foreground border-r border-border pr-2">
                        {user.username}
                    </p>
                    <p className="text-sm text-muted-foreground border-r border-border pr-2">
                        {user.averageWpm.toFixed(2)} wpm
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {user.averageAccuracy.toFixed(2)}% accuracy
                    </p>
                </div>
            )}
            <div className="w-full max-w-4xl">
                <Table>
                    <TableCaption>Top 50 Players by Average WPM</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[60px] text-center">rank</TableHead>
                            <TableHead className="w-[180px]">username</TableHead>
                            <TableHead className="w-[120px] text-center">ave. wpm</TableHead>
                            <TableHead className="w-[120px] text-center">ave. accuracy</TableHead>
                            <TableHead className="w-[120px] text-center">total games</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {userList.map((user, index) => (
                            <TableRow key={user.id}>
                                <TableCell className="text-center">{index + 1}</TableCell>
                                <TableCell className="font-medium">{user.username}</TableCell>
                                <TableCell className="text-center">{user.averageWpm.toFixed(2)}</TableCell>
                                <TableCell className="text-center">{user.averageAccuracy.toFixed(2)}%</TableCell>
                                <TableCell className="text-center">{user.totalGames}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={5} className="text-center">Total Players: {totalPlayers}</TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </div>
    )
}