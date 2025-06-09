"use client";

import type { Game, User } from "~/server/db/schema";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";

export default function TimeLimit15Table({
  games,
  totalPlayers,
}: {
  games: (Game & { user: User })[];
  totalPlayers: number;
}) {
  return (
    <div className="w-full max-w-4xl">
      <Table>
        <TableCaption>top 50 players by best 15s WPM</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px] text-center">rank</TableHead>
            <TableHead className="w-[180px]">
              <Button
                variant="ghost"
                size="sm"
              >
                name
              </Button>
            </TableHead>
            <TableHead className="w-[120px] text-center">
              <Button
                variant="ghost"
                size="sm"
              >
                wpm
              </Button>
            </TableHead>
            <TableHead className="w-[120px] text-center">
              <Button
                variant="ghost"
                size="sm"
              >
                acc
              </Button> 
            </TableHead>
            <TableHead className="w-[120px] text-center">
              <Button
                variant="ghost"
                size="sm"
              >
                date
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {games.map((game, index) => (
            <TableRow key={game.id}>
              <TableCell className="text-center">{index + 1}</TableCell>
              <TableCell className="font-medium">
                {game.user.stayAnonymous ? "Anonymous" : (game.user.username ?? "Anonymous")}
              </TableCell>
              <TableCell className="text-center">
                {game.wpm}
              </TableCell>
              <TableCell className="text-center">
                {game.accuracy}%
              </TableCell>
              <TableCell className="text-center">
                {new Date(game.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5} className="text-right">
              total players: {totalPlayers}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
