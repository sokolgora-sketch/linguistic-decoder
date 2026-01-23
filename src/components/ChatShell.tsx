import React from "react";

type ChatShellProps = {
  title?: string;
  subtitle?: string;
  rightSlot?: React.ReactNode;
  children: React.ReactNode;
  composer?: React.ReactNode;

  /**
   * Layout control: defaults to max-w-7xl.
   * Use "max-w-none" for a full-width console posture (e.g., Instrument UI).
   */
  maxWidthClass?: string;
};

export default function ChatShell({
  title = "ZË-RO",
  subtitle = "Seven-vowel word decoder.",
  rightSlot,
  children,
  composer,
  maxWidthClass = "max-w-7xl",
}: ChatShellProps) {
  const wrap = `mx-auto w-full ${maxWidthClass} px-4`;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header (ChatGPT-style, simple) */}
      <header className="sticky top-0 z-20 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
        <div className={`${wrap} py-3 flex items-center justify-between gap-3`}>
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
        <div className={`${wrap} py-6`}>{children}</div>
      </main>

      {/* Bottom composer area */}
      {composer ? (
        <footer className="sticky bottom-0 z-20 border-t bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
          <div className={`${wrap} py-4`}>{composer}</div>
        </footer>
      ) : null}
    </div>
  );
}
