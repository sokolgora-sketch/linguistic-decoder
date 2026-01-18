# Milestone — DeepRoot RootMap v0.1 (Functional Key Decoder)

Status: DRAFT  
Owner: DF + Sokol  
Scope: Engine + contract + minimal UI hook (optional)

---

## 0) Purpose

Add a **root-first** analysis layer that decomposes a word into minimal functional pieces (“roots/tokens”), then reports:

- **Keys (explainers):** languages where a token has **standalone functional meaning** (supported).
- **Carriers:** languages that carry the form but do **not** internally explain the token (optional).
- **ComposedMeaning:** a short functional statement built from the supported keys.

This is **not** “winner/loser.” It is **explainers vs carriers**, with strict guardrails to avoid coincidence.

---

## 1) Where this fits in ZË-RO pipeline

Order (high-level):
1. **Heart / Seven-Voices**
2. **Math7 / PrinciplesPath**
3. **DeepRoot RootMap (NEW)**
4. Candidates (may reference RootMap, but RootMap does not crown a winner)
5. OriginClaim gates remain separate (policy/meta)

RootMap is an additional section; it does not break existing output.

---

## 2) Deterministic selection policy (IMPORTANT)

RootMap must be deterministic **and** Heart-aligned.

### v0.1 selection rule
- Input: `minRoots[]` hypotheses from DeepRoot.
- Also input (optional): **Heart primary path** (`heart.math7.primary.vowels` preferred; fallback `primaryPath.voicePath`).
- Deterministic selection:
  1) If Heart primary path exists, select the **first hypothesis** whose **terminal vowel** matches Heart’s **terminal vowel**.
  2) Otherwise, select `minRoots[0]` (stable order fallback).

### Why
This prevents nonsense like selecting a hypothesis whose final vowel conflicts with Heart for the same word.  
Example: `study` must end on **I** (STU-DI) so RootMap must prefer **DI**, not **DA**.

No scoring. No randomness. No “best hypothesis” language war. Just deterministic alignment.

---

## 3) Contract: `rootMap?: RootMapV1` (optional, v0.1)

```ts
type RootToken = {
  token: string; // e.g. "DI"
  role?: "action" | "instrument" | "unit" | "modifier" | "unknown";
  vowel_path?: string; // optional (if token contains vowels)
};

type RootKey = {
  token: string;            // must match a token in tokens[]
  language: string;         // "sq" | "en" | ...
  gloss: string;            // "know / knowledge"
  evidence: string[];       // short bullets, no essays
  status: "supported" | "speculative";
  ops?: string[];           // transforms used to align form
};

type RootCarrier = {
  token: string;
  language: string;
  carrierForm: string;
  note?: string;
};

type RootSpan = {
  token: string;
  start: number;
  end: number;
  source: "surface";
  note?: string;
};

type RootMapV1 = {
  tokens: RootToken[];
  keys: RootKey[];
  carriers?: RootCarrier[];
  spans?: RootSpan[];
  composedMeaning: string;
  notes?: string[];
};

---

## RootMap (DeepRoot) — current behavior (v0.1.1)

- RootMap selection is deterministic and Heart-aligned when Heart primary path is available.
- Selection rule:
  1) If Heart primary path exists, select the first DeepRoot minRoots hypothesis whose terminal vowel matches Heart’s terminal vowel.
  2) Else fallback to minRoots[0].
- RootMap remains “keys vs carriers” (no ranking / no winner).
- Canon check: `study` -> tokens `SHTU | DI` (not `DA`).

