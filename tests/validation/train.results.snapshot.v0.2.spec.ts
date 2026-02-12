import { readFileSync } from "node:fs";
import path from "node:path";
import { computeValidationResultsV0_2, type ValidationRecordV01 } from "../../src/shared/validation/metrics.v0.2";

function readJson<T>(rel: string): T {
  const p = path.join(process.cwd(), rel);
  return JSON.parse(readFileSync(p, "utf8")) as T;
}

function loadSplit(splitPath: string, all: ValidationRecordV01[]): ValidationRecordV01[] {
  const raw = readJson<unknown>(splitPath);
  if (Array.isArray(raw) && raw.length && typeof raw[0] === "string") {
    const ids = raw as string[];
    const byId = new Map(all.map((r) => [r.id, r]));
    return ids.map((id) => byId.get(id)).filter(Boolean) as ValidationRecordV01[];
  }
  return raw as ValidationRecordV01[];
}

test("validation v0.2 — train results snapshot", () => {
  const all = readJson<ValidationRecordV01[]>("tests/validation/datasets/validation.dataset.v0.2.json");
  const train = loadSplit("tests/validation/datasets/validation.train.v0.2.json", all);
  const out = computeValidationResultsV0_2(train);
  expect(out).toMatchSnapshot();
});
