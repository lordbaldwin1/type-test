import { count } from "drizzle-orm";
import { db } from "~/server/db";
import { games, users } from "~/server/db/schema";
import Image from "next/image";
import Link from "next/link";

export default async function About() {
  const totalUsers = await db.select({ count: count() }).from(users);
  const totalGames = await db.select({ count: count() }).from(games);
  return (
    <div className="flex flex-col lg:max-w-3xl md:max-w-2xl mx-auto text-md mt-4 md:mt-8 px-4 pb-8">
      <div className="flex flex-row items-center justify-center mb-4 md:mb-8 gap-4">
        <p className="text-muted-foreground border-r-2 border-border pr-4">total users: {totalUsers[0]?.count}</p>
        <p className="text-muted-foreground">total tests completed: {totalGames[0]?.count}</p>
      </div>
      <Image 
        src="/knight-helm.png" 
        className="mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 outline-1 outline-border rounded-full mb-4 md:mb-6" 
        alt="logo" 
        width={225} 
        height={225} 
      />
      <h1 className="text-left text-2xl font-bold mb-4">About</h1>
      <p className="text-foreground/80 mb-4">
      I&apos;m a massive fan of the minimalistic, elegant typing site <Link target="_blank" rel="noopener noreferrer" href="https://monkeytype.com" className="underline hover:text-muted-foreground">monkeytype.com</Link>. I wanted to see if I was able to recreate the same experience using my favorite modern tech stack. This site is not built using any source code from the <Link target="_blank" rel="noopener noreferrer" href="https://github.com/monkeytypegame/monkeytype/tree/master" className="underline hover:text-muted-foreground">monkeytype GitHub repo</Link>. I built this site from scratch using monkeytype as heavy inspiration. The tech stack for this site includes: Next.js/React, TypeScript, Tailwind, shadcn/ui, Drizzle, Postgres, Clerk, and Railway for deployment.
      </p>
      <p className="text-foreground/80">
      The source code for this site is available <Link target="_blank" rel="noopener noreferrer" href="https://github.com/lordbaldwin1/type-test" className="underline hover:text-muted-foreground">here</Link> or in the footer below and is under the MIT license. If you would like to see anything else that I&apos;m working on, checkout my <Link target="_blank" rel="noopener noreferrer" href="https://github.com/lordbaldwin1" className="underline hover:text-muted-foreground">GitHub</Link> or <Link target="_blank" rel="noopener noreferrer" href="https://zacharyspringer.dev/" className="underline hover:text-muted-foreground">personal website</Link>. If you have any questions or feedback, please feel free to email me at <Link target="_blank" rel="noopener noreferrer" href="mailto:springerczachary@gmail.com" className="underline hover:text-muted-foreground">springerczachary@gmail.com</Link>.
      </p>
      <br />
      <p className="text-foreground/80">ghost icon credit: <Link target="_blank" rel="noopener noreferrer" href="https://www.flaticon.com/authors/tiemcuala" className="underline hover:text-muted-foreground">Tiemcuala</Link>.</p>
    </div>
  );
}
