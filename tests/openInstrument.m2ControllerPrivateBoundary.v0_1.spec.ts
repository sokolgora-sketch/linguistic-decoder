import {
  chmodSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  symlinkSync,
  unlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import {
  M2_CONTROLLER_COMMITMENT_PHASES_V0_1,
  M2_CONTROLLER_PRIVATE_BOUNDARY_SCHEMA_V0_1,
  M2_CONTROLLER_PRIVATE_EXCLUSION_CATEGORIES_V0_1,
  M2_SEALED_MANIFEST_ONLY_LINKAGE_V0_1,
  M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1,
  type M2ControllerPrivateBoundaryInputV0_1,
  verifyM2ControllerPrivateBoundaryV0_1,
} from "@/shared/openInstrument/m2ControllerPrivateBoundary.v0_1";

const hash = (value: Buffer | string): string =>
  createHash("sha256").update(value).digest("hex");

const canonical = (value: unknown): string => {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(canonical).join(",") + "]";
  const record = value as Record<string, unknown>;
  return (
    "{" +
    Object.keys(record)
      .sort()
      .map((key) => JSON.stringify(key) + ":" + canonical(record[key]))
      .join(",") +
    "}"
  );
};

type FixtureV0_1 = {
  root: string;
  input: M2ControllerPrivateBoundaryInputV0_1;
  cleanup: () => void;
};

const makeFixtureV0_1 = (): FixtureV0_1 => {
  const rawRoot = mkdtempSync(join(tmpdir(), "m2-controller-private-boundary-"));
  const root = realpathSync(rawRoot);
  chmodSync(root, 0o700);
  const values = {
    namespace: Buffer.from("synthetic namespace commitment\n"),
    exclusion: Buffer.from("synthetic exclusion inventory\n"),
    registry: Buffer.from("synthetic private registry\n"),
    selection: Buffer.from("synthetic selection record\n"),
    chronology: Buffer.from("synthetic chronology record\n"),
  };
  const pool = {
    schemaVersion: "open-instrument.m2-public-pool-definition.v0.1",
    serializationProfile: "canonical-json-v0.1",
    containsTargetSemantics: false,
    targetBearingFieldCount: 0,
    linkageMode: M2_SEALED_MANIFEST_ONLY_LINKAGE_V0_1,
    frozen: true,
  };
  const poolBytes = Buffer.from(canonical(pool) + "\n");
  const projection = {
    claimBoundary: ["synthetic-only"],
    schemaVersion: "synthetic-operator-projection.v0.1",
    structuralFingerprint: "a".repeat(64),
  };
  const projectionBytes = canonical(projection) + "\n";
  const files = [
    ["namespace", "namespace.bin", "NAMESPACE_COMMITMENT", values.namespace],
    ["exclusion", "exclusion.bin", "EXCLUSION_INVENTORY", values.exclusion],
    ["registry", "registry.bin", "PRIVATE_REGISTRY", values.registry],
    ["selection", "selection.bin", "SELECTION_RECORD", values.selection],
    ["chronology", "chronology.bin", "CHRONOLOGY_RECORD", values.chronology],
    ["pool", "public-pool.json", "PUBLIC_POOL_DEFINITION", poolBytes],
  ] as const;
  const artifacts = files.map(([artifactId, relativePath, kind, bytes]) => ({
    artifactId,
    kind,
    relativePath,
    expectedSha256: hash(bytes),
    expectedByteLength: bytes.length,
    exclusionCategories: [] as string[],
    frozen: true as const,
    mutatedAfterFreeze: false as const,
  }));
  for (const [, relativePath, , bytes] of files) {
    writeFileSync(join(root, relativePath), bytes, { mode: 0o600 });
    chmodSync(join(root, relativePath), 0o600);
  }
  const dependencies = [...artifacts]
    .sort((left, right) => left.artifactId.localeCompare(right.artifactId))
    .map((artifact) => ({
      artifactId: artifact.artifactId,
      byteLength: artifact.expectedByteLength,
      sha256: artifact.expectedSha256,
    }));
  const manifestBytes = Buffer.from(
    canonical({
      dependencies,
      frozen: true,
      linkageMode: M2_SEALED_MANIFEST_ONLY_LINKAGE_V0_1,
      schemaVersion: "open-instrument.m2-sealed-manifest.v0.1",
      selfReferential: false,
      serializationProfile: "canonical-json-v0.1",
      targetBearingDataPublic: false,
    }) + "\n",
  );
  writeFileSync(join(root, "sealed-manifest.json"), manifestBytes, { mode: 0o600 });
  chmodSync(join(root, "sealed-manifest.json"), 0o600);
  artifacts.push({
    artifactId: "manifest",
    kind: "SEALED_MANIFEST",
    relativePath: "sealed-manifest.json",
    expectedSha256: hash(manifestBytes),
    expectedByteLength: manifestBytes.length,
    exclusionCategories: [],
    frozen: true,
    mutatedAfterFreeze: false,
  });
  const input: M2ControllerPrivateBoundaryInputV0_1 = {
    schemaVersion: M2_CONTROLLER_PRIVATE_BOUNDARY_SCHEMA_V0_1,
    syntheticFixture: true,
    auditProvenance: {
      classification: M2_SINGLE_OPERATOR_REPRODUCIBLE_AUDIT_CLASSIFICATION_V0_1,
      selfReviewStatus: "SELF_REVIEWED",
      independentHumanReviewerReference: null,
      claimsIndependentHumanReview: false,
    },
    privateRoot: root,
    forbiddenRoots: [join(root, "..", "forbidden-not-root")],
    artifacts,
    manifestArtifactId: "manifest",
    exclusionCoverage: {
      artifactId: "exclusion",
      status: "VERIFIED_FOR_DECLARED_SCOPE",
      categories: {
        baseline: "COVERED",
        priorTarget: "COVERED",
        priorReveal: "COVERED",
        priorControl: "COVERED",
        priorResearch: "COVERED",
        embryoOrReplication: "COVERED",
      },
    },
    chronology: {
      evidenceMode: "SYNTHETIC_CONTROLLED_OBSERVATION",
      controlledObservationVerified: true,
      entries: M2_CONTROLLER_COMMITMENT_PHASES_V0_1.map((phase, ordinal) => ({
        phase,
        artifactId: ["namespace", "pool", "exclusion", "registry", "selection"][ordinal],
        sha256: artifacts.find(
          (artifact) =>
            artifact.artifactId ===
            ["namespace", "pool", "exclusion", "registry", "selection"][ordinal],
        )?.expectedSha256 as string,
        byteLength: artifacts.find(
          (artifact) =>
            artifact.artifactId ===
            ["namespace", "pool", "exclusion", "registry", "selection"][ordinal],
        )?.expectedByteLength as number,
        ordinal,
        occurredAt: "2026-10-20T00:00:0" + String(ordinal) + "Z",
        immutableEvidence: true,
        executed: false,
      })),
    },
    operatorProjection: {
      serializedBytes: projectionBytes,
      sha256: hash(projectionBytes),
      byteLength: Buffer.byteLength(projectionBytes),
      frozen: true,
    },
    isolationEvidence: {
      evidenceMode: "SYNTHETIC_CONTROLLED_OBSERVATION",
      filesystemBoundaryVerified: true,
      processBoundaryVerified: true,
      filesystemAccessAttempt: "DENIED",
      processAccessAttempt: "DENIED",
      privatePathNotExposed: true,
    },
    executionBoundary: {
      realCandidateIntakeAuthorized: false,
      realKeyCreated: false,
      realIdsAssigned: false,
      realSelectionExecuted: false,
      realExecutionAuthorized: false,
    },
  };
  return {
    root,
    input,
    cleanup: () => rmSync(root, { recursive: true, force: true }),
  };
};

const cloneInputV0_1 = (
  input: M2ControllerPrivateBoundaryInputV0_1,
): M2ControllerPrivateBoundaryInputV0_1 =>
  JSON.parse(JSON.stringify(input)) as M2ControllerPrivateBoundaryInputV0_1;

const rewriteArtifactBytesV0_1 = (
  fixture: FixtureV0_1,
  input: M2ControllerPrivateBoundaryInputV0_1,
  artifactId: string,
  bytes: Buffer,
) => {
  const artifact = input.artifacts.find((candidate) => candidate.artifactId === artifactId);
  if (!artifact) throw new Error(`missing fixture artifact: ${artifactId}`);
  writeFileSync(join(fixture.root, artifact.relativePath), bytes, { mode: 0o600 });
  chmodSync(join(fixture.root, artifact.relativePath), 0o600);
  (artifact as { expectedSha256: string }).expectedSha256 = hash(bytes);
  (artifact as { expectedByteLength: number }).expectedByteLength = bytes.length;
};

const expectBlockedV0_1 = (
  fixture: FixtureV0_1,
  mutate: (input: M2ControllerPrivateBoundaryInputV0_1) => void,
  reason: string,
) => {
  const input = cloneInputV0_1(fixture.input);
  mutate(input);
  const result = verifyM2ControllerPrivateBoundaryV0_1(input);
  expect(result.status).toBe("BLOCKED");
  expect(result.reasonCodes).toContain(reason);
  expect(result.realCandidateIntakeAuthorized).toBe(false);
  expect(result.realExecutionAuthorized).toBe(false);
  expect(JSON.stringify(result)).not.toContain(fixture.root);
};

describe("M2 controller-private boundary", () => {
  it("verifies synthetic private storage, sealed linkage and controlled isolation", () => {
    const fixture = makeFixtureV0_1();
    try {
      expect(verifyM2ControllerPrivateBoundaryV0_1(fixture.input)).toMatchObject({
        status: "SYNTHETIC_BOUNDARY_READY",
        privateStorageVerified: true,
        artifactIntegrityVerified: true,
        sealedManifestVerified: true,
        commitmentChronologyVerified: false,
        commitmentChronologyStatus: "SYNTHETIC_METADATA_ONLY",
        blindIsolationVerified: true,
        publicProjectionVerified: true,
        realCandidateIntakeAuthorized: false,
        realExecutionAuthorized: false,
      });
    } finally {
      fixture.cleanup();
    }
  });

  it("blocks a private root overlapping a forbidden root", () => {
    const fixture = makeFixtureV0_1();
    try {
      expectBlockedV0_1(fixture, (input) => {
        input.forbiddenRoots = [fixture.root];
      }, "PRIVATE_ROOT_OVERLAPS_FORBIDDEN_ROOT");
    } finally {
      fixture.cleanup();
    }
  });

  it("uses component-aware forbidden-root containment", () => {
    const cases = [
      ["filesystem root", "/", true],
      ["exact same root", "same", true],
      ["parent root", "parent", true],
      ["child root", "child", true],
      ["similarly named sibling", "sibling", false],
    ] as const;
    for (const [label, relation, overlaps] of cases) {
      const fixture = makeFixtureV0_1();
      try {
        const forbiddenRoot =
          relation === "same"
            ? fixture.root
            : relation === "parent"
              ? dirname(fixture.root)
              : relation === "child"
                ? join(fixture.root, "child")
                : relation === "sibling"
                  ? `${fixture.root}-sibling`
                  : "/";
        const result = verifyM2ControllerPrivateBoundaryV0_1({
          ...fixture.input,
          forbiddenRoots: [forbiddenRoot],
        });
        if (overlaps) {
          expect(result.reasonCodes).toContain("PRIVATE_ROOT_OVERLAPS_FORBIDDEN_ROOT");
        } else {
          expect(result.reasonCodes).not.toContain("PRIVATE_ROOT_OVERLAPS_FORBIDDEN_ROOT");
          expect(result.status).toBe("SYNTHETIC_BOUNDARY_READY");
        }
        expect(label).toBeTruthy();
      } finally {
        fixture.cleanup();
      }
    }
  });

  it("blocks traversal in an artifact path", () => {
    const fixture = makeFixtureV0_1();
    try {
      expectBlockedV0_1(fixture, (input) => {
        (input.artifacts[0] as { relativePath: string }).relativePath = "../escape";
      }, "ARTIFACT_RECORD_INVALID");
    } finally {
      fixture.cleanup();
    }
  });

  it("blocks a symlink in the private tree", () => {
    const fixture = makeFixtureV0_1();
    const outside = join(tmpdir(), "m2-controller-private-outside");
    try {
      writeFileSync(outside, "private\n", { mode: 0o600 });
      unlinkSync(join(fixture.root, "namespace.bin"));
      symlinkSync(outside, join(fixture.root, "namespace.bin"));
      expectBlockedV0_1(fixture, () => {}, "PRIVATE_SYMLINK_PRESENT");
    } finally {
      fixture.cleanup();
      rmSync(outside, { force: true });
    }
  });

  it("blocks permissive private-root permissions", () => {
    const fixture = makeFixtureV0_1();
    try {
      chmodSync(fixture.root, 0o755);
      expectBlockedV0_1(fixture, () => {}, "PRIVATE_ROOT_PERMISSIONS_INSUFFICIENT");
    } finally {
      fixture.cleanup();
    }
  });

  it("blocks permissive nested private-directory permissions", () => {
    const fixture = makeFixtureV0_1();
    try {
      const nested = join(fixture.root, "nested");
      mkdirSync(nested, { mode: 0o755 });
      chmodSync(nested, 0o755);
      expectBlockedV0_1(
        fixture,
        () => {},
        "PRIVATE_DIRECTORY_PERMISSIONS_INSUFFICIENT",
      );
    } finally {
      fixture.cleanup();
    }
  });

  it("blocks tampered, missing and length-mismatched artifacts", () => {
    const cases = [
      ["hash", (fixture: FixtureV0_1) => writeFileSync(join(fixture.root, "namespace.bin"), "tampered\n"), "ARTIFACT_HASH_MISMATCH"],
      ["missing", (fixture: FixtureV0_1) => unlinkSync(join(fixture.root, "namespace.bin")), "ARTIFACT_MISSING"],
      ["length", (fixture: FixtureV0_1) => {}, "ARTIFACT_BYTE_LENGTH_MISMATCH"],
    ] as const;
    for (const [name, mutateFile, reason] of cases) {
      const fixture = makeFixtureV0_1();
      try {
        mutateFile(fixture);
        const input = cloneInputV0_1(fixture.input);
        if (name === "length") input.artifacts[0].expectedByteLength += 1;
        const result = verifyM2ControllerPrivateBoundaryV0_1(input);
        expect(result.status).toBe("BLOCKED");
        expect(result.reasonCodes).toContain(reason);
      } finally {
        fixture.cleanup();
      }
    }
  });

  it("blocks a manifest dependency mismatch", () => {
    const fixture = makeFixtureV0_1();
    try {
      const manifestPath = join(fixture.root, "sealed-manifest.json");
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Record<string, unknown>;
      const dependencies = manifest.dependencies as Array<Record<string, unknown>>;
      dependencies[0].sha256 = "0".repeat(64);
      const bytes = Buffer.from(canonical(manifest) + "\n");
      writeFileSync(manifestPath, bytes, { mode: 0o600 });
      const input = cloneInputV0_1(fixture.input);
      input.artifacts.find((artifact) => artifact.artifactId === "manifest")!.expectedSha256 = hash(bytes);
      input.artifacts.find((artifact) => artifact.artifactId === "manifest")!.expectedByteLength = bytes.length;
      expectBlockedV0_1({ ...fixture, input }, () => {}, "MANIFEST_DEPENDENCY_MISMATCH");
    } finally {
      fixture.cleanup();
    }
  });

  it("blocks canonical null sealed-manifest and public-pool artifacts", () => {
    for (const artifactId of ["manifest", "pool"] as const) {
      const fixture = makeFixtureV0_1();
      try {
        const input = cloneInputV0_1(fixture.input);
        rewriteArtifactBytesV0_1(fixture, input, artifactId, Buffer.from("null\n"));
        if (artifactId === "manifest") {
          expectBlockedV0_1({ ...fixture, input }, () => {}, "MANIFEST_INVALID");
        } else {
          const manifestPath = join(fixture.root, "sealed-manifest.json");
          const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Record<string, unknown>;
          const dependencies = manifest.dependencies as Array<Record<string, unknown>>;
          const poolDependency = dependencies.find((dependency) => dependency.artifactId === "pool")!;
          poolDependency.sha256 = input.artifacts.find((artifact) => artifact.artifactId === "pool")!.expectedSha256;
          poolDependency.byteLength = input.artifacts.find((artifact) => artifact.artifactId === "pool")!.expectedByteLength;
          const manifestBytes = Buffer.from(canonical(manifest) + "\n");
          writeFileSync(manifestPath, manifestBytes, { mode: 0o600 });
          chmodSync(manifestPath, 0o600);
          const manifestArtifact = input.artifacts.find((artifact) => artifact.artifactId === "manifest")!;
          manifestArtifact.expectedSha256 = hash(manifestBytes);
          manifestArtifact.expectedByteLength = manifestBytes.length;
          expectBlockedV0_1({ ...fixture, input }, () => {}, "PUBLIC_POOL_METADATA_INVALID");
        }
      } finally {
        fixture.cleanup();
      }
    }
  });

  it("rejects coerced manifest dependency identifiers", () => {
    const fixture = makeFixtureV0_1();
    try {
      const manifestPath = join(fixture.root, "sealed-manifest.json");
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Record<string, unknown>;
      const dependencies = manifest.dependencies as Array<Record<string, unknown>>;
      dependencies[0].artifactId = ["namespace"];
      rewriteArtifactBytesV0_1(
        fixture,
        fixture.input,
        "manifest",
        Buffer.from(canonical(manifest) + "\n"),
      );
      expectBlockedV0_1({ ...fixture, input: fixture.input }, () => {}, "MANIFEST_DEPENDENCY_MISMATCH");
    } finally {
      fixture.cleanup();
    }
  });

  it("blocks duplicate artifact records and incomplete exclusion coverage", () => {
    const fixture = makeFixtureV0_1();
    try {
      expectBlockedV0_1(fixture, (input) => {
        input.artifacts = [...input.artifacts, input.artifacts[0]];
      }, "DUPLICATE_ARTIFACT_ID");
      expectBlockedV0_1(fixture, (input) => {
        input.exclusionCoverage.status = "UNKNOWN";
      }, "EXCLUSION_COVERAGE_UNKNOWN_OR_CONFLICTING");
    } finally {
      fixture.cleanup();
    }
  });

  it("requires the declared exclusion inventory and complete artifact kinds", () => {
    const wrongKindFixture = makeFixtureV0_1();
    try {
      const input = cloneInputV0_1(wrongKindFixture.input);
      const exclusion = input.artifacts.find((artifact) => artifact.artifactId === "exclusion")!;
      (exclusion as { kind: string }).kind = "SOURCE";
      expectBlockedV0_1(
        { ...wrongKindFixture, input },
        () => {},
        "ARTIFACT_RECORD_INVALID",
      );
    } finally {
      wrongKindFixture.cleanup();
    }

    const missingInventoryFixture = makeFixtureV0_1();
    try {
      const input = cloneInputV0_1(missingInventoryFixture.input);
      input.artifacts = input.artifacts.filter((artifact) => artifact.artifactId !== "exclusion");
      expectBlockedV0_1(
        { ...missingInventoryFixture, input },
        () => {},
        "ARTIFACT_RECORD_INVALID",
      );
    } finally {
      missingInventoryFixture.cleanup();
    }
  });

  it("blocks chronology that is metadata-only or claims execution", () => {
    const fixture = makeFixtureV0_1();
    try {
      expectBlockedV0_1(fixture, (input) => {
        input.chronology.evidenceMode = "METADATA_ONLY";
      }, "COMMITMENT_CHRONOLOGY_UNVERIFIED");
      expectBlockedV0_1(fixture, (input) => {
        input.chronology.entries[0].executed = true;
      }, "COMMITMENT_CHRONOLOGY_INVALID");
      expectBlockedV0_1(fixture, (input) => {
        input.chronology.entries[0].occurredAt = "controller-says-before";
      }, "COMMITMENT_CHRONOLOGY_INVALID");
    } finally {
      fixture.cleanup();
    }
  });

  it("orders chronology by UTC instants across timestamp precision", () => {
    const fixture = makeFixtureV0_1();
    try {
      const input = cloneInputV0_1(fixture.input);
      input.chronology.entries[0].occurredAt = "2026-10-20T00:00:00Z";
      input.chronology.entries[1].occurredAt = "2026-10-20T00:00:00.100Z";
      expect(verifyM2ControllerPrivateBoundaryV0_1(input).status).toBe("SYNTHETIC_BOUNDARY_READY");

      expectBlockedV0_1(fixture, (candidate) => {
        candidate.chronology.entries[0].occurredAt = "2026-10-20T00:00:00.900Z";
        candidate.chronology.entries[1].occurredAt = "2026-10-20T00:00:00.100Z";
      }, "COMMITMENT_ORDER_INVALID");

      const laterInput = cloneInputV0_1(fixture.input);
      laterInput.chronology.entries[0].occurredAt = "2026-10-20T00:00:00.900Z";
      laterInput.chronology.entries[1].occurredAt = "2026-10-20T00:00:01Z";
      expect(verifyM2ControllerPrivateBoundaryV0_1(laterInput).status).toBe("SYNTHETIC_BOUNDARY_READY");

      expectBlockedV0_1(fixture, (candidate) => {
        candidate.chronology.entries[1].occurredAt = "2026-10-20T00:00:00Z";
      }, "COMMITMENT_ORDER_INVALID");
    } finally {
      fixture.cleanup();
    }
  });

  it("blocks target-bearing public metadata and projection leakage", () => {
    const fixture = makeFixtureV0_1();
    try {
      const poolPath = join(fixture.root, "public-pool.json");
      const pool = JSON.parse(readFileSync(poolPath, "utf8")) as Record<string, unknown>;
      pool.targetWord = "private";
      const poolBytes = Buffer.from(canonical(pool) + "\n");
      writeFileSync(poolPath, poolBytes, { mode: 0o600 });
      const input = cloneInputV0_1(fixture.input);
      input.artifacts.find((artifact) => artifact.artifactId === "pool")!.expectedSha256 = hash(poolBytes);
      input.artifacts.find((artifact) => artifact.artifactId === "pool")!.expectedByteLength = poolBytes.length;
      const manifestPath = join(fixture.root, "sealed-manifest.json");
      const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Record<string, unknown>;
      const dependencies = manifest.dependencies as Array<Record<string, unknown>>;
      const poolDependency = dependencies.find((dependency) => dependency.artifactId === "pool")!;
      poolDependency.sha256 = hash(poolBytes);
      poolDependency.byteLength = poolBytes.length;
      const manifestBytes = Buffer.from(canonical(manifest) + "\n");
      writeFileSync(manifestPath, manifestBytes, { mode: 0o600 });
      input.artifacts.find((artifact) => artifact.artifactId === "manifest")!.expectedSha256 = hash(manifestBytes);
      input.artifacts.find((artifact) => artifact.artifactId === "manifest")!.expectedByteLength = manifestBytes.length;
      expectBlockedV0_1({ ...fixture, input }, () => {}, "PUBLIC_TARGET_SEMANTICS_EXPOSED");
    } finally {
      fixture.cleanup();
    }
    const projectionFixture = makeFixtureV0_1();
    try {
      const input = cloneInputV0_1(projectionFixture.input);
      const projection = {
        projectionPrivateSentinel: "synthetic-private-value",
        schemaVersion: "synthetic-operator-projection.v0.1",
      };
      const serializedBytes = canonical(projection) + "\n";
      input.operatorProjection.serializedBytes = serializedBytes;
      input.operatorProjection.sha256 = hash(serializedBytes);
      input.operatorProjection.byteLength = Buffer.byteLength(serializedBytes);
      expectBlockedV0_1({ ...projectionFixture, input }, () => {}, "BLIND_PROJECTION_INVALID");
      expect(JSON.stringify(verifyM2ControllerPrivateBoundaryV0_1(input))).not.toContain(
        "synthetic-private-value",
      );
    } finally {
      projectionFixture.cleanup();
    }
  });

  it("blocks metadata-only and allowed-access isolation evidence", () => {
    const fixture = makeFixtureV0_1();
    try {
      expectBlockedV0_1(fixture, (input) => {
        input.isolationEvidence.evidenceMode = "METADATA_ONLY";
      }, "ISOLATION_UNVERIFIED");
      expectBlockedV0_1(fixture, (input) => {
        input.isolationEvidence.filesystemAccessAttempt = "ALLOWED";
      }, "BLIND_PRIVATE_ACCESS_OBSERVED");
    } finally {
      fixture.cleanup();
    }
  });

  it("blocks false independent-review, real-key and real-selection claims", () => {
    const fixture = makeFixtureV0_1();
    try {
      expectBlockedV0_1(fixture, (input) => {
        input.auditProvenance.claimsIndependentHumanReview = true;
      }, "FALSE_INDEPENDENT_HUMAN_REVIEW_CLAIM");
      expectBlockedV0_1(fixture, (input) => {
        input.executionBoundary.realKeyCreated = true;
      }, "REAL_AUTHORIZATION_REQUESTED");
      expectBlockedV0_1(fixture, (input) => {
        input.executionBoundary.realSelectionExecuted = true;
      }, "REAL_AUTHORIZATION_REQUESTED");
    } finally {
      fixture.cleanup();
    }
  });
});
