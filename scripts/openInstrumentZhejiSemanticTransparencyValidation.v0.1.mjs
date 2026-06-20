#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = process.cwd();
const THIS_FILE = fileURLToPath(import.meta.url);

const DEFAULT_SCHEMA_PATH = path.join(
  REPO_ROOT,
  "docs/open-instrument/schemas/zheji-semantic-transparency/zheji-semantic-transparency-schema-v0.1.json",
);

const DEFAULT_FIXTURE_PATH = path.join(
  REPO_ROOT,
  "docs/open-instrument/fixtures/zheji-semantic-transparency/zheji-semantic-transparency-static-fixture-v0.1.json",
);

const REQUIRED_TOP_LEVEL_FIELDS = [
  "schema_version",
  "posture",
  "target_word",
  "normalized_word",
  "surface_vowels",
  "functional_vowel_path",
  "transparency_status",
  "claim_policy",
  "free_operator_candidates",
  "carrier_claims",
  "code_f",
  "code_e",
  "isolation_audit",
  "witnesses",
  "blocked_claims",
  "null_reason",
  "source_note",
  "diagnostic_notes",
];

const REQUIRED_CLAIM_POLICY = [
  "no_single_winner",
  "non_origin_claim",
  "non_ownership_claim",
  "candidate_only",
  "evidence_anchored",
  "null_allowed",
];

const REQUIRED_BLOCKED_CLAIMS = [
  "proven_origin",
  "true_origin",
  "final_etymology",
  "linguistic_ownership",
  "candidate_truth",
  "provider_as_evidence",
  "publication_grade_proof",
];

const REQUIRED_AUDIT_CHECKS = [
  "standalone_check",
  "function_check",
  "substring_force_check",
  "semantic_stretch_check",
  "provider_only_check",
  "origin_claim_check",
  "ownership_claim_check",
  "evidence_anchor_check",
];

const ALLOWED_STATUSES = new Set([
  "not_evaluated",
  "null_no_transparency",
  "insufficient_evidence",
  "candidate_transparency",
  "partial_transparency",
  "strong_candidate_transparency",
  "blocked_forbidden_claim",
]);

const FORBIDDEN_TEXT_PATTERNS = [
  /\bproven origin\b/i,
  /\btrue origin\b/i,
  /\bfinal etymology\b/i,
  /\blinguistic ownership\b/i,
  /\bprovider[- ]confirmed truth\b/i,
  /\bpublication[- ]grade proof\b/i,
  /\bthis language owns\b/i,
  /\bthis proves\b/i,
];

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function fail(errors, message) {
  errors.push(message);
}

function claimBearingTextFromCase(testCase) {
  return JSON.stringify({
    target_word: testCase.target_word,
    normalized_word: testCase.normalized_word,
    free_operator_candidates: testCase.free_operator_candidates,
    carrier_claims: testCase.carrier_claims,
    code_f: testCase.code_f,
    code_e: testCase.code_e,
    isolation_audit: testCase.isolation_audit,
    witnesses: testCase.witnesses,
    diagnostic_notes: testCase.diagnostic_notes,
  });
}

function sourceNoteHasRequiredPosture(sourceNote) {
  const note = String(sourceNote || "").toLowerCase();
  return (
    note.includes("candidate semantic transparency") &&
    note.includes("meaning-motivation") &&
    note.includes("does not claim origin") &&
    note.includes("historical ownership") &&
    note.includes("final etymology") &&
    note.includes("publication-grade proof")
  );
}

function validateCase(testCase, index, errors) {
  const prefix = `cases[${index}]`;

  for (const field of REQUIRED_TOP_LEVEL_FIELDS) {
    if (!Object.prototype.hasOwnProperty.call(testCase, field)) {
      fail(errors, `${prefix} missing required field: ${field}`);
    }
  }

  if (!ALLOWED_STATUSES.has(testCase.transparency_status)) {
    fail(errors, `${prefix} invalid transparency_status: ${testCase.transparency_status}`);
  }

  if (!testCase.claim_policy || typeof testCase.claim_policy !== "object") {
    fail(errors, `${prefix} missing claim_policy object`);
  } else {
    for (const field of REQUIRED_CLAIM_POLICY) {
      if (testCase.claim_policy[field] !== true) {
        fail(errors, `${prefix} claim_policy.${field} must be true`);
      }
    }
  }

  if (!Array.isArray(testCase.blocked_claims)) {
    fail(errors, `${prefix} blocked_claims must be an array`);
  } else {
    for (const claim of REQUIRED_BLOCKED_CLAIMS) {
      if (!testCase.blocked_claims.includes(claim)) {
        fail(errors, `${prefix} missing blocked claim: ${claim}`);
      }
    }
  }

  if (!sourceNoteHasRequiredPosture(testCase.source_note)) {
    fail(errors, `${prefix} source_note does not preserve required non-origin/non-ownership posture`);
  }

  if (!testCase.code_f || !testCase.code_e) {
    fail(errors, `${prefix} code_f and code_e must both exist`);
  } else if (JSON.stringify(testCase.code_f) === JSON.stringify(testCase.code_e)) {
    fail(errors, `${prefix} code_f and code_e must be independent objects`);
  }

  if (!testCase.isolation_audit || typeof testCase.isolation_audit !== "object") {
    fail(errors, `${prefix} missing isolation_audit object`);
  } else {
    for (const check of REQUIRED_AUDIT_CHECKS) {
      if (!testCase.isolation_audit[check]) {
        fail(errors, `${prefix} missing isolation audit check: ${check}`);
      }
    }
  }

  if (testCase.transparency_status === "null_no_transparency" && !testCase.null_reason) {
    fail(errors, `${prefix} null_no_transparency requires null_reason`);
  }

  const providerOnlyStatus = testCase.isolation_audit?.provider_only_check?.status;
  if (
    testCase.transparency_status === "strong_candidate_transparency" &&
    providerOnlyStatus !== "pass"
  ) {
    fail(errors, `${prefix} provider-only support cannot be accepted as strong evidence`);
  }

  const originStatus = testCase.isolation_audit?.origin_claim_check?.status;
  const ownershipStatus = testCase.isolation_audit?.ownership_claim_check?.status;
  if (
    (originStatus === "fail" || ownershipStatus === "fail") &&
    testCase.transparency_status !== "blocked_forbidden_claim"
  ) {
    fail(errors, `${prefix} failed origin/ownership audit must force blocked_forbidden_claim`);
  }

  const body = claimBearingTextFromCase(testCase);
  for (const pattern of FORBIDDEN_TEXT_PATTERNS) {
    if (pattern.test(body)) {
      fail(errors, `${prefix} contains forbidden claim wording: ${pattern}`);
    }
  }
}

function validateNoRuntimeImports(helperPath, errors) {
  const text = fs.readFileSync(helperPath, "utf8");
  const forbiddenImports = [
    /from\s+["'][^"']*(?:src\/|app\/|pages\/|components\/|ui\/|api\/)[^"']*["']/,
    /require\(["'][^"']*(?:src\/|app\/|pages\/|components\/|ui\/|api\/)[^"']*["']\)/,
    /fetch\s*\(/,
    new RegExp("Open" + "AI", "i"),
    new RegExp("oll" + "ama", "i"),
    new RegExp("local" + "host", "i"),
    new RegExp("process" + "\\.env\\.[A-Z0-9_]*" + "KEY", "i"),
  ];

  for (const pattern of forbiddenImports) {
    if (pattern.test(text)) {
      fail(errors, `validation helper contains forbidden runtime/provider/network pattern: ${pattern}`);
    }
  }
}

export function validateZhejiSemanticTransparencyPassiveArtifacts({
  schemaPath = DEFAULT_SCHEMA_PATH,
  fixturePath = DEFAULT_FIXTURE_PATH,
  helperPath = THIS_FILE,
} = {}) {
  const errors = [];

  const schema = readJson(schemaPath);
  const fixture = readJson(fixturePath);

  if (schema.title !== "Zheji Semantic Transparency Layer v0.1 Passive Schema") {
    fail(errors, "schema title mismatch");
  }

  if (!schema.description || !schema.description.includes("does not prove origin")) {
    fail(errors, "schema description must reject origin proof");
  }

  if (fixture.posture !== "passive_static_fixture_non_wiring") {
    fail(errors, "fixture posture must be passive_static_fixture_non_wiring");
  }

  if (!Array.isArray(fixture.cases) || fixture.cases.length < 3) {
    fail(errors, "fixture must contain at least three cases");
  } else {
    fixture.cases.forEach((testCase, index) => validateCase(testCase, index, errors));

    const statuses = new Set(fixture.cases.map((testCase) => testCase.transparency_status));
    if (!statuses.has("candidate_transparency")) {
      fail(errors, "fixture missing candidate_transparency case");
    }
    if (!statuses.has("null_no_transparency")) {
      fail(errors, "fixture missing null_no_transparency case");
    }
    if (!statuses.has("blocked_forbidden_claim")) {
      fail(errors, "fixture missing blocked_forbidden_claim case");
    }
  }

  validateNoRuntimeImports(helperPath, errors);

  return {
    ok: errors.length === 0,
    errors,
    checked: {
      schemaPath,
      fixturePath,
      helperPath,
      caseCount: Array.isArray(fixture.cases) ? fixture.cases.length : 0,
    },
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === path.resolve(THIS_FILE)) {
  const result = validateZhejiSemanticTransparencyPassiveArtifacts();
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) {
    process.exit(1);
  }
}
