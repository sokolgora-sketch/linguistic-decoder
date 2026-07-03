import { existsSync, readFileSync } from "node:fs";

const docCandidates = [
  "docs/contracts/UI_Telemetry_Contract_v0.1_DONE.md",
  "docs/UI_TELEMETRY_CONTRACT_v0.1_DONE.md",
];

function readUiTelemetryDoneDoc(): string {
  const path = docCandidates.find((candidate) => existsSync(candidate));
  if (!path) throw new Error("UI telemetry DONE doc not found.");
  return readFileSync(path, "utf8");
}

describe("UI telemetry DONE doc live-surface reconciliation v0.1", () => {
  it("marks the v0.1 DONE doc as historical and points to current live Open Instrument truth", () => {
    const doc = readUiTelemetryDoneDoc();

    expect(doc).toContain("Current Live Surface Status (2026-07)");
    expect(doc).toContain("historical DONE record for UI Telemetry Contract v0.1");
    expect(doc).toContain("The live user surface is `/chat`");
    expect(doc).toContain("`/chat` renders `ZroChatPage`, which calls `/api/analyze-v1`");
    expect(doc).toContain("`InstrumentPanel` is tabbed");
    expect(doc).toContain("Raw JSON is debug/collapsed-oriented");
    expect(doc).toContain("Reviewed DA functional operator evidence");
    expect(doc).toContain("DI is semantically supported but remains non-live");
    expect(doc).toContain("not historical-origin, winner, or language-superiority evidence");
  });
});
