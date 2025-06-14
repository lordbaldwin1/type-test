import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import ForceUsernameModal from "../_components/force-username-modal";
import { getUsername } from "~/server/db/queries";
import { auth } from "@clerk/nextjs/server";

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
      </SignedIn>
    </div>
  );
}

