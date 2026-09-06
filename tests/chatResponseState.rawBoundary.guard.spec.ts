import { readFileSync } from "node:fs";

describe("/chat response state raw boundary", () => {
  it("keeps network JSON opaque until the existing InstrumentPanel boundary", () => {
    const source = readFileSync("src/components/ZroChatPage.tsx", "utf8");

    expect(source).not.toContain("let res: any");
    expect(source).not.toContain("let json: any");
    expect(source).toContain("const json: unknown");
    expect(source).toContain("payload={latestInstrumentPayload}");
  });
});
