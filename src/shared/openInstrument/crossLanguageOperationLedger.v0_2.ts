import { extractSevenVowelsFromString, type SevenVowel } from "@/shared/math7.core";

export const CROSS_LANGUAGE_OPERATION_LEDGER_SCHEMA_V0_2 =
  "open-instrument.cross-language-operation-ledger.v0_2" as const;

export const CROSS_LANGUAGE_OPERATION_DEFINITIONS_V0_2 = [
  {
    operationId: "IDENTITY.v0_1",
    kind: "IDENTITY",
    version: "0.1",
    positionUnit: "none",
    cost: 0,
  },
  {
    operationId: "TRANSPOSE_ADJACENT.v0_1",
    kind: "TRANSPOSE_ADJACENT",
    version: "0.1",
    positionUnit: "zero_based_unicode_code_point",
    cost: 1,
  },
  {
    operationId: "OMIT.v0_2",
    kind: "OMIT",
    version: "0.2",
    positionUnit: "zero_based_unicode_code_point",
    cost: 1,
    removedCodePointsPerApplication: 1,
  },
] as const;

export type CrossLanguageOperationIdV0_2 =
  (typeof CROSS_LANGUAGE_OPERATION_DEFINITIONS_V0_2)[number]["operationId"];

export type CrossLanguageOperationApplicationInputV0_2 =
  | Readonly<{
      applicationId: string;
      operationId: "IDENTITY.v0_1";
      positions: readonly [];
    }>
  | Readonly<{
      applicationId: string;
      operationId: "TRANSPOSE_ADJACENT.v0_1";
      positions: readonly number[];
    }>
  | Readonly<{
      applicationId: string;
      operationId: "OMIT.v0_2";
      position: number;
      expectedRemovedText: string;
    }>;

export type CrossLanguageOperationVoiceEventV0_2 = Readonly<{
  voice: SevenVowel;
  sourceCharacter: string;
  position: number;
  sourceSpan: Readonly<{ start: number; end: number }>;
}>;

type VoiceProjection = Readonly<{
  status: "COMPLETE" | "UNKNOWN_OR_NULL";
  path: readonly SevenVowel[];
  events: readonly CrossLanguageOperationVoiceEventV0_2[];
  unresolvedReason: string | null;
}>;

export type CrossLanguageOperationApplicationV0_2 = Readonly<{
  applicationId: string;
  sequence: number;
  operationId: CrossLanguageOperationIdV0_2;
  kind: "IDENTITY" | "TRANSPOSE_ADJACENT" | "OMIT";
  positions: readonly number[];
  before: string;
  after: string | null;
  cost: number;
  status: "APPLIED" | "REJECTED" | "NOT_RUN";
  reasonCodes: readonly string[];
  writtenVoicesBefore: VoiceProjection;
  writtenVoicesAfter: VoiceProjection | null;
  voiceConservation: "PRESERVED" | "CHANGED" | "UNKNOWN_OR_NULL";
  removedText: string | null;
  removedSpan: Readonly<{ start: number; end: number }> | null;
  originalInputSpan: Readonly<{ start: number; end: number }> | null;
  omittedVoiceEvents: readonly (CrossLanguageOperationVoiceEventV0_2 & Readonly<{
    originalInputSpan: Readonly<{ start: number; end: number }>;
  }>)[];
  inverse: Readonly<{
    kind: "IDENTITY" | "TRANSPOSE_ADJACENT" | "REINSERT_REMOVED_TEXT";
    positions: readonly number[];
    text: string | null;
  }> | null;
}>;

export type CrossLanguageOperationLedgerV0_2 = Readonly<{
  schemaVersion: typeof CROSS_LANGUAGE_OPERATION_LEDGER_SCHEMA_V0_2;
  replayStatus: "APPLIED" | "REJECTED";
  initialForm: string;
  declaredFinalForm: string;
  replayedFinalForm: string;
  mechanicalReconstructionStatus: "EXACT_MATCH" | "MISMATCH" | "NOT_RUN";
  positionUnit: "zero_based_unicode_code_point";
  spanConvention: "half_open";
  operations: readonly CrossLanguageOperationApplicationV0_2[];
  operationCount: number;
  totalCost: number;
  initialWrittenVoices: VoiceProjection;
  finalWrittenVoices: VoiceProjection;
  voiceConservation: "PRESERVED" | "CHANGED" | "UNKNOWN_OR_NULL";
  omittedCanonicalVoices: readonly SevenVowel[];
  omittedVoiceEvents: readonly (CrossLanguageOperationVoiceEventV0_2 & Readonly<{
    originalInputSpan: Readonly<{ start: number; end: number }>;
  }>)[];
  inverseReplay: Readonly<{
    status: "EXACT_MATCH" | "MISMATCH" | "NOT_RUN";
    reconstructedInitialForm: string | null;
    applications: readonly Readonly<{
      applicationId: string;
      kind: "IDENTITY" | "TRANSPOSE_ADJACENT" | "REINSERT_REMOVED_TEXT";
      before: string;
      after: string | null;
      positions: readonly number[];
      text: string | null;
      status: "APPLIED" | "REJECTED";
      reasonCodes: readonly string[];
    }>[];
  }>;
  relationship: Readonly<{
    text: string | null;
    status: "USER_PROPOSED" | "UNKNOWN_OR_NULL";
    evidenceStatus: "CITATION_ENTERED_UNVERIFIED" | "UNKNOWN_OR_NULL";
    evidenceReference: string | null;
    authority: "USER_DECLARED_UNVERIFIED";
    linguisticApplicabilityStatus: "NOT_ASSESSED";
    sourceAuthorityPromotion: "NONE";
  }>;
  selection: Readonly<{
    mode: "no_single_winner";
    selectedCandidateId: null;
    userDecisionPosture: "user_decides";
  }>;
}>;

export type BuildCrossLanguageOperationLedgerResultV0_2 =
  | Readonly<{ status: "READY"; ledger: CrossLanguageOperationLedgerV0_2 }>
  | Readonly<{
      status: "REJECTED";
      ledger: CrossLanguageOperationLedgerV0_2;
      reasonCodes: readonly string[];
    }>
  | Readonly<{ status: "INVALID"; reasonCodes: readonly string[] }>;

export type CrossLanguageOperationLedgerInputV0_2 = Readonly<{
  initialForm: string;
  declaredFinalForm: string;
  operations: readonly CrossLanguageOperationApplicationInputV0_2[];
  proposedRelationship: string;
  evidenceReference: string;
}>;

type RecordValue = Record<string, unknown>;

function isRecord(value: unknown): value is RecordValue {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isExactToken(value: unknown, maxCodePoints = 80): value is string {
  return typeof value === "string" && value.trim().length > 0 &&
    !/\s/u.test(value) && Array.from(value).length <= maxCodePoints;
}

function isCombiningMark(value: string | undefined): boolean {
  return value !== undefined && /^\p{M}$/u.test(value);
}

function projectWrittenVoices(form: string): VoiceProjection {
  const characters = Array.from(form);
  if (!characters.every((character) => /^[A-Za-zÇçËë]$/u.test(character))) {
    return {
      status: "UNKNOWN_OR_NULL",
      path: [],
      events: [],
      unresolvedReason: "ORTHOGRAPHY_NOT_SUPPORTED_BY_CANONICAL_WRITTEN_VOICE_PROJECTION",
    };
  }
  const events = characters.flatMap((character, position) => {
    const voice = extractSevenVowelsFromString(character)[0];
    return voice ? [{
      voice,
      sourceCharacter: character,
      position,
      sourceSpan: { start: position, end: position + 1 },
    }] : [];
  });
  return {
    status: "COMPLETE",
    path: events.map((event) => event.voice),
    events,
    unresolvedReason: null,
  };
}

function validateApplication(value: unknown, index: number): string[] {
  const prefix = `APPLICATION_${index + 1}`;
  if (!isRecord(value)) return [`${prefix}_MALFORMED`];
  const reasons: string[] = [];
  if (typeof value.applicationId !== "string" || !value.applicationId.trim() || value.applicationId.length > 100) {
    reasons.push(`${prefix}_ID_REQUIRED`);
  }
  if (value.operationId === "IDENTITY.v0_1") {
    if (!Array.isArray(value.positions) || value.positions.length !== 0) reasons.push(`${prefix}_IDENTITY_TAKES_NO_POSITIONS`);
  } else if (value.operationId === "TRANSPOSE_ADJACENT.v0_1") {
    if (!Array.isArray(value.positions) || value.positions.length !== 2 || !value.positions.every(Number.isInteger)) {
      reasons.push(`${prefix}_TWO_INTEGER_CODE_POINT_POSITIONS_REQUIRED`);
    } else if ((value.positions[1] as number) !== (value.positions[0] as number) + 1) {
      reasons.push(`${prefix}_POSITIONS_MUST_BE_ADJACENT_AND_ORDERED`);
    }
  } else if (value.operationId === "OMIT.v0_2") {
    if (!Number.isInteger(value.position)) reasons.push(`${prefix}_INTEGER_CODE_POINT_POSITION_REQUIRED`);
    if (typeof value.expectedRemovedText !== "string" || Array.from(value.expectedRemovedText).length !== 1) {
      reasons.push(`${prefix}_EXACTLY_ONE_EXPECTED_CODE_POINT_REQUIRED`);
    }
  } else {
    reasons.push(`${prefix}_OPERATION_UNSUPPORTED`);
  }
  return reasons;
}

function voiceConservation(before: VoiceProjection, after: VoiceProjection | null): "PRESERVED" | "CHANGED" | "UNKNOWN_OR_NULL" {
  if (!after || before.status !== "COMPLETE" || after.status !== "COMPLETE") return "UNKNOWN_OR_NULL";
  return JSON.stringify(before.path) === JSON.stringify(after.path) ? "PRESERVED" : "CHANGED";
}

function invalid(reasonCodes: readonly string[]): BuildCrossLanguageOperationLedgerResultV0_2 {
  return { status: "INVALID", reasonCodes: [...new Set(reasonCodes)] };
}

export function buildCrossLanguageOperationLedgerV0_2(
  value: CrossLanguageOperationLedgerInputV0_2,
): BuildCrossLanguageOperationLedgerResultV0_2 {
  if (!isRecord(value)) return invalid(["INPUT_MUST_BE_OBJECT"]);
  const rootReasons: string[] = [];
  if (!isExactToken(value.initialForm)) rootReasons.push("INITIAL_FORM_MUST_BE_ONE_EXACT_TOKEN_UP_TO_80_CODE_POINTS");
  if (!isExactToken(value.declaredFinalForm)) rootReasons.push("DECLARED_FINAL_FORM_MUST_BE_ONE_EXACT_TOKEN_UP_TO_80_CODE_POINTS");
  if (!Array.isArray(value.operations) || value.operations.length > 8) rootReasons.push("ZERO_TO_EIGHT_OPERATIONS_REQUIRED");
  if (typeof value.proposedRelationship !== "string" || value.proposedRelationship.length > 1000) rootReasons.push("PROPOSED_RELATIONSHIP_MALFORMED");
  if (typeof value.evidenceReference !== "string" || value.evidenceReference.length > 1000) rootReasons.push("EVIDENCE_REFERENCE_MALFORMED");
  if (Array.isArray(value.operations)) {
    const ids = new Set<string>();
    value.operations.forEach((operation, index) => {
      rootReasons.push(...validateApplication(operation, index));
      if (isRecord(operation) && typeof operation.applicationId === "string") {
        if (ids.has(operation.applicationId)) rootReasons.push(`APPLICATION_${index + 1}_ID_DUPLICATED`);
        ids.add(operation.applicationId);
      }
    });
  }
  if (rootReasons.length) return invalid(rootReasons);

  const applications: CrossLanguageOperationApplicationV0_2[] = [];
  const omittedEvents: Array<CrossLanguageOperationVoiceEventV0_2 & { originalInputSpan: { start: number; end: number } }> = [];
  const characters = Array.from(value.initialForm);
  const originalPositions = characters.map((_, index) => index);
  let current = value.initialForm;
  let rejected = false;

  for (const [index, application] of value.operations.entries()) {
    const before = current;
    const beforeVoices = projectWrittenVoices(before);
    if (rejected) {
      const kind = application.operationId === "IDENTITY.v0_1"
        ? "IDENTITY"
        : application.operationId === "TRANSPOSE_ADJACENT.v0_1" ? "TRANSPOSE_ADJACENT" : "OMIT";
      const positions = application.operationId === "OMIT.v0_2"
        ? [application.position]
        : application.operationId === "TRANSPOSE_ADJACENT.v0_1" ? [...application.positions] : [];
      applications.push({
        applicationId: application.applicationId,
        sequence: index + 1,
        operationId: application.operationId,
        kind,
        positions,
        before,
        after: null,
        cost: application.operationId === "IDENTITY.v0_1" ? 0 : 1,
        status: "NOT_RUN",
        reasonCodes: ["PREVIOUS_APPLICATION_REJECTED"],
        writtenVoicesBefore: beforeVoices,
        writtenVoicesAfter: null,
        voiceConservation: "UNKNOWN_OR_NULL",
        removedText: null,
        removedSpan: null,
        originalInputSpan: null,
        omittedVoiceEvents: [],
        inverse: null,
      });
      continue;
    }
    const reasonCodes: string[] = [];
    let after: string | null = null;
    let positions: number[] = [];
    let cost = 0;
    let removedText: string | null = null;
    let removedSpan: { start: number; end: number } | null = null;
    let originalInputSpan: { start: number; end: number } | null = null;
    let removedVoiceEvents: Array<CrossLanguageOperationVoiceEventV0_2 & { originalInputSpan: { start: number; end: number } }> = [];
    let inverse: CrossLanguageOperationApplicationV0_2["inverse"] = null;
    let kind: CrossLanguageOperationApplicationV0_2["kind"];

    if (application.operationId === "IDENTITY.v0_1") {
      kind = "IDENTITY";
      after = before;
      inverse = { kind: "IDENTITY", positions: [], text: null };
    } else if (application.operationId === "TRANSPOSE_ADJACENT.v0_1") {
      kind = "TRANSPOSE_ADJACENT";
      positions = [...application.positions];
      cost = 1;
      const [left, right] = positions;
      const currentCharacters = Array.from(before);
      if (left === undefined || right === undefined || left < 0 || right >= currentCharacters.length) {
        reasonCodes.push("TRANSPOSE_POSITION_OUT_OF_RANGE");
      } else if ([currentCharacters[left], currentCharacters[right], currentCharacters[left - 1], currentCharacters[right + 1]].some(isCombiningMark)) {
        reasonCodes.push("TRANSPOSE_WOULD_SPLIT_UNICODE_COMBINING_SEQUENCE");
      } else {
        [currentCharacters[left], currentCharacters[right]] = [currentCharacters[right]!, currentCharacters[left]!];
        [originalPositions[left], originalPositions[right]] = [originalPositions[right]!, originalPositions[left]!];
        after = currentCharacters.join("");
        inverse = { kind: "TRANSPOSE_ADJACENT", positions, text: null };
      }
    } else {
      kind = "OMIT";
      positions = [application.position];
      cost = 1;
      const currentCharacters = Array.from(before);
      const position = application.position;
      if (position < 0 || position >= currentCharacters.length) {
        reasonCodes.push("OMIT_POSITION_OUT_OF_RANGE");
      } else if (currentCharacters[position] !== application.expectedRemovedText) {
        reasonCodes.push("OMIT_EXPECTED_TEXT_MISMATCH");
      } else if (isCombiningMark(currentCharacters[position]) || isCombiningMark(currentCharacters[position + 1])) {
        reasonCodes.push("OMIT_WOULD_SPLIT_UNICODE_COMBINING_SEQUENCE");
      } else {
        removedText = currentCharacters[position]!;
        removedSpan = { start: position, end: position + 1 };
        const originalPosition = originalPositions[position];
        if (originalPosition !== undefined) originalInputSpan = { start: originalPosition, end: originalPosition + 1 };
        removedVoiceEvents = beforeVoices.events.flatMap((event) => {
          if (event.position !== position || !originalInputSpan) return [];
          return [{ ...event, originalInputSpan }];
        });
        currentCharacters.splice(position, 1);
        originalPositions.splice(position, 1);
        after = currentCharacters.join("");
        inverse = { kind: "REINSERT_REMOVED_TEXT", positions: [position], text: removedText };
      }
    }

    if (reasonCodes.length || after === null) {
      rejected = true;
      applications.push({
        applicationId: application.applicationId,
        sequence: index + 1,
        operationId: application.operationId,
        kind,
        positions,
        before,
        after: null,
        cost,
        status: "REJECTED",
        reasonCodes: reasonCodes.length ? reasonCodes : ["OPERATION_COULD_NOT_BE_APPLIED"],
        writtenVoicesBefore: beforeVoices,
        writtenVoicesAfter: null,
        voiceConservation: "UNKNOWN_OR_NULL",
        removedText: null,
        removedSpan: null,
        originalInputSpan: null,
        omittedVoiceEvents: [],
        inverse: null,
      });
      continue;
    }

    const afterVoices = projectWrittenVoices(after);
    omittedEvents.push(...removedVoiceEvents);
    applications.push({
      applicationId: application.applicationId,
      sequence: index + 1,
      operationId: application.operationId,
      kind,
      positions,
      before,
      after,
      cost,
      status: "APPLIED",
      reasonCodes: [],
      writtenVoicesBefore: beforeVoices,
      writtenVoicesAfter: afterVoices,
      voiceConservation: voiceConservation(beforeVoices, afterVoices),
      removedText,
      removedSpan,
      originalInputSpan,
      omittedVoiceEvents: removedVoiceEvents,
      inverse,
    });
    current = after;
  }

  const initialVoices = projectWrittenVoices(value.initialForm);
  const finalVoices = projectWrittenVoices(current);
  const operationCount = applications.filter((application) => application.status === "APPLIED").length;
  const totalCost = applications.filter((application) => application.status === "APPLIED")
    .reduce((sum, application) => sum + application.cost, 0);

  const inverseApplications: Array<{
    applicationId: string;
    kind: "IDENTITY" | "TRANSPOSE_ADJACENT" | "REINSERT_REMOVED_TEXT";
    before: string;
    after: string | null;
    positions: number[];
    text: string | null;
    status: "APPLIED" | "REJECTED";
    reasonCodes: string[];
  }> = [];
  let reverseCurrent = current;
  let inverseRejected = false;
  if (!rejected) {
    for (const application of [...applications].reverse()) {
      const before = reverseCurrent;
      const reasonCodes: string[] = [];
      let after: string | null = null;
      const inverse = application.inverse;
      if (!inverse || application.after !== before) {
        reasonCodes.push("INVERSE_INPUT_FORM_MISMATCH");
      } else if (inverse.kind === "IDENTITY") {
        after = before;
      } else if (inverse.kind === "TRANSPOSE_ADJACENT") {
        const chars = Array.from(before);
        const [left, right] = inverse.positions;
        if (left === undefined || right === undefined || left < 0 || right >= chars.length) {
          reasonCodes.push("INVERSE_TRANSPOSE_POSITION_OUT_OF_RANGE");
        } else if ([chars[left], chars[right], chars[left - 1], chars[right + 1]].some(isCombiningMark)) {
          reasonCodes.push("INVERSE_TRANSPOSE_WOULD_SPLIT_UNICODE_COMBINING_SEQUENCE");
        } else {
          [chars[left], chars[right]] = [chars[right]!, chars[left]!];
          after = chars.join("");
        }
      } else {
        const chars = Array.from(before);
        const position = inverse.positions[0];
        if (position === undefined || position < 0 || position > chars.length) {
          reasonCodes.push("INVERSE_INSERT_POSITION_OUT_OF_RANGE");
        } else if (isCombiningMark(chars[position])) {
          reasonCodes.push("INVERSE_INSERT_WOULD_SPLIT_UNICODE_COMBINING_SEQUENCE");
        } else {
          chars.splice(position, 0, inverse.text ?? "");
          after = chars.join("");
        }
      }
      if (reasonCodes.length || after === null) {
        inverseRejected = true;
        inverseApplications.push({
          applicationId: application.applicationId,
          kind: inverse?.kind ?? "IDENTITY",
          before,
          after: null,
          positions: [...(inverse?.positions ?? [])],
          text: inverse?.text ?? null,
          status: "REJECTED",
          reasonCodes: reasonCodes.length ? reasonCodes : ["INVERSE_COULD_NOT_BE_APPLIED"],
        });
        break;
      }
      inverseApplications.push({
        applicationId: application.applicationId,
        kind: inverse?.kind ?? "IDENTITY",
        before,
        after,
        positions: [...(inverse?.positions ?? [])],
        text: inverse?.text ?? null,
        status: "APPLIED",
        reasonCodes: [],
      });
      reverseCurrent = after;
    }
  }
  const inverseStatus = rejected
    ? "NOT_RUN" as const
    : !inverseRejected && reverseCurrent === value.initialForm ? "EXACT_MATCH" as const : "MISMATCH" as const;
  const ledger: CrossLanguageOperationLedgerV0_2 = {
    schemaVersion: CROSS_LANGUAGE_OPERATION_LEDGER_SCHEMA_V0_2,
    replayStatus: rejected ? "REJECTED" : "APPLIED",
    initialForm: value.initialForm,
    declaredFinalForm: value.declaredFinalForm,
    replayedFinalForm: current,
    mechanicalReconstructionStatus: rejected ? "NOT_RUN" : current === value.declaredFinalForm ? "EXACT_MATCH" : "MISMATCH",
    positionUnit: "zero_based_unicode_code_point",
    spanConvention: "half_open",
    operations: applications,
    operationCount,
    totalCost,
    initialWrittenVoices: initialVoices,
    finalWrittenVoices: finalVoices,
    voiceConservation: rejected ? "UNKNOWN_OR_NULL" : voiceConservation(initialVoices, finalVoices),
    omittedCanonicalVoices: [...new Set(omittedEvents.map((event) => event.voice))],
    omittedVoiceEvents: omittedEvents,
    inverseReplay: {
      status: inverseStatus,
      reconstructedInitialForm: inverseStatus === "NOT_RUN" ? null : reverseCurrent,
      applications: inverseApplications,
    },
    relationship: {
      text: value.proposedRelationship.trim() || null,
      status: value.proposedRelationship.trim() ? "USER_PROPOSED" : "UNKNOWN_OR_NULL",
      evidenceStatus: value.evidenceReference.trim() ? "CITATION_ENTERED_UNVERIFIED" : "UNKNOWN_OR_NULL",
      evidenceReference: value.evidenceReference.trim() || null,
      authority: "USER_DECLARED_UNVERIFIED",
      linguisticApplicabilityStatus: "NOT_ASSESSED",
      sourceAuthorityPromotion: "NONE",
    },
    selection: {
      mode: "no_single_winner",
      selectedCandidateId: null,
      userDecisionPosture: "user_decides",
    },
  };

  return rejected
    ? {
        status: "REJECTED",
        ledger,
        reasonCodes: applications.filter((application) => application.status === "REJECTED")
          .flatMap((application) => application.reasonCodes),
      }
    : { status: "READY", ledger };
}
