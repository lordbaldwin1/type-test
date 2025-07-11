import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import * as simpleIcons from "simple-icons";
import {
  getUserBestTimeStats,
  getUserBestWordStats,
  getUserPosition,
  getUserRank15,
} from "~/server/db/queries";
import CopyUrlButton from "../_components/copy-url";
import EditProfile from "../_components/edit-profile";
import Link from "next/link";
import { Globe } from "lucide-react";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const githubIcon = simpleIcons.siGithub;
  const xIcon = simpleIcons.siX;

  const user = await db.query.users.findFirst({
    where: eq(users.username, username),
  });

  if (!user) {
    return notFound();
  }

  const { time15, time30, time60 } = await getUserBestTimeStats(user.id);
  const bestTime15Wpm = time15?.wpm || time15?.wpm !== 0 ? time15?.wpm : "-";
  const bestTime30Wpm = time30?.wpm ?? "-";
  const bestTime60Wpm = time60?.wpm ?? "-";
  const bestTime15Accuracy =
    time15?.accuracy || time15?.accuracy !== 0 ? time15?.accuracy : "-";
  const bestTime30Accuracy = time30?.accuracy ?? "-";
  const bestTime60Accuracy = time60?.accuracy ?? "-";

  const { word10, word25, word50, word100 } = await getUserBestWordStats(
    user.id,
  );
  const bestWord10Wpm = word10?.wpm ?? "-";
  const bestWord25Wpm = word25?.wpm ?? "-";
  const bestWord50Wpm = word50?.wpm ?? "-";
  const bestWord100Wpm = word100?.wpm ?? "-";
  const bestWord10Accuracy = word10?.accuracy ?? "-";
  const bestWord25Accuracy = word25?.accuracy ?? "-";
  const bestWord50Accuracy = word50?.accuracy ?? "-";
  const bestWord100Accuracy = word100?.accuracy ?? "-";

  const userRankAverageWpm = await getUserPosition(user.averageWpm);
  const userRank15Time = await getUserRank15(time15?.wpm ?? 0);

  const averageWpmRank = userRankAverageWpm?.rank;
  const average15TimeRank = userRank15Time?.rank;

  // ADD XP BAR HERE
  const calculateXpForLevel = (level: number) => {
    let xpRequired = 0;
    let xpIncrement = 100;
    for (let i = 1; i < level; i++) {
      xpRequired += xpIncrement;
      xpIncrement += 100;
    }
    return xpRequired;
  };

  const xpToNextLevel = calculateXpForLevel(user.currentLevel + 1);
  const xpIntoCurrentLevel = user.totalXp;
  const progressWidth = xpIntoCurrentLevel / xpToNextLevel;

  const xpToNextLevelDisplay = (xpToNextLevel / 1000).toFixed(1);
  const xpIntoCurrentLevelDisplay = (xpIntoCurrentLevel / 1000).toFixed(1);

  return (
    <div className="animate-in fade-in-0 mx-24 mt-8 flex flex-col items-center justify-center duration-500">
      {/* Top Card */}
      <div className="bg-card outline-border flex h-full w-full flex-row rounded-lg outline-2">
        <div className="bg-card flex w-full flex-col rounded-lg p-4 lg:flex-row">
          {/* Profile Section */}
          <div className="border-border flex flex-1 flex-col items-center justify-center border-b-2 py-6 lg:mr-8 lg:border-b-0">
            <div className="flex flex-row w-full">
              <div className="flex flex-col items-center justify-center w-full">
                <h1 className="text-3xl">{user.username}</h1>
                <p className="text-muted-foreground text-sm">{`Joined ${user.createdAt.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" })}`}</p>
                <div className="flex flex-row items-center justify-between w-full gap-4 mt-1">
                  <span className="text-muted-foreground text-xl font-semibold text-right min-w-[60px]">{`${user.currentLevel}`}</span>
                  <div className="relative flex-1 h-4 bg-muted rounded-sm overflow-hidden">
                    <div
                      className="bg-primary h-full transition-all duration-500 ease-out"
                      style={{ width: `${Math.min(progressWidth * 100, 100)}%` }}
                    />
                  </div>
                  <span className="text-muted-foreground text-sm min-w-[80px] text-left">{`${xpIntoCurrentLevelDisplay}k/${xpToNextLevelDisplay}k`}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider after Profile */}
          <div className="bg-border order-4 mx-4 hidden h-full w-2 rounded-sm lg:order-1 lg:block" />

          {/* Test Stats Section */}
          <div className="border-border order-2 mx-auto grid w-full grid-cols-3 place-items-center gap-4 justify-self-center border-b-2 py-6 lg:order-2 lg:mr-8 lg:flex lg:max-w-sm lg:flex-1 lg:flex-col lg:place-items-start lg:justify-center lg:border-b-0 lg:py-0">
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
                {Math.floor(user.timeTyping / 3600)
                  .toString()
                  .padStart(2, "0")}
                :
                {Math.floor((user.timeTyping % 3600) / 60)
                  .toString()
                  .padStart(2, "0")}
                :{(user.timeTyping % 60).toString().padStart(2, "0")}
              </p>
            </div>
          </div>

          {/* Divider after Test Stats */}
          <div className="bg-border order-5 mx-4 hidden h-full w-2 rounded-sm lg:order-3 lg:block" />

          {/* Bio Section - Now shown third on large screens */}
          <div className="border-border order-1 flex flex-1 flex-col justify-center border-b-2 py-6 lg:order-4 lg:mr-8 lg:border-b-0 lg:py-0">
            <h1 className="text-muted-foreground text-md -mb-1">bio</h1>
            <p className="max-w-md text-sm leading-none">
              {user.bio}
            </p>
            <h1 className="text-muted-foreground text-md mt-4 -mb-1">
              keyboard
            </h1>
            <p className="text-sm leading-none">{user.keyboard}</p>
          </div>

          {/* Divider after Bio */}
          <div className="bg-border order-6 mx-4 hidden h-full w-2 rounded-sm lg:order-5 lg:block" />

          {/* Socials Section - Remains last */}
          <div className="order-3 flex flex-row justify-center gap-4 py-6 lg:order-6 lg:flex-col lg:justify-center lg:py-0">
            {user.githubUsername && (
              <Link href={`https://github.com/${user.githubUsername}`} target="_blank" rel="noopener noreferrer">
                <div
                  dangerouslySetInnerHTML={{ __html: githubIcon.svg }}
                  className="[&>svg]:fill-muted-foreground hover:[&>svg]:fill-primary h-8 w-8"
                />
              </Link>
            )}
            {user.xUsername && (
              <Link href={`https://x.com/${user.xUsername}`} target="_blank" rel="noopener noreferrer">
                <div
                dangerouslySetInnerHTML={{ __html: xIcon.svg }}
                className="[&>svg]:fill-muted-foreground hover:[&>svg]:fill-primary h-8 w-8"
                />
              </Link>
            )}
            {user.websiteUrl && (
              <Link href={user.websiteUrl} target="_blank" rel="noopener noreferrer">
                <Globe className="h-8 w-8 text-muted-foreground hover:text-primary" />
              </Link>
            )}
            {!user.githubUsername && !user.xUsername && !user.websiteUrl && (
              <p className="text-muted-foreground text-sm">no socials</p>
            )}
          </div>
        </div>
        <div className="flex h-full w-8 flex-col items-end">
          <EditProfile />
          <CopyUrlButton />
        </div>
      </div>

      {/* Leaderboard and Stats Cards */}
      <div className="mt-8 grid w-full grid-cols-1 gap-6 lg:grid-cols-3">
        {/* All-Time English Leaderboards Card */}
        <div className="bg-card outline-border flex flex-col items-center rounded-lg p-6 outline-2">
          <h2 className="text-muted-foreground mb-4 text-center text-lg tracking-widest">
            leaderboards
          </h2>
          <div className="mb-2 flex w-full flex-row justify-center gap-16">
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-base">15s wpm</span>
              <span className="font-mono text-3xl">{averageWpmRank}</span>
              <span className="text-muted-foreground mt-1 text-xs tracking-widest">
                GOAT
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-base">ave. wpm</span>
              <span className="font-mono text-3xl">{average15TimeRank}</span>
              <span className="text-muted-foreground mt-1 text-xs tracking-widest">
                GOAT
              </span>
            </div>
          </div>
        </div>
        {/* Time-Based Stats Card */}
        <div className="bg-card outline-border flex flex-col items-center rounded-lg p-6 outline-2">
          <h2 className="text-muted-foreground mb-4 text-lg tracking-widest">
            time stats (wpm)
          </h2>
          <div className="grid w-full grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-sm">15 sec.</span>
              <span className="font-mono text-3xl">{bestTime15Wpm}</span>
              <span className="text-muted-foreground text-base">
                {bestTime15Accuracy}%
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-sm">30 sec.</span>
              <span className="font-mono text-3xl">{bestTime30Wpm}</span>
              <span className="text-muted-foreground text-base">
                {bestTime30Accuracy}%
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-sm">60 sec.</span>
              <span className="font-mono text-3xl">{bestTime60Wpm}</span>
              <span className="text-muted-foreground text-base">
                {bestTime60Accuracy}%
              </span>
            </div>
          </div>
        </div>
        {/* Word-Based Stats Card */}
        <div className="bg-card outline-border flex flex-col items-center rounded-lg p-6 outline-2">
          <h2 className="text-muted-foreground mb-4 text-lg tracking-widest">
            word stats (wpm)
          </h2>
          <div className="grid w-full grid-cols-4 gap-6">
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-sm">10 w</span>
              <span className="font-mono text-3xl">{bestWord10Wpm}</span>
              <span className="text-muted-foreground text-base">
                {bestWord10Accuracy}%
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-sm">25 w</span>
              <span className="font-mono text-3xl">{bestWord25Wpm}</span>
              <span className="text-muted-foreground text-base">
                {bestWord25Accuracy}%
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-sm">50 w</span>
              <span className="font-mono text-3xl">{bestWord50Wpm}</span>
              <span className="text-muted-foreground text-base">
                {bestWord50Accuracy}%
              </span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-muted-foreground text-sm">100 w</span>
              <span className="font-mono text-3xl">{bestWord100Wpm}</span>
              <span className="text-muted-foreground text-base">
                {bestWord100Accuracy}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
