import React from "react";

type ChatShellProps = {
  title?: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
  composer?: React.ReactNode;
};

export default function ChatShell({
  title = "ZË-RO",
  subtitle = "Seven-Voices word decoder.",
  rightSlot,
  children,
  composer,
}: ChatShellProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header (ChatGPT-style, simple) */}
      <header className="sticky top-0 z-20 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <div className="mx-auto w-full max-w-4xl px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-semibold tracking-tight">{title}</div>
            <div className="text-xs text-muted-foreground truncate">{subtitle}</div>
          </div>

          {rightSlot ? (
            <div className="shrink-0">{rightSlot}</div>
          ) : (
            <div className="text-xs text-muted-foreground shrink-0">Ready when you are.</div>
          )}
        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        <div className="mx-auto w-full max-w-4xl px-4 py-6">
          {children}
        </div>
      </main>

      {/* Bottom composer area */}
      {composer ? (
        <footer className="sticky bottom-0 z-20 border-t bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
          <div className="mx-auto w-full max-w-4xl px-4 py-4">
            {composer}
          </div>
        </footer>
      ) : null}
    </div>
  );
}
