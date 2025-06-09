import { count } from "drizzle-orm";
import { db } from "~/server/db";
import { games, users } from "~/server/db/schema";
import Image from "next/image";

export default async function About() {
  const totalUsers = await db.select({ count: count() }).from(users);
  const totalGames = await db.select({ count: count() }).from(games);
  return (
    <div className="flex flex-col lg:max-w-3xl md:max-w-2xl mx-auto h-screen mt-8">
      <div className="flex flex-row items-center justify-center mb-8 gap-4">
        <p className="text-muted-foreground border-r-2 border-border pr-4">total users: {totalUsers[0]?.count}</p>
        <p className="text-muted-foreground">total tests completed: {totalGames[0]?.count}</p>
      </div>
      <Image src="/knight-helm.png" className="mx-auto bg-gradient-to-br from-primary/20 to-secondary/20 outline outline-1 outline-border rounded-full" alt="logo" width={225} height={225} />
      <h1 className="text-left text-2xl font-bold">About</h1>
      <p>
      type-test is a typing test game that allows you to test your typing speed and accuracy.type-test is a typing test game that allows you to test your typing speed and accuracy.type-test is a typing test game that allows you to test your typing speed and accuracy.type-test is a typing test game that allows you to test your typing speed and accuracy.type-test is a typing test game that allows you to test your typing speed and accuracy.
      </p>
    </div>
  );
}
