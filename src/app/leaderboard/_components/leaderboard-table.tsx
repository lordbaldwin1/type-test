"use client";

import type { User } from "~/server/db/schema";
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
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { ArrowDown, ArrowDownUp, ArrowUp } from "lucide-react";

export default function LeaderboardTable({
  users,
  totalPlayers,
}: {
  users: User[];
  totalPlayers: number;
}) {
  const [userList, setUserList] = useState<User[]>(users);
  const [sortState, setSortState] = useState<"desc" | "asc" | "original">(
    "original",
  );
  const [sortColumn, setSortColumn] = useState<
    "name" | "ave. wpm" | "ave. accuracy" | "total games"
  >("name");

  const sortName = () => {
    if (sortState === "desc") {
      const sorted = users.sort((a, b) =>
        a.username!.localeCompare(b.username!),
      );
      setUserList(sorted);
    } else {
      const sorted = users.sort((a, b) =>
        b.username!.localeCompare(a.username!),
      );
      setUserList(sorted);
    }
  };

  const sortAveWpm = () => {
    if (sortState === "desc") {
      const sorted = users.sort((a, b) => a.averageWpm - b.averageWpm);
      setUserList(sorted);
    } else {
      const sorted = users.sort((a, b) => b.averageWpm - a.averageWpm);
      setUserList(sorted);
    }
  };

  const sortAveAccuracy = () => {
    if (sortState === "desc") {
      const sorted = users.sort(
        (a, b) => a.averageAccuracy - b.averageAccuracy,
      );
      setUserList(sorted);
    } else {
      const sorted = users.sort(
        (a, b) => b.averageAccuracy - a.averageAccuracy,
      );
      setUserList(sorted);
    }
  };

  const sortTotalGames = () => {
    if (sortState === "desc") {
      const sorted = users.sort((a, b) => a.totalGames - b.totalGames);
      setUserList(sorted);
    } else {
      const sorted = users.sort((a, b) => b.totalGames - a.totalGames);
      setUserList(sorted);
    }
  };

  const handleSort = (
    column: "name" | "ave. wpm" | "ave. accuracy" | "total games",
  ) => {
    if (sortColumn !== column) {
      setSortColumn(column);
      setSortState("desc");
      if (column === "name") {
        sortName();
      } else if (column === "ave. wpm") {
        sortAveWpm();
      } else if (column === "ave. accuracy") {
        sortAveAccuracy();
      } else if (column === "total games") {
        sortTotalGames();
      }
    } else {
      if (sortState === "original") {
        setSortState("desc");
        if (column === "name") {
          sortName();
        } else if (column === "ave. wpm") {
          sortAveWpm();
        } else if (column === "ave. accuracy") {
          sortAveAccuracy();
        } else if (column === "total games") {
          sortTotalGames();
        }
      } else if (sortState === "desc") {
        setSortState("asc");
        if (column === "name") {
          sortName();
        } else if (column === "ave. wpm") {
          sortAveWpm();
        } else if (column === "ave. accuracy") {
          sortAveAccuracy();
        } else if (column === "total games") {
          sortTotalGames();
        }
      } else {
        setSortState("original");
        setUserList(users);
      }
    }
  };

  return (
      <div className="w-full max-w-5xl min-w-[800px]">
        <Table>
          <TableCaption>top 50 players by average wpm</TableCaption>
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
                  onClick={() => handleSort("ave. wpm")}
                >
                  ave. wpm
                  {(sortColumn !== "ave. wpm" || sortState === "original") && (
                    <ArrowDownUp className="h-4 w-4" />
                  )}
                  {sortColumn === "ave. wpm" && sortState === "desc" && (
                    <ArrowDown className="h-4 w-4" />
                  )}
                  {sortColumn === "ave. wpm" && sortState === "asc" && (
                    <ArrowUp className="h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="w-[120px] text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("ave. accuracy")}
                >
                  ave. accuracy
                  {(sortColumn !== "ave. accuracy" ||
                    sortState === "original") && (
                    <ArrowDownUp className="h-4 w-4" />
                  )}
                  {sortColumn === "ave. accuracy" && sortState === "desc" && (
                    <ArrowDown className="h-4 w-4" />
                  )}
                  {sortColumn === "ave. accuracy" && sortState === "asc" && (
                    <ArrowUp className="h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="w-[120px] text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSort("total games")}
                >
                  total games
                  {(sortColumn !== "total games" ||
                    sortState === "original") && (
                    <ArrowDownUp className="h-4 w-4" />
                  )}
                  {sortColumn === "total games" && sortState === "desc" && (
                    <ArrowDown className="h-4 w-4" />
                  )}
                  {sortColumn === "total games" && sortState === "asc" && (
                    <ArrowUp className="h-4 w-4" />
                  )}
                </Button>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userList.map((user, index) => (
              <TableRow key={user.id}>
                <TableCell className="text-center">{index + 1}</TableCell>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell className="text-center">
                  {user.averageWpm.toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  {user.averageAccuracy.toFixed(2)}%
                </TableCell>
                <TableCell className="text-center">{user.totalGames}</TableCell>
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
