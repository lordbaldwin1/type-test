"use client";

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
} 