import fs from "node:fs";

function read(path: string): string {
  return fs.readFileSync(path, "utf8");
}

describe("Open Instrument responsive shell guard", () => {
  it("keeps the sticky composer from covering the final result content", () => {
    const source = read("src/components/ChatShell.tsx");

    expect(source).toContain("sticky bottom-0");
    expect(source).toContain("env(safe-area-inset-bottom)");
    expect(source).toContain("pb-[calc(16rem+env(safe-area-inset-bottom))]");
    expect(source).toContain("xl:pb-[calc(7.5rem+env(safe-area-inset-bottom))]");
  });

  it("keeps the /chat composer compact and full-width across breakpoints", () => {
    const source = read("src/components/ZroChatPage.tsx");

    expect(source).toContain("w-full min-w-0");
    expect(source).toContain("md:grid-cols-[minmax(0,1fr)_minmax(220px,0.45fr)]");
    expect(source).toContain("md:col-span-2 xl:col-span-1");
  });

  it("keeps tabs and long inspection text inside the instrument shell", () => {
    const panel = read("src/ui/instrument/InstrumentPanel.tsx");
    const candidates = read("src/ui/candidates/CandidatesAccordion.tsx");
    const rawJson = read("src/ui/instrument/sections/RawJsonCard.tsx");

    expect(panel).toContain("max-w-full overflow-hidden");
    expect(panel).toContain("overscroll-x-contain");
    expect(panel).toContain("whitespace-nowrap");
    expect(candidates).toContain("whitespace-pre-wrap break-words");
    expect(rawJson).toContain("whitespace-pre-wrap break-words");
  });
});
