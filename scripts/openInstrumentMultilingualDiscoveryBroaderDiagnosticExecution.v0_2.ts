import {
  executeBroaderDiagnosticOnceV0_2,
} from "@/shared/openInstrument/multilingualDiscoverySubstrateBroaderDiagnosticExecution.v0_2";

const rootDir = process.cwd();
const execution = executeBroaderDiagnosticOnceV0_2(rootDir);

console.log(JSON.stringify({
  authoritativeAttempts: execution.result.authoritativeAttempts,
  sampleInputCount: execution.result.sampleInputCount,
  sampleIdentitySha256: execution.result.sampleIdentitySha256,
  validInputCount: execution.result.aggregate.validInputCount,
  invalidOrUnreachableInputCount: execution.result.aggregate.invalidOrUnreachableInputCount,
  distinctQueryKeys: execution.result.aggregate.distinctQueryKeys,
  distinctSubstrateKeysReached: execution.result.aggregate.distinctSubstrateKeysReached,
  distinctAlbanianKeysReached: execution.result.aggregate.distinctAlbanianKeysReached,
  distinctLatinKeysReached: execution.result.aggregate.distinctLatinKeysReached,
  interpretationClass: execution.result.interpretationClass,
  resultSha256: execution.hashes.rawResult,
  manifestSha256: execution.hashes.manifest,
}, null, 2));
