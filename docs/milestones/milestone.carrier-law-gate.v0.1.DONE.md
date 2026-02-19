# Milestone: Carrier Law Gate v0.1 — DONE

## Goal
Prove (deterministically, in-engine) the invariant:

> Consonants do not carry sustained voice. Carrier nuclei are the Seven Voices: A, E, I, O, U, Y, Ë.

If an IPA chunk contains **no carrier nucleus**, the engine must surface **NO_CARRIER** (no “helpful” invention).

---

## Deliverable
Deterministic extractor for **Carrier Voices** from IPA, wired into `maskCarrierSummary` and surfaced in the Instrument UI.

### Core extractor
- `src/shared/vowels/extractCarrierVoicesFromIpa.v0.1.ts`

**Output (contract)**
- `voices: Array<"A"|"E"|"I"|"O"|"U"|"Y"|"Ë">`
- `tokens: { kind: "vowel"|"syllabic"|"implicit", raw: string, voice: SevenVowel, note: string }[]`
- `diagnostics: { noCarrier: boolean, usedImplicit: boolean, usedSyllabic: boolean }`

---

## Deterministic rules (minimal “physics”)
- **R1 (explicit vowels):** reuse `parseIpaVowels.v0.2` and map explicit nuclei to {A,E,I,O,U,Y,Ë}.
- **R2 (syllabic sonorants):** syllabic marker (U+0329) on sonorants (e.g. m̩ n̩ l̩ r̩ ɹ̩ ɫ̩) ⇒ carrier **Ë**.
- **R3 (final obstruent + sonorant):** if IPA ends in a **sonorant** and the preceding segment is an **obstruent**, inject an implicit **Ë** before the final sonorant.
  - Purpose: capture “rhythm”-style epenthetic schwa.
  - Guardrail: do **not** inject on sonorant→sonorant endings (e.g. /lm/).
- **R4 (hard proof):** if after R1–R3 carriers are still empty ⇒ `diagnostics.noCarrier=true` (do not fake a carrier).

---

## Wiring
- Carrier extraction: `src/shared/vowels/extractCarrierVoicesFromIpa.v0.1.ts`
- Summary: `src/shared/maskCarrierSummary.v0.1.ts` uses carrier nuclei (not spelling vowels)
- UI: Instrument surfaces:
  - **NO_CARRIER** when `diagnostics.noCarrier === true`
  - **IMPLICIT Ë / SYLLABIC Ë** when `diagnostics.usedImplicit/usedSyllabic === true`

---

## Tests proving DONE
- `tests/vowels/extractCarrierVoicesFromIpa.v0.1.spec.ts`
- `tests/vowels/extractCarrierVoicesFromIpa.v0.1.lock.spec.ts`
- `tests/vowels/phoneticOnlySevenVoices.guard.v0.1.spec.ts`
- `tests/shared/maskCarrierSummary.v0.1.spec.ts`
