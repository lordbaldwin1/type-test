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
import { useState } from "react";
import { ArrowDownUp } from "lucide-react";
import { ArrowDown } from "lucide-react";
import { ArrowUp } from "lucide-react";

export default function TimeLimit15Table({
  games,
  totalPlayers,
}: {
  games: (Game & { user: User })[];
  totalPlayers: number;
}) {
  const [gameList, setGameList] = useState<(Game & { user: User })[]>(games);
  const [sortState, setSortState] = useState<"desc" | "asc" | "original">(
    "original",
  );
  const [sortColumn, setSortColumn] = useState<"name" | "wpm" | "accuracy" | "date">(
    "name",
  );

  const sortName = () => {
    if (sortState === "desc") {
      const sorted = games.sort((a, b) =>
        a.user.username!.localeCompare(b.user.username!),
      );
      setGameList(sorted);
    } else {
      const sorted = games.sort((a, b) =>
        b.user.username!.localeCompare(a.user.username!),
      );
      setGameList(sorted);
    }
  };

  const sortWpm = () => {
    if (sortState === "desc") {
      const sorted = games.sort((a, b) => a.wpm! - b.wpm!);
      setGameList(sorted);
    } else {
      const sorted = games.sort((a, b) => b.wpm! - a.wpm!);
      setGameList(sorted);
    }
  };

  const sortAccuracy = () => {
    if (sortState === "desc") {
      const sorted = games.sort((a, b) => a.accuracy! - b.accuracy!);
      setGameList(sorted);
    } else {
      const sorted = games.sort((a, b) => b.accuracy! - a.accuracy!);
      setGameList(sorted);
    }
  };

  const sortDate = () => {
    if (sortState === "desc") {
      const sorted = games.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      setGameList(sorted);
    } else {
      const sorted = games.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      setGameList(sorted);
    }
  };

  const handleSort = (column: "name" | "wpm" | "accuracy" | "date") => {
    if (sortColumn !== column) {
      setSortColumn(column);
      setSortState("desc");
      if (column === "name") {
        sortName();
      } else if (column === "wpm") {
        sortWpm();
      } else if (column === "accuracy") {
        sortAccuracy();
      } else if (column === "date") {
        sortDate();
      }
    } else {
      if (sortState === "original") {
        setSortState("desc");
        if (column === "name") {
          sortName();
        } else if (column === "wpm") {
          sortWpm();
        } else if (column === "accuracy") {
          sortAccuracy();
        } else if (column === "date") {
          sortDate();
        }
      } else if (sortState === "desc") {
        setSortState("asc");
        if (column === "name") {
          sortName();
        } else if (column === "wpm") {
          sortWpm();
        } else if (column === "accuracy") {
          sortAccuracy();
        } else if (column === "date") {
          sortDate();
        }
      } else {
        setSortState("original");
        setGameList(games);
      }
    }
  };
  
  
  
  
  return (
    <div className="w-[800px]">
      <Table>
        <TableCaption>top 50 players by best 15s WPM</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px] text-center">rank</TableHead>
            <TableHead className="w-[180px]">
            <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("name")}
                >
                  name
                  {(sortColumn !== "name" || sortState === "original") && (
                    <ArrowDownUp className="h-4 w-4" />
                  )}
                  {sortColumn === "name" && sortState === "desc" && (
                    <ArrowDown className="h-4 w-4" />
                  )}
                  {sortColumn === "name" && sortState === "asc" && (
                    <ArrowUp className="h-4 w-4" />
                  )}
                </Button>
            </TableHead>
            <TableHead className="w-[120px] text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("wpm")}
              >
                wpm
                {(sortColumn !== "wpm" || sortState === "original") && (
                  <ArrowDownUp className="h-4 w-4" />
                )}
                {sortColumn === "wpm" && sortState === "desc" && (
                  <ArrowDown className="h-4 w-4" />
                )}
                {sortColumn === "wpm" && sortState === "asc" && (
                  <ArrowUp className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
            <TableHead className="w-[120px] text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("accuracy")}
              >
                acc
                {(sortColumn !== "accuracy" || sortState === "original") && (
                  <ArrowDownUp className="h-4 w-4" />
                )}
                {sortColumn === "accuracy" && sortState === "desc" && (
                  <ArrowDown className="h-4 w-4" />
                )}
                {sortColumn === "accuracy" && sortState === "asc" && (
                  <ArrowUp className="h-4 w-4" />
                )}
              </Button> 
            </TableHead>
            <TableHead className="w-[120px] text-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleSort("date")}
              >
                date
                {(sortColumn !== "date" || sortState === "original") && (
                  <ArrowDownUp className="h-4 w-4" />
                )}
                {sortColumn === "date" && sortState === "desc" && (
                  <ArrowDown className="h-4 w-4" />
                )}
                {sortColumn === "date" && sortState === "asc" && (
                  <ArrowUp className="h-4 w-4" />
                )}
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gameList.map((game, index) => (
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
