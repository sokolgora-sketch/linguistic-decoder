# Open Instrument Simple Functional Motivation V1

**Milestone ID:** `OPEN_INSTRUMENT_SIMPLE_FUNCTIONAL_MOTIVATION_V1`

**Status:** `DONE`

**Opened:** 2026-08-12

## 1. Purpose

Open Instrument must become simple enough that a normal user can type one
word and immediately understand the most useful functional-motivation result.

The primary product question is:

> Which living-language candidate can functionally motivate this word, what
> are its smallest meaningful embryos, and how do those embryos motivate the
> meaning or function of the word?

The Instrument must answer that question before exposing internal diagnostics.

This milestone is a product implementation milestone.

It is not a documentation-only, research-only, or architecture-only milestone.

This document is the single governing milestone document.

No additional design/review documentation lane is required unless actual
implementation uncovers a concrete blocker that cannot be resolved in code,
tests, evidence, or product behavior.

---

## 2. User promise

For a word such as `study`, the primary result should be immediately readable
as something close to:

### Functional motivation

**Language:** Albanian

**Candidate:** `SHTU + DI`

**SHTU** — add / increase / put-on

**DI** — know / knowledge

**How it can motivate "study":**

Adding or increasing knowledge; making knowledge yours through learning.

**Evidence:** Partial

- DI — reviewed functional evidence
- SHTU — structural evidence; review/runtime authorization still pending

The user should not need to understand internal gate architecture, provenance
enums, rank-group identifiers, OriginClaim machinery, or raw JSON to understand
the result.

---

## 3. Current baseline

At milestone opening, normal `/api/analyze-v1` analysis is deterministic.

The normal Analyze path does not currently use an LLM to discover candidates.

Current candidate production comes from deterministic engine logic, existing
candidate data, DeepRoot/RootMap structures, and reviewed runtime evidence.

An LLM proposer exists separately behind the optional
`Propose with Engine Oracle` diagnostic path.

That proposer is not currently the normal candidate-discovery path.

The milestone changes this.

---

## 4. Product result contract

The normal user-facing result must prioritize exactly these concepts:

1. candidate language;
2. functional candidate expression;
3. smallest meaningful embryos;
4. plain meaning of each embryo;
5. plain explanation of how the combination can motivate the input word;
6. simple evidence status.

Example:

`study`

→ Albanian

→ `SHTU + DI`

→ add/increase + know/knowledge

→ adding/increasing knowledge through learning

→ `Partial`

The normal result must not begin with internal evidence machinery.

---

## 5. Functional candidate model

A functional candidate may contain one embryo or multiple embryos.

Examples:

- `DI`
- `DA`
- `SHTU + DI`

A multi-embryo candidate is allowed to be useful before every component reaches
full reviewed status.

The evidence state must describe the truth honestly rather than hide the
candidate.

### User-facing evidence states

#### Reviewed

All required functional components used by the candidate are reviewed and
runtime-authorized for the claimed functional role.

#### Partial

The functional candidate is useful and structurally supported, but one or more
required components are not yet fully reviewed/runtime-authorized.

Example at milestone opening:

`SHTU + DI`

- DI = reviewed functional
- SHTU = structural / pending

Therefore:

`SHTU + DI = Partial`

#### Proposed

An LLM or other proposer generated the candidate, but deterministic/reviewed
evidence is not yet sufficient to call it Partial or Reviewed.

It must never silently appear as reviewed truth.

#### No supported candidate

Neither deterministic evidence nor verified proposer output currently supports
a useful functional candidate.

Normal UI text should simply say:

> No supported functional candidate yet.

---

## 6. Study canonical product behavior

`study` is the canonical milestone example.

The primary functional-motivation result must expose:

**Language:** Albanian

**Candidate:** `SHTU + DI`

**SHTU**
- add / increase / put-on
- structural evidence at milestone opening

**DI**
- know / knowledge
- reviewed functional evidence

**Functional explanation:**

Adding or increasing knowledge; making knowledge yours through learning.

**Seven-Voice alignment:**

- Functional vowel path: `U → I`
- Seven Principles: `U (5) — Unity → I (3) — Insight`
- Colors: `Blue → Yellow`
- Musical notes: `G → E`

The primary result must make the active vowel-to-principle,
vowel-to-color, and vowel-to-note mappings visible without requiring
the user to open lower diagnostic surfaces.

It must also expose the compact canonical seven-key:

- `A (1) — Truth — Red — C`
- `E (2) — Expansion — Orange — D`
- `I (3) — Insight — Yellow — E`
- `O (4) — Balance — Green — F`
- `U (5) — Unity — Blue — G`
- `Y (6) — Reflection — Indigo — A`
- `Ë (7) — Evolution — Violet — B`

These are canonical ZË-RO model mappings. Their display does not
create a historical-origin, language-superiority, or external
scientific-proof claim.


**Evidence status:** Partial

The existing surface/functional truth remains:

- surface path = `U → Y`
- functional path = `U → I`
- delta = `DIVERGE`

The candidate presentation must not incorrectly promote SHTU to reviewed
functional evidence.

It also must not hide the useful `SHTU + DI` functional reading merely because
SHTU is not yet fully reviewed.

---

## 7. Simple UI contract

The normal Instrument UI must be result-first.

### Primary visible order

1. input word;
2. Functional Motivation result;
3. language;
4. candidate embryos;
5. plain embryo meanings;
6. functional explanation;
7. evidence status;
8. optional secondary candidates.

### Primary UI must NOT be dominated by

- `no_single_winner`;
- `user_decides`;
- `historicalOriginClaim`;
- `winnerClaim`;
- `languageSuperiorityClaim`;
- internal rank-group names;
- internal provenance enums;
- gate evidence references;
- reason-code lists;
- raw contract identifiers;
- raw JSON.

These may remain internally for safeguards and auditability.

They belong in Advanced or collapsed evidence details.

The normal UI may retain one short boundary such as:

> Functional motivation, not historical etymology.

That is enough for the primary surface.

---

## 8. Candidates surface

The Candidates section must stop behaving primarily like a list of raw engine
records.

Its first purpose is to answer:

> What candidate can motivate this word?

For each useful candidate, show:

### Language

Human-readable language name.

### Candidate

One or more embryos.

Example:

`SHTU + DI`

### Components

Each embryo and its plain functional meaning.

### Functional explanation

One short natural-language statement connecting the candidate to the input
word.

### Evidence

Only the simple user-facing state:

- Reviewed
- Partial
- Proposed
- No supported candidate

Technical details may be expanded on demand.

---

## 9. LLM role

The milestone requires LLM candidate discovery to become part of the normal
Analyze experience.

The LLM is a candidate generator.

The LLM is not the truth authority.

### Target runtime sequence

```text
user word
→ deterministic ZË-RO pre-analysis
→ structural / reviewed evidence lookup
→ automatic LLM candidate proposal
→ deterministic verification
→ evidence classification
→ user-facing functional candidates

The LLM should receive enough deterministic context to search intelligently,
including where available:

input word;
surface vowel path;
structural segmentation hints;
RootMap tokens;
reviewed lexical evidence;
permitted transforms;
existing candidate evidence.

The proposer should search for the smallest useful living-language embryos that
could motivate the meaning/function of the word.

The proposer should return structured candidate hypotheses rather than prose
only.

At minimum each proposed candidate should contain:

language;
candidate expression;
embryos;
embryo glosses;
semantic bridge;
required transforms;
concise functional explanation.
10. LLM runtime requirements

Normal user Analyze must not depend on clicking an Advanced diagnostic button
to invoke candidate discovery.

The existing separate proposer/oracle architecture may be reused, simplified,
or refactored.

Provider behavior

Tests and CI may use deterministic mock providers.

User-facing runtime must never present a mock proposal as a real discovered
candidate.

A configured real provider may be used for normal LLM discovery.

If no real provider is available, the Instrument must fail gracefully and
continue with deterministic candidates.

It must not fabricate a successful LLM discovery.

11. Deterministic verifier role

LLM output must be treated as a hypothesis.

Before promotion, deterministic/reviewed logic should check as applicable:

candidate language is usable;
embryos are non-empty;
segmentation is plausible;
transformations are allowed;
vowel-path relationships are computed correctly;
known reviewed lexical evidence matches;
unsupported reviewed status is not invented;
semantic bridge is present;
duplicate candidates are collapsed;
smaller useful embryos rank before unnecessary larger expansions.

The verifier may classify a proposal as:

Reviewed;
Partial;
Proposed;
rejected.

Rejected candidates do not need to clutter the primary UI.

12. Historical/origin material

Historical etymology is not the primary product question.

OriginClaim and related safeguards may remain internally.

They must not dominate the main user experience.

The Instrument should not force the user to read repeated statements about:

winners;
primordiality;
superiority;
ownership;
origin.

The user-facing functional result must remain clearly separate from historical
etymology with one concise boundary.

13. Technical diagnostics

The following belong primarily in Advanced or collapsed detail surfaces:

OriginClaim diagnostics;
DeepRoot–Heart gate reason codes;
evidence refs;
source-kind enums;
rank groups;
validation reason arrays;
raw Engine JSON;
raw evidence package;
provider diagnostics;
carrier diagnostics;
internal contract fields.

These remain valuable for development and scientific audit.

They are not the normal user experience.

14. Implementation sequence

The milestone should proceed in product slices, not documentation lanes.

Slice A — simplify the current result UI

Make Functional Motivation the primary result.

Reduce default technical/legalistic clutter.

Move audit machinery behind Advanced/details.

Slice B — promote functional candidate composition

Represent useful multi-embryo combinations such as:

Albanian → SHTU + DI

as an actual user-facing functional candidate.

Keep component-level evidence status honest.

Slice C — generalize candidate presentation

Do not special-case the UI to study.

The same presentation model must work for:

one-embryo candidates;
multi-embryo candidates;
partial candidates;
proposed candidates;
Null/no-supported-candidate results.
Slice D — automatic LLM proposer

Connect candidate proposal to normal Analyze.

The user should not need Advanced to invoke it.

Slice E — deterministic proposal verification

Verify/classify LLM proposals before user-facing promotion.

Slice F — simplify whole Instrument

Review Overview, Evidence, Candidates, Roots/Meaning, and Advanced.

Keep the normal experience simple.

Keep diagnostics available without making them the product.

Slice G — final browser proof and closure

Run the full milestone proof set on the actual implementation source.

Only close the milestone after user-visible smoke passes.

15. Required proof words
study

Must show clearly:

Language: Albanian
Candidate: SHTU + DI
SHTU meaning
DI meaning
plain functional explanation
Partial evidence
DI reviewed
SHTU pending/structural
surface U → Y
functional U → I
DIVERGE

The primary UI must not bury this answer beneath audit language.

damage

Must show the strongest supported functional motivation clearly.

At milestone opening, reviewed DA must remain visible as the smallest reviewed
functional embryo.

A larger candidate combination must only be shown if evidence supports it.

father

Must not invent reviewed evidence.

If no useful supported functional candidate exists, normal UI should say:

No supported functional candidate yet.

arbitrary non-hardcoded word

At least one word without a hardcoded canonical candidate must prove that the
normal Analyze flow actually invokes real LLM candidate proposal.

The result must then be classified honestly as Reviewed, Partial, Proposed, or
rejected.

This is required to prove that the LLM is genuinely integrated into normal
candidate discovery.

16. Non-negotiable product rules
User usefulness before internal diagnostics.
Functional motivation before historical-origin machinery.
Smallest meaningful embryos first.
Living-language motivation must be explicit.
Multi-embryo candidates are first-class results.
Partial evidence must be visible as Partial, not hidden.
LLM proposes; deterministic/reviewed evidence verifies.
Mock provider output is never presented as real discovery.
Unsupported evidence is never promoted.
Null remains a legitimate result.
Advanced diagnostics remain available.
Primary UI stays simple.
17. Out of scope

This milestone does not require:

Petro Zheji full-fidelity reconstruction;
a new historical etymology engine;
ranking historical origin;
internet-wide autonomous research on every Analyze;
automatic dictionary scraping;
proving Albanian historical origin;
proving primordial language claims;
JO / PO / MAT work;
unrelated candidateModel cleanup;
unrelated type-debt cleanup.

Authoritative external lexical retrieval may be a later capability.

This milestone first makes the existing reviewed evidence plus automatic LLM
candidate proposal useful in the actual Instrument.

18. No-documentation-loop rule

After this governing milestone document exists:

DO NOT create additional design-only or review-only PRs for ordinary milestone
progress.

Proceed to implementation.

A new document is justified only if a concrete implementation blocker requires
a durable new contract that cannot reasonably live in code/tests or this
milestone.

Normal progress is:

inspect
→ implement
→ test
→ browser smoke
→ merge
→ continue next product slice

not:

design doc
→ review doc
→ authorization doc
→ another design doc
19. Milestone exit criteria

The milestone remains ACTIVE until ALL are true.

User experience
 Functional Motivation is the dominant normal result.
 Candidate language is immediately visible.
 Multi-embryo candidate expression is immediately visible.
 Embryo meanings are immediately visible.
 Functional explanation is understandable without engineering knowledge.
 Evidence state uses Reviewed / Partial / Proposed / No supported candidate.
 Main UI is no longer dominated by claim/gate/internal-contract language.
 Audit diagnostics remain accessible in Advanced/details.
Study
 Albanian SHTU + DI is the clear functional candidate.
 SHTU = add / increase / put-on.
 DI = know / knowledge.
 Functional explanation is clear.
Functional Seven-Principles alignment is immediately visible and derived from canonical SSOT.
Functional color alignment is immediately visible and derived from canonical SSOT.
Functional musical-note alignment is immediately visible and derived from canonical SSOT.
The compact seven-vowel principle/color/note key is visible in the primary result.
 Candidate status = Partial until SHTU reaches full review.
 DI remains reviewed.
 SHTU remains honestly pending/structural.
 Surface U → Y.
 Functional U → I.
 Delta DIVERGE.
Candidate discovery
 Normal Analyze can invoke automatic LLM candidate proposal.
 LLM proposal is not hidden behind Advanced.
 A real non-mock provider smoke is completed.
 At least one non-hardcoded word proves live LLM candidate discovery.
 LLM proposals are deterministically verified/classified.
 Mock proposals cannot appear as real user results.
 Provider failure falls back safely.
Controls
 damage remains useful and truthful.
 father does not invent reviewed evidence.
 Null/no-supported-candidate UI is simple.
 Existing truth-layer corrections remain intact.
 IPA carrier diagnostics cannot overwrite functional-path truth.
Engineering proof
 Focused tests pass.
 npm run typecheck:contracts passes.
 npm run gate:quick passes.
 exact-source CI passes.
 Codex review has no unresolved actionable findings.
 npm run open-instrument:live-smoke passes.
 mandatory actual-browser pre-merge smoke passes.
 user explicitly approves final visible behavior.
Operations
 implementation PRs are merged.
 merged main receives final quick proof.
 DF_BRAIN monthly log is updated.
 DF_BRAIN ZË-RO project file is updated.
20. Closure rule

This milestone may be changed from:

Status: ACTIVE

to:

Status: DONE

only after every required exit criterion is satisfied.

At closure, update this SAME document with:

final implementation PR numbers;
final merge SHAs;
actual LLM provider proof;
final Study / Damage / Father / arbitrary-word smoke results;
final gate/CI/Codex proof;
DF_BRAIN closure commit.

Do not create a separate milestone-closure design document.

The finished product itself is the closure evidence.
## 21. Final closure evidence — 2026-08-18

<!-- OPEN_INSTRUMENT_SIMPLE_FUNCTIONAL_MOTIVATION_V1_CLOSED_2026_08_18 -->

`OPEN_INSTRUMENT_SIMPLE_FUNCTIONAL_MOTIVATION_V1` satisfied all governing exit criteria before this status change.

### Final implementation PRs

- PR #1789 → `73d85c33890e1b314fd2c45c9ffd414f1a7eb5f6`
- PR #1790 → `aad2e6f55e236c2efc153fe0fb5ac974691bc9ed`
- PR #1791 → `0de7a3cf0a6f85f68d888e92f0ad53bb4f516453`
- PR #1792 → `49a9d21cadc19c67c48f69f86d315679a7864b20`
- PR #1793 → `a6848ac49d3eea8b6fe610ac8b768dab452de669`
- PR #1794 → `62f8d747be53a0b532f068040fc04596a4f653d2`
- PR #1795 → `d77fdd49a92bfaed418baa5375740fcd9d7f3d96`
- PR #1796 → `a83298434065ee3b33987d52b26bd94247c5c101`
- PR #1797 → `d6a792a728ea4621d1c5d01605f4ca1e57aab9cd`

Final implementation main before the closure-only documentation update:

`d6a792a728ea4621d1c5d01605f4ca1e57aab9cd`

### Final Study product proof

Normal `/chat` browser acceptance showed:

- language: Albanian;
- evidence: Partial;
- candidate: `SHTU + DI`;
- SHTU: structural — `add / increase / put-on`;
- DI: reviewed — `know / knowledge`;
- exact plain functional explanation:
  `Adding or increasing knowledge; making knowledge yours through learning.`;
- candidate-owned functional path: `U → I`;
- canonical principle alignment: `U (5) — Unity → I (3) — Insight`;
- canonical colors: `Blue → Yellow`;
- canonical musical notes: `G → E`;
- full seven-vowel principle/color/note key visible;
- surface path: `U → Y`;
- delta: `DIVERGE`.

The principle/color/note display is explicitly bounded as canonical ZË-RO model metadata, not historical-origin or external scientific proof.

### Final Damage control

Normal `/chat` browser acceptance showed:

- language: Albanian;
- evidence: Reviewed;
- candidate: `DA`;
- meaning: `split / divide`;
- bounded functional motivation remained useful and truthful;
- RootMap remained PRESENT with reviewed DA evidence;
- reviewed DA emitted no candidate-specific `A → Ë` path;
- candidate-level active Seven-Voice alignment was therefore correctly suppressed;
- run-level deterministic functional path `A → Ë` remained visible separately;
- no historical-origin, winner, superiority, ownership, or candidate-truth promotion occurred.

### Final Father control

Normal `/chat` browser acceptance showed:

- language: Albanian;
- evidence: Reviewed;
- candidate: `AT`;
- meaning: `father`;
- RootMap remained PRESENT;
- AT RootMap role: `unit`;
- reviewed AT emitted no candidate-specific `A → Ë` path;
- candidate-level active Seven-Voice alignment was therefore correctly suppressed;
- run-level deterministic functional path `A → Ë` remained visible separately;
- reviewed AT evidence stayed target-bounded and did not create an unrestricted bare-`at` father rule;
- no historical-origin or winner claim occurred.

### Candidate-bound Seven-Voice truth

The final valid Codex P2 finding was resolved before merge.

Active Seven-Voice alignment now belongs to the result actually displayed:

- first-class candidates/compositions use their own candidate vowel path;
- legacy displayed RootMap compositions derive alignment from their own RootMap token vowel paths;
- reviewed single-embryo candidates without their own vowel path do not borrow a broader run-level functional path;
- the full canonical seven-key can remain visible independently as model reference metadata.

### Actual LLM provider proof

Slice G completed real non-mock normal-Analyze candidate discovery using:

- local provider: Ollama;
- model: `llama3.1:8b`;
- loopback-only OpenAI-compatible endpoint;
- no paid OpenAI API;
- no remote provider.

At least one arbitrary/non-hardcoded live discovery was deterministically verified while preserving Proposed-only status.

Additional browser/control coverage during Slice G included:

- `memory`: surface `E-O-Y` → functional `E-O-I`, Proposed;
- `rhythm`: canonical surface `Y` → functional `I-Ë`, Proposed;
- `garden`: valid no-supported-candidate / Null outcome;
- `silver`: provider timeout failed safely without false promotion;
- `window`: unavailable carrier alignment failed closed, functional path remained unavailable, and no candidate was promoted.

Mock-provider output remained excluded from real user truth.

### Final engineering proof

Final PR #1797 reviewed source:

`f2ddf99859a28d3b86b4e3296626ce927f42edcc`

Proof completed before merge:

- focused tests: PASS;
- `npm run typecheck:contracts`: PASS;
- `npm run gate:quick`: PASS;
- exact-source GitHub CI: PASS;
- contracts-typecheck: PASS;
- CodeQL: PASS;
- no unresolved actionable Codex finding;
- mandatory actual-browser pre-merge smoke: PASS;
- explicit user approval of final visible behavior: PASS.

PR #1797 then merged to:

`d6a792a728ea4621d1c5d01605f4ca1e57aab9cd`

Merged-main production proof:

- `/chat`: PASS;
- `/`: PASS;
- profile-driven DA / DI / AT positive and negative runtime assertions: PASS;
- smoke-focused regression suites: PASS;
- `npm run open-instrument:live-smoke`: PASS when executed with the external automatic proposer disabled, matching the live-smoke runner's no-external-provider contract;
- merged main remained clean.

The initial merged-main smoke attempt built successfully and began passing route/API assertions, but inherited a locally enabled real proposer and hit the smoke runner's 10-second HTTP abort. The canonical no-external-provider rerun completed successfully without source changes.

### DF_BRAIN closure evidence

Both required DF_BRAIN records were synchronized before closure:

- `log/2026-08.md`;
- `projects/zero/zero.md`.

DF_BRAIN synchronization commit:

`b5ea5183d885cb79657542d2b6e6ee5453f35650`

That commit records PR #1796, PR #1797, final browser evidence, candidate-bound Seven-Voice behavior, merged-main live-smoke proof, and the preserved Slice G real-provider proof.

### Closure decision

Every governing exit criterion in section 19 is satisfied.

No additional implementation slice is required for this milestone.

The milestone is therefore:

`DONE`

Future Open Instrument work must be selected from fresh product/repository inspection rather than extending this completed milestone by assumption.
