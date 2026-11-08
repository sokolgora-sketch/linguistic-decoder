"use strict";

const { spawnSync } = require("node:child_process");
const { createHash } = require("node:crypto");
const { createReadStream, readFileSync, lstatSync } = require("node:fs");
const { TextDecoder } = require("node:util");
const path = require("node:path");

const utf8 = new TextDecoder("utf-8", { fatal: true });
const HASH_MANIFEST = /(?:^|\/)hash-manifest[^/]*\.json$/i;
const NAMED_MANIFEST = /(?:^|\/)[A-Za-z0-9._-]+\.manifest\.json$/i;
const WORKFLOW = /^\.github\/workflows\/[A-Za-z0-9._-]+\.ya?ml$/i;
const OWNER_FIELDS = [
  "procedureId",
  "experimentId",
  "contractId",
  "correctionContractId",
  "schemaVersion",
  "manifestVersion",
];
const HASH_PATTERN = /^[0-9a-f]{64}$/i;
const MANIFEST_HASH_PAIRS = [
  ["path", "sha256"],
  ["path", "compressedSha256"],
  ["uncompressedPath", "uncompressedSha256"],
];

function cleanGitEnvironment() {
  const env = { ...process.env };
  for (const key of Object.keys(env)) {
    if (key.startsWith("GIT_")) delete env[key];
  }
  env.GIT_TERMINAL_PROMPT = "0";
  return env;
}

function runGit(repoRoot, args) {
  const result = spawnSync("git", ["-C", repoRoot, ...args], {
    env: cleanGitEnvironment(),
    maxBuffer: 64 * 1024 * 1024,
    shell: false,
    encoding: null,
    timeout: 15_000,
  });
  return {
    status: result.status,
    error: result.error,
    stdout: result.stdout || Buffer.alloc(0),
    stderr: result.stderr || Buffer.alloc(0),
  };
}

function isSafeRepoPath(filePath) {
  return (
    typeof filePath === "string" &&
    filePath.length > 0 &&
    !/[\\\0-\x1f\x7f]/.test(filePath) &&
    !filePath.startsWith("/") &&
    !filePath.includes("//") &&
    filePath.split("/").every((part) => part !== "" && part !== "." && part !== "..")
  );
}

function validRef(ref) {
  return ref === "HEAD" || /^[0-9a-f]{40}(?:[0-9a-f]{24})?$/i.test(ref);
}

function readTrackedPaths(repoRoot, ref) {
  if (!validRef(ref)) return { error: "FROZEN_BASE_REF_INVALID", detail: "base ref is not a verified commit identifier" };
  const result = runGit(repoRoot, ["ls-tree", "-r", "-z", "--name-only", ref]);
  if (result.status !== 0 || result.error) {
    return { error: "FROZEN_BASE_TREE_UNAVAILABLE", detail: "cannot inspect the base commit tree" };
  }
  try {
    const text = utf8.decode(result.stdout);
    const paths = text.split("\0");
    if (paths[paths.length - 1] !== "") {
      return { error: "FROZEN_BASE_TREE_MALFORMED", detail: "Git returned malformed tree paths" };
    }
    return { paths: paths.slice(0, -1) };
  } catch {
    return { error: "FROZEN_BASE_TREE_MALFORMED", detail: "a base tree path is not valid UTF-8" };
  }
}

function readGitFile(repoRoot, ref, filePath) {
  if (!isSafeRepoPath(filePath) || !validRef(ref)) return null;
  const result = runGit(repoRoot, ["show", `${ref}:${filePath}`]);
  return result.status === 0 && !result.error ? result.stdout : null;
}

function sha256Bytes(bytes) {
  return createHash("sha256").update(bytes).digest("hex");
}

function sha256File(filePath) {
  return new Promise((resolve, reject) => {
    let fileStat;
    try {
      fileStat = lstatSync(filePath);
    } catch (error) {
      reject(error);
      return;
    }
    if (!fileStat.isFile() || fileStat.isSymbolicLink()) {
      reject(new Error("target is not a regular file"));
      return;
    }
    const hash = createHash("sha256");
    const stream = createReadStream(filePath);
    stream.on("data", (chunk) => hash.update(chunk));
    stream.on("error", reject);
    stream.on("end", () => resolve(hash.digest("hex")));
  });
}

function ownerMetadata(manifest) {
  const present = OWNER_FIELDS.filter((field) => Object.hasOwn(manifest, field));
  for (const field of present) {
    if (typeof manifest[field] !== "string" || manifest[field].trim().length === 0) {
      return { ownerContract: null, valid: false };
    }
  }
  const ownerField = OWNER_FIELDS.find((field) => typeof manifest[field] === "string");
  return ownerField
    ? { ownerContract: manifest[ownerField], valid: true }
    : { ownerContract: null, valid: false };
}

function authorityProcedure(ownerContract) {
  if (!ownerContract) {
    return "OWNER_AUTHORIZATION_REQUIRED: identify the owning contract and use its reviewed migration procedure; a checksum edit is not authorization";
  }
  return `Owner-reviewed PR under ${ownerContract}; follow its documented change procedure, stop for owner direction if none exists, and do not treat a checksum-only update as authorization`;
}

function parseManifest(repoRoot, baseRef, manifestPath) {
  const bytes = readGitFile(repoRoot, baseRef, manifestPath);
  if (!bytes) {
    return {
      error: "FROZEN_MANIFEST_UNREADABLE",
      path: manifestPath,
      ownerContract: null,
      detail: "canonical manifest bytes are unavailable from the verified base commit",
    };
  }

  let manifest;
  try {
    manifest = JSON.parse(utf8.decode(bytes));
  } catch {
    return {
      error: "FROZEN_MANIFEST_MALFORMED",
      path: manifestPath,
      ownerContract: null,
      detail: "canonical manifest is not valid UTF-8 JSON",
    };
  }
  if (!manifest || typeof manifest !== "object" || Array.isArray(manifest)) {
    return {
      error: "FROZEN_MANIFEST_MALFORMED",
      path: manifestPath,
      ownerContract: null,
      detail: "canonical manifest root is not an object",
    };
  }

  const owner = ownerMetadata(manifest);
  const records = [];
  const errors = [];
  function visit(value) {
    if (!value || typeof value !== "object") return;
    if (Array.isArray(value)) {
      for (const entry of value) visit(entry);
      return;
    }
    for (const [pathField, hashField] of MANIFEST_HASH_PAIRS) {
      if (!Object.hasOwn(value, pathField) || !Object.hasOwn(value, hashField)) continue;
      const filePath = value[pathField];
      const expectedSha256 = value[hashField];
      // Some research packets bind host-local external artifacts. They are not
      // repository paths and cannot be changed by this Git push.
      if (typeof filePath === "string" && (filePath.startsWith("/") || /^[A-Za-z]:\\/.test(filePath))) continue;
      if (!isSafeRepoPath(filePath) || !HASH_PATTERN.test(expectedSha256)) {
        errors.push({
          reasonCode: "FROZEN_IDENTITY_METADATA_INVALID",
          path: typeof filePath === "string" ? filePath : null,
          manifestPath,
          ownerContract: owner.ownerContract,
          expectedSha256: typeof expectedSha256 === "string" ? expectedSha256 : null,
          actualSha256: null,
          authorityProcedure: authorityProcedure(owner.ownerContract),
          detail: "identity record requires a safe repository path and a 64-character SHA-256",
        });
      } else {
        records.push({
          path: filePath,
          expectedSha256: expectedSha256.toLowerCase(),
          manifestPath,
          ownerContract: owner.ownerContract,
          ownerMetadataValid: owner.valid,
          authorityProcedure: authorityProcedure(owner.ownerContract),
        });
      }
    }
    for (const entry of Object.values(value)) visit(entry);
  }
  visit(manifest);

  return {
    records,
    errors,
    ownerContract: owner.ownerContract,
    ownerMetadataValid: owner.valid,
    bytes,
  };
}

function parseWorkflowPins(bytes, workflowPath) {
  let text;
  try {
    text = utf8.decode(bytes);
  } catch {
    return { error: "FROZEN_WORKFLOW_MALFORMED", workflowPath, detail: "workflow is not valid UTF-8" };
  }
  const pins = [];
  const pattern = /echo\s+["']([0-9a-f]{64})\s{2,}([^"']+)["']\s*\|\s*sha256sum\s+--check/gim;
  for (const match of text.matchAll(pattern)) {
    const expectedSha256 = match[1].toLowerCase();
    const filePath = match[2].trim();
    if (!isSafeRepoPath(filePath)) {
      return { error: "FROZEN_WORKFLOW_PIN_INVALID", workflowPath, detail: "workflow checksum pin contains an unsafe path" };
    }
    pins.push({
      path: filePath,
      expectedSha256,
      manifestPath: workflowPath,
      ownerContract: `CI SHA-256 pin in ${workflowPath}`,
      ownerMetadataValid: true,
      authorityProcedure: `OWNER_AUTHORIZED_CI_CHECKSUM_MIGRATION for ${workflowPath}: review the source artifact and workflow change together; changing a checksum alone is not authorization`,
    });
  }
  return { pins };
}

function loadCatalog(repoRoot, baseRef) {
  const tree = readTrackedPaths(repoRoot, baseRef);
  if (tree.error) return { error: tree.error, detail: tree.detail };

  const manifestPaths = tree.paths.filter((filePath) => HASH_MANIFEST.test(filePath) || NAMED_MANIFEST.test(filePath));
  const workflowPaths = tree.paths.filter((filePath) => WORKFLOW.test(filePath));
  const records = [];
  const authoritySources = new Map();
  const errors = [];

  for (const manifestPath of manifestPaths) {
    const parsed = parseManifest(repoRoot, baseRef, manifestPath);
    if (parsed.error) {
      errors.push({
        reasonCode: parsed.error,
        path: manifestPath,
        manifestPath,
        ownerContract: parsed.ownerContract || null,
        expectedSha256: null,
        actualSha256: null,
        authorityProcedure: authorityProcedure(parsed.ownerContract),
        detail: parsed.detail,
      });
      continue;
    }
    records.push(...parsed.records);
    errors.push(...parsed.errors);
    if (HASH_MANIFEST.test(manifestPath) || parsed.records.length > 0) {
      authoritySources.set(manifestPath, {
        path: manifestPath,
        ownerContract: parsed.ownerContract,
        ownerMetadataValid: parsed.ownerMetadataValid,
        authorityProcedure: authorityProcedure(parsed.ownerContract),
        expectedSha256: sha256Bytes(parsed.bytes),
      });
    }
  }

  for (const workflowPath of workflowPaths) {
    const bytes = readGitFile(repoRoot, baseRef, workflowPath);
    if (!bytes) {
      errors.push({
        reasonCode: "FROZEN_WORKFLOW_UNREADABLE",
        path: workflowPath,
        manifestPath: workflowPath,
        ownerContract: `CI checksum authority in ${workflowPath}`,
        expectedSha256: null,
        actualSha256: null,
        authorityProcedure: authorityProcedure(`CI checksum authority in ${workflowPath}`),
        detail: "workflow bytes are unavailable from the verified base commit",
      });
      continue;
    }
    const parsed = parseWorkflowPins(bytes, workflowPath);
    if (parsed.error) {
      errors.push({
        reasonCode: parsed.error,
        path: workflowPath,
        manifestPath: workflowPath,
        ownerContract: `CI checksum authority in ${workflowPath}`,
        expectedSha256: null,
        actualSha256: null,
        authorityProcedure: authorityProcedure(`CI checksum authority in ${workflowPath}`),
        detail: parsed.detail,
      });
      continue;
    }
    if (parsed.pins.length > 0) {
      authoritySources.set(workflowPath, {
        path: workflowPath,
        ownerContract: `CI checksum authority in ${workflowPath}`,
        ownerMetadataValid: true,
        authorityProcedure: authorityProcedure(`CI checksum authority in ${workflowPath}`),
        expectedSha256: sha256Bytes(bytes),
        workflowPins: parsed.pins,
      });
      records.push(...parsed.pins);
    }
  }

  const grouped = new Map();
  for (const record of records) {
    const list = grouped.get(record.path) || [];
    list.push(record);
    grouped.set(record.path, list);
  }
  for (const [filePath, list] of grouped) {
    const hashes = new Set(list.map((record) => record.expectedSha256));
    if (hashes.size > 1) {
      errors.push({
        reasonCode: "FROZEN_EXPECTED_IDENTITY_CONFLICT",
        path: filePath,
        manifestPath: list.map((record) => record.manifestPath).join(","),
        ownerContract: list.map((record) => record.ownerContract || "UNKNOWN").join(","),
        expectedSha256: [...hashes].join(","),
        actualSha256: null,
        authorityProcedure: list.map((record) => record.authorityProcedure).join("; "),
        detail: "canonical identity sources disagree about the expected SHA-256",
      });
    }
  }

  return { records, authoritySources, errors };
}

function makeDiagnostic(reasonCode, filePath, fields = {}) {
  return {
    reasonCode,
    path: filePath,
    manifestPath: fields.manifestPath || null,
    ownerContract: fields.ownerContract || null,
    expectedSha256: fields.expectedSha256 || null,
    actualSha256: fields.actualSha256 || null,
    authorityProcedure: fields.authorityProcedure || authorityProcedure(fields.ownerContract),
    detail: fields.detail || null,
  };
}

async function inspectPlannedFiles({ repoRoot, plannedPaths, baseRef = "HEAD" }) {
  const startedAt = process.hrtime.bigint();
  if (!Array.isArray(plannedPaths) || plannedPaths.length === 0 || plannedPaths.some((p) => !isSafeRepoPath(p))) {
    return {
      ok: false,
      elapsedMs: elapsedMs(startedAt),
      diagnostics: [makeDiagnostic("FROZEN_PLANNED_PATH_INVALID", null, { detail: "provide one or more safe repository-relative paths" })],
      results: [],
    };
  }
  const catalog = loadCatalog(repoRoot, baseRef);
  if (catalog.error) {
    return {
      ok: false,
      elapsedMs: elapsedMs(startedAt),
      diagnostics: [makeDiagnostic(catalog.error, null, { detail: catalog.detail })],
      results: [],
    };
  }
  if (catalog.errors.length > 0) {
    return {
      ok: false,
      elapsedMs: elapsedMs(startedAt),
      diagnostics: catalog.errors,
      results: [],
    };
  }

  const results = [];
  const diagnostics = [];
  for (const filePath of plannedPaths) {
    const matches = catalog.records.filter((record) => record.path === filePath);
    const authoritySource = catalog.authoritySources.get(filePath);
    if (matches.length === 0 && !authoritySource) {
      results.push({ path: filePath, status: "NO_REGISTERED_CHECKSUM_IDENTITY", matches: [] });
      continue;
    }
    if (matches.some((record) => !record.ownerMetadataValid) || (authoritySource && !authoritySource.ownerMetadataValid)) {
      diagnostics.push(makeDiagnostic("FROZEN_AUTHORITY_METADATA_INVALID", filePath, {
        manifestPath: matches[0]?.manifestPath || authoritySource?.path,
        ownerContract: matches[0]?.ownerContract || authoritySource?.ownerContract,
        expectedSha256: matches[0]?.expectedSha256 || authoritySource?.expectedSha256,
        authorityProcedure: matches[0]?.authorityProcedure || authoritySource?.authorityProcedure,
        detail: "checksum metadata has no valid owning contract identifier",
      }));
      continue;
    }
    const entries = matches.map((record) => ({
      manifestPath: record.manifestPath,
      ownerContract: record.ownerContract,
      expectedSha256: record.expectedSha256,
      authorityProcedure: record.authorityProcedure,
    }));
    if (authoritySource) {
      entries.push({
        manifestPath: filePath,
        ownerContract: authoritySource.ownerContract,
        expectedSha256: authoritySource.expectedSha256,
        authorityProcedure: authoritySource.authorityProcedure,
      });
    }
    results.push({ path: filePath, status: "PROTECTED_BY_FROZEN_IDENTITY", matches: entries });
  }
  return { ok: diagnostics.length === 0, elapsedMs: elapsedMs(startedAt), diagnostics, results };
}

async function verifyChangedFiles({ repoRoot, baseSha, headSha, changedPaths }) {
  const startedAt = process.hrtime.bigint();
  if (
    !validRef(baseSha) ||
    !validRef(headSha) ||
    !Array.isArray(changedPaths) ||
    changedPaths.length === 0 ||
    changedPaths.some((filePath) => !isSafeRepoPath(filePath))
  ) {
    return {
      ok: false,
      elapsedMs: elapsedMs(startedAt),
      diagnostics: [makeDiagnostic("FROZEN_CHANGESET_UNVERIFIED", null, {
        detail: "verified base, head, and changed repository paths are required before validation",
      })],
      checkedIdentityCount: 0,
    };
  }

  const catalog = loadCatalog(repoRoot, baseSha);
  if (catalog.error) {
    return {
      ok: false,
      elapsedMs: elapsedMs(startedAt),
      diagnostics: [makeDiagnostic(catalog.error, null, { detail: catalog.detail })],
      checkedIdentityCount: 0,
    };
  }

  const changed = new Set(changedPaths);
  const diagnostics = [];
  for (const error of catalog.errors) {
    if (
      !error.path ||
      !isSafeRepoPath(error.path) ||
      changed.has(error.path) ||
      [
        "FROZEN_MANIFEST_MALFORMED",
        "FROZEN_MANIFEST_UNREADABLE",
        "FROZEN_WORKFLOW_MALFORMED",
        "FROZEN_WORKFLOW_PIN_INVALID",
        "FROZEN_WORKFLOW_UNREADABLE",
      ].includes(error.reasonCode)
    ) {
      diagnostics.push(error.path ? error : makeDiagnostic(error.reasonCode, null, error));
    }
  }

  for (const [manifestPath, source] of catalog.authoritySources) {
    if (!changed.has(manifestPath)) continue;
    if (source.workflowPins) continue;
    if (!source.ownerMetadataValid) {
      diagnostics.push(makeDiagnostic("FROZEN_AUTHORITY_METADATA_INVALID", manifestPath, {
        manifestPath,
        ownerContract: source.ownerContract,
        expectedSha256: source.expectedSha256,
        authorityProcedure: source.authorityProcedure,
        detail: "changed frozen manifest has no valid owning contract identifier",
      }));
      continue;
    }
    let actualSha256 = null;
    try {
      actualSha256 = await sha256File(path.join(repoRoot, manifestPath));
    } catch {
      diagnostics.push(makeDiagnostic("FROZEN_AUTHORITY_SOURCE_UNREADABLE", manifestPath, {
        manifestPath,
        ownerContract: source.ownerContract,
        expectedSha256: source.expectedSha256,
        authorityProcedure: source.authorityProcedure,
        detail: "changed authority source cannot be read as a regular file",
      }));
      continue;
    }
    diagnostics.push(makeDiagnostic("FROZEN_AUTHORITY_SOURCE_CHANGED", manifestPath, {
      manifestPath,
      ownerContract: source.ownerContract,
      expectedSha256: source.expectedSha256,
      actualSha256,
      authorityProcedure: source.authorityProcedure,
      detail: "frozen authority metadata changes require a separate owner-reviewed migration",
    }));
  }

  for (const filePath of changedPaths) {
    if ((HASH_MANIFEST.test(filePath) || NAMED_MANIFEST.test(filePath)) && !catalog.authoritySources.has(filePath)) {
      diagnostics.push(makeDiagnostic("FROZEN_AUTHORITY_SOURCE_ADDED", filePath, {
        actualSha256: await sha256File(path.join(repoRoot, filePath)).catch(() => null),
        detail: "a new checksum authority source requires separate owner review before it can establish frozen identities",
      }));
    }
  }

  for (const workflowPath of changedPaths.filter((filePath) => WORKFLOW.test(filePath))) {
    const source = catalog.authoritySources.get(workflowPath);
    let currentBytes;
    try {
      currentBytes = readFileSync(path.join(repoRoot, workflowPath));
    } catch {
      diagnostics.push(makeDiagnostic("FROZEN_AUTHORITY_SOURCE_UNREADABLE", workflowPath, {
        manifestPath: workflowPath,
        ownerContract: source.ownerContract,
        expectedSha256: source.expectedSha256,
        authorityProcedure: source.authorityProcedure,
        detail: "changed workflow authority source cannot be read",
      }));
      continue;
    }
    const currentPins = parseWorkflowPins(currentBytes, workflowPath);
    const pinKey = (pins) => JSON.stringify((pins || []).map(({ path: p, expectedSha256 }) => [p, expectedSha256]).sort());
    const currentSha256 = sha256Bytes(currentBytes);
    if (currentPins.error) {
      diagnostics.push(makeDiagnostic("FROZEN_AUTHORITY_SOURCE_CHANGED", workflowPath, {
        manifestPath: workflowPath,
        ownerContract: source?.ownerContract || `CI checksum authority in ${workflowPath}`,
        expectedSha256: source?.expectedSha256,
        actualSha256: currentSha256,
        authorityProcedure: source?.authorityProcedure,
        detail: "workflow checksum authority changed or became malformed",
      }));
      continue;
    }
    if (!source?.workflowPins) {
      if (currentPins.pins.length > 0) {
        diagnostics.push(makeDiagnostic("FROZEN_AUTHORITY_SOURCE_ADDED", workflowPath, {
          manifestPath: workflowPath,
          ownerContract: `CI checksum authority in ${workflowPath}`,
          actualSha256: currentSha256,
          authorityProcedure: authorityProcedure(`CI checksum authority in ${workflowPath}`),
          detail: "a new workflow checksum authority requires separate owner review",
        }));
      }
      continue;
    }
    if (pinKey(currentPins.pins) !== pinKey(source.workflowPins)) {
      diagnostics.push(makeDiagnostic("FROZEN_AUTHORITY_SOURCE_CHANGED", workflowPath, {
        manifestPath: workflowPath,
        ownerContract: source.ownerContract,
        expectedSha256: source.expectedSha256,
        actualSha256: currentSha256,
        authorityProcedure: source.authorityProcedure,
        detail: "workflow checksum authority changed or became malformed",
      }));
    }
  }

  const pathGroups = new Map();
  for (const record of catalog.records) {
    if (!changed.has(record.path)) continue;
    const group = pathGroups.get(record.path) || [];
    group.push(record);
    pathGroups.set(record.path, group);
  }

  let checkedIdentityCount = 0;
  for (const [filePath, records] of pathGroups) {
    checkedIdentityCount += records.length;
    if (records.some((record) => !record.ownerMetadataValid)) {
      for (const record of records.filter((item) => !item.ownerMetadataValid)) {
        diagnostics.push(makeDiagnostic("FROZEN_AUTHORITY_METADATA_INVALID", filePath, {
          manifestPath: record.manifestPath,
          ownerContract: record.ownerContract,
          expectedSha256: record.expectedSha256,
          authorityProcedure: record.authorityProcedure,
          detail: "identity is present but its manifest has no valid owning contract identifier",
        }));
      }
      continue;
    }
    let actualSha256 = null;
    try {
      actualSha256 = await sha256File(path.join(repoRoot, filePath));
    } catch {
      for (const record of records) {
        diagnostics.push(makeDiagnostic("FROZEN_TARGET_UNREADABLE", filePath, {
          manifestPath: record.manifestPath,
          ownerContract: record.ownerContract,
          expectedSha256: record.expectedSha256,
          authorityProcedure: record.authorityProcedure,
          detail: "changed protected file cannot be read as a regular file",
        }));
      }
      continue;
    }
    for (const record of records) {
      if (actualSha256 !== record.expectedSha256) {
        diagnostics.push(makeDiagnostic("FROZEN_IDENTITY_MISMATCH", filePath, {
          manifestPath: record.manifestPath,
          ownerContract: record.ownerContract,
          expectedSha256: record.expectedSha256,
          actualSha256,
          authorityProcedure: record.authorityProcedure,
          detail: "changed file differs from the checksum frozen in the verified base contract",
        }));
      }
    }
  }

  return {
    ok: diagnostics.length === 0,
    elapsedMs: elapsedMs(startedAt),
    diagnostics,
    checkedIdentityCount,
  };
}

function elapsedMs(startedAt) {
  return Number(process.hrtime.bigint() - startedAt) / 1_000_000;
}

async function main(argv) {
  if (argv.length === 0 || argv[0] === "--help") {
    console.log("Usage: node scripts/frozenContractPreflight.v0_1.cjs --planned <repo-relative-path> [...]");
    return argv.length === 0 ? 2 : 0;
  }
  if (argv[0] !== "--planned" || argv.length < 2) {
    console.error(JSON.stringify(makeDiagnostic("FROZEN_PREFLIGHT_ARGUMENTS_INVALID", null, {
      detail: "only the read-only --planned mode is supported",
    })));
    return 2;
  }
  const result = await inspectPlannedFiles({ repoRoot: process.cwd(), plannedPaths: argv.slice(1) });
  for (const entry of result.results) console.log(JSON.stringify(entry));
  for (const diagnostic of result.diagnostics) console.error(JSON.stringify(diagnostic));
  console.log(JSON.stringify({ status: result.ok ? "PASS" : "FAIL", elapsedMs: Number(result.elapsedMs.toFixed(2)) }));
  return result.ok ? 0 : 1;
}

module.exports = { inspectPlannedFiles, verifyChangedFiles };

if (require.main === module) {
  main(process.argv.slice(2)).then((status) => {
    process.exitCode = status;
  }).catch((error) => {
    console.error(JSON.stringify(makeDiagnostic("FROZEN_PREFLIGHT_INTERNAL_ERROR", null, {
      detail: error instanceof Error ? error.message : String(error),
    })));
    process.exitCode = 1;
  });
}
