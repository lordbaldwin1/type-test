import { count } from "drizzle-orm";
import { db } from "~/server/db";
import { games, users } from "~/server/db/schema";
import Image from "next/image";
import Link from "next/link";
import * as simpleIcons from "simple-icons";

export const dynamic = "force-dynamic";

export default async function About() {
  const totalUsers = await db.select({ count: count() }).from(users);
  const totalGames = await db.select({ count: count() }).from(games);

  // Icon references
  const TypeScriptIcon = simpleIcons.siTypescript;
  const HTMLIcon = simpleIcons.siHtml5;
  const CSSIcon = simpleIcons.siCss;
  const ReactIcon = simpleIcons.siReact;
  const NextIcon = simpleIcons.siNextdotjs;
  const GitIcon = simpleIcons.siGit;
  const GitHubIcon = simpleIcons.siGithub;
  const TailwindIcon = simpleIcons.siTailwindcss;
  const DrizzleIcon = simpleIcons.siDrizzle;
  const PostgresIcon = simpleIcons.siPostgresql;
  const RailwayIcon = simpleIcons.siRailway;
  const GitHubActionsIcon = simpleIcons.siGithubactions;

  return (
    <div className="animate-fade-in flex w-full flex-col items-center px-4 py-8">
      <div className="mx-auto w-full max-w-3xl lg:max-w-5xl">
        <div className="mt-0 mb-4 flex w-full flex-wrap items-center justify-center gap-4">
          <div className="">
            <Image
              src="/pixel-archer.gif"
              className="from-primary/20 to-secondary/20 outline-border rounded-xl bg-gradient-to-br outline-1"
              alt="logo"
              width={100}
              height={100}
              priority
            />
          </div>
          <div className="flex min-w-[200px] flex-1 flex-col justify-center">
            <span className="text-muted-foreground text-start text-xs">
              created by:
            </span>
            <h1 className="bg-primary bg-clip-text text-start text-4xl font-bold text-transparent md:text-5xl">
              zachary springer
            </h1>
          </div>
          <div className="flex flex-shrink-0 items-center gap-2">
            <p className="text-muted-foreground border-border border-r-2 pr-4">
              total users: {totalUsers[0]?.count}
            </p>
            <p className="text-muted-foreground">
              total tests completed: {totalGames[0]?.count}
            </p>
          </div>
        </div>

        <section className="flex flex-col gap-2">
          <h2 className="text-foreground text-2xl font-semibold">About</h2>
          <p className="text-muted-foreground leading-relaxed">
            I&apos;m a massive fan of the minimalistic, elegant typing site{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://monkeytype.com"
              className="hover:text-foreground underline"
            >
              monkeytype.com
            </Link>
            . I wanted to see if I was able to recreate the same experience
            using my favorite modern tech stack. This site is not built using
            any source code from the{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/monkeytypegame/monkeytype/tree/master"
              className="hover:text-foreground underline"
            >
              monkeytype
            </Link>{" "}
            because I&apos;m young and they use jQuery. I built this site from
            scratch using monkeytype as heavy inspiration.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            The source code for this site is available{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/lordbaldwin1/type-test"
              className="hover:text-foreground underline"
            >
              here
            </Link>{" "}
            or in the footer below and is under the MIT license. If you would
            like to see anything else I&apos;m working on, checkout my{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://github.com/lordbaldwin1"
              className="hover:text-foreground underline"
            >
              GitHub
            </Link>{" "}
            or{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://zacharyspringer.dev/"
              className="hover:text-foreground underline"
            >
              personal website
            </Link>
            . If you have any questions or feedback, please feel free to email
            me at{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="mailto:springerczachary@gmail.com"
              className="hover:text-foreground underline"
            >
              springerczachary@gmail.com
            </Link>
            .
          </p>
          <p className="text-muted-foreground mt-4">
            ghost icon credit:{" "}
            <Link
              target="_blank"
              rel="noopener noreferrer"
              href="https://www.flaticon.com/authors/tiemcuala"
              className="hover:text-foreground underline"
            >
              Tiemcuala
            </Link>
            .
          </p>
        </section>

        <section className="mt-8 flex flex-col gap-2">
          <h2 className="text-foreground mb-4 text-2xl font-semibold">
            created with
          </h2>
          <div className="flex flex-col gap-8">
            <div>
              <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
                {[
                  { icon: NextIcon, name: "Next.js" },
                  { icon: ReactIcon, name: "React" },
                  { icon: TypeScriptIcon, name: "TypeScript" },
                  { icon: DrizzleIcon, name: "Drizzle" },
                  { icon: PostgresIcon, name: "Postgres" },
                  { icon: HTMLIcon, name: "HTML5" },
                  { icon: CSSIcon, name: "CSS" },
                  { icon: TailwindIcon, name: "Tailwind" },
                  { icon: GitIcon, name: "Git" },
                  { icon: GitHubIcon, name: "GitHub" },
                  { icon: GitHubActionsIcon, name: "GitHub Actions" },
                  { icon: RailwayIcon, name: "Railway" },
                ]
                  .filter(({ icon }) => !!icon)
                  .map(({ icon, name }) => (
                    <div
                      key={name}
                      className="bg-card group flex cursor-pointer flex-col items-center justify-center rounded-xl p-3 shadow transition-transform"
                      title={name}
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: icon.svg }}
                        className="[&>svg]:fill-muted-foreground group-hover:[&>svg]:fill-primary h-8 w-8"
                      />
                      <span className="text-muted-foreground group-hover:text-primary mt-2 text-center text-xs font-semibold">
                        {name}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
