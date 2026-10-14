import {
  CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_AUTHORITY_BOUNDARY_V0_1,
  CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_CONSUMER_V0_1,
  CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_SCHEMA_V0_1,
  CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_UNIT_SCHEMA_V0_1,
  projectCmuDictBridgeDiscoveryTransportV0_1,
} from "@/shared/openInstrument/cmudictBridgeDiscoveryTransport.v0_1";
import {
  CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_RUNTIME_AUTHORITY_TAG_V0_1,
  projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1,
  type CmuDictCandidateProductionSpokenRepresentationBridgeInputV0_1,
  type CmuDictCandidateProductionSpokenRepresentationBridgeV0_1,
} from "@/shared/openInstrument/cmudictCandidateProductionSpokenRepresentationBridge.v0_1";
import {
  adaptCmuDictCandidateSourceEvidenceV0_1,
  type CmuDictCandidateAdapterInputV0_1,
} from "@/shared/openInstrument/cmudictCandidateSourceAdapter.v0_1";
import { projectCmuDictCandidateGammaProjectionV0_1 } from "@/shared/openInstrument/cmudictCandidateGammaProjection.v0_1";
import { projectCmuDictCandidateVoiceProjectionV0_1 } from "@/shared/openInstrument/cmudictCandidateVoiceProjection.v0_1";
import { projectCmuDictCandidateZcProjectionV0_1 } from "@/shared/openInstrument/cmudictCandidateZcProjection.v0_1";
import { buildCmuDictProductionSpokenBridgePrerequisitesV0_1 } from "@/shared/openInstrument/cmudictProductionSpokenBridgePrerequisites.v0_1";
import { normalizeEnglishLexicalJoinKeyV0_1 } from "@/shared/openInstrument/englishLexicalSenseSourceContract.v0_1";

function candidate(sourceForm: string): CmuDictCandidateAdapterInputV0_1 {
  return {
    candidateId: `candidate.${sourceForm}.v0_1`,
    sourceId: `english-kaikki-record.${sourceForm}.v0_1`,
    sourceFamilyId: "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1",
    sourceRecordId: `snapshot-record.${sourceForm}.v0_1`,
    sourceForm,
    normalizedForm: normalizeEnglishLexicalJoinKeyV0_1(sourceForm),
    language: "English",
    senseId: `sense.${sourceForm}.v0_1`,
    gloss: "fixture gloss; not transport authority",
    sourceProvenance: {
      entryLocator: `fixture://english/${sourceForm}`,
      sourceRecordId: `snapshot-record.${sourceForm}.v0_1`,
      sourceFamilyId: "open-instrument.wiktionary-kaikki-english-lexical-sense.v0_1",
    },
  };
}

function bridgeInput(
  candidateForm = "stone",
  productionForm = candidateForm,
): CmuDictCandidateProductionSpokenRepresentationBridgeInputV0_1 {
  const source = adaptCmuDictCandidateSourceEvidenceV0_1(candidate(candidateForm));
  const voice = projectCmuDictCandidateVoiceProjectionV0_1(source);
  const gamma = projectCmuDictCandidateGammaProjectionV0_1(voice);
  return {
    candidateVoiceProjection: voice,
    productionPrerequisites:
      buildCmuDictProductionSpokenBridgePrerequisitesV0_1(productionForm),
    candidateGammaProjection: gamma,
    candidateZcProjection: projectCmuDictCandidateZcProjectionV0_1(gamma),
  };
}

function bridge(
  candidateForm = "stone",
  productionForm = candidateForm,
): CmuDictCandidateProductionSpokenRepresentationBridgeV0_1 {
  return projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(
    bridgeInput(candidateForm, productionForm),
  );
}

function copy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function keysDeep(value: unknown, keys: string[] = []): string[] {
  if (Array.isArray(value)) {
    for (const child of value) keysDeep(child, keys);
  } else if (value !== null && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      keys.push(key);
      keysDeep(child, keys);
    }
  }
  return keys;
}

describe("CMUdict Bridge to Discovery evidence-only transport v0.1", () => {
  it("projects a valid Bridge-compatible result into the exact transport envelope", () => {
    const transport = projectCmuDictBridgeDiscoveryTransportV0_1(bridge());
    expect(transport).toMatchObject({
      schemaVersion: CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_SCHEMA_V0_1,
      unitSchemaVersion: CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_UNIT_SCHEMA_V0_1,
      bridgeStatus: "COMPATIBLE_FOR_SUBSEQUENT_RELATION_EVALUATION",
      bridgeReason: null,
      preservedBridgeAuthorityTag:
        CMUDICT_CANDIDATE_PRODUCTION_SPOKEN_REPRESENTATION_BRIDGE_RUNTIME_AUTHORITY_TAG_V0_1,
      authorityBoundary:
        CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_AUTHORITY_BOUNDARY_V0_1,
      consumer: CMUDICT_BRIDGE_DISCOVERY_TRANSPORT_CONSUMER_V0_1,
    });
    expect(transport?.units).toHaveLength(1);
  });

  it("preserves Bridge Null and nested upstream Null reasons", () => {
    const sourceNull = bridge("word-not-in-cmudict-v0-1", "stone");
    const transport = projectCmuDictBridgeDiscoveryTransportV0_1(sourceNull);
    expect(transport).toMatchObject({
      bridgeStatus: "NULL",
      bridgeReason: "BRIDGE_SOURCE_AUTHORITY_MISSING",
    });
    expect(transport?.candidateLedger.sourceEvidenceReasonCode).toBe(
      "PRONUNCIATION_NOT_FOUND",
    );
  });

  it("transports canonical nullable Bridge Null and independently retained ledgers", () => {
    const canonicalNull =
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(null);
    const nullTransport =
      projectCmuDictBridgeDiscoveryTransportV0_1(canonicalNull);
    expect(nullTransport).toMatchObject({
      bridgeStatus: "NULL",
      bridgeReason: "BRIDGE_PROVENANCE_INCOMPLETE",
      candidateLedger: null,
      productionLedger: null,
      units: [],
    });

    const malformed = copy(bridgeInput()) as unknown as {
      candidateVoiceProjection: {
        sourceEvidence: { variants: Array<Record<string, unknown>> };
      };
    };
    delete malformed.candidateVoiceProjection.sourceEvidence.variants[0].rawSourceLine;
    const retainedBridge =
      projectCmuDictCandidateProductionSpokenRepresentationBridgeV0_1(
        malformed,
      );
    const retainedTransport =
      projectCmuDictBridgeDiscoveryTransportV0_1(retainedBridge);
    expect(retainedTransport?.candidateLedger).toBeNull();
    expect(retainedTransport?.productionLedger).not.toBeNull();
    expect(retainedTransport?.bridgeStatus).toBe("NULL");
  });

  it("preserves a blocked Bridge without evaluating downstream gates", () => {
    const blocked = bridge("stone", "tone");
    const transport = projectCmuDictBridgeDiscoveryTransportV0_1(blocked);
    expect(transport).toMatchObject({
      bridgeStatus: "BLOCKED_BY_MISSING_AUTHORITY",
      bridgeReason: "BRIDGE_NORMALIZATION_MISMATCH",
    });
    expect(transport?.consumer).toBe("NONE");
  });

  it("rejects a missing or wrong incoming Bridge runtime authority tag", () => {
    const missing = copy(bridge()) as unknown as Record<string, unknown>;
    delete missing.runtimeAuthorityTag;
    const wrong = copy(bridge()) as unknown as Record<string, unknown>;
    wrong.runtimeAuthorityTag = "WRONG";
    expect(projectCmuDictBridgeDiscoveryTransportV0_1(missing)).toBeNull();
    expect(projectCmuDictBridgeDiscoveryTransportV0_1(wrong)).toBeNull();
  });

  it.each([
    ["candidate provenance", (value: Record<string, unknown>) => {
      const candidateLedger = value.candidateLedger as { sourceEvidence: { variants: Array<Record<string, unknown>> } };
      candidateLedger.sourceEvidence.variants[0].rawSourceLine = "tampered";
    }],
    ["production provenance", (value: Record<string, unknown>) => {
      const productionLedger = value.productionLedger as { variants: Array<{ physicalEvidence: Record<string, unknown> }> };
      productionLedger.variants[0].physicalEvidence.rawSourceLine = "tampered";
    }],
    ["artifact", (value: Record<string, unknown>) => {
      (value.exactArtifactIdentity as Record<string, unknown>).sha256 = "wrong";
    }],
    ["revision", (value: Record<string, unknown>) => { value.sourceRevision = "wrong"; }],
    ["notation", (value: Record<string, unknown>) => { value.notation = "wrong"; }],
    ["normalization", (value: Record<string, unknown>) => {
      (value.normalizationIdentity as Record<string, unknown>).candidateJoinKey = "wrong";
    }],
    ["parser", (value: Record<string, unknown>) => {
      (value.parserIdentity as Record<string, unknown>).candidate = "wrong";
    }],
    ["mapping", (value: Record<string, unknown>) => { value.mappingIdentity = "wrong"; }],
  ])("rejects tampered %s evidence", (_label, mutate) => {
    const tampered = copy(bridge()) as unknown as Record<string, unknown>;
    mutate(tampered);
    expect(projectCmuDictBridgeDiscoveryTransportV0_1(tampered)).toBeNull();
  });

  it("preserves annotation-ineligible evidence and the exact raw line", () => {
    const transport = projectCmuDictBridgeDiscoveryTransportV0_1(
      bridge("aalborg"),
    );
    expect(transport).toMatchObject({
      bridgeStatus: "BLOCKED_BY_MISSING_AUTHORITY",
      annotationEligibility: {
        annotatedRecordCountInFrozenArtifact: 22,
        currentRecordEligible: false,
      },
    });
    expect(
      transport?.productionLedger.variants[0].physicalEvidence.rawSourceLine,
    ).toBe("aalborg AO1 L B AO0 R G # place, danish");
  });

  it("preserves ambiguous production variants without selecting a winner", () => {
    const transport = projectCmuDictBridgeDiscoveryTransportV0_1(bridge("read"));
    expect(transport).toMatchObject({
      bridgeStatus: "BLOCKED_BY_MISSING_AUTHORITY",
      bridgeReason: "BRIDGE_VARIANT_POLICY_UNRESOLVED",
    });
    expect(transport?.candidateLedger.variants).toHaveLength(2);
    expect(transport?.productionLedger.variants).toHaveLength(2);
    expect(keysDeep(transport)).not.toContain("winner");
  });

  it("preserves duplicate physical records, order, identity, and zero record loss", () => {
    const transport = projectCmuDictBridgeDiscoveryTransportV0_1(
      bridge("mormonism"),
    );
    expect(transport?.units).toHaveLength(2);
    expect(transport?.units.map((unit) => unit.pair.pairIndex)).toEqual([0, 1]);
    expect(transport?.variantCardinality).toEqual({
      candidate: 2,
      production: 2,
      paired: 2,
      oneToOne: true,
      recordsLost: 0,
    });
    expect(
      transport?.units.map(
        (unit) => unit.pair.candidateVariant.sourceEvidence.sourceLineNumber,
      ),
    ).toEqual(
      transport?.units.map(
        (unit) => unit.pair.productionVariant.physicalEvidence.sourceLineNumber,
      ),
    );
  });

  it("preserves one moving source nucleus across two canonical Voice events", () => {
    const transport = projectCmuDictBridgeDiscoveryTransportV0_1(bridge("stone"));
    const pair = transport?.units[0].pair;
    expect(pair?.candidateVariant.nuclei).toHaveLength(1);
    expect(pair?.candidateVariant.canonicalVoicePath).toEqual(["O", "U"]);
    expect(pair?.productionVariant.nuclei).toHaveLength(1);
  });

  it("preserves exact candidate and production provenance without collapse", () => {
    const source = bridge();
    const transport = projectCmuDictBridgeDiscoveryTransportV0_1(source);
    expect(transport?.candidateLedger).toEqual(source.candidateLedger);
    expect(transport?.productionLedger).toEqual(source.productionLedger);
    expect(transport?.candidateGammaProjection).toEqual(
      source.candidateGammaProjection,
    );
    expect(transport?.candidateZcProjection).toEqual(source.candidateZcProjection);
  });

  it("emits no automatic gate, relation, semantic, historical, cross-language, or winner authority", () => {
    const transport = projectCmuDictBridgeDiscoveryTransportV0_1(bridge());
    const keys = keysDeep(transport);
    for (const forbidden of [
      "matchClassification",
      "presentationClassification",
      "voiceRelationship",
      "authorizedOperationIds",
      "expansionOrCompositionChain",
      "protoRoots",
      "targetSense",
      "reviewedFunctionalEvidence",
      "semanticInterpretation",
      "historicalRelation",
      "crossLanguageRelation",
      "winner",
      "rank",
      "sameRepresentation",
    ]) {
      expect(keys).not.toContain(forbidden);
    }
    const serialized = JSON.stringify(transport);
    expect(serialized).not.toContain("STRUCTURAL_MOTIVATION_CANDIDATE");
    expect(serialized).not.toContain("SAME_REPRESENTATION");
  });

  it("rejects unknown schema and unknown representation domain", () => {
    const unknownSchema = copy(bridge()) as unknown as Record<string, unknown>;
    unknownSchema.schemaVersion = "unknown";
    const unknownDomain = copy(bridge()) as unknown as Record<string, unknown>;
    unknownDomain.representationDomain = "unknown";
    expect(projectCmuDictBridgeDiscoveryTransportV0_1(unknownSchema)).toBeNull();
    expect(projectCmuDictBridgeDiscoveryTransportV0_1(unknownDomain)).toBeNull();
  });

  it("is deterministic and deeply frozen", () => {
    const first = projectCmuDictBridgeDiscoveryTransportV0_1(bridge());
    const second = projectCmuDictBridgeDiscoveryTransportV0_1(bridge());
    expect(second).toEqual(first);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first?.units)).toBe(true);
    expect(Object.isFrozen(first?.units[0])).toBe(true);
    expect(Object.isFrozen(first?.candidateLedger)).toBe(true);
    expect(Object.isFrozen(first?.productionLedger)).toBe(true);
  });
});
