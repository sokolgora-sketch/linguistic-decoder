import fs from "node:fs";

describe("contractAdapter pickVoicePaths evidence-selection boundary", () => {
  it("does not use broad Record casts for heartInstrumentV1 / evidence / raw.evidence selection", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    const start = text.indexOf('const hiRootValue = getField(payload, "heartInstrumentV1");');
    const end = text.indexOf('const evVowelPathArr = evPick ? asStringArray(evPick["vowelPath"]) : null;', start);

    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);

    const block = text.slice(start, end);

    expect(block).not.toContain('getField(payload, "heartInstrumentV1") as Record<string, unknown>');
    expect(block).not.toContain('getField(payload, "evidence") as Record<string, unknown>');
    expect(block).not.toContain('rawPayload["evidence"] as Record<string, unknown>');

    expect(block).toContain('const hiRootValue = getField(payload, "heartInstrumentV1");');
    expect(block).toContain('const hiRoot = isRecord(hiRootValue) ? hiRootValue : null;');
    expect(block).toContain('const evRootEvidenceValue = getField(payload, "evidence");');
    expect(block).toContain('const evRootEvidence = isRecord(evRootEvidenceValue) ? evRootEvidenceValue : null;');
    expect(block).toContain('const rawEvidenceValue = isRecord(rawPayload) ? rawPayload["evidence"] : null;');
    expect(block).toContain('const evRawEvidence = isRecord(rawEvidenceValue) ? rawEvidenceValue : null;');
  });
});
