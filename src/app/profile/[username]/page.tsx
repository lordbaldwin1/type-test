import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import * as simpleIcons from "simple-icons";
import { getUserBestTimeStats, getUserBestWordStats, getUserPosition, getUserRank15 } from "~/server/db/queries";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const youtubeIcon = simpleIcons.siYoutube;
  const githubIcon = simpleIcons.siGithub;
  const xIcon = simpleIcons.siX;
  const twitchIcon = simpleIcons.siTwitch;
  const discordIcon = simpleIcons.siDiscord;

  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    return notFound();
  }

  const { time15, time30, time60 } = await getUserBestTimeStats(user.id);
  const bestTime15Wpm = time15?.wpm || time15?.wpm !== 0 ? time15?.wpm : "n/a";
  const bestTime30Wpm = time30?.wpm ?? "n/a";
  const bestTime60Wpm = time60?.wpm ?? "n/a";
  const bestTime15Accuracy = time15?.accuracy || time15?.accuracy !== 0 ? time15?.accuracy : "n/a";
  const bestTime30Accuracy = time30?.accuracy ?? "n/a";
  const bestTime60Accuracy = time60?.accuracy ?? "n/a";

  const { word10, word25, word50, word100 } = await getUserBestWordStats(user.id);
  const bestWord10Wpm = word10?.wpm ?? "n/a";
  const bestWord25Wpm = word25?.wpm ?? "n/a";
  const bestWord50Wpm = word50?.wpm ?? "n/a";
  const bestWord100Wpm = word100?.wpm ?? "n/a";
  const bestWord10Accuracy = word10?.accuracy ?? "n/a";
  const bestWord25Accuracy = word25?.accuracy ?? "n/a";
  const bestWord50Accuracy = word50?.accuracy ?? "n/a";
  const bestWord100Accuracy = word100?.accuracy ?? "n/a";

  const userRankAverageWpm = await getUserPosition(user.averageWpm);
  const userRank15Time = await getUserRank15(user.averageWpm);

  const averageWpmRank = userRankAverageWpm?.rank;
  const average15TimeRank = userRank15Time?.rank;

  return (
    <div className="flex flex-col items-center justify-center px-4 md:px-8 lg:px-16 xl:px-24 mt-8 animate-in fade-in-0 duration-500">
      {/* Top Card */}
      <div className="bg-card flex w-full flex-col rounded-lg p-4 lg:flex-row">
        {/* Profile Section */}
        <div className="flex flex-col items-center py-6 lg:mr-8">
          <div className="flex flex-row">
            <Image
              src={"/knight-helm.png"}
              alt="knight helmet"
              className="mr-4 rounded-full bg-gray-300"
              width={96}
              height={96}
            />
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-3xl">{user.username}</h1>
              <p className="text-muted-foreground text-sm">{`Joined ${user.createdAt.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}`}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-row items-center justify-center w-full">
            <p className="text-lg text-left">127</p>
            <div className="bg-border mx-3 h-2 w-full rounded-sm" />
            <p className="text-muted-foreground text-sm">1.2k/19.1k</p>
          </div>
        </div>

        {/* Divider after Profile */}
        <div className="bg-border mx-4 hidden h-full w-px rounded-sm lg:block order-4 lg:order-1" />

        {/* Test Stats Section - Now shown second on large screens */}
        <div className="order-2 lg:order-2 grid grid-cols-3 gap-4 place-items-center justify-self-center lg:place-items-start lg:max-w-sm mx-auto lg:flex lg:flex-1 lg:flex-col lg:justify-center w-full lg:mr-8 py-6 lg:py-0">
          <div>
            <h1 className="text-muted-foreground text-sm">tests started</h1>
            <p className="text-2xl leading-none">{user.totalGamesStarted}</p>
          </div>
          <div>
            <h1 className="text-muted-foreground text-sm">tests completed</h1>
            <p className="text-2xl leading-none">{user.totalGames}</p>
          </div>
          <div>
            <h1 className="text-muted-foreground text-sm">time typing</h1>
            <p className="text-2xl leading-none">
              {Math.floor(user.timeTyping / 3600).toString().padStart(2, '0')}:
              {Math.floor((user.timeTyping % 3600) / 60).toString().padStart(2, '0')}:
              {(user.timeTyping % 60).toString().padStart(2, '0')}
            </p>
          </div>
        </div>

        {/* Divider after Test Stats */}
        <div className="bg-border mx-4 hidden h-full w-px rounded-sm lg:block order-5 lg:order-3" />

        {/* Bio Section - Now shown third on large screens */}
        <div className="order-1 lg:order-4 flex flex-1 flex-col justify-center py-6 lg:mr-8 lg:py-0">
          <h1 className="text-muted-foreground text-md -mb-1">bio</h1>
          <p className="text-sm leading-none max-w-md">
            hi everyone, i&apos;m a keyboard enthusiast and i love to type. hi everyone, i&apos;m a keyboard enthusiast and i love to type. hi everyone, i&apos;m a keyboard enthusiast and i love to type. hi everyone, i&apos;m a keyboard enthusiast and i love to type.
          </p>
          <h1 className="text-muted-foreground text-md mt-4 -mb-1">keyboard</h1>
          <p className="text-sm leading-none">Realforce 87u</p>
        </div>

        {/* Divider after Bio */}
        <div className="bg-border mx-4 hidden h-full w-px rounded-sm lg:block order-6 lg:order-5" />

        {/* Socials Section - Remains last */}
        <div className="order-3 lg:order-6 flex flex-row justify-center gap-4 lg:flex-col lg:justify-center py-6 lg:py-0">
          <div
            dangerouslySetInnerHTML={{ __html: youtubeIcon.svg }}
            className="h-8 w-8 [&>svg]:fill-foreground"
          />
          <div
            dangerouslySetInnerHTML={{ __html: githubIcon.svg }}
            className="h-8 w-8 [&>svg]:fill-foreground"
          />
          <div
            dangerouslySetInnerHTML={{ __html: xIcon.svg }}
            className="h-8 w-8 [&>svg]:fill-foreground"
          />
          <div
            dangerouslySetInnerHTML={{ __html: twitchIcon.svg }}
            className="h-8 w-8 [&>svg]:fill-foreground"
          />
          <div
            dangerouslySetInnerHTML={{ __html: discordIcon.svg }}
            className="h-8 w-8 [&>svg]:fill-foreground"
          />
        </div>
      </div>

      {/* Leaderboard and Stats Cards */}
      <div className="w-full mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* All-Time English Leaderboards Card */}
        <div className="bg-card rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-muted-foreground text-lg mb-4 tracking-widest text-center">leaderboards</h2>
          <div className="flex flex-row justify-center gap-16 w-full mb-2">
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-base">15s wpm</span>
              <span className="text-3xl font-mono">{averageWpmRank}</span>
              <span className="text-xs text-muted-foreground tracking-widest mt-1">GOAT</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-base">ave. wpm</span>
              <span className="text-3xl font-mono">{average15TimeRank}</span>
              <span className="text-xs text-muted-foreground tracking-widest mt-1">GOAT</span>
            </div>
          </div>
        </div>
        {/* Time-Based Stats Card */}
        <div className="bg-card rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-muted-foreground text-lg mb-4 tracking-widest">time stats (wpm)</h2>
          <div className="grid grid-cols-3 gap-6 w-full">
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-sm">15 sec.</span>
              <span className="text-3xl font-mono">{bestTime15Wpm}</span>
              <span className="text-muted-foreground text-base">{bestTime15Accuracy}%</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-sm">30 sec.</span>
              <span className="text-3xl font-mono">{bestTime30Wpm}</span>
              <span className="text-muted-foreground text-base">{bestTime30Accuracy}%</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-sm">60 sec.</span>
              <span className="text-3xl font-mono">{bestTime60Wpm}</span>
              <span className="text-muted-foreground text-base">{bestTime60Accuracy}%</span>
            </div>
          </div>
        </div>
        {/* Word-Based Stats Card */}
        <div className="bg-card rounded-lg p-6 flex flex-col items-center">
          <h2 className="text-muted-foreground text-lg mb-4 tracking-widest">word stats (wpm)</h2>
          <div className="grid grid-cols-4 gap-6 w-full">
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-sm">10 w</span>
              <span className="text-3xl font-mono">{bestWord10Wpm}</span>
              <span className="text-muted-foreground text-base">{bestWord10Accuracy}%</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-sm">25 w</span>
              <span className="text-3xl font-mono">{bestWord25Wpm}</span>
              <span className="text-muted-foreground text-base">{bestWord25Accuracy}%</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-sm">50 w</span>
              <span className="text-3xl font-mono">{bestWord50Wpm}</span>
              <span className="text-muted-foreground text-base">{bestWord50Accuracy}%</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-sm">100 w</span>
              <span className="text-3xl font-mono">{bestWord100Wpm}</span>
              <span className="text-muted-foreground text-base">{bestWord100Accuracy}%</span>
            </div>
          </div>
        </div>

      </div>
      <div className="flex justify-center mt-8">
        <div className={`flex flex-row items-center justify-center gap-2 text-sm text-muted-foreground transition-opacity duration-300`}>
          <kbd className="bg-card text-foreground rounded-sm px-2 py-1 font-mono">
            tab
          </kbd>
          <p>+</p>
          <kbd className="bg-card text-foreground rounded-sm px-2 py-1 font-mono">
            enter
          </kbd>
          <p>- start playing</p>
        </div>
      </div>
    </div>
  );
}
