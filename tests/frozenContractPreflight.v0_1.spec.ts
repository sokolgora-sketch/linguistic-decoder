import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";

const { inspectPlannedFiles, verifyChangedFiles } = require("../scripts/frozenContractPreflight.v0_1.cjs") as {
  inspectPlannedFiles: (input: { repoRoot: string; plannedPaths: string[]; baseRef?: string }) => Promise<{
    ok: boolean;
    elapsedMs: number;
    diagnostics: Array<{ reasonCode: string; path: string | null }>;
    results: Array<{ path: string; status: string; matches: Array<Record<string, string>> }>;
  }>;
  verifyChangedFiles: (input: {
    repoRoot: string;
    baseSha: string;
    headSha: string;
    changedPaths: string[];
  }) => Promise<{
    ok: boolean;
    elapsedMs: number;
    checkedIdentityCount: number;
    diagnostics: Array<{
      reasonCode: string;
      path: string | null;
      manifestPath?: string | null;
      ownerContract?: string | null;
      expectedSha256?: string | null;
      actualSha256?: string | null;
      authorityProcedure?: string | null;
    }>;
  }>;
};

type Fixture = {
  root: string;
  baseSha: string;
  protectedPath: string;
  manifestPath: string;
  cleanup: () => void;
};

function git(root: string, ...args: string[]) {
  const result = spawnSync("git", ["-C", root, ...args], { encoding: "utf8", shell: false });
  if (result.status !== 0) throw new Error(`git ${args.join(" ")} failed: ${result.stderr}`);
  return result.stdout.trim();
}

function sha256(text: string) {
  return createHash("sha256").update(text).digest("hex");
}

function makeFixture(options: {
  owner?: string | null;
  digest?: string;
  identityPath?: string;
  malformedJson?: boolean;
  workflowPin?: boolean;
} = {}): Fixture {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "frozen-contract-preflight-"));
  const root = path.join(temp, "repo");
  const protectedPath = "src/shared/frozenEngine.ts";
  const protectedContent = "export const frozenEngine = true;\n";
  const manifestPath = "docs/open-instrument/research-artifacts/test-freeze/hash-manifest.json";
  const archivePath = "docs/open-instrument/research-artifacts/test-freeze/result.json.gz";
  const expandedPath = "docs/open-instrument/research-artifacts/test-freeze/result.json";
  const archiveBytes = "compressed fixture bytes\n";
  const expandedBytes = "expanded fixture bytes\n";
  fs.mkdirSync(path.join(root, path.dirname(protectedPath)), { recursive: true });
  fs.mkdirSync(path.join(root, path.dirname(manifestPath)), { recursive: true });
  fs.writeFileSync(path.join(root, protectedPath), protectedContent);
  fs.writeFileSync(path.join(root, archivePath), archiveBytes);
  fs.writeFileSync(path.join(root, expandedPath), expandedBytes);
  const manifest: Record<string, unknown> = {
    inputs: [{ path: options.identityPath || protectedPath, sha256: options.digest || sha256(protectedContent) }],
    resultArchive: {
      path: archivePath,
      compressedSha256: sha256(archiveBytes),
      uncompressedPath: expandedPath,
      uncompressedSha256: sha256(expandedBytes),
    },
  };
  if (options.owner !== null) manifest.procedureId = options.owner || "test.frozen-engine.v0.1";
  fs.writeFileSync(
    path.join(root, manifestPath),
    options.malformedJson ? "{ malformed" : JSON.stringify(manifest, null, 2),
  );
  if (options.workflowPin) {
    const workflowTarget = "tests/fixtures/pinned-record.json";
    const workflowTargetBytes = "{\"frozen\":true}\n";
    const workflowPath = ".github/workflows/ci.yml";
    fs.mkdirSync(path.join(root, path.dirname(workflowTarget)), { recursive: true });
    fs.mkdirSync(path.join(root, path.dirname(workflowPath)), { recursive: true });
    fs.writeFileSync(path.join(root, workflowTarget), workflowTargetBytes);
    fs.writeFileSync(
      path.join(root, workflowPath),
      `name: CI\nrun: echo \"${sha256(workflowTargetBytes)}  ${workflowTarget}\" | sha256sum --check\n`,
    );
  }
  git(root, "init", "--initial-branch=main");
  git(root, "config", "user.name", "Frozen preflight test");
  git(root, "config", "user.email", "frozen-preflight@example.invalid");
  git(root, "add", "--all");
  git(root, "commit", "-m", "frozen baseline");
  const baseSha = git(root, "rev-parse", "HEAD");
  return {
    root,
    baseSha,
    protectedPath,
    manifestPath,
    cleanup: () => fs.rmSync(temp, { recursive: true, force: true }),
  };
}

describe("frozen-contract early preflight", () => {
  const fixtures: Fixture[] = [];
  afterEach(() => {
    for (const fixture of fixtures.splice(0)) fixture.cleanup();
  });

  function fresh(options: Parameters<typeof makeFixture>[0] = {}) {
    const fixture = makeFixture(options);
    fixtures.push(fixture);
    return fixture;
  }

  it("reports planned protected paths, owner contract, expected checksum, and authority procedure", async () => {
    const fixture = fresh();
    const archivePath = "docs/open-instrument/research-artifacts/test-freeze/result.json.gz";
    const expandedPath = "docs/open-instrument/research-artifacts/test-freeze/result.json";
    const result = await inspectPlannedFiles({
      repoRoot: fixture.root,
      plannedPaths: [fixture.protectedPath, archivePath, expandedPath, "src/ordinary feature.ts"],
    });

    expect(result.ok).toBe(true);
    expect(result.results[0]).toMatchObject({ path: fixture.protectedPath, status: "PROTECTED_BY_FROZEN_IDENTITY" });
    expect(result.results[0]?.matches[0]).toMatchObject({
      ownerContract: "test.frozen-engine.v0.1",
      expectedSha256: sha256("export const frozenEngine = true;\n"),
    });
    expect(result.results[0]?.matches[0]?.authorityProcedure).toContain("Owner-reviewed PR under test.frozen-engine.v0.1");
    expect(result.results[1]?.matches[0]?.expectedSha256).toBe(sha256("compressed fixture bytes\n"));
    expect(result.results[2]?.matches[0]?.expectedSha256).toBe(sha256("expanded fixture bytes\n"));
    expect(result.results[3]).toMatchObject({ path: "src/ordinary feature.ts", status: "NO_REGISTERED_CHECKSUM_IDENTITY" });
  });

  it("passes unchanged protected bytes and unrelated ordinary changes", async () => {
    const fixture = fresh();
    const ordinaryPath = "src/ordinary feature.ts";
    fs.writeFileSync(path.join(fixture.root, ordinaryPath), "export const ordinary = 1;\n");
    const ordinary = await verifyChangedFiles({
      repoRoot: fixture.root,
      baseSha: fixture.baseSha,
      headSha: fixture.baseSha,
      changedPaths: [ordinaryPath],
    });
    expect(ordinary).toMatchObject({ ok: true, checkedIdentityCount: 0 });

    const unchanged = await verifyChangedFiles({
      repoRoot: fixture.root,
      baseSha: fixture.baseSha,
      headSha: fixture.baseSha,
      changedPaths: [fixture.protectedPath],
    });
    expect(unchanged.ok).toBe(true);
    expect(unchanged.checkedIdentityCount).toBe(1);
  });

  it("rejects modified protected bytes with the owning contract and both hashes", async () => {
    const fixture = fresh();
    fs.writeFileSync(path.join(fixture.root, fixture.protectedPath), "export const frozenEngine = false;\n");
    const result = await verifyChangedFiles({
      repoRoot: fixture.root,
      baseSha: fixture.baseSha,
      headSha: fixture.baseSha,
      changedPaths: [fixture.protectedPath],
    });

    expect(result.ok).toBe(false);
    expect(result.diagnostics).toContainEqual(expect.objectContaining({
      reasonCode: "FROZEN_IDENTITY_MISMATCH",
      path: fixture.protectedPath,
      ownerContract: "test.frozen-engine.v0.1",
      expectedSha256: sha256("export const frozenEngine = true;\n"),
      actualSha256: sha256("export const frozenEngine = false;\n"),
    }));
  });

  it("does not let a changed manifest bless a changed frozen target", async () => {
    const fixture = fresh();
    const changedContent = "export const frozenEngine = 'migrated';\n";
    fs.writeFileSync(path.join(fixture.root, fixture.protectedPath), changedContent);
    fs.writeFileSync(path.join(fixture.root, fixture.manifestPath), JSON.stringify({
      procedureId: "test.frozen-engine.v0.1",
      inputs: [{ path: fixture.protectedPath, sha256: sha256(changedContent) }],
    }, null, 2));

    const result = await verifyChangedFiles({
      repoRoot: fixture.root,
      baseSha: fixture.baseSha,
      headSha: fixture.baseSha,
      changedPaths: [fixture.protectedPath, fixture.manifestPath],
    });

    expect(result.ok).toBe(false);
    expect(result.diagnostics.map((diagnostic) => diagnostic.reasonCode)).toEqual(expect.arrayContaining([
      "FROZEN_AUTHORITY_SOURCE_CHANGED",
      "FROZEN_IDENTITY_MISMATCH",
    ]));
    expect(result.diagnostics.find((diagnostic) => diagnostic.reasonCode === "FROZEN_IDENTITY_MISMATCH"))
      .toMatchObject({ expectedSha256: sha256("export const frozenEngine = true;\n"), actualSha256: sha256(changedContent) });
  });

  it("reads CI workflow checksum pins and rejects a changed pin source", async () => {
    const fixture = fresh({ workflowPin: true });
    const workflowPath = ".github/workflows/ci.yml";
    const targetPath = "tests/fixtures/pinned-record.json";
    const planned = await inspectPlannedFiles({ repoRoot: fixture.root, plannedPaths: [targetPath] });
    expect(planned.ok).toBe(true);
    expect(planned.results[0]?.matches[0]).toMatchObject({
      manifestPath: workflowPath,
      ownerContract: `CI SHA-256 pin in ${workflowPath}`,
      expectedSha256: sha256("{\"frozen\":true}\n"),
    });

    fs.writeFileSync(
      path.join(fixture.root, workflowPath),
      `name: CI\nrun: echo \"${"0".repeat(64)}  ${targetPath}\" | sha256sum --check\n`,
    );
    const changedSource = await verifyChangedFiles({
      repoRoot: fixture.root,
      baseSha: fixture.baseSha,
      headSha: fixture.baseSha,
      changedPaths: [workflowPath],
    });
    expect(changedSource.ok).toBe(false);
    expect(changedSource.diagnostics[0]).toMatchObject({
      reasonCode: "FROZEN_AUTHORITY_SOURCE_CHANGED",
      path: workflowPath,
    });
  });

  it("fails safely for missing authority identifiers and malformed checksum metadata", async () => {
    const missingOwner = fresh({ owner: null });
    fs.writeFileSync(path.join(missingOwner.root, missingOwner.protectedPath), "changed\n");
    const missingOwnerResult = await verifyChangedFiles({
      repoRoot: missingOwner.root,
      baseSha: missingOwner.baseSha,
      headSha: missingOwner.baseSha,
      changedPaths: [missingOwner.protectedPath],
    });
    expect(missingOwnerResult.ok).toBe(false);
    expect(missingOwnerResult.diagnostics[0]).toMatchObject({ reasonCode: "FROZEN_AUTHORITY_METADATA_INVALID" });

    const malformedHash = fresh({ digest: "not-a-sha256" });
    fs.writeFileSync(path.join(malformedHash.root, malformedHash.protectedPath), "changed\n");
    const malformedHashResult = await verifyChangedFiles({
      repoRoot: malformedHash.root,
      baseSha: malformedHash.baseSha,
      headSha: malformedHash.baseSha,
      changedPaths: [malformedHash.protectedPath],
    });
    expect(malformedHashResult.ok).toBe(false);
    expect(malformedHashResult.diagnostics[0]).toMatchObject({
      reasonCode: "FROZEN_IDENTITY_METADATA_INVALID",
      path: malformedHash.protectedPath,
    });

    const unsafePath = fresh({ identityPath: "../outside-repo.ts" });
    const unsafePathResult = await verifyChangedFiles({
      repoRoot: unsafePath.root,
      baseSha: unsafePath.baseSha,
      headSha: unsafePath.baseSha,
      changedPaths: ["src/ordinary.ts"],
    });
    expect(unsafePathResult.ok).toBe(false);
    expect(unsafePathResult.diagnostics[0]).toMatchObject({ reasonCode: "FROZEN_IDENTITY_METADATA_INVALID" });

    const malformedManifest = fresh({ malformedJson: true });
    const malformedResult = await verifyChangedFiles({
      repoRoot: malformedManifest.root,
      baseSha: malformedManifest.baseSha,
      headSha: malformedManifest.baseSha,
      changedPaths: ["src/ordinary.ts"],
    });
    expect(malformedResult.ok).toBe(false);
    expect(malformedResult.diagnostics[0]).toMatchObject({ reasonCode: "FROZEN_MANIFEST_MALFORMED" });
  });

  it("rejects unverifiable change sets instead of silently skipping the gate", async () => {
    const fixture = fresh();
    const result = await verifyChangedFiles({
      repoRoot: fixture.root,
      baseSha: "unknown",
      headSha: fixture.baseSha,
      changedPaths: [],
    });
    expect(result.ok).toBe(false);
    expect(result.diagnostics[0]).toMatchObject({ reasonCode: "FROZEN_CHANGESET_UNVERIFIED" });
  });

  it("does not accept a caller-supplied preflight bypass argument", () => {
    const fixture = fresh();
    const script = path.resolve(__dirname, "../scripts/frozenContractPreflight.v0_1.cjs");
    const result = spawnSync(process.execPath, [script, "--skip-frozen-preflight"], {
      cwd: fixture.root,
      encoding: "utf8",
      shell: false,
    });
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("FROZEN_PREFLIGHT_ARGUMENTS_INVALID");
  });
});
