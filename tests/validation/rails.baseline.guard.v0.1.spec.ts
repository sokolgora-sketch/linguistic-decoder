import { readFileSync } from "node:fs";

function read(p: string): string {
  return readFileSync(p, "utf8");
}

function expectExactMatch(currentPath: string, baselinePath: string) {
  const cur = read(currentPath);
  const base = read(baselinePath);
  expect(cur).toBe(base);
}

test("validation rails baselines are locked (v0.1 + v0.2)", () => {
  expectExactMatch(
    "docs/validation/validation.results.current.v0.1.json",
    "docs/validation/validation.results.baseline.v0.1.json"
  );

  expectExactMatch(
    "docs/validation/validation.results.current.v0.2.json",
    "docs/validation/validation.results.baseline.v0.2.json"
  );
});
