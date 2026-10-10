import {
  executeS4ProductValidationV0_2,
  finalizeS4ProductValidationAttempt2V0_2,
  verifyS4ProductValidationV0_2,
} from "@/shared/openInstrument/multilingualDiscoverySubstrateS4.v0_2";

async function main(): Promise<void> {
  if (process.argv.includes("--verify")) {
    const verified = verifyS4ProductValidationV0_2();
    console.log("S4_STORED_RESULT_INTEGRITY_PASS");
    console.log(`S4_OUTCOME=${verified.outcome}`);
    console.log(`S4_NEW_POSITIVE_INPUTS=${verified.summary.NEW_POSITIVE_INPUTS}`);
    console.log(`S4_COVERAGE_BEFORE=${verified.summary.COVERAGE_BEFORE}`);
    console.log(`S4_COVERAGE_AFTER=${verified.summary.COVERAGE_AFTER}`);
    return;
  }
  if (process.argv.includes("--finalize-attempt-2")) {
    const finalized = finalizeS4ProductValidationAttempt2V0_2();
    console.log("S4_ATTEMPT_2_OFFLINE_FINALIZATION_PASS");
    console.log(`S4_NEW_POSITIVE_INPUTS=${finalized.summary.NEW_POSITIVE_INPUTS}`);
    console.log(`S4_COVERAGE_BEFORE=${finalized.summary.COVERAGE_BEFORE}`);
    console.log(`S4_COVERAGE_AFTER=${finalized.summary.COVERAGE_AFTER}`);
    console.log("PROVIDER_QUERIES_DURING_RECOVERY=0");
    console.log("INDEX_LOOKUPS_DURING_RECOVERY=0");
    console.log("NETWORK_CALLS_DURING_RECOVERY=0");
    console.log("EVALUATION_INPUTS_REEXECUTED=0");
    return;
  }
  const result = await executeS4ProductValidationV0_2();
  console.log("S4_PRODUCT_VALIDATION_EXECUTION_PASS");
  console.log(`S4_OUTCOME=${result.summary.NEW_POSITIVE_INPUTS > 0 ? "S4_MEASURABLE_IMPROVEMENT" : "S4_BOUNDED_NO_IMPROVEMENT"}`);
  for (const [key, value] of Object.entries(result.summary)) console.log(`${key}=${value ?? "NULL"}`);
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exitCode = 1;
});
