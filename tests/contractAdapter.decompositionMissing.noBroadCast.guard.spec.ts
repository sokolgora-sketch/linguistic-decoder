import fs from "node:fs";

describe("contractAdapter decomposition missing boundary", () => {
  it("does not use a broad PresentOrMissing cast for candidate decomposition", () => {
    const text = fs.readFileSync("src/ui/instrument/contractAdapter.ts", "utf8");

    expect(text).not.toContain(
      'decomposition: missing("not_emitted") as PresentOrMissing<DecompositionItemVM[]>,'
    );

    expect(text).toContain(
      'decomposition: missing<DecompositionItemVM[]>("not_emitted"),'
    );
  });
});
