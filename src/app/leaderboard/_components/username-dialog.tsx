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
import { addUsername, makeUserAnonymous } from "~/server/db/actions";
import { toast } from "sonner";
import { UserPen } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useRouter } from "next/navigation";

export default function UsernameDialog() {
  const [username, setUsername] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const router = useRouter();

  const handleAddUsername = async () => {
    setStatus("loading");
    const result = await addUsername(username);
    if (result.message === "Username added.") {
      setIsOpen(false);
      toast.success("Username added.");
      router.refresh();
    } else {
      setStatus("error");
      toast.error("Failed to add username.");
    }
  };

  const handleClose = async () => {
    setIsOpen(false);
    const result = await makeUserAnonymous();
    if (!result.error) {
      toast.success(result.message);
    } else {
      setStatus("error");
      toast.error(result.message);
    }
  }
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
          <p>Update your username</p>
        </TooltipContent>
      </Tooltip>
      <DialogContent className="font-mono">
        <DialogHeader>
          <DialogTitle>Update your username</DialogTitle>
          <DialogDescription>
            Enter a new username and click set username to update it.
          </DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          placeholder="lordbaldwin1..."
          maxLength={16}
          minLength={3}
          value={username}
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              await handleAddUsername();
            }
          }}
          onChange={(e) => setUsername(e.target.value)}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleClose} variant="outline">
              Remain Anonymous
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
            {status === "loading" ? "setting..." : "Set Username"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
