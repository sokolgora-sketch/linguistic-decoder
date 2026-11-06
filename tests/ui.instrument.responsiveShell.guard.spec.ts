import fs from "node:fs";

function read(path: string): string {
  return fs.readFileSync(path, "utf8");
}

describe("Open Instrument responsive shell guard", () => {
  it("keeps the mobile composer in flow and the desktop sticky composer below safe-area content", () => {
    const source = read("src/components/ChatShell.tsx");

    expect(source).toContain("static border-t border-[#333333]");
    expect(source).toContain("sm:sticky sm:bottom-0");
    expect(source).toContain("env(safe-area-inset-bottom)");
    expect(source).toContain("pb-4 sm:pb-[calc(22rem+env(safe-area-inset-bottom))]");
    expect(source).toContain("xl:pb-[calc(7.5rem+env(safe-area-inset-bottom))]");
  });

  it("settles each mobile result on its analysis and exposes a direct composer jump", () => {
    const source = read("src/components/ZroChatPage.tsx");

    expect(source).toContain("window.matchMedia('(max-width: 639px)').matches");
    expect(source).toContain("typeof window.matchMedia === 'function'");
    expect(source).toContain('window.innerWidth <= 639');
    expect(source).toContain("settledResultMessageIdRef.current !== settledResultMessageId");
    expect(source).toContain("behavior: 'instant'");
    expect(source).toContain('data-testid="settled-analysis-result"');
    expect(source).toContain("primaryReading ?? result");
    expect(source).toContain("inputElement.focus({ preventScroll: true })");

    const panel = read("src/ui/instrument/InstrumentPanel.tsx");
    expect(panel).toContain('data-testid="primary-reading-scroll-target"');
    expect(panel).toContain('data-testid="mobile-composer-jump"');
    expect(panel).toContain("scroll-mt-24 sm:scroll-mt-0");
  });

  it("keeps the /chat composer compact and full-width across breakpoints", () => {
    const source = read("src/components/ZroChatPage.tsx");

    expect(source).toContain("w-full min-w-0");
    expect(source).toContain("md:grid-cols-2");
    expect(source).toContain("xl:grid-cols-[minmax(0,1fr)_minmax(220px,0.45fr)_minmax(260px,0.55fr)_minmax(150px,0.32fr)_minmax(180px,0.42fr)_132px]");
    expect(source).toContain("md:col-span-2 xl:col-span-1");
  });

  it("keeps tabs and long inspection text inside the instrument shell", () => {
    const panel = read("src/ui/instrument/InstrumentPanel.tsx");
    const candidates = read("src/ui/candidates/CandidatesAccordion.tsx");
    const rawJson = read("src/ui/instrument/sections/RawJsonCard.tsx");
    const tabsStart = panel.indexOf("function SectionTabs");
    const tabsEnd = panel.indexOf("function TabPanel", tabsStart);
    const tabs = panel.slice(tabsStart, tabsEnd);

    expect(panel).toContain("max-w-full overflow-hidden");
    expect(tabs).toContain("flex max-w-full flex-wrap gap-1.5");
    expect(tabs).toContain("min-h-10 max-w-full rounded-[8px]");
    expect(tabs).not.toContain("overflow-x-auto");
    expect(tabs).not.toContain("whitespace-nowrap");
    expect(candidates).toContain("whitespace-pre-wrap break-words");
    expect(rawJson).toContain("whitespace-pre-wrap break-words");
  });
});
