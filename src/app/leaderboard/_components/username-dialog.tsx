"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { addUsername } from "~/server/db/actions";
import { toast } from "sonner";
import { UserPen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";

export default function UsernameDialog() {
  const [username, setUsername] = useState("");
  const [isOpen, setIsOpen] = useState(true);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");

  const handleAddUsername = async () => {
    setStatus("loading");
    const result = await addUsername(username);
    if (result.message === "Username added.") {
      setIsOpen(false);
      toast.success("Username added.");
    } else {
      setStatus("error");
      toast.error("Failed to add username.");
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              variant="link"
              className="text-muted-foreground hover:text-foreground hover:scale-110"
            >
              <UserPen className="h-4 w-4" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Set a username</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="font-mono">
        <DialogHeader>
          <DialogTitle>Create a username</DialogTitle>
          <DialogDescription>
            de-anonimize yourself on the leaderboard.
          </DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          placeholder="lordbaldwin1..."
          maxLength={16}
          minLength={3}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={() => setIsOpen(false)} variant="outline">
              Close
            </Button>
          </DialogClose>
          <Button
            onClick={handleAddUsername}
            disabled={
              status === "loading" ||
              username.length < 3 ||
              username.length > 16
            }
          >
            {" "}
            {status === "loading" ? "Joining..." : "Join"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
