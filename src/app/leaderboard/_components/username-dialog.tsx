"use client"

import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useState } from "react";
import { addUsername } from "~/server/db/actions";
import { toast } from "sonner";

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
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">Join the leaderboard!</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Join the leaderboard!</DialogTitle>
                    <DialogDescription>
                        Create a username to place yourself on the leaderboard.
                    </DialogDescription>
                </DialogHeader>
                <Input type="text" placeholder="lordbaldwin1..." maxLength={16} minLength={3} value={username} onChange={(e) => setUsername(e.target.value)} />
                <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={() => setIsOpen(false)} variant="outline">Close</Button>
                    </DialogClose>
                    <Button onClick={handleAddUsername} disabled={(status === "loading") || username.length < 3 || username.length > 16}> {status === "loading" ? "Joining..." : "Join"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}