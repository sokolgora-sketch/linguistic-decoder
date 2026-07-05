import fs from "node:fs";

describe("contractAdapter rootMap parser boundary", () => {
  it("does not use broad casts in parseRootMapV1 and narrows token roles, key statuses, and span sources before typed return", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    const start = text.indexOf("function parseRootMapV1(v: unknown): ParseRootMapResult {");
    const end = text.indexOf("// ----------------------- small helpers -----------------------", start);

    expect(start).toBeGreaterThanOrEqual(0);
    expect(end).toBeGreaterThan(start);

    const block = text.slice(start, end);

    expect(block).not.toContain("(v as any).tokens");
    expect(block).not.toContain("(v as any).keys");
    expect(block).not.toContain("(v as any).carriers");
    expect(block).not.toContain("(v as any).spans");
    expect(block).not.toContain("(v as any).notes");
    expect(block).not.toContain("return { ok: true, value: v as RootMapV1 };");
    expect(block).not.toContain("...(role != null ? { role } : {}),");
    expect(block).not.toContain('...(source != null ? { source } : {}),');

    expect(block).toContain('type RootMapTokenRole =');
    expect(block).toContain('type RootMapKeyStatus =');
    expect(block).toContain('type RootMapSpanSource =');
    expect(block).toContain('const normalizeRootTokenRole = (value: unknown): RootMapTokenRole | null => {');
    expect(block).toContain('const normalizeRootKeyStatus = (value: unknown): RootMapKeyStatus | null => {');
    expect(block).toContain('const normalizeRootSpanSource = (value: unknown): RootMapSpanSource | null => {');

    expect(block).toContain('const tokens = v["tokens"]');
    expect(block).toContain('const keys = v["keys"]');
    expect(block).toContain('const carriers = v["carriers"]');
    expect(block).toContain('const spans = v["spans"]');
    expect(block).toContain('const notes = v["notes"]');

    expect(block).toContain("const typedTokens: RootMapToken[] = tokens.map");
    expect(block).toContain("const typedKeys: RootMapKey[] = keys.map");
    expect(block).toContain('const typedCarriers: RootMapV1["carriers"] =');
    expect(block).toContain('const typedSpans: RootMapV1["spans"] =');
    expect(block).toContain('const typedNotes: RootMapV1["notes"] =');

    expect(block).toContain("const normalizedRole = role == null ? null : normalizeRootTokenRole(role);");
    expect(block).toContain('throw new Error("rootMap.tokens[].role expected RootTokenRoleV1")');
    expect(block).toContain("...(normalizedRole != null ? { role: normalizedRole } : {}),");

    expect(block).toContain("const normalizedStatus = normalizeRootKeyStatus(status);");
    expect(block).toContain('return { ok: false, reason: "rootMap.keys[].status expected RootKeyStatusV1" };');
    expect(block).toContain('throw new Error("rootMap.keys[].status expected RootKeyStatusV1")');
    expect(block).toContain("status: normalizedStatus,");

    expect(block).toContain("const normalizedSource = normalizeRootSpanSource(source);");
    expect(block).toContain('return { ok: false, reason: "rootMap.spans[].source expected RootSpanSourceV1" };');
    expect(block).toContain('throw new Error("rootMap.spans[].source expected RootSpanSourceV1")');
    expect(block).toContain("source: normalizedSource,");

    expect(block).toContain("value: {");
    expect(block).toContain("tokens: typedTokens,");
    expect(block).toContain("keys: typedKeys,");
    expect(block).toContain("composedMeaning,");
    expect(block).toContain("...(typedSpans ? { spans: typedSpans } : {}),");
  });
});
