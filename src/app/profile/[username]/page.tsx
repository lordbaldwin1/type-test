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
    <div className="flex flex-col items-center justify-center">
      {/* Top Card */}
      <div className="bg-card flex w-full flex-row rounded-lg p-4">
        {/* Profile Section */}
        <div className="flex flex-col items-center py-6 mr-8">
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
          <div className="mt-4 flex flex-row items-center justify-center">
            <p className="text-lg">127</p>
            <div className="bg-border mx-3 h-2 w-40 rounded-sm" />
            <p className="text-muted-foreground text-sm">1.2k/19.1k</p>
          </div>
        </div>

        <div className="bg-border mx-4 h-full w-2 rounded-sm" />

        {/* Test Started/Completed/Time Typing */}
        <div className="mr-8 flex flex-col justify-center">
          <h1 className="text-muted-foreground text-md -mb-1">tests started</h1>
          <p className="text-3xl leading-none">89112</p>
          <h1 className="text-muted-foreground text-md mt-4 -mb-1">
            tests completed
          </h1>
          <p className="text-3xl leading-none">9253</p>
          <h1 className="text-muted-foreground text-md mt-4 -mb-1">
            time typing
          </h1>
          <p className="text-3xl leading-none">123:45:67</p>
        </div>

        <div className="bg-border mx-4 h-full w-2 rounded-sm" />

        {/* Bio Section */}
        <div className="mr-8 flex flex-col justify-center">
          <h1 className="text-muted-foreground text-md -mb-1">bio</h1>
          <p className="text-sm leading-none">
            hi everyone, i&apos;m a keyboard enthusiast and i love to type.
          </p>
          <h1 className="text-muted-foreground text-md mt-4 -mb-1">keyboard</h1>
          <p className="text-sm leading-none">Realforce 87u</p>
        </div>

        <div className="bg-border mx-4 h-full w-2 rounded-sm" />

        {/* Socials Section */}
        <div className="mr-8 flex flex-col justify-center gap-4">
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
