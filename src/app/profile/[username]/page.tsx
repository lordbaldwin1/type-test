import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Image from "next/image";
import { db } from "~/server/db";
import { users } from "~/server/db/schema";
import * as simpleIcons from "simple-icons";

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
  return (
    <div className="flex flex-col items-center justify-center px-4 md:px-8 lg:px-16 xl:px-24 mt-8">
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
        <div className="order-2 lg:order-2 grid grid-cols-3 gap-4 place-items-center justify-self-center max-w-sm mx-auto lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:mr-8 py-6 lg:py-0">
          <div>
            <h1 className="text-muted-foreground text-sm">tests started</h1>
            <p className="text-2xl leading-none">89112</p>
          </div>
          <div>
            <h1 className="text-muted-foreground text-sm">tests completed</h1>
            <p className="text-2xl leading-none">9253</p>
          </div>
          <div>
            <h1 className="text-muted-foreground text-sm">time typing</h1>
            <p className="text-2xl leading-none">123:45:67</p>
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
      <h1>Profile</h1>
      <p>{username}</p>
    </div>
  );
}
