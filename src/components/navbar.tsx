import {
  ChartNoAxesColumnIncreasing,
  Scroll,
  Swords,
  User,
} from "lucide-react";
import { ModeToggle } from "./theme-toggle";
import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

interface NavbarProps {
  showUi?: boolean;
}

export default function Navbar({ showUi = true }: NavbarProps) {
  return (
    <div
      className={`w-full transition-opacity duration-300 ${
        showUi ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="mx-24 mt-8 flex flex-row items-center justify-between">
        <div className="flex items-center">
          <Link className="mr-6 flex flex-row" href={`/`}>
            <Image src="/cute-ghost.png" alt="logo" width={32} height={32} />
            <h1 className="hidden font-mono text-3xl md:block lg:block">
              vanishtype
            </h1>
          </Link>
          <div className="text-muted-foreground flex flex-row gap-6">
            <Link href={`/`}>
              <Swords className="hover:text-foreground transition-transform duration-200 hover:scale-110 h-5.5 w-5.5" />
            </Link>
            <Link href={`/leaderboard`}>
              <ChartNoAxesColumnIncreasing className="hover:text-foreground transition-transform duration-200 hover:scale-110 h-5.5 w-5.5" />
            </Link>
            <Link href={`/about`}>
              <Scroll className="hover:text-foreground transition-transform duration-200 hover:scale-110 h-5.5 w-5.5" />
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
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
