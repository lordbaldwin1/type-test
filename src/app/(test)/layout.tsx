"use client";

import Navbar from "~/components/navbar";
import Footer from "~/components/footer";
import { TestLayoutProvider, useTestLayout } from "./_context/test-layout-context";

function TestLayoutContent({ children }: { children: React.ReactNode }) {
  const { showUi } = useTestLayout();

  return (
    <div className="flex h-screen flex-col">
      <div
        className={`transition-opacity duration-300 ${
          showUi ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Navbar />
      </div>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <div
        className={`transition-opacity duration-300 ${
          showUi ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Footer />
      </div>
    </div>
  );
}

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TestLayoutProvider>
      <TestLayoutContent>{children}</TestLayoutContent>
    </TestLayoutProvider>
  );
} 