# Zheji Generalization Heart Extraction Semantics Audit v0.1

Status: EXTRACTION_MIXED.

Project lane: Open Instrument / ZËRO.

Audit date: 2026-06-20.

Audited base:

* Short SHA: `373ff8e2`
* Full SHA: `373ff8e2c05931b27e103992752380100f009b3b`

Prerequisite design:

* `docs/open-instrument/zheji-generalization-verification-extraction-audit-v0.1.md`
* `docs/open-instrument/reviews/zheji-generalization-verification-extraction-audit-design-review-v0.1.md`

## Audit decision

Heart extraction semantics are classified as:

`EXTRACTION_MIXED`

This audit is docs-only.

This audit does not select the final second word.

This audit does not replay Zheji.

This audit does not modify source behavior.

This audit does not authorize runtime/API/UI/provider/model-switch work.

## Method

The audit inspected source, tests, docs, and scripts for:

* `surfaceVowels`
* `functionalVowelPath`
* `voicePath`
* `vowelPath`
* vowel extraction logic
* input normalization logic
* phonetic / IPA / pronunciation references
* audio / spectrogram / formant references

The audit used source-discovery output captured during the PR script.

## Evidence summary

Extraction evidence file generated during audit:

* `/tmp/zero_heart_extraction_semantics_evidence_v0_1.txt`

Source snapshot generated during audit:

* `/tmp/zero_heart_extraction_semantics_source_snapshot_v0_1.txt`

The generated evidence classified the extraction status as:

`EXTRACTION_MIXED`

The evidence reason was:

Extraction-relevant source lines include both written vowel operations and phonetic/IPA/pronunciation references.

## Evidence excerpt

```text
status=EXTRACTION_MIXED
reason=Extraction-relevant source lines include both written vowel operations and phonetic/IPA/pronunciation references.
has_general_phonetic_elsewhere=True

=== extraction-relevant evidence lines ===
373ff8e2 373ff8e2c05931b27e103992752380100f009b3b docs(open-instrument): review Zheji generalization verification extraction audit design v0.1
docs/milestones/PHONETIC_VOWEL_MAPPER_v0.1_DONE.md
docs/milestones/UNIVERSAL_VOWEL_MAPPER_v0.1_DONE.md
docs/open-instrument/local-provider-smoke-vowelpath-v0.2-plan.md
docs/open-instrument/reviews/zheji-generalization-verification-extraction-audit-design-review-v0.1.md
docs/open-instrument/zheji-generalization-verification-extraction-audit-v0.1.md
docs/papers/zero-cohort-01-vowel-bracket-battery-v0.1.md
scripts/scripts/print-seven-vowels.ts
src/core/sevenVowelsTraits.ts
src/lib/sevenVowelsCore.ts
src/shared/validation/extractFeatures.v0.1.ts
src/shared/validation/extractFeatures.v0.2.ts
src/shared/vowels/extractCarrierVoicesFromIpa.v0.1.ts
src/shared/vowels/extractCarrierVoicesFromZhuyin.v0.1.ts
src/shared/vowels/extractOrthographyVoicesFromWord.v0.1.ts
src/shared/vowels/extractZhuyinSignal.v0.1.ts
src/shared/vowels/ipaVowelMap.v0.1.ts
src/shared/vowels/ipaVowelMap.v0.2.ts
src/shared/vowels/mapVowels.v0.1.ts
src/shared/vowels/mapVowels.v0.2.ts
src/shared/vowels/parseIpaVowels.v0.1.ts
src/shared/vowels/parseIpaVowels.v0.2.ts
src/shared/vowels/vowelMap.baseGreek.v0.2.ts
src/shared/vowels/vowelMap.baseLatin.v0.1.ts
src/shared/vowels/vowelMap.registry.v0.1.ts
src/shared/vowels/vowelMap.registry.v0.2.ts
src/shared/vowels/vowelVoices.v0.1.ts
src/ui/instrument/voicePathPicker.ts
tests/audit/vowelNumericMapping.audit.v0.1.2.spec.ts
tests/sevenVowelsCore.spec.ts
tests/validation/extractFeatures.smoke.v0.1.spec.ts
tests/verifier/rootHasVowel.v0.1.spec.ts
tests/voicePathPicker.precedence.spec.ts
tests/vowels.turkish.langhint.y-consonant.v0.1.spec.ts
tests/vowels.turkish.orthography.v0.1.spec.ts
tests/vowels/__snapshots__/extractCarrierVoicesFromIpa.v0.1.lock.spec.ts.snap
tests/vowels/__snapshots__/ipaVowelMap.v0.1.lock.spec.ts.snap
tests/vowels/__snapshots__/ipaVowelMap.v0.2.lock.spec.ts.snap
tests/vowels/__snapshots__/mapVowels.v0.2.lock.spec.ts.snap
tests/vowels/__snapshots__/vowelMap.baseGreek.v0.2.lock.spec.ts.snap
tests/vowels/__snapshots__/vowelMap.baseLatin.v0.1.lock.spec.ts.snap
tests/vowels/__snapshots__/vowelMap.registry.v0.2.lock.spec.ts.snap
tests/vowels/extractCarrierVoicesFromIpa.v0.1.lock.spec.ts
tests/vowels/extractCarrierVoicesFromIpa.v0.1.spec.ts
tests/vowels/extractCarrierVoicesFromZhuyin.v0.1.spec.ts
tests/vowels/extractOrthographyVoicesFromWord.v0.1.lock.spec.ts
tests/vowels/extractOrthographyVoicesFromWord.v0.1.spec.ts
tests/vowels/extractToneFromZhuyin.v0.1.spec.ts
tests/vowels/extractZhuyinSignal.v0.1.spec.ts
tests/vowels/ipaVowelMap.v0.1.lock.spec.ts
tests/vowels/ipaVowelMap.v0.2.lock.spec.ts
tests/vowels/mapVowels.v0.1.spec.ts
tests/vowels/mapVowels.v0.2.lock.spec.ts
tests/vowels/mapVowels.v0.2.spec.ts
tests/vowels/onlySevenVoices.guard.v0.1.spec.ts
tests/vowels/orthographySsot.guard.v0.1.spec.ts
tests/vowels/parseIpaVowels.v0.1.spec.ts
tests/vowels/parseIpaVowels.v0.2.spec.ts
tests/vowels/phoneticIpaSsot.guard.v0.1.spec.ts
tests/vowels/phoneticOnlySevenVoices.guard.v0.1.spec.ts
tests/vowels/vowelMap.baseGreek.v0.2.lock.spec.ts
tests/vowels/vowelMap.baseLatin.v0.1.lock.spec.ts
tests/vowels/vowelMap.registry.v0.2.lock.spec.ts
tests/vowels/zhuyinMap.v0.1.lock.spec.ts
src/engine/analyzeWordV1.ts:62:function voicePathRawFromMath7Path(path: VoicePath | null | undefined): string {
src/engine/analyzeWordV1.ts:103:  const voicePathRaw = voicePathRawFromMath7Path(math7_summary?.path ?? null);
src/engine/analyzeWordV1.ts:105:    voicePathRaw.length === 0 ? null : runSevenVoicesStressTestV1({ word: input, voicePathRaw });
src/engine/wordMatrix.ts:13:      voicePath: "Unity → > Insight",
src/engine/wordMatrix.ts:22:        voicePath: "U → I",
src/engine/wordMatrix.ts:29:        voicePath: "U → I",
src/engine/wordMatrix.ts:37:      voicePath: "",
src/engine/wordMatrix.ts:46:      voicePath: "Truth → > Truth",
src/engine/wordMatrix.ts:55:        voicePath: "A → A",
src/engine/wordMatrix.ts:62:        voicePath: "Ë",
src/engine/wordMatrix.ts:70:      voicePath: "",
src/engine/zhejiLens.ts:48: * Centripetal vowels decrease score, Centrifugal increase, Neutral = 0.
src/engine/zhejiLens.ts:51:  vowelPath: Vowel[],
src/engine/zhejiLens.ts:56:  for (const v of vowelPath) {
src/engine/zhejiLens.ts:74:  vowelPath: Vowel[],
src/engine/zhejiLens.ts:77:  if (vowelPath.length < 2) return [];
src/engine/zhejiLens.ts:80:  for (let i = 0; i < vowelPath.length - 1; i++) {
src/engine/zhejiLens.ts:81:    const v1 = vowelPath[i];
src/engine/zhejiLens.ts:82:    const v2 = vowelPath[i + 1];
src/engine/zhejiLens.ts:122:  vowelPath: Vowel[],
src/engine/zhejiLens.ts:125:  if (!vowelPath.length) {
src/engine/zhejiLens.ts:129:  const startTrait = traits[vowelPath[0]];
src/engine/zhejiLens.ts:130:  const endTrait = traits[vowelPath[vowelPath.length - 1]];
src/engine/zhejiLens.ts:132:    vowelPath.length > 2 ? traits[vowelPath[1]] : undefined;
src/engine/zhejiLens.ts:167:  vowelPath: Vowel[],
src/engine/zhejiLens.ts:170:  const v = vowelPath.join("");
src/engine/analyzeWord.ts:13: *  - Do NOT change field names or types (e.g. keep primaryPath.voicePath as string[]).
src/engine/analyzeWord.ts:151:        voicePath: (c.voices?.voiceSequence || []).join(" → "),
src/engine/analyzeWord.ts:217:      voicePath: join(withCanon.primaryPath.voicePath),
src/engine/analyzeWord.ts:228:      voicePath: join(alt.voicePath),
src/engine/mindAnalyzer.ts:95:  // Seven vowels (treat y as vowel; include ë)
src/engine/mindAnalyzer.ts:96:  const vowels = new Set(["a","e","i","o","u","y","ë"]);
src/engine/mindAnalyzer.ts:111:    if (vowels.has(ch)) continue;
src/engine/math7.ts:28:  basis?: string;           // sanitized basis used to derive vowels (not spelling)
src/engine/math7.ts:29:  vowels?: SevenVowel[];    // extracted 7-vowels
src/engine/math7.ts:55: * Internal helper: normalize any vowel-ish inputs to canonical SevenVowel[].
src/engine/math7.ts:57:function normalizeSevenVowels(vowelsIn: Array<string | null | undefined>): SevenVowel[] {
src/engine/math7.ts:58:  return vowelsIn
src/engine/math7.ts:77:  vowelsIn: Array<string | null | undefined>,
src/engine/math7.ts:80:  const vowels = normalizeSevenVowels(vowelsIn);
src/engine/math7.ts:82:  const principlesPath = vowels.map((v) => PRINCIPLE_MAP[v] ?? v);
src/engine/math7.ts:85:  const totalMod7 = totalMod7FromVowels(vowels);
src/engine/math7.ts:89:    vowels.length > 0 && vowels[vowels.length - 1] === "Ë" ? "closed" : "open";
src/engine/math7.ts:92:  const indices0to6 = vowels.map((v) => VOWEL_INDEX[v]);
src/engine/math7.ts:105:    vowels,
src/engine/math7.ts:124: * IMPORTANT: we intentionally use the payload's vowelPath (if present),
src/engine/math7.ts:128:  const { basis, vowels } = extractMath7BasisFromPayload(payload);
src/engine/math7.ts:129:  const hinted = applyStrictTerminalYHint(payload, vowels);
src/engine/patterns/mediatorAxisPair.ts:28:function vowelsOf(word: string): string[] {
src/engine/patterns/mediatorAxisPair.ts:59:  const vs = vowelsOf(word);
docs/MILESTONES.md:93:The per-candidate DeepRoot–Heart gate could incorrectly report `aligned` by falling back to a global DeepRoot path (e.g. `deepRoot.functionalRoots[0].vowelPath`) when a candidate’s own `vowelPath` was missing or different. This breaks the “instrument truth” principle: a candidate gate must describe *that candidate’s evidence only*.
docs/MILESTONES.md:98:- `candidateResolvedPath` is derived from `candidates[i].vowelPath` only.
docs/MILESTONES.md:99:- If `candidates[i].vowelPath` is missing → gate must surface `insufficient_data` (no global fallback).
docs/MILESTONES.md:101:  - `candidates[i].vowelPath` if present
docs/MILESTONES.md:103:- DeepRoot global path (`deepRoot.functionalRoots[0].vowelPath`) is **not allowed** as a fallback for candidate gating.
docs/UI_TELEMETRY_CONTRACT_v0.1_DONE.md:58:  - `primaryPath.voicePath`
src/functions/sevenVoicesC.ts:11:  return u === "Ë" ? "Ë" : VOWELS.includes(u as any) ? (u as Vowel) : null;
src/functions/sevenVoicesC.ts:40:export function normalizeTerminalY(seq: Vowel[], rawWord: string): Vowel[] {
src/functions/sevenVoicesC.ts:54:export function computeC(voicePath: Vowel[], consClasses: CClass[], RING: Record<Vowel, number>): number {
src/functions/sevenVoicesC.ts:56:  const hops = Math.max(0, voicePath.length - 1);
src/functions/sevenVoicesC.ts:59:    const d = Math.abs(RING[voicePath[i + 1]] - RING[voicePath[i]]);
src/functions/sevenVoicesC.ts:68: * Extract the raw substrings between the normalized base vowels.
src/functions/sevenVoicesC.ts:73:  // find indices of base vowels in raw string (first match per base slot)
scripts/eval-gold.ts:42:  const primaryVoicePath: string[] = result.primaryPath?.voicePath ?? [];
src/functions/sevenVoicesStressTest.ts:9:      vowels: (word.match(/[AEIOUYËaeiouyë]/g) ?? []).join(""),
src/functions/sevenVoicesCore.ts:13: *  - No pretty-printing (like turning voicePath arrays into strings) in here.
src/functions/sevenVoicesCore.ts:18:import { computeC, extractBase, normalizeTerminalY, readWindowsDebug, edgeBiasPenalty, type EdgeInfo } from "./sevenVoicesC";
src/functions/sevenVoicesCore.ts:38:  voicePath: Vowel[];
src/functions/sevenVoicesCore.ts:69:  const voicePath = seq;
src/functions/sevenVoicesCore.ts:71:    voicePath,
src/functions/sevenVoicesCore.ts:72:    ringPath: voicePath.map((v) => RING[v]),
src/functions/sevenVoicesCore.ts:73:    levelPath: voicePath.map((v) => LVL[v]),
src/functions/sevenVoicesCore.ts:75:      V: checksumV(voicePath),
src/functions/sevenVoicesCore.ts:77:      C: computeC(voicePath, consClasses, RING),
src/functions/sevenVoicesCore.ts:79:    kept: keptCount(baseSeq, voicePath),
src/functions/sevenVoicesCore.ts:154:  return [E, ringPenalty(p.voicePath, RING), C, -p.kept];
src/functions/sevenVoicesCore.ts:197:    const uniqPaths = Array.from(new Map(paths.map(p => [p.voicePath.join(""), p])).values());
src/functions/sevenVoicesCore.ts:202:        if (p.voicePath.length > 1) {
src/functions/sevenVoicesCore.ts:204:                const dPrefix = Math.abs(RING[p.voicePath[1]] - RING[p.voicePath[0]]);
src/functions/sevenVoicesCore.ts:208:                const lastHopIdx = p.voicePath.length - 2;
src/functions/sevenVoicesCore.ts:209:                const dSuffix = Math.abs(RING[p.voicePath[lastHopIdx + 1]] - RING[p.voicePath[lastHopIdx]]);
src/functions/sevenVoicesCore.ts:219:        return preferClosureTie(p.voicePath, q.voicePath);
docs/milestones/UI_TELEMETRY_v0.1.2_FROZEN.md:26:## Milestone B — Auditable surface vs normalized vowels (DONE)
docs/milestones/UI_TELEMETRY_v0.1.2_FROZEN.md:30:- the functional (normalized) vowel path,
docs/milestones/UI_TELEMETRY_v0.1.2_FROZEN.md:35:- `evidence.surfaceVowels`: **true surface vowels** (source of truth: `heartInstrumentV1.surfaceVowels`)
docs/milestones/UI_TELEMETRY_v0.1.2_FROZEN.md:36:- `evidence.vowelPath`: **functional vowel path** (source of truth: `heart.math7.primary.vowels`)
docs/milestones/UI_TELEMETRY_v0.1.2_FROZEN.md:37:- `evidence.normalizationSteps`: deterministic proof records, emitted only when `surfaceVowels !== vowelPath`
docs/milestones/UI_TELEMETRY_v0.1.2_FROZEN.md:41:- `heartInstrumentV1.surfaceVowels = ["U","Y"]`
docs/milestones/UI_TELEMETRY_v0.1.2_FROZEN.md:42:- `evidence.surfaceVowels = ["U","Y"]`
docs/milestones/UI_TELEMETRY_v0.1.2_FROZEN.md:43:- `evidence.vowelPath = ["U","I"]`
docs/milestones/UI_TELEMETRY_v0.1.2_FROZEN.md:44:- `evidence.normalizationSteps = [{ op:"vowel_normalize", from:"UY", to:"UI", reason:"functional_equivalence" }]`
docs/milestones/UI_TELEMETRY_v0.1.2_FROZEN.md:50:  - `evidence.surfaceVowels === heartInstrumentV1.surfaceVowels`
docs/milestones/UI_TELEMETRY_v0.1.2_FROZEN.md:51:  - `evidence.vowelPath === ["U","I"]` for `study`
docs/milestones/milestone.geometry-eval-battery.v0.1.md:8:2) Noise rejection (no vowels => no carriers => geometry ∅)
docs/milestones/milestone.geometry-eval-battery.v0.1.md:18:- multiple representations of the same IPA return identical carrier extraction output (strict raw input rules apply).
docs/milestones/SEVEN_PRINCIPLES_NOTE_MAPPING_v0.1.md:30:- [ ] At least one unit test asserts the mapping for all 7 vowels.
scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs:24:  "surface_vowels",
docs/milestones/DEEProot_ROOTMAP_v0.1.md:40:- Also input (optional): **Heart primary path** (`heart.math7.primary.vowels` preferred; fallback `primaryPath.voicePath`).
docs/milestones/DEEProot_ROOTMAP_v0.1.md:59:  vowel_path?: string; // optional (if token contains vowels)
scripts/sweep.ts:54:        const pred = (out?.primaryPath?.voicePath||[]).join("→");
src/lib/runAnalysis.ts:40:        voicePath: [],
docs/milestones/UNIVERSAL_VOWEL_MAPPER_v0.1_DONE.md:15:- Mapper (SSOT): `src/shared/vowels/mapVowels.v0.2.ts`
docs/milestones/UNIVERSAL_VOWEL_MAPPER_v0.1_DONE.md:16:- Base Latin table (locked): `src/shared/vowels/vowelMap.baseLatin.v0.1.ts`
docs/milestones/UNIVERSAL_VOWEL_MAPPER_v0.1_DONE.md:17:- Base Greek table (v0.2): `src/shared/vowels/vowelMap.baseGreek.v0.2.ts`
docs/milestones/UNIVERSAL_VOWEL_MAPPER_v0.1_DONE.md:18:- Overrides registry (v0.2): `src/shared/vowels/vowelMap.registry.v0.2.ts`
docs/milestones/UNIVERSAL_VOWEL_MAPPER_v0.1_DONE.md:23:- Test: `tests/vowels/vowelMap.baseLatin.v0.1.lock.spec.ts`
docs/milestones/UNIVERSAL_VOWEL_MAPPER_v0.1_DONE.md:27:- Test: `tests/vowels/mapVowels.v0.2.spec.ts`
docs/milestones/UNIVERSAL_VOWEL_MAPPER_v0.1_DONE.md:35:  - `tests/vowels/mapVowels.v0.2.lock.spec.ts`
docs/milestones/UNIVERSAL_VOWEL_MAPPER_v0.1_DONE.md:36:  - `tests/vowels/vowelMap.baseGreek.v0.2.lock.spec.ts`
docs/milestones/UNIVERSAL_VOWEL_MAPPER_v0.1_DONE.md:37:  - `tests/vowels/vowelMap.registry.v0.2.lock.spec.ts`
docs/milestones/UNIVERSAL_VOWEL_MAPPER_v0.1_DONE.md:48:- `npm test -- tests/vowels/vowelMap.baseLatin.v0.1.lock.spec.ts tests/vowels/mapVowels.v0.2.spec.ts tests/vowels/mapVowels.v0.2.lock.spec.ts tests/vowels/vowelMap.baseGreek.v0.2.lock.spec.ts tests/vowels/vowelMap.registry.v0.2.lock.spec.ts tests/validation/dataset.lock.v0.2.spec.ts`
```

## Interpretation

If status is `EXTRACTION_ORTHOGRAPHIC`, future second-word selection may treat written vowel symbols as the tested Heart input.

If status is `EXTRACTION_PHONETIC`, future second-word selection must avoid diphthongs and must use clear pronunciation/IPA assumptions.

If status is `EXTRACTION_MIXED`, future second-word selection must explicitly say which stage is being tested.

The current status is:

`EXTRACTION_MIXED`

## Candidate implication

The prior design ranked candidates as:

1. `comic`
2. `limit`
3. `mind` deferred

This audit does not change that ranking by itself.

A later review must decide whether the audited extraction status is strong enough to choose a final second word.

## What remains unauthorized

This audit does not authorize:

* Zheji replay
* provider execution
* OpenAI execution
* remote endpoint execution
* localhost/Ollama execution
* model switching
* DeepSeek switching
* runtime wiring
* API output changes
* UI output changes
* package metadata changes
* CI changes
* evidence packs
* publication framing
* candidate-truth claims
* origin claims
* ownership claims
* model-quality claims
* VoiceLab work

## Validation proof

The audit ran:

* `node scripts/openInstrumentZhejiSemanticTransparencyValidation.v0.1.mjs`
* `npm test -- tests/openInstrument.zhejiSemanticTransparencyValidation.v0.1.spec.ts --runInBand`
* `npm run gate:quick`
* `git diff --check`
* exact changed-file proof

All passed before merge.

## Hard boundaries

Hard boundaries preserved:

* No provider execution.
* No Zheji replay.
* No runtime/API/UI behavior changes.
* No package metadata changes.
* No CI changes.
* No evidence promotion.
* No publication framing.
* No VoiceLab work.

## Current next task

`docs(open-instrument): review Heart extraction semantics audit for Zheji generalization v0.1`
