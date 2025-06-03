import { Crown, Info, Keyboard, Rabbit } from "lucide-react";
import { ModeToggle } from "./theme-toggle";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="w-full">
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
            <Link href={`/`}>
              <Crown className="hover:text-foreground transition-transform duration-200 hover:scale-110" />
            </Link>
            <Link href={`/`}>
              <Info className="hover:text-foreground transition-transform duration-200 hover:scale-110" />
            </Link>
          </div>
        </div>

        <ModeToggle />
      </div>
    </div>
  );
}
