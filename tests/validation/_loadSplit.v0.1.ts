import { readFileSync } from "node:fs";
import path from "node:path";
import type { ValidationRecordV01 } from "../../src/shared/validation/metrics.v0.1";

function readJson(p: string): unknown {
  return JSON.parse(readFileSync(p, "utf8")) as unknown;
}

export function loadDatasetV01(): ValidationRecordV01[] {
  const p = path.join(process.cwd(), "tests/validation/datasets/validation.dataset.v0.1.json");
  return readJson(p) as ValidationRecordV01[];
}

export function loadSplitRecordsV01(splitFile: string): ValidationRecordV01[] {
  const all = loadDatasetV01();
  const byId = new Map(all.map((r) => [r.id, r]));

  const p = path.join(process.cwd(), splitFile);
  const raw = readJson(p);

  if (Array.isArray(raw) && raw.length && typeof raw[0] === "string") {
    const ids = raw as string[];
    return ids.map((id) => byId.get(id)).filter(Boolean) as ValidationRecordV01[];
  }

  return raw as ValidationRecordV01[];
}
