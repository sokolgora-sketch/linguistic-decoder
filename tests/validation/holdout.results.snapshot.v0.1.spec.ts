import { computeValidationResultsV0_1 } from "../../src/shared/validation/metrics.v0.1";
import { loadSplitRecordsV01 } from "./_loadSplit.v0.1";

test("validation v0.1 — holdout results snapshot", () => {
  const records = loadSplitRecordsV01("tests/validation/datasets/validation.holdout.v0.1.json");
  const out = computeValidationResultsV0_1(records);
  expect(out).toMatchSnapshot();
});
