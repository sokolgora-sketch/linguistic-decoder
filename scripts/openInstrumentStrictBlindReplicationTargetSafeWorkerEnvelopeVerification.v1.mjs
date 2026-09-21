import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const dir = resolve(root, "docs/open-instrument/research-artifacts/strict-blind-embryo-first-replication-series-v1");
const envelopePath = resolve(dir, "target-safe-worker-envelope.v1.json");
const preregistrationPath = resolve(dir, "preregistration.json");

const EXPECTED_PREREGISTRATION_BYTES = 18031;
const EXPECTED_PREREGISTRATION_SHA256 = "ee1baa297a3155a0c0e29afe8c96cc909b7329d49cc1498c0e58cfecd32a4352";
const EXPECTED_SOURCE_UNIVERSE = ["fjale.fjalor-shqip.v0_1", "scaife.lewis-short.v0_1", "scaife.middle-liddell.v0_1"];
const EXPECTED_SEARCH_STAGES = [
  "S0 exact embryo",
  "S1 identity-preserving normalization",
  "S2 source-attested bounded morphology",
  "S3 source-attested dialect/history",
  "S4 authoritative reconstruction",
];
const EXPECTED_SEARCH_FORBIDDEN = [
  "target lookup",
  "target translation",
  "target semantic search",
  "unlimited spelling mutation",
  "unlogged substitution",
  "post-hoc function search",
];
const EXPECTED_OUTCOMES = [
  "FUNCTIONAL_CORRESPONDENCE",
  "LEXICAL_EQUIVALENCE",
  "FORM_RESEMBLANCE_ONLY",
  "HISTORICAL_RELATION_ONLY",
  "INSUFFICIENT_CORRESPONDENCE",
  "NULL",
];
const EXPECTED_TRUTH_HIERARCHY = ["FACT", "INFERENCE", "HYPOTHESIS", "UNKNOWN / NULL"];
const EXPECTED_BLIND_TRUTH_HIERARCHY = ["source_fact", "inference", "hypothesis", "unknown"];
const EXPECTED_PAYLOAD_SLOTS = ["SBR-01", "SBR-02", "SBR-03"];
const FORBIDDEN_KEYS = new Set([
  "targetWord",
  "partOfSpeech",
  "targetSenseId",
  "targetSenseDefinition",
  "targetSenseLocator",
  "targetDefinition",
  "targetLocator",
  "expansionChain",
  "operationIds",
  "controller",
  "controllerSha256",
  "candidatePool",
  "candidatePoolAuthority",
  "structuralControllers",
  "selectedTargets",
  "selectedWords",
  "previousResults",
  "priorResults",
  "m7Results",
  "dfBrain",
  "linear",
  "parentConversation",
  "projectContext",
  "targetDefinition",
]);

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const readJson = (path) => JSON.parse(readFileSync(path, "utf8"));
const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
const escaped = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const containsLeakedIdentity = (serialized, value) => new RegExp(`(^|[^a-z0-9])${escaped(value)}([^a-z0-9]|$)`, "i").test(serialized);

function findForbiddenKeys(value, path = "$") {
  const found = [];
  if (Array.isArray(value)) {
    value.forEach((item, index) => found.push(...findForbiddenKeys(item, `${path}[${index}]`)));
    return found;
  }
  if (!value || typeof value !== "object") return found;
  for (const [key, child] of Object.entries(value)) {
    if (FORBIDDEN_KEYS.has(key)) found.push(`${path}.${key}`);
    found.push(...findForbiddenKeys(child, `${path}.${key}`));
  }
  return found;
}

function assertEqual(actual, expected, message) {
  if (!same(actual, expected)) throw new Error(`${message}: ${JSON.stringify(actual)}`);
}

export function validateTargetSafeWorkerEnvelope(envelope, { selectedWords = [], selectedSenseIds = [], selectedDefinitions = [] } = {}) {
  if (envelope.schemaVersion !== "open-instrument.strict-blind-embryo-first-replication-series-target-safe-worker-envelope.v1") throw new Error("envelope schema mismatch");
  if (envelope.artifactKind !== "TARGET_SAFE_WORKER_EXECUTION_ENVELOPE") throw new Error("envelope kind mismatch");
  if (envelope.experimentId !== "open-instrument-strict-blind-embryo-first-replication-series-v1") throw new Error("envelope experiment identity mismatch");
  if (envelope.status !== "EXECUTION_CONTRACT_ONLY") throw new Error("envelope status mismatch");

  const forbidden = findForbiddenKeys(envelope);
  if (forbidden.length) throw new Error(`target-bearing envelope key: ${forbidden.join(",")}`);
  const serialized = JSON.stringify(envelope).toLowerCase();
  for (const value of [...selectedWords, ...selectedSenseIds, ...selectedDefinitions]) {
    if (value && containsLeakedIdentity(serialized, value)) throw new Error(`target leakage in envelope: ${value}`);
  }

  const authority = envelope.authorizationBoundary;
  for (const [key, expected] of Object.entries({
    researchOnly: true,
    noScientificExecution: true,
    noTargetReveal: true,
    noProductionEvidence: true,
    noRuntimeAuthorization: true,
    noCatalogMutation: true,
    noBaselineMutation: true,
    noPreregistrationMutation: true,
    noHistoricalM7Mutation: true,
  })) if (authority?.[key] !== expected) throw new Error(`authorization boundary mismatch: ${key}`);

  if (envelope.preregistrationBinding?.path !== "docs/open-instrument/research-artifacts/strict-blind-embryo-first-replication-series-v1/preregistration.json") throw new Error("preregistration path mismatch");
  if (envelope.preregistrationBinding.sha256 !== EXPECTED_PREREGISTRATION_SHA256 || envelope.preregistrationBinding.mustRemainByteIdentical !== true) throw new Error("preregistration binding mismatch");
  if (envelope.preregistrationBinding.selectedCasesAreNotIncluded !== true || envelope.preregistrationBinding.controllersAreNotIncluded !== true) throw new Error("target-safe preregistration boundary mismatch");

  assertEqual(envelope.sourceUniverse.traditions.map((tradition) => tradition.id), EXPECTED_SOURCE_UNIVERSE, "source universe mismatch");
  if (envelope.sourceUniverse.sourcePolicyId !== "open-instrument-m7-common-source-universe-v1" || envelope.sourceUniverse.noNewTradition !== true || envelope.sourceUniverse.languagesAreWitnessesNotWinners !== true || envelope.sourceUniverse.sourceUnavailabilityIsValidState !== true) throw new Error("source authority boundary mismatch");
  if (envelope.searchPolicy.searchPolicyVersion !== "open-instrument-m7-search-s0-s4-v1") throw new Error("search policy version mismatch");
  assertEqual(envelope.searchPolicy.orderedStages, EXPECTED_SEARCH_STAGES, "search stages mismatch");
  assertEqual(envelope.searchPolicy.forbidden, EXPECTED_SEARCH_FORBIDDEN, "search prohibitions mismatch");
  if (envelope.searchPolicy.everyQueryMustBeLogged !== true || envelope.searchPolicy.allCasesUseSamePolicy !== true) throw new Error("search logging or common-policy boundary mismatch");

  assertEqual(envelope.truthHierarchy, EXPECTED_TRUTH_HIERARCHY, "truth hierarchy mismatch");
  if (envelope.blindPayloadContract.onePayloadOnly !== true || envelope.blindPayloadContract.mustMatchPreregistrationDeclaration !== true || envelope.blindPayloadContract.mustRemainByteIdentical !== true) throw new Error("blind payload identity contract mismatch");
  assertEqual(envelope.sourceQueryRecordContract.resultStates, ["FOUND", "NOT_FOUND", "SOURCE_UNAVAILABLE", "AMBIGUOUS"], "query result states mismatch");
  assertEqual(envelope.sourceQueryRecordContract.searchStages, ["S0", "S1", "S2", "S3", "S4"], "query stages mismatch");
  if (envelope.sourceQueryRecordContract.interpretationForbidden !== true) throw new Error("query interpretation boundary missing");
  if (envelope.sourceFactContract.truthLevel !== "FACT" || envelope.sourceFactContract.targetBindingForbidden !== true || envelope.sourceFactContract.functionalInterpretationSeparate !== true) throw new Error("source fact boundary mismatch");
  assertEqual(envelope.formRelationContract.allowedRelationTypes, ["exact_identity", "identity_preserving_normalization", "source_attested_bounded_morphology", "source_attested_dialect_history", "authoritative_reconstruction"], "form relation classes mismatch");
  if (envelope.formRelationContract.sourceEvidenceRequired !== true || envelope.formRelationContract.unlimitedMutationForbidden !== true) throw new Error("form relation boundary mismatch");

  const freeze = envelope.functionFreezeContract;
  assertEqual(freeze.allowedTruthLevels, ["INFERENCE", "HYPOTHESIS"], "function truth levels mismatch");
  if (freeze.nullTruthLevel !== "UNKNOWN / NULL" || freeze.targetBindingForbidden !== true || freeze.freezeStatus !== "FROZEN" || freeze.noBoundedFunctionStatus !== "NULL" || freeze.createdBeforeTargetReveal !== true || freeze.immutableAfterFreeze !== true || freeze.functionsMayNotBeAddedRemovedStrengthenedWeakenedOrRewrittenAfterFreeze !== true) throw new Error("function freeze boundary mismatch");
  assertEqual(freeze.freezeBeforeReveal, ["SOURCE_QUERY_LOG", "SOURCE_FACTS", "FORM_RELATIONS", "FUNCTION_CANDIDATES", "FUNCTION_CLASSES", "TRUTH_LEVELS", "ALTERNATIVES", "REJECTIONS", "NULL_IF_NONE", "EVIDENCE_REFS"], "function freeze fields mismatch");
  if (envelope.nullIfNone.ruleId !== "open-instrument-m7-null-if-no-bounded-function-v1" || envelope.nullIfNone.condition !== "NO_BOUNDED_FUNCTION_AT_PRE_REVEAL_FREEZE" || envelope.nullIfNone.result !== "NULL" || envelope.nullIfNone.explicitNullRequired !== true || envelope.nullIfNone.sourceFactAloneDoesNotImplyInsufficientCorrespondence !== true) throw new Error("NULL_IF_NONE boundary mismatch");

  assertEqual(envelope.outcomeContract.outcomeSpace, EXPECTED_OUTCOMES, "outcome space mismatch");
  if (envelope.outcomeContract.specificityPolicy.requiresBoundedTargetSpecificMechanism !== true || envelope.outcomeContract.specificityPolicy.broadFunctionInsufficient !== true || envelope.outcomeContract.specificityPolicy.metaphoricalPostHocFitInsufficient !== true || envelope.outcomeContract.specificityPolicy.synonymExpansionForbidden !== true || envelope.outcomeContract.specificityPolicy.semanticStrengtheningAfterRevealForbidden !== true || envelope.outcomeContract.specificityPolicy.semanticWeakeningAfterRevealForbidden !== true) throw new Error("specificity policy mismatch");
  if (envelope.outcomeContract.preRevealOutcome.noBoundedFunction !== "NULL" || envelope.outcomeContract.postRevealOutcome.boundedFunctionFrozenButNoFunctionPassesCorrespondenceOrSpecificity !== "INSUFFICIENT_CORRESPONDENCE" || envelope.outcomeContract.targetCorrespondenceForbiddenBeforeDurability !== true) throw new Error("outcome boundary mismatch");

  if (envelope.artifactContract.targetRevealStatus !== "NOT_REQUESTED_AND_NOT_PERFORMED" || envelope.artifactContract.createdBeforeTargetReveal !== true || envelope.artifactContract.explicitNullAllowed !== true || envelope.artifactContract.noTargetBearingFields !== true) throw new Error("artifact reveal boundary mismatch");
  for (const field of ["primaryPersistedBeforeReveal", "primaryClosedAndReopened", "primaryRawLengthAndShaComputedFromDisk", "primaryRecomputedAfterReadback", "internalIdentityReverifiedFromReopenedBytes", "separateVerificationReportRequired", "secondaryByteForByteCopyRequired", "secondaryRecomputedFromDisk", "primaryAndSecondaryMustMatchExactly", "bothPathsAndIdentitiesRecorded", "secondaryMustNotBeCreatedByReserialization", "parentRecoveryRequired"]) if (envelope.durabilityContract[field] !== true) throw new Error(`durability requirement missing: ${field}`);
  if (envelope.durabilityContract.revealBlockedUntilComplete !== true) throw new Error("reveal durability gate missing");
  if (envelope.parentRecoveryContract.failureBehavior !== "FAIL_CLOSED_NO_TARGET_REVEAL") throw new Error("parent recovery failure behavior mismatch");
  if (envelope.workerIsolationContract.forkContext !== false || envelope.workerIsolationContract.selfAuditBeforeSourceResearch !== true || envelope.workerIsolationContract.failureBehavior !== "STOP_BEFORE_SOURCE_RESEARCH") throw new Error("worker isolation boundary mismatch");
  assertEqual(envelope.caseIndependenceContract.executionOrder, EXPECTED_PAYLOAD_SLOTS, "case execution order mismatch");
  if (envelope.caseIndependenceContract.oneFreshWorkerPerCase !== true || envelope.caseIndependenceContract.workerReuseForbidden !== true || envelope.caseIndependenceContract.previousResultsInput !== false || envelope.caseIndependenceContract.crossCaseLearningForbidden !== true || envelope.caseIndependenceContract.otherCaseInspectionForbidden !== true) throw new Error("case independence mismatch");
  assertEqual(envelope.claimBoundaries, ["research_only", "no_production_evidence", "no_runtime_authorization", "no_historical_derivation_claim", "no_cognacy_claim", "no_borrowing_claim", "no_language_superiority_claim", "no_candidate_truth_claim", "no_single_winner", "user_decides", "null_is_valid"], "claim boundary mismatch");
  for (const [key, expected] of Object.entries({ productionEvidenceAdmitted: false, catalogMutationAuthorized: false, baselineMutationAuthorized: false, runtimeMutationAuthorized: false, apiOrUiMutationAuthorized: false })) if (envelope.runtimeAuthorization?.[key] !== expected) throw new Error(`runtime authorization mismatch: ${key}`);
  return true;
}

export function verifyStrictBlindReplicationTargetSafeWorkerEnvelope() {
  const envelopeBytes = readFileSync(envelopePath);
  const preregistrationBytes = readFileSync(preregistrationPath);
  const envelope = JSON.parse(envelopeBytes.toString("utf8"));
  const preregistration = JSON.parse(preregistrationBytes.toString("utf8"));
  if (preregistrationBytes.byteLength !== EXPECTED_PREREGISTRATION_BYTES || sha256(preregistrationBytes) !== EXPECTED_PREREGISTRATION_SHA256) throw new Error("preregistration identity mismatch");
  validateTargetSafeWorkerEnvelope(envelope, {
    selectedWords: preregistration.structuralControllers.map((controller) => controller.targetWord),
    selectedSenseIds: preregistration.structuralControllers.map((controller) => controller.targetSenseId),
    selectedDefinitions: preregistration.structuralControllers.map((controller) => controller.targetSenseDefinition),
  });
  if (envelopeBytes.byteLength === 0) throw new Error("empty worker envelope");
  const payloadResults = preregistration.blindPayloads.map((declared) => {
    const payloadBytes = readFileSync(resolve(root, declared.path));
    if (payloadBytes.byteLength !== declared.rawByteLength || sha256(payloadBytes) !== declared.rawSha256) throw new Error(`blind payload identity mismatch: ${declared.replicationSlot}`);
    const payload = JSON.parse(payloadBytes.toString("utf8"));
    assertEqual(Object.keys(payload).sort(), ["claimBoundary", "durabilityPolicyId", "embryo", "experimentId", "forbiddenOperations", "functionFreezePolicyVersion", "opaqueStructuralProvenanceReference", "replicationSlot", "schemaVersion", "searchPolicyVersion", "sourceUniverseId", "targetRevealStatus", "truthHierarchy", "voicePath", "workerIsolationPolicyId"].sort(), `blind payload shape mismatch: ${declared.replicationSlot}`);
    assertEqual(payload.truthHierarchy, EXPECTED_BLIND_TRUTH_HIERARCHY, `blind truth hierarchy mismatch: ${declared.replicationSlot}`);
    if (payload.targetRevealStatus !== "FORBIDDEN_UNTIL_DURABILITY_GATE" || payload.experimentId !== envelope.experimentId || payload.replicationSlot !== declared.replicationSlot) throw new Error(`blind payload boundary mismatch: ${declared.replicationSlot}`);
    if (!same(payload.forbiddenOperations, EXPECTED_SEARCH_FORBIDDEN)) throw new Error(`blind payload search boundary mismatch: ${declared.replicationSlot}`);
    return { replicationSlot: declared.replicationSlot, byteLength: payloadBytes.byteLength, sha256: sha256(payloadBytes) };
  });
  return {
    envelopeByteLength: envelopeBytes.byteLength,
    envelopeSha256: sha256(envelopeBytes),
    preregistrationByteLength: preregistrationBytes.byteLength,
    preregistrationSha256: sha256(preregistrationBytes),
    payloadResults,
  };
}

export function assembleTargetSafeWorkerInputForDryRun(replicationSlot) {
  const result = verifyStrictBlindReplicationTargetSafeWorkerEnvelope();
  const declaration = readJson(preregistrationPath).blindPayloads.find((payload) => payload.replicationSlot === replicationSlot);
  if (!declaration) throw new Error(`unknown replication slot: ${replicationSlot}`);
  const payload = readJson(resolve(root, declaration.path));
  return {
    envelope: readJson(envelopePath),
    blindPayload: payload,
    authorizedSourceAccess: "PLACEHOLDER_AUTHORIZED_SOURCE_ACCESS",
    externalDurabilityDirectory: "PLACEHOLDER_CASE_SPECIFIC_EXTERNAL_DURABILITY_DIRECTORY",
    sourceQueriesPerformed: 0,
    targetRevealed: false,
    result,
  };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) console.log(JSON.stringify(verifyStrictBlindReplicationTargetSafeWorkerEnvelope()));
