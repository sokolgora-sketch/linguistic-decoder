
---

## Wiring
- Summary: `src/shared/maskCarrierSummary.v0.1.ts` uses `extractCarrierVoicesFromIpa.v0.1` (carrier = nuclei, not spelling vowels).
- UI: Instrument surfaces:
  - **NO_CARRIER** when diagnostics.noCarrier === true
  - **IMPLICIT Ë / SYLLABIC Ë** when diagnostics.usedImplicit/usedSyllabic === true

## Tests proving DONE
- `tests/vowels/extractCarrierVoicesFromIpa.v0.1.spec.ts`
- `tests/vowels/extractCarrierVoicesFromIpa.v0.1.lock.spec.ts`
- `tests/vowels/phoneticOnlySevenVoices.guard.v0.1.spec.ts`
- `tests/shared/maskCarrierSummary.v0.1.spec.ts`
