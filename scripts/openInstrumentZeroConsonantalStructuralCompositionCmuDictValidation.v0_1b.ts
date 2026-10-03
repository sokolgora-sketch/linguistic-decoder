import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join, resolve } from "node:path";
import {
  CMUDICT_DATA_BYTES_V0_1,
  CMUDICT_DATA_SHA256_V0_1,
  CMUDICT_SOURCE_NOTATION_V0_1,
  CMUDICT_SOURCE_PROFILE_ID_V0_1,
  CMUDICT_SOURCE_REVISION_V0_1,
  type CmuDictPronunciationVariantV0_1,
} from "@/shared/openInstrument/cmudictArpabetPronunciation.v0_1";
import {
  resolveArpabetPronunciationVariantsToVoiceV0_1,
  type PronunciationVoiceVariantResultV0_1,
} from "@/shared/openInstrument/pronunciationToVoice.v0_1";
import {
  deriveZeroConsonantalStructuralCompositionV0_1,
} from "@/shared/openInstrument/zeroConsonantalStructuralComposition.v0_1";
import {
  buildZeroConsonantalDistributionSummaryV0_1,
  stableJsonV0_1,
} from "@/shared/openInstrument/zeroConsonantalStructuralCompositionValidation.v0_1b";

const REPO_ROOT = process.cwd();
const SOURCE_PATH = join(REPO_ROOT, "src/data/openInstrument/pronunciation/cmudict.dict");
const CONTRACT_PATH = join(REPO_ROOT, "docs/open-instrument/zero-consonantal-structural-composition-v0.1.md");
const CONFIGURATION_AUTHORITY_PATH = join(REPO_ROOT, "docs/open-instrument/consonantal-configuration-authority-v0.1.md");
const PRIOR_PRODUCT_CONTRACT_PATH = join(REPO_ROOT, "docs/open-instrument/consonant-structure-product-embryo-v0.1.md");
const IMPLEMENTATION_PATH = join(REPO_ROOT, "src/shared/openInstrument/zeroConsonantalStructuralComposition.v0_1.ts");
const VALIDATION_MODULE_PATH = join(REPO_ROOT, "src/shared/openInstrument/zeroConsonantalStructuralCompositionValidation.v0_1b.ts");
const SCRIPT_PATH = fileURLToPath(import.meta.url);
const ARTIFACT_DIRECTORY = join(REPO_ROOT, "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1b");
const POPULATION_SPEC_PATH = join(ARTIFACT_DIRECTORY, "population-spec.json");
const RESULT_PATH = join(ARTIFACT_DIRECTORY, "result.json");
const MANIFEST_PATH = join(ARTIFACT_DIRECTORY, "hash-manifest.json");
const FRD02_RESULT_PATH = join(REPO_ROOT, "docs/open-instrument/research-artifacts/frd02-cvc-v0.1c-p4-synthetic-calibration-v0.1/result.json");
const FRD02_MANIFEST_PATH = join(REPO_ROOT, "docs/open-instrument/research-artifacts/frd02-cvc-v0.1c-p4-synthetic-calibration-v0.1/hash-manifest.json");

const HISTORICAL_FRD02_TYPO_SHA256 = "b912ae02bb8be01ba75475df068a3cffdd440eae166542cc944ce8fdabf2bf43";
const ZC_CONTRACT_SHA256 = "1ee274253f2b6da3c29a9c9b4409c258e64a6d4121dcf48925464dac926a8e0c";
const CONFIGURATION_AUTHORITY_SHA256 = "b4d24f1105af0b4a3a2a3275425f84a1499ddea77f0d307f5d175d8125ac502d";
const PRIOR_PRODUCT_CONTRACT_SHA256 = "14ab3a088f891b1aba079d5ef7f6c23a2c5883758c24a7976788dd9024dc99fc";
const PREDECESSOR_ARTIFACT_DIRECTORY = join(REPO_ROOT, "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1");
const PREDECESSOR_RESULT_PATH = join(PREDECESSOR_ARTIFACT_DIRECTORY, "result.json");
const PREDECESSOR_MANIFEST_PATH = join(PREDECESSOR_ARTIFACT_DIRECTORY, "hash-manifest.json");
const PREDECESSOR_POPULATION_SPEC_PATH = join(PREDECESSOR_ARTIFACT_DIRECTORY, "population-spec.json");
const PREDECESSOR_RESULT_SHA256 = "44d00ff40a06c1fe5273755e6cdebabe6322d7eb9cdb8e5b8a359ccafcdb1d10";
const PREDECESSOR_MANIFEST_SHA256 = "274d0e357ceeeb8169e0922200abdddcd5fbd4be03f7cc7aac053c65a931cbe1";
const PREDECESSOR_POPULATION_SPEC_SHA256 = "81248026f57cffb0c357a4e29e0cce4d3139adc1521eda89e72754783095ed44";
const SUCCESSOR_REASON = "AGGREGATION_IMPLEMENTATION_SCALABILITY_DEFECT_REPAIRED";

type PopulationEntryV0_1 = Readonly<{
  lexicalWord: string;
  sourceForm: string;
  variantId: string;
  variantOrder: number;
  sourcePronunciation: string;
  sourceUnits: readonly string[];
  eligibility: "ELIGIBLE" | "NULL_OR_INELIGIBLE";
  reasonCode: string | null;
}>;

type PopulationSpecV0_1 = Readonly<{
  schemaVersion: "open-instrument.zero-consonantal-structural-composition-cmudict-population-spec.v0_1";
  status: "FROZEN_BEFORE_AUTHORITATIVE_EXECUTION";
  source: Readonly<{
    id: typeof CMUDICT_SOURCE_PROFILE_ID_V0_1;
    revision: typeof CMUDICT_SOURCE_REVISION_V0_1;
    notation: typeof CMUDICT_SOURCE_NOTATION_V0_1;
    path: string;
    sha256: string;
    bytes: number;
  }>;
  contracts: Readonly<{
    zcContractSha256: string;
    configurationAuthoritySha256: string;
    priorProductContractSha256: string;
  }>;
  population: Readonly<{
    lexicalFormsTotal: number;
    sourceVariantsTotal: number;
    entries: readonly PopulationEntryV0_1[];
  }>;
  rules: Readonly<{
    eligibility: readonly string[];
    nullAccounting: readonly string[];
    variantPolicy: readonly string[];
    aggregation: readonly string[];
  }>;
}>;

function sha256Bytes(value: Uint8Array): string {
  return createHash("sha256").update(value).digest("hex");
}

function sha256File(path: string): string {
  return sha256Bytes(readFileSync(path));
}

function fileBytes(path: string): number {
  return readFileSync(path).byteLength;
}

function repositoryHead(): string {
  return execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim();
}

function assertFrozenBindings(): void {
  if (
    sha256File(SOURCE_PATH) !== CMUDICT_DATA_SHA256_V0_1 ||
    fileBytes(SOURCE_PATH) !== CMUDICT_DATA_BYTES_V0_1
  ) {
    throw new Error(
      "FROZEN_AUTHORITY_MISMATCH: bundled CMUdict source identity differs from the frozen production source",
    );
  }
  if (sha256File(CONTRACT_PATH) !== ZC_CONTRACT_SHA256) {
    throw new Error("FROZEN_AUTHORITY_MISMATCH: zero-consonantal contract hash differs");
  }
  if (sha256File(CONFIGURATION_AUTHORITY_PATH) !== CONFIGURATION_AUTHORITY_SHA256) {
    throw new Error("FROZEN_AUTHORITY_MISMATCH: consonantal configuration authority hash differs");
  }
  if (sha256File(PRIOR_PRODUCT_CONTRACT_PATH) !== PRIOR_PRODUCT_CONTRACT_SHA256) {
    throw new Error("FROZEN_AUTHORITY_MISMATCH: prior product contract hash differs");
  }
  if (
    sha256File(PREDECESSOR_RESULT_PATH) !== PREDECESSOR_RESULT_SHA256 ||
    sha256File(PREDECESSOR_MANIFEST_PATH) !== PREDECESSOR_MANIFEST_SHA256 ||
    sha256File(PREDECESSOR_POPULATION_SPEC_PATH) !== PREDECESSOR_POPULATION_SPEC_SHA256
  ) {
    throw new Error("PREDECESSOR_INTEGRITY_MISMATCH: preserved v0.1 artifact hash differs");
  }
}

function writeJson(path: string, value: unknown): void {
  writeFileSync(path, JSON.stringify(value, null, 2) + "\n", "utf8");
}

function compareStrings(left: string, right: string): number {
  return left < right ? -1 : left > right ? 1 : 0;
}

function normalizeWord(word: string): string {
  return word.normalize("NFC").trim().toLowerCase();
}

function splitVariant(sourceForm: string): { lexicalWord: string; variantId: string } {
  const match = /^(.*)\((\d+)\)$/u.exec(sourceForm);
  return match ? { lexicalWord: match[1], variantId: match[2] } : { lexicalWord: sourceForm, variantId: "1" };
}

function enumerateSourceVariants(): CmuDictPronunciationVariantV0_1[] {
  const rows = new Map<string, CmuDictPronunciationVariantV0_1[]>();
  for (const line of readFileSync(SOURCE_PATH, "utf8").split(/\r?\n/u)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith(";;;")) continue;
    const separator = trimmed.indexOf(" ");
    if (separator <= 0) continue;
    const sourceForm = trimmed.slice(0, separator);
    const sourcePronunciation = trimmed.slice(separator + 1).trim();
    if (!sourcePronunciation) continue;
    const split = splitVariant(sourceForm);
    const lexicalWord = normalizeWord(split.lexicalWord);
    if (!lexicalWord) continue;
    const variants = rows.get(lexicalWord) ?? [];
    variants.push({
      lexicalWord,
      sourceForm,
      variantId: split.variantId,
      variantOrder: variants.length,
      sourcePronunciation,
      sourceUnits: Object.freeze(sourcePronunciation.split(/\s+/u)),
      sourceProfileId: CMUDICT_SOURCE_PROFILE_ID_V0_1,
      sourceRevision: CMUDICT_SOURCE_REVISION_V0_1,
      sourceNotation: CMUDICT_SOURCE_NOTATION_V0_1,
    });
    rows.set(lexicalWord, variants);
  }
  return [...rows.values()].flat().sort(
    (left, right) =>
      compareStrings(left.lexicalWord, right.lexicalWord) ||
      left.variantOrder - right.variantOrder ||
      compareStrings(left.sourceForm, right.sourceForm),
  );
}

function sourceVariantFromEntry(entry: PopulationEntryV0_1): CmuDictPronunciationVariantV0_1 {
  return {
    lexicalWord: entry.lexicalWord,
    sourceForm: entry.sourceForm,
    variantId: entry.variantId,
    variantOrder: entry.variantOrder,
    sourcePronunciation: entry.sourcePronunciation,
    sourceUnits: entry.sourceUnits,
    sourceProfileId: CMUDICT_SOURCE_PROFILE_ID_V0_1,
    sourceRevision: CMUDICT_SOURCE_REVISION_V0_1,
    sourceNotation: CMUDICT_SOURCE_NOTATION_V0_1,
  };
}

function resolveVariant(variant: CmuDictPronunciationVariantV0_1): PronunciationVoiceVariantResultV0_1 {
  const resolved = resolveArpabetPronunciationVariantsToVoiceV0_1(variant.lexicalWord, [variant]);
  const result = resolved.variants[0];
  if (!result) throw new Error("missing resolved variant for " + variant.sourceForm);
  return result;
}

function compactSegment(segment: PronunciationVoiceVariantResultV0_1["normalizedSegments"][number]) {
  return {
    segmentIndex: segment.segmentIndex,
    kind: segment.kind,
    sourceUnits: [...segment.sourceUnits],
    stress: segment.stress,
    nucleusIndex: segment.nucleusIndex,
    baseCategory: segment.baseCategory,
    voiceAnchors: segment.voiceAnchors === null ? null : [...segment.voiceAnchors],
  };
}

function gammaForVariant(variant: PronunciationVoiceVariantResultV0_1) {
  const sourceNuclei = variant.nuclei.map((nucleus) => ({
    nucleusIndex: nucleus.nucleusIndex,
    sourceSegmentIndex: variant.normalizedSegments.find(
      (segment) => segment.nucleusIndex === nucleus.nucleusIndex,
    )?.segmentIndex ?? null,
    sourceToken: nucleus.sourceToken,
    baseCategory: nucleus.baseCategory,
    stress: nucleus.stress,
    kind: nucleus.kind,
    voiceAnchors: [...nucleus.voiceAnchors],
  }));
  const consonants = variant.normalizedSegments.filter((segment) => segment.kind === "consonant");
  const region = (
    regionKind: string,
    leftNucleusIndex: number | null,
    rightNucleusIndex: number | null,
    segments: typeof consonants,
  ) => ({
    regionKind,
    leftNucleusIndex,
    rightNucleusIndex,
    consonants: segments.map((segment) => ({
      segmentIndex: segment.segmentIndex,
      sourceUnits: [...segment.sourceUnits],
    })),
  });
  const regions = [
    region(
      "SOURCE_PREFIX_REGION",
      null,
      sourceNuclei[0]?.nucleusIndex ?? null,
      consonants.filter(
        (segment) =>
          segment.segmentIndex <
          (sourceNuclei[0]?.sourceSegmentIndex ?? Number.POSITIVE_INFINITY),
      ),
    ),
  ];
  for (let index = 0; index < sourceNuclei.length - 1; index += 1) {
    const left = sourceNuclei[index];
    const right = sourceNuclei[index + 1];
    regions.push(
      region(
        "SOURCE_INTER_NUCLEUS_REGION",
        left.nucleusIndex,
        right.nucleusIndex,
        consonants.filter(
          (segment) =>
            segment.segmentIndex > (left.sourceSegmentIndex ?? -1) &&
            segment.segmentIndex <
              (right.sourceSegmentIndex ?? Number.POSITIVE_INFINITY),
        ),
      ),
    );
  }
  const finalNucleus = sourceNuclei.at(-1);
  regions.push(
    region(
      "SOURCE_SUFFIX_REGION",
      finalNucleus?.nucleusIndex ?? null,
      null,
      consonants.filter(
        (segment) =>
          segment.segmentIndex > (finalNucleus?.sourceSegmentIndex ?? -1),
      ),
    ),
  );
  return {
    variantId: variant.variant.variantId,
    variantOrder: variant.variant.variantOrder,
    sourceProfileId: variant.variant.sourceProfileId,
    sourceNotation: variant.variant.sourceNotation,
    sourceRevision: variant.variant.sourceRevision,
    sourceSegments: variant.normalizedSegments.map(compactSegment),
    sourceNuclei,
    canonicalVoiceEvents: variant.nuclei.flatMap((nucleus) => [...nucleus.voiceAnchors]),
    consonantRegions: regions,
  };
}

function classifyEntry(variant: CmuDictPronunciationVariantV0_1): PopulationEntryV0_1 {
  const resolved = resolveVariant(variant);
  const zc = deriveZeroConsonantalStructuralCompositionV0_1(resolved);
  const eligible = resolved.reasonCode === null && resolved.canonicalVoicePath !== null && zc !== null;
  return {
    lexicalWord: variant.lexicalWord,
    sourceForm: variant.sourceForm,
    variantId: variant.variantId,
    variantOrder: variant.variantOrder,
    sourcePronunciation: variant.sourcePronunciation,
    sourceUnits: [...variant.sourceUnits],
    eligibility: eligible ? "ELIGIBLE" : "NULL_OR_INELIGIBLE",
    reasonCode: eligible ? null : resolved.reasonCode ?? "ZC_NULL",
  };
}

function buildPopulationSpec(): PopulationSpecV0_1 {
  assertFrozenBindings();
  const sourceVariants = enumerateSourceVariants();
  const entries = sourceVariants.map(classifyEntry);
  return {
    schemaVersion: "open-instrument.zero-consonantal-structural-composition-cmudict-population-spec.v0_1",
    status: "FROZEN_BEFORE_AUTHORITATIVE_EXECUTION",
    source: {
      id: CMUDICT_SOURCE_PROFILE_ID_V0_1,
      revision: CMUDICT_SOURCE_REVISION_V0_1,
      notation: CMUDICT_SOURCE_NOTATION_V0_1,
      path: "src/data/openInstrument/pronunciation/cmudict.dict",
      sha256: sha256File(SOURCE_PATH),
      bytes: fileBytes(SOURCE_PATH),
    },
    contracts: {
      zcContractSha256: sha256File(CONTRACT_PATH),
      configurationAuthoritySha256: sha256File(CONFIGURATION_AUTHORITY_PATH),
      priorProductContractSha256: sha256File(PRIOR_PRODUCT_CONTRACT_PATH),
    },
    population: {
      lexicalFormsTotal: new Set(entries.map((entry) => entry.lexicalWord)).size,
      sourceVariantsTotal: entries.length,
      entries,
    },
    rules: {
      eligibility: [
        "Enumerate every retained source variant from the frozen bundled CMUdict file.",
        "Resolve each variant through resolveArpabetPronunciationVariantsToVoiceV0_1.",
        "Require variant.reasonCode=null and canonicalVoicePath non-null.",
        "Require deriveZeroConsonantalStructuralCompositionV0_1 to return non-null.",
        "Each eligible variant contributes exactly one primary observation.",
      ],
      nullAccounting: [
        "Every non-eligible source variant remains counted with its existing variant reason when available.",
        "ZC_NULL is an artifact accounting label for a valid pronunciation variant that the frozen ZC function returns Null for; it is not a new runtime reason code.",
        "Null/ineligible variants contribute no fabricated ZC observation.",
      ],
      variantPolicy: [
        "No first-variant selection, winner selection, majority vote, or collapse of same-path variants.",
        "Variant identity and variant order remain part of every eligible observation.",
      ],
      aggregation: [
        "Sort observations by normalized lexicalWord, variantOrder, then sourceForm using code-point ordering.",
        "Use JSON serialization with fixed object-key insertion order for vector, Gamma, ZC, and group signatures.",
        "Frequency tables are sorted by descending count with canonical signature tie-breaks, except numeric histograms which are ascending by value.",
        "R equality includes identity, segmentIndices, and occurrenceCount exactly as returned by the frozen implementation.",
      ],
    },
  };
}

function assertPopulationSpecMatchesSource(spec: PopulationSpecV0_1): void {
  assertFrozenBindings();
  if (
    spec.source.id !== CMUDICT_SOURCE_PROFILE_ID_V0_1 ||
    spec.source.revision !== CMUDICT_SOURCE_REVISION_V0_1 ||
    spec.source.notation !== CMUDICT_SOURCE_NOTATION_V0_1 ||
    spec.source.sha256 !== CMUDICT_DATA_SHA256_V0_1 ||
    spec.source.bytes !== CMUDICT_DATA_BYTES_V0_1 ||
    spec.contracts.zcContractSha256 !== ZC_CONTRACT_SHA256 ||
    spec.contracts.configurationAuthoritySha256 !== CONFIGURATION_AUTHORITY_SHA256 ||
    spec.contracts.priorProductContractSha256 !== PRIOR_PRODUCT_CONTRACT_SHA256
  ) {
    throw new Error(
      "VALIDATION_INVALID_IMPLEMENTATION_OR_EXECUTION_DEFECT: population spec is not bound to the frozen source and contracts",
    );
  }
  if (sha256File(SOURCE_PATH) !== spec.source.sha256 || fileBytes(SOURCE_PATH) !== spec.source.bytes) {
    throw new Error("VALIDATION_INVALID_IMPLEMENTATION_OR_EXECUTION_DEFECT: source hash/bytes changed after population freeze");
  }
  const current = enumerateSourceVariants().map((variant) => ({
    lexicalWord: variant.lexicalWord,
    sourceForm: variant.sourceForm,
    variantId: variant.variantId,
    variantOrder: variant.variantOrder,
    sourcePronunciation: variant.sourcePronunciation,
    sourceUnits: [...variant.sourceUnits],
  }));
  const frozen = spec.population.entries.map((entry) => ({
    lexicalWord: entry.lexicalWord,
    sourceForm: entry.sourceForm,
    variantId: entry.variantId,
    variantOrder: entry.variantOrder,
    sourcePronunciation: entry.sourcePronunciation,
    sourceUnits: [...entry.sourceUnits],
  }));
  if (stableJsonV0_1(current) !== stableJsonV0_1(frozen)) {
    throw new Error("VALIDATION_INVALID_IMPLEMENTATION_OR_EXECUTION_DEFECT: source population changed after freeze");
  }
}

function resultObservation(entry: PopulationEntryV0_1) {
  const resolved = resolveVariant(sourceVariantFromEntry(entry));
  const zc = deriveZeroConsonantalStructuralCompositionV0_1(resolved);
  if (entry.eligibility !== "ELIGIBLE" || resolved.reasonCode !== null || resolved.canonicalVoicePath === null || zc === null) {
    throw new Error("VALIDATION_INVALID_IMPLEMENTATION_OR_EXECUTION_DEFECT: frozen eligible entry became Null: " + entry.sourceForm);
  }
  return {
    lexicalWord: entry.lexicalWord,
    sourceForm: entry.sourceForm,
    variantId: entry.variantId,
    variantOrder: entry.variantOrder,
    sourcePronunciation: entry.sourcePronunciation,
    sourceUnits: [...entry.sourceUnits],
    voicePath: [...resolved.canonicalVoicePath],
    gammaSignature: stableJsonV0_1(gammaForVariant(resolved)),
    zc,
  };
}

function assertSuccessorPopulation(spec: PopulationSpecV0_1): void {
  const eligibleVariants = spec.population.entries.filter((entry) => entry.eligibility === "ELIGIBLE");
  const eligibleForms = new Set(eligibleVariants.map((entry) => entry.lexicalWord));
  const variantCountsByForm = new Map<string, number>();
  for (const entry of spec.population.entries) {
    variantCountsByForm.set(entry.lexicalWord, (variantCountsByForm.get(entry.lexicalWord) ?? 0) + 1);
  }
  const counts = {
    lexicalFormsTotal: spec.population.lexicalFormsTotal,
    sourceVariantsTotal: spec.population.sourceVariantsTotal,
    eligibleVariants: eligibleVariants.length,
    nullOrIneligibleVariants: spec.population.entries.length - eligibleVariants.length,
    formsWithEligibleVariant: eligibleForms.size,
    formsWithoutEligibleVariant: spec.population.lexicalFormsTotal - eligibleForms.size,
    multiVariantForms: [...variantCountsByForm.values()].filter((count) => count > 1).length,
  };
  const expected = {
    lexicalFormsTotal: 126052,
    sourceVariantsTotal: 135166,
    eligibleVariants: 135136,
    nullOrIneligibleVariants: 30,
    formsWithEligibleVariant: 126031,
    formsWithoutEligibleVariant: 21,
    multiVariantForms: 8447,
  };
  if (stableJsonV0_1(counts) !== stableJsonV0_1(expected)) {
    throw new Error("POPULATION_REPRODUCTION_MISMATCH: " + stableJsonV0_1({ counts, expected }));
  }
}

function prepare(): void {
  mkdirSync(ARTIFACT_DIRECTORY, { recursive: true });
  const spec = buildPopulationSpec();
  assertSuccessorPopulation(spec);
  const serialized = JSON.stringify(spec, null, 2) + "\n";
  if (sha256Bytes(Buffer.from(serialized, "utf8")) !== PREDECESSOR_POPULATION_SPEC_SHA256) {
    throw new Error("POPULATION_REPRODUCTION_MISMATCH: successor population bytes differ from predecessor");
  }
  writeJson(POPULATION_SPEC_PATH, spec);
  console.log(JSON.stringify({
    mode: "PREPARE_SUCCESSOR_POPULATION_SPEC",
    populationSpec: POPULATION_SPEC_PATH,
    populationSpecSha256: sha256File(POPULATION_SPEC_PATH),
    lexicalForms: spec.population.lexicalFormsTotal,
    sourceVariants: spec.population.sourceVariantsTotal,
    eligibleVariants: spec.population.entries.filter((entry) => entry.eligibility === "ELIGIBLE").length,
    nullOrIneligibleVariants: spec.population.entries.filter((entry) => entry.eligibility !== "ELIGIBLE").length,
  }, null, 2));
}

function execute(): void {
  if (!existsSync(POPULATION_SPEC_PATH)) throw new Error("population spec is missing; run --prepare first");
  if (existsSync(RESULT_PATH) || existsSync(MANIFEST_PATH)) {
    throw new Error("AUTHORITATIVE_EXECUTION_ALREADY_EXISTS: refusing a second result generation attempt");
  }
  const spec = JSON.parse(readFileSync(POPULATION_SPEC_PATH, "utf8")) as PopulationSpecV0_1;
  assertPopulationSpecMatchesSource(spec);
  assertSuccessorPopulation(spec);
  if (sha256File(POPULATION_SPEC_PATH) !== PREDECESSOR_POPULATION_SPEC_SHA256) {
    throw new Error("POPULATION_REPRODUCTION_MISMATCH: successor population hash differs from predecessor");
  }
  const utcStart = new Date().toISOString();
  const eligibleEntries = spec.population.entries.filter((entry) => entry.eligibility === "ELIGIBLE");
  const observations = eligibleEntries.map(resultObservation);
  const distributions = buildZeroConsonantalDistributionSummaryV0_1(observations);
  if (!distributions.invariants.identicalGammaAlwaysIdenticalZc) throw new Error("VALIDATION_INTEGRITY_FAILURE: identical Gamma produced different ZC");
  const utcEnd = new Date().toISOString();
  const nullReasonCounts = new Map<string, number>();
  for (const entry of spec.population.entries.filter((candidate) => candidate.eligibility !== "ELIGIBLE")) {
    const reason = entry.reasonCode ?? "ZC_NULL";
    nullReasonCounts.set(reason, (nullReasonCounts.get(reason) ?? 0) + 1);
  }
  const eligibleForms = new Set(eligibleEntries.map((entry) => entry.lexicalWord));
  const variantCountsByForm = new Map<string, number>();
  for (const entry of spec.population.entries) {
    variantCountsByForm.set(entry.lexicalWord, (variantCountsByForm.get(entry.lexicalWord) ?? 0) + 1);
  }
  const result = {
    schemaVersion: "open-instrument.zero-consonantal-structural-composition-cmudict-validation.v0_1b",
    predecessor: {
      status: "INVALID_EXECUTION_PRESERVED",
      resultSha256: PREDECESSOR_RESULT_SHA256,
      manifestSha256: PREDECESSOR_MANIFEST_SHA256,
      populationSpecSha256: PREDECESSOR_POPULATION_SPEC_SHA256,
    },
    repair: {
      reason: SUCCESSOR_REASON,
      modulePath: "src/shared/openInstrument/zeroConsonantalStructuralCompositionValidation.v0_1b.ts",
      moduleSha256: sha256File(VALIDATION_MODULE_PATH),
    },
    status: "COMPLETED_RESULT_PRESERVED",
    population: {
      sourceId: spec.source.id,
      sourceRevision: spec.source.revision,
      sourceNotation: spec.source.notation,
      sourceSha256: spec.source.sha256,
      sourceBytes: spec.source.bytes,
      lexicalFormsTotal: spec.population.lexicalFormsTotal,
      sourceVariantsTotal: spec.population.sourceVariantsTotal,
      eligibleVariants: eligibleEntries.length,
      nullOrIneligibleVariants: spec.population.sourceVariantsTotal - eligibleEntries.length,
      formsWithEligibleVariant: eligibleForms.size,
      formsWithoutEligibleVariant: spec.population.lexicalFormsTotal - eligibleForms.size,
      multiVariantForms: [...variantCountsByForm.values()].filter((count) => count > 1).length,
      nullReasonCounts: [...nullReasonCounts.entries()].sort(([left], [right]) => compareStrings(left, right)).map(([reasonCode, count]) => ({ reasonCode, count })),
      variantPolicy: "ONE_INDIVIDUALLY_VALID_AUTHORITATIVE_PRONUNCIATION_VARIANT",
    },
    execution: {
      attemptCount: 1,
      utcStart,
      utcEnd,
      command: "npx tsx scripts/openInstrumentZeroConsonantalStructuralCompositionCmuDictValidation.v0_1b.ts --execute",
      scriptPath: "scripts/openInstrumentZeroConsonantalStructuralCompositionCmuDictValidation.v0_1b.ts",
      scriptSha256: sha256File(SCRIPT_PATH),
      populationSpecPath: "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1b/population-spec.json",
      populationSpecSha256: sha256File(POPULATION_SPEC_PATH),
      syntheticOnly: false,
      realDataExecuted: false,
      adaptiveRerun: false,
      repositoryHead: repositoryHead(),
    },
    authority: {
      zcContractSha256: sha256File(CONTRACT_PATH),
      configurationAuthoritySha256: sha256File(CONFIGURATION_AUTHORITY_PATH),
      priorProductContractSha256: sha256File(PRIOR_PRODUCT_CONTRACT_PATH),
      implementationPath: "src/shared/openInstrument/zeroConsonantalStructuralComposition.v0_1.ts",
      implementationSha256: sha256File(IMPLEMENTATION_PATH),
      sourcePath: "src/data/openInstrument/pronunciation/cmudict.dict",
    },
    aggregation: {
      observationUnit: "one individually valid authoritative pronunciation variant",
      sourceSort: "lexicalWord code-point order, variantOrder, sourceForm",
      zcSignature: "JSON object {p,i,s,d,a,r}; R identity, segmentIndices, and occurrenceCount included",
      gammaEquality: "JSON serialization of source-bound profile/notation/revision, variant identity/order, normalized source segments, source nuclei, canonical anchors, and source-relative consonant regions",
    },
    distributions,
    observations,
    claimBoundary: {
      semanticAnalysisPerformed: false,
      semanticInterpretation: "NOT_PERFORMED",
      lexicalMeaningUsed: false,
      productionReadinessEstablished: false,
    },
  };
  writeJson(RESULT_PATH, result);
  const resultSha256 = sha256File(RESULT_PATH);
  const frd02Manifest = JSON.parse(readFileSync(FRD02_MANIFEST_PATH, "utf8")) as { artifacts: readonly { path: string; sha256: string }[] };
  const manifest = {
    manifestVersion: "open-instrument.artifact-hash-manifest.v0_1",
    status: "COMPLETED_RESULT_PRESERVED",
    attemptCount: 1,
    noRerun: true,
    realDataExecuted: false,
    predecessor: {
      resultSha256: PREDECESSOR_RESULT_SHA256,
      manifestSha256: PREDECESSOR_MANIFEST_SHA256,
    },
    repair: {
      reason: SUCCESSOR_REASON,
      modulePath: "src/shared/openInstrument/zeroConsonantalStructuralCompositionValidation.v0_1b.ts",
      moduleSha256: sha256File(VALIDATION_MODULE_PATH),
    },
    repositoryHead: repositoryHead(),
    artifacts: [
      { path: "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1b/population-spec.json", sha256: sha256File(POPULATION_SPEC_PATH), byteLength: fileBytes(POPULATION_SPEC_PATH) },
      { path: "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1b/result.json", sha256: resultSha256, byteLength: fileBytes(RESULT_PATH) },
      { path: "scripts/openInstrumentZeroConsonantalStructuralCompositionCmuDictValidation.v0_1b.ts", sha256: sha256File(SCRIPT_PATH), byteLength: fileBytes(SCRIPT_PATH) },
      { path: "src/shared/openInstrument/zeroConsonantalStructuralCompositionValidation.v0_1b.ts", sha256: sha256File(VALIDATION_MODULE_PATH), byteLength: fileBytes(VALIDATION_MODULE_PATH) },
      { path: "src/shared/openInstrument/zeroConsonantalStructuralComposition.v0_1.ts", sha256: sha256File(IMPLEMENTATION_PATH), byteLength: fileBytes(IMPLEMENTATION_PATH) },
      { path: "src/data/openInstrument/pronunciation/cmudict.dict", sha256: spec.source.sha256, byteLength: spec.source.bytes },
      { path: "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1/result.json", sha256: PREDECESSOR_RESULT_SHA256, byteLength: fileBytes(PREDECESSOR_RESULT_PATH) },
      { path: "docs/open-instrument/research-artifacts/zero-consonantal-structural-composition-v0.1-cmudict-validation-v0.1/hash-manifest.json", sha256: PREDECESSOR_MANIFEST_SHA256, byteLength: fileBytes(PREDECESSOR_MANIFEST_PATH) },
    ],
    frozenContracts: {
      zcContractSha256: sha256File(CONTRACT_PATH),
      configurationAuthoritySha256: sha256File(CONFIGURATION_AUTHORITY_PATH),
      priorProductContractSha256: sha256File(PRIOR_PRODUCT_CONTRACT_PATH),
    },
    successorReason: SUCCESSOR_REASON,
    frd02: {
      actualSha256: sha256File(FRD02_RESULT_PATH),
      preservedManifestSha256: frd02Manifest.artifacts.find((artifact) => artifact.path.endsWith("result.json"))?.sha256 ?? null,
      historicalTypoValue: HISTORICAL_FRD02_TYPO_SHA256,
      manifestSha256: sha256File(FRD02_MANIFEST_PATH),
    },
  };
  writeJson(MANIFEST_PATH, manifest);
  console.log(JSON.stringify({
    mode: "AUTHORITATIVE_EXECUTION",
    attemptCount: 1,
    resultPath: RESULT_PATH,
    resultBytes: fileBytes(RESULT_PATH),
    resultSha256,
    manifestPath: MANIFEST_PATH,
    manifestSha256: sha256File(MANIFEST_PATH),
    eligibleVariants: eligibleEntries.length,
    nullOrIneligibleVariants: spec.population.sourceVariantsTotal - eligibleEntries.length,
    observationCount: observations.length,
    sameVDifferentZcGroups: distributions.sameVDifferentZc.voiceGroupsWithMultipleZc,
    sameVSameZcDifferentGammaGroups: distributions.sameVSameZcDifferentGamma.groupsWithMultipleGamma,
  }, null, 2));
}

const mode = process.argv[2];
if (mode === "--prepare") prepare();
else if (mode === "--execute") execute();
else if (mode === "--help") console.log("Usage: npx tsx scripts/openInstrumentZeroConsonantalStructuralCompositionCmuDictValidation.v0_1b.ts --prepare|--execute");
else if (resolve(process.argv[1] ?? "") === resolve(SCRIPT_PATH)) throw new Error("expected --prepare or --execute");
