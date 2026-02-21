# ZË-RO — Linguistic Decoder

*A deterministic seven-vowel analysis instrument (orthography + optional IPA) with evidence-first telemetry.*

[![CI](https://github.com/sokolgora-sketch/linguistic-decoder/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/sokolgora-sketch/linguistic-decoder/actions/workflows/ci.yml)
[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-blue)](LICENSE)

---

## What is this?

ZË-RO (in this repo) is a **calibrated decoder** for vowel-carrier structure in words.

It does three things, deterministically:

1) **Extracts a 7-vowel “voice path”** using the vowels **A, E, I, O, U, Y, Ë**
   - From **orthography** (spelling)
   - From **phonetics** when an **IPA string** is provided

2) **Detects Mask vs Carrier divergence**
   - When spelling path ≠ spoken (IPA) path, the UI marks **DIVERGE**.

3) **Emits audit-friendly telemetry**
   - Evidence-first output (stable references, explicit “not emitted”)
   - Deterministic gates make disagreements visible and testable

This is a research instrument: it helps test hypotheses about vowel structure and meaning. It does **not** claim conclusions by default.

---

## Example: “rhythm” (mask vs carrier)

```ts
analyzeWord("rhythm", { mode: "strict", ipa: "/ˈrɪð(ə)m/" });
```

Typical behavior:
- **Orthography (spelling):** `Y`
- **Phonetics (IPA carriers):** `I → Ë`
- **Status:** `DIVERGE`

---

## Determinism & anti-regression

- **SSOT vowel extraction** (one authoritative mapper)
- **Evidence-first contracts** (UI reads VM; missing data is explicit)
- **Canon C2** drift harness (baseline + diff report)

Commands:
- `npm run gate:quick` — lint + unit tests + integration + build
- `npm run canon:c2` — detect drift vs baseline (fails on unexpected change)
- `npm run canon:c2:update` — refresh baseline after an intentional change

---

## Run locally

```bash
npm install
npm run dev
# http://localhost:3000
```

---

## License

GNU Affero General Public License v3.0 (AGPL-3.0). See `LICENSE`.
