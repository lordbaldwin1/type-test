"use client";

// bio
// keyboard
// githubUsername
// xUsername
// websiteUrl

import { Button } from "~/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog";
import { Loader2, Pencil } from "lucide-react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { useState } from "react";
import Link from "next/link";
import { updateUserProfile } from "~/server/db/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function EditProfile() {
  const [bio, setBio] = useState("");
  const [keyboard, setKeyboard] = useState("");
  const [githubUsername, setGithubUsername] = useState("");
  const [xUsername, setXUsername] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const response = await updateUserProfile({
        bio,
        keyboard,
        githubUsername,
        xUsername,
        websiteUrl,
      });

      if (response.message === "User profile updated.") {
        toast.success("Profile updated successfully.");
        router.refresh();
      } else {
        toast.error("Failed to update profile.", {
          description: response.message,
        });
      }
    } catch (error) {
      toast.error("Failed to update profile.", {
        description: error instanceof Error ? error.message : "An unknown error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="hover:bg-primary hover:text-primary-foreground h-1/2 flex-1 rounded-tr-lg p-2">
          <Pencil className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Edit your profile information and press save to update your changes.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label>Username</Label>
            <p className="text-sm text-muted-foreground">To edit your username, navigate to the <Link className="underline hover:text-primary" href="/leaderboard">leaderboard</Link> and click the update username icon next your personal stats.</p>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Bio</Label>
            <Textarea value={bio} placeholder="enter bio..." maxLength={250} onChange={(e) => setBio(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Keyboard</Label>
            <Input value={keyboard} placeholder="enter keyboard..." onChange={(e) => setKeyboard(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Github Username</Label>
            <Input value={githubUsername} placeholder="just your username..." onChange={(e) => setGithubUsername(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>X Username</Label>
            <Input value={xUsername} placeholder="just your username..." onChange={(e) => setXUsername(e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label>Website URL</Label>
            <Input value={websiteUrl} placeholder="https://zacharyspringer.dev/..." onChange={(e) => setWebsiteUrl(e.target.value)} />
          </div>
        </div>
        <DialogFooter className="w-full items-center justify-center mt-4">
          <DialogClose asChild>
            <Button className="w-1/2" variant="outline">Cancel</Button>
          </DialogClose>
          <Button className="w-1/2" disabled={isLoading} onClick={handleSave}>{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
