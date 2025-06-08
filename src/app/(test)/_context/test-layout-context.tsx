"use client";

import { useState, createContext, useContext } from "react";

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

export function TestLayoutProvider({ children }: { children: React.ReactNode }) {
  const [showUi, setShowUi] = useState(true);

  return (
    <TestLayoutContext.Provider value={{ showUi, setShowUi }}>
      {children}
    </TestLayoutContext.Provider>
  );
} 