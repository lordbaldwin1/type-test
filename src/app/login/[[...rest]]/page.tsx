import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import ForceUsernameModal from "../_components/force-username-modal";
import { getUsername } from "~/server/db/queries";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Login() {
  const { userId } = await auth();
  const username = await getUsername(userId ?? null);
  const needsUsername = !username;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <SignedOut>
        <SignIn />
      </SignedOut>
      <SignedIn>
        <ForceUsernameModal open={needsUsername} />
        {!needsUsername ? (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">Hello {username}</h1>
            <p className="text-sm text-muted-foreground">
            You are logged in! Click below to start typing.
          </p>
          <Link href="/">Start Typing</Link>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-bold">Hello there!</h1>
            <p className="text-sm text-muted-foreground">
              You must set a username to continue.
            </p>
          </div>
        )}
      </SignedIn>
    </div>
  );
}

