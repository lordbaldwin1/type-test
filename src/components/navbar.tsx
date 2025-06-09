import { Crown, Info, Keyboard, Rabbit, User } from "lucide-react";
import { ModeToggle } from "./theme-toggle";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";

interface NavbarProps {
  showUi?: boolean;
}

export default function Navbar({ showUi = true }: NavbarProps) {
  return (
    <div className={`w-full transition-opacity duration-300 ${
      showUi ? "opacity-100" : "pointer-events-none opacity-0"
    }`}>
      <div className="mx-24 mt-8 flex flex-row items-center justify-between">
        <div className="flex items-center gap-6">
          <Link className="flex flex-row" href={`/`}>
            <Rabbit className="text-muted-foreground mr-2 h-10 w-10" />
            <h1 className="hidden font-mono text-4xl font-semibold md:block lg:block">
              type-test
            </h1>
          </Link>
          <div className="text-muted-foreground flex flex-row gap-6">
            <Link href={`/`}>
              <Keyboard className="hover:text-foreground transition-transform duration-200 hover:scale-110" />
            </Link>
            <Link href={`/leaderboard`}>
              <Crown className="hover:text-foreground transition-transform duration-200 hover:scale-110" />
            </Link>
            <Link href={`/about`}>
              <Info className="hover:text-foreground transition-transform duration-200 hover:scale-110" />
            </Link>
          </div>
        </div>
        <div className="flex items-center">
          <ModeToggle />
          <SignedOut>
            <SignInButton mode="modal">
              <User className="text-muted-foreground hover:text-foreground h-4.5 w-4.5 hover:scale-110" />
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
