// src/components/force-username-modal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { addUsername } from "~/server/db/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useClerk } from "@clerk/nextjs";

export default function ForceUsernameModal({ open }: { open: boolean }) {
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const router = useRouter();
  const { signOut } = useClerk();

  // If modal closes for any reason, sign out
  const handleOpenChange = async (isOpen: boolean) => {
    if (!isOpen) {
      await signOut();
    }
  };

  const handleAddUsername = async () => {
    setStatus("loading");
    const result = await addUsername(username);
    if (result.message === "Username added.") {
      toast.success(result.message);
      setStatus("idle");
      router.refresh();
    } else {
      setStatus("error");
      toast.error(result.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="font-mono">
        <DialogHeader>
          <DialogTitle>Set your username</DialogTitle>
          <DialogDescription>
            You must set a username to continue.
          </DialogDescription>
        </DialogHeader>
        <Input
          type="text"
          placeholder="your username..."
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
          <Button
            onClick={handleAddUsername}
            disabled={
              status === "loading" ||
              username.length < 3 ||
              username.length > 16
            }
          >
            {status === "loading" ? "setting..." : "Set Username"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}