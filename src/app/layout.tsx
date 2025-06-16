import "~/styles/globals.css";

import { type Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "~/lib/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "~/components/ui/sonner";
import { dark } from "@clerk/themes";

const baseUrl = "https://vanishtype.com";

export const metadata: Metadata = {
  title: "Vanishtype | A simple, quiet typing test",
  description: "A simple, minimalistic typing test site with speed metrics and leaderboards",
  keywords: ["typing test", "typing", "test", "speed", "metrics", "leaderboards", "minimalistic", "simple", "quiet", "vanishtype"],
  authors: [{ name: "Zachary Springer", url: "https://zacharyspringer.dev" }],
  metadataBase: new URL(baseUrl),
  applicationName: "Vanishtype",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  twitter: {
    card: 'summary_large_image',
    title: "Vanishtype | A simple, quiet typing test",
    description: "A simple, minimalistic typing test site with speed metrics and leaderboards",
    images: [`${baseUrl}/og-image.png`],
  },
  openGraph: {
    title: "Vanishtype | A simple, quiet typing test",
    description: "A simple, minimalistic typing test site with speed metrics and leaderboards",
    images: [{ url: `${baseUrl}/og-image.png` }],
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider appearance={{ baseTheme: dark }}>
      <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
        <head />

        <body className="font-mono flex h-screen flex-col overflow-hidden">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            themes={["dark", "light", "serika-dark", "blue", "rose", "purple", "light-rose"]}
          >
            <main className="flex-1 overflow-auto">
              {children}
            </main>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
