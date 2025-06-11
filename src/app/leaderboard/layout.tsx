import Navbar from "~/components/navbar";
import Footer from "~/components/footer"; 
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Leaderboard | Vanishtype",
}

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="font-mono flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}

