import React from "react";
import Image from "next/image";
import { MT } from "@/ui/typography/marketingType.v0.1";

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
  const wrap = `mx-auto w-full ${maxWidthClass} px-3 sm:px-4`;

  return (
    <div className="flex min-h-screen min-w-0 flex-col bg-[#111111] text-[#f5f7fb]">
      <header className="sticky top-0 z-20 border-b border-[#333333] bg-[#1a1a1a]/95 backdrop-blur supports-[backdrop-filter]:bg-[#1a1a1a]/88">
        <div className={`${wrap} flex min-w-0 flex-wrap items-center justify-between gap-2 py-2 sm:gap-3`}>
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <Image
              src="/zero_logo_hero_white.svg"
              alt={title}
              width={140}
              height={35}
              className="h-6 w-auto shrink-0 sm:h-7"
              priority={false}
            />
            <div className="min-w-0 border-l border-[#333333] pl-2 sm:pl-3">
              <div className={`${MT.eyebrow} text-[10px] text-[#d7dde7]`}>
                instrument · open
              </div>
              <div className="truncate text-[12px] leading-5 text-[#aeb7c5]">
                {subtitle}
              </div>
            </div>
          </div>

          {rightSlot ? (
            <div className="shrink-0">{rightSlot}</div>
          ) : (
            <div className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#2f5a3d] bg-[#101712] px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#6fc18a]" />
              <span className={`${MT.actionSm} text-[#b7d8c1]`}>Ready</span>
            </div>
          )}
        </div>
      </header>

      <main className={composer ? "flex-1 pb-[calc(16rem+env(safe-area-inset-bottom))] md:pb-[calc(9.5rem+env(safe-area-inset-bottom))] xl:pb-[calc(7.5rem+env(safe-area-inset-bottom))]" : "flex-1"}>
        <div className={`${wrap} py-4`}>{children}</div>
      </main>

      {composer ? (
        <footer className="sticky bottom-0 z-20 border-t border-[#333333] bg-[#111111]/95 backdrop-blur supports-[backdrop-filter]:bg-[#111111]/88">
          <div className={`${wrap} pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 sm:py-4`}>{composer}</div>
        </footer>
      ) : null}
    </div>
  );
}
