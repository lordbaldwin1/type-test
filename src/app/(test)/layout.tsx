"use client";

import { useState, createContext, useContext } from "react";
import Navbar from "~/components/navbar";
import Footer from "~/components/footer";

interface TestLayoutContextType {
  showUi: boolean;
  setShowUi: (show: boolean) => void;
}

const TestLayoutContext = createContext<TestLayoutContextType | undefined>(undefined);

export function useTestLayout() {
  const context = useContext(TestLayoutContext);
  if (!context) {
    throw new Error("useTestLayout must be used within TestLayoutProvider");
  }
  return context;
}

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showUi, setShowUi] = useState(true);

  return (
    <TestLayoutContext.Provider value={{ showUi, setShowUi }}>
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
    </TestLayoutContext.Provider>
  );
} 