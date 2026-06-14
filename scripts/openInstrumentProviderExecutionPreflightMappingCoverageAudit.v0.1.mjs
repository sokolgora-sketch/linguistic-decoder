#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DEFAULT_PATHS = Object.freeze({
  mappingDesign:
    "docs/open-instrument/open-instrument-provider-execution-preflight-fixture-contract-checklist-mapping-design-v0.1.md",
  mappingReview:
    "docs/open-instrument/open-instrument-provider-execution-preflight-fixture-contract-checklist-mapping-design-review-v0.1.md",
  auditDesign:
    "docs/open-instrument/open-instrument-provider-execution-preflight-mapping-coverage-audit-design-v0.1.md",
  auditReview:
    "docs/open-instrument/open-instrument-provider-execution-preflight-mapping-coverage-audit-design-review-v0.1.md",
  checklistContractDesign:
    "docs/open-instrument/open-instrument-provider-execution-preflight-checklist-contract-design-v0.1.md",
  checklistContractReview:
    "docs/open-instrument/open-instrument-provider-execution-preflight-checklist-contract-design-review-v0.1.md",
  fixture:
    "docs/open-instrument/fixtures/provider-execution-preflight/open-instrument-provider-execution-preflight-static-fixture-v0.1.json",
});

const ENV_PATH_KEYS = Object.freeze({
  mappingDesign:
    "OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_MAPPING_DESIGN_PATH",
  mappingReview:
    "OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_MAPPING_REVIEW_PATH",
  auditDesign:
    "OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_AUDIT_DESIGN_PATH",
  auditReview:
    "OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_AUDIT_REVIEW_PATH",
  checklistContractDesign:
    "OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_CHECKLIST_CONTRACT_DESIGN_PATH",
  checklistContractReview:
    "OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_CHECKLIST_CONTRACT_REVIEW_PATH",
  fixture:
    "OPEN_INSTRUMENT_PROVIDER_EXECUTION_PREFLIGHT_MAPPING_COVERAGE_FIXTURE_PATH",
});

function pathOverridesFromEnvironment(env = process.env) {
  const overrides = {};
  for (const [key, envName] of Object.entries(ENV_PATH_KEYS)) {
    const value = env[envName];
    if (typeof value === "string" && value.trim() !== "") {
      overrides[key] = value;
    }
  }
  return overrides;
}

function resolveRepoPath(repoRoot, inputPath) {
  return path.isAbsolute(inputPath) ? inputPath : path.join(repoRoot, inputPath);
}

const SECTION_FAMILIES = Object.freeze([
  {
    id: "identity",
    fixtureKeys: ["schemaVersion", "fixtureIdentity"],
    mappingDesignMarkers: ["## Identity mapping"],
    mappingReviewMarkers: ["## Identity mapping review", "Identity mapping is accepted"],
    checklistMarkers: ["top-level contract identity"],
  },
  {
    id: "sourceDocs",
    fixtureKeys: ["sourceDocs"],
    mappingDesignMarkers: ["## sourceDocs mapping"],
    mappingReviewMarkers: ["## sourceDocs mapping review", "sourceDocs mapping is accepted"],
    checklistMarkers: ["sourceDocs"],
  },
  {
    id: "repositoryState",
    fixtureKeys: ["repositoryState"],
    mappingDesignMarkers: ["## repositoryState mapping"],
    mappingReviewMarkers: ["## repositoryState mapping review", "repositoryState mapping is accepted"],
    checklistMarkers: ["repositoryState"],
  },
  {
    id: "runPacketStatus",
    fixtureKeys: ["runPacketStatus"],
    mappingDesignMarkers: ["## runPacketStatus mapping"],
    mappingReviewMarkers: ["## runPacketStatus mapping review", "runPacketStatus mapping is accepted"],
    checklistMarkers: ["runPacketStatus"],
  },
  {
    id: "staticValidationStatus",
    fixtureKeys: ["staticValidationStatus"],
    mappingDesignMarkers: ["## staticValidationStatus mapping"],
    mappingReviewMarkers: [
      "## staticValidationStatus mapping review",
      "staticValidationStatus mapping is accepted",
    ],
    checklistMarkers: ["staticValidationStatus"],
  },
  {
    id: "providerIdentity",
    fixtureKeys: ["providerIdentity"],
    mappingDesignMarkers: ["## providerIdentity mapping"],
    mappingReviewMarkers: ["## providerIdentity mapping review", "providerIdentity mapping is accepted"],
    checklistMarkers: ["providerIdentity"],
  },
  {
    id: "modelIdentity",
    fixtureKeys: ["modelIdentity"],
    mappingDesignMarkers: ["## modelIdentity mapping"],
    mappingReviewMarkers: ["## modelIdentity mapping review", "modelIdentity mapping is accepted"],
    checklistMarkers: ["modelIdentity"],
  },
  {
    id: "endpointIdentity",
    fixtureKeys: ["endpointIdentity"],
    mappingDesignMarkers: ["## endpointIdentity mapping"],
    mappingReviewMarkers: ["## endpointIdentity mapping review", "endpointIdentity mapping is accepted"],
    checklistMarkers: ["endpointIdentity"],
  },
  {
    id: "authorizationGates",
    fixtureKeys: ["authorizationGates"],
    mappingDesignMarkers: ["## authorizationGates mapping"],
    mappingReviewMarkers: [
      "## authorizationGates mapping review",
      "authorizationGates mapping is accepted",
    ],
    checklistMarkers: ["authorizationGates"],
  },
  {
    id: "defaultSnapshotStatus",
    fixtureKeys: ["defaultSnapshotStatus"],
    mappingDesignMarkers: ["## defaultSnapshotStatus mapping"],
    mappingReviewMarkers: [
      "## defaultSnapshotStatus mapping review",
      "defaultSnapshotStatus mapping is accepted",
    ],
    checklistMarkers: ["defaultSnapshotStatus"],
  },
  {
    id: "promptSourceReviewStatus",
    fixtureKeys: ["promptSourceReviewStatus"],
    mappingDesignMarkers: ["## promptSourceReviewStatus mapping"],
    mappingReviewMarkers: [
      "## promptSourceReviewStatus mapping review",
      "promptSourceReviewStatus mapping is accepted",
    ],
    checklistMarkers: ["promptSourceReviewStatus"],
  },
  {
    id: "capturePathStatus",
    fixtureKeys: ["capturePathStatus"],
    mappingDesignMarkers: ["## capturePathStatus mapping"],
    mappingReviewMarkers: [
      "## capturePathStatus mapping review",
      "capturePathStatus mapping is accepted",
    ],
    checklistMarkers: ["capturePathStatus"],
  },
  {
    id: "failurePolicyStatus",
    fixtureKeys: ["failurePolicyStatus"],
    mappingDesignMarkers: ["## failurePolicyStatus mapping"],
    mappingReviewMarkers: [
      "## failurePolicyStatus mapping review",
      "failurePolicyStatus mapping is accepted",
    ],
    checklistMarkers: ["failurePolicyStatus"],
  },
  {
    id: "runtimeApiUiExclusionStatus",
    fixtureKeys: ["runtimeApiUiExclusionStatus"],
    mappingDesignMarkers: ["## runtimeApiUiExclusionStatus mapping"],
    mappingReviewMarkers: [
      "## runtimeApiUiExclusionStatus mapping review",
      "runtimeApiUiExclusionStatus mapping is accepted",
    ],
    checklistMarkers: ["runtimeApiUiExclusionStatus"],
  },
  {
    id: "artifactReportAuthorizationStatus",
    fixtureKeys: ["artifactReportAuthorizationStatus"],
    mappingDesignMarkers: ["## artifactReportAuthorizationStatus mapping"],
    mappingReviewMarkers: [
      "## artifactReportAuthorizationStatus mapping review",
      "artifactReportAuthorizationStatus mapping is accepted",
    ],
    checklistMarkers: ["artifactReportAuthorizationStatus"],
  },
  {
    id: "evidenceBoundaryStatus",
    fixtureKeys: ["evidenceBoundaryStatus", "nonExecutionDeclaration"],
    mappingDesignMarkers: ["## evidenceBoundaryStatus mapping"],
    mappingReviewMarkers: [
      "## evidenceBoundaryStatus mapping review",
      "evidenceBoundaryStatus mapping is accepted",
    ],
    checklistMarkers: ["evidenceBoundaryStatus"],
  },
  {
    id: "finalDecision",
    fixtureKeys: ["finalDecision"],
    mappingDesignMarkers: ["## finalDecision mapping"],
    mappingReviewMarkers: ["## finalDecision mapping review", "finalDecision mapping is accepted"],
    checklistMarkers: ["finalDecision"],
  },
  {
    id: "stopConditions",
    fixtureKeys: ["stopConditions", "unmappedFieldPolicy"],
    mappingDesignMarkers: ["## Stop-condition mapping"],
    mappingReviewMarkers: ["## Stop-condition mapping review", "Stop-condition mapping is accepted"],
    checklistMarkers: ["stop conditions"],
  },
]);

const REQUIRED_AUDIT_MARKERS = Object.freeze([
  "fail closed if any required section is missing",
  "fail closed if any mapping creates execution authority",
  "fail closed if any mapping creates evidence claims",
]);

const FORBIDDEN_AUTHORIZATION_PATTERNS = Object.freeze([
  {
    label: "provider execution authorization",
    pattern: /\bprovider execution is authorized\b/i,
  },
  {
    label: "model call authorization",
    pattern: /\bmodel calls? (are|is) authorized\b/i,
  },
  {
    label: "OpenAI API authorization",
    pattern: /\bOpenAI API use is authorized\b/i,
  },
  {
    label: "runtime API UI authorization",
    pattern: /\bruntime\/API\/UI wiring is authorized\b/i,
  },
  {
    label: "artifact report authorization",
    pattern: /\bartifact\/report creation is authorized\b/i,
  },
  {
    label: "publication framing authorization",
    pattern: /\bpublication framing is authorized\b/i,
  },
  {
    label: "provider output evidence claim",
    pattern: /\bprovider-output evidence is created\b/i,
  },
  {
    label: "candidate truth evidence claim",
    pattern: /\bcandidate-truth evidence is created\b/i,
  },
  {
    label: "origin evidence claim",
    pattern: /\borigin evidence is created\b/i,
  },
  {
    label: "model quality evidence claim",
    pattern: /\bmodel-quality evidence is created\b/i,
  },
  {
    label: "execution safety evidence claim",
    pattern: /\bexecution-safety evidence is created\b/i,
  },
]);

function readText(repoRoot, relativePath, overrides) {
  if (Object.prototype.hasOwnProperty.call(overrides, relativePath)) {
    return String(overrides[relativePath]);
  }
  return fs.readFileSync(resolveRepoPath(repoRoot, relativePath), "utf8");
}

function readFixture(repoRoot, relativePath, overrides, fixtureOverride) {
  if (fixtureOverride !== undefined) {
    return fixtureOverride;
  }
  return JSON.parse(readText(repoRoot, relativePath, overrides));
}

function requireMarker({ failures, text, marker, source }) {
  if (!text.includes(marker)) {
    failures.push(`${source}: missing marker: ${marker}`);
  }
}

function isNegatedBoundaryLine(line) {
  const lower = line.toLowerCase();
  return [
    "must not",
    "does not",
    "do not",
    "cannot",
    "can't",
    "not say",
    "not authorize",
    "doesn't",
    "no provider execution",
    "no model call",
    "no openai api",
    "no runtime/api/ui",
  ].some((marker) => lower.includes(marker));
}

function checkForbiddenAuthorizationLanguage({ failures, source, text }) {
  const lines = text.split(/\r?\n/);
  for (const [index, line] of lines.entries()) {
    for (const rule of FORBIDDEN_AUTHORIZATION_PATTERNS) {
      rule.pattern.lastIndex = 0;
      if (rule.pattern.test(line) && !isNegatedBoundaryLine(line)) {
        failures.push(`${source}: forbidden ${rule.label} on line ${index + 1}`);
      }
    }
  }
}

export function auditProviderExecutionPreflightMappingCoverage(options = {}) {
  const repoRoot = options.repoRoot ?? process.cwd();
  const paths = {
    ...DEFAULT_PATHS,
    ...pathOverridesFromEnvironment(options.env ?? process.env),
    ...(options.paths ?? {}),
  };
  const documentOverrides = options.documentOverrides ?? {};
  const fixtureOverride = options.fixtureOverride;

  const failures = [];

  const mappingDesign = readText(repoRoot, paths.mappingDesign, documentOverrides);
  const mappingReview = readText(repoRoot, paths.mappingReview, documentOverrides);
  const auditDesign = readText(repoRoot, paths.auditDesign, documentOverrides);
  const auditReview = readText(repoRoot, paths.auditReview, documentOverrides);
  const checklistContractDesign = readText(
    repoRoot,
    paths.checklistContractDesign,
    documentOverrides,
  );
  const checklistContractReview = readText(
    repoRoot,
    paths.checklistContractReview,
    documentOverrides,
  );
  const fixture = readFixture(repoRoot, paths.fixture, documentOverrides, fixtureOverride);

  const docsForUnsafeLanguage = {
    [paths.mappingDesign]: mappingDesign,
    [paths.mappingReview]: mappingReview,
    [paths.auditDesign]: auditDesign,
    [paths.auditReview]: auditReview,
    [paths.checklistContractDesign]: checklistContractDesign,
    [paths.checklistContractReview]: checklistContractReview,
  };

  for (const [source, text] of Object.entries(docsForUnsafeLanguage)) {
    checkForbiddenAuthorizationLanguage({ failures, source, text });
  }

  for (const marker of REQUIRED_AUDIT_MARKERS) {
    if (!auditDesign.includes(marker) && !auditReview.includes(marker)) {
      failures.push(`audit design/review: missing fail-closed marker: ${marker}`);
    }
  }

  const fixtureKeys = new Set(Object.keys(fixture));

  for (const family of SECTION_FAMILIES) {
    for (const fixtureKey of family.fixtureKeys) {
      if (!fixtureKeys.has(fixtureKey)) {
        failures.push(`fixture: missing required section key for ${family.id}: ${fixtureKey}`);
      }
    }

    for (const marker of family.mappingDesignMarkers) {
      requireMarker({
        failures,
        text: mappingDesign,
        marker,
        source: `${paths.mappingDesign}:${family.id}`,
      });
    }

    for (const marker of family.mappingReviewMarkers) {
      requireMarker({
        failures,
        text: mappingReview,
        marker,
        source: `${paths.mappingReview}:${family.id}`,
      });
    }

    const contractText = `${checklistContractDesign}\n${checklistContractReview}`;
    const hasContractMarker = family.checklistMarkers.some((marker) =>
      contractText.toLowerCase().includes(marker.toLowerCase()),
    );
    if (!hasContractMarker) {
      failures.push(
        `checklist contract design/review: missing contract marker for ${family.id}`,
      );
    }
  }

  const coveredFixtureKeys = new Set(
    SECTION_FAMILIES.flatMap((family) => family.fixtureKeys),
  );
  for (const fixtureKey of fixtureKeys) {
    if (!coveredFixtureKeys.has(fixtureKey)) {
      failures.push(`fixture: section lacks coverage mapping: ${fixtureKey}`);
    }
  }

  const summary = {
    sectionFamilies: SECTION_FAMILIES.map((family) => family.id),
    fixtureSections: [...fixtureKeys],
    docsAudited: Object.keys(docsForUnsafeLanguage),
    providerExecutionAuthorized: false,
    modelCallAuthorized: false,
    openAiApiUseAuthorized: false,
    runtimeApiUiWiringAuthorized: false,
  };

  return {
    ok: failures.length === 0,
    failures,
    summary,
  };
}

function runCli() {
  const result = auditProviderExecutionPreflightMappingCoverage();

  console.log("Open Instrument provider execution preflight mapping coverage audit v0.1");
  console.log("Boundary: local deterministic docs/fixture coverage audit only.");
  console.log("Boundary: no provider execution, no model call, no OpenAI API use.");
  console.log("Boundary: no network call, no provider default change, no runtime/API/UI wiring.");
  console.log("Boundary: no fixture mutation, no schema mutation, no artifact/report creation.");
  console.log(
    "Boundary: not provider-output, candidate-truth, origin, model-quality, publication, or execution-safety evidence.",
  );
  console.log("Audit summary:");
  console.log(JSON.stringify(result.summary, null, 2));

  if (!result.ok) {
    console.error("Mapping coverage audit failed:");
    for (const failure of result.failures) {
      console.error(`- ${failure}`);
    }
    process.exitCode = 1;
    return;
  }

  console.log("Open Instrument provider execution preflight mapping coverage audit passed.");
}

const thisFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedFile === thisFile) {
  runCli();
}
