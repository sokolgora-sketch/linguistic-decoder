import {
  evaluateCanonicalOperatorReuseMatrixV0_1,
} from "../../src/shared/canonicalOperatorReuseMatrix.v0_1";

const report =
  evaluateCanonicalOperatorReuseMatrixV0_1();

console.log(JSON.stringify(report, null, 2));

if (!report.pass) {
  console.error(
    "DA/DI canonical-operator reuse metrics failed.",
  );
  process.exitCode = 1;
}
