import { computeValidationResultsV0_1 } from "../../src/shared/validation/metrics.v0.1";
import { loadSplitRecordsV01 } from "./_loadSplit.v0.1";

test("validation guard: no Date.now / Math.random / fetch during validation run", () => {
  const records = loadSplitRecordsV01("tests/validation/datasets/validation.train.v0.1.json");

  const origNow = Date.now;
  const origRand = Math.random;
  const origFetch = (globalThis as any).fetch;

  (Date as any).now = () => {
    throw new Error("Date.now is forbidden in validation");
  };
  (Math as any).random = () => {
    throw new Error("Math.random is forbidden in validation");
  };
  (globalThis as any).fetch = () => {
    throw new Error("fetch is forbidden in validation");
  };

  try {
    expect(() => computeValidationResultsV0_1(records)).not.toThrow();
  } finally {
    (Date as any).now = origNow;
    (Math as any).random = origRand;
    (globalThis as any).fetch = origFetch;
  }
});
