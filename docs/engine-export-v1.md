# Engine Export API v1

This document describes the HTTP API for exporting analysis results.

## Endpoints

### `GET /api/analyze`

Performs a full analysis of a single word and returns the complete `AnalysisResult` payload. This is the main endpoint used by the primary UI.

### Analyze V1 mode metadata

`GET /api/analyze-v1` and `POST /api/analyze-v1` use the same canonical mode
contract for successful analysis responses.

- The top-level response `mode` is the effective execution mode used by the
  deterministic analysis.
- The only canonical modes are `strict` and `open`.
- A missing, empty, or whitespace-only mode defaults to effective `strict`.
- Surrounding whitespace is removed from a supplied mode before canonical
  validation, so padded `strict` and `open` values are accepted.
- A non-empty unsupported mode is invalid and returns HTTP `400`; it does not
  produce successful analysis metadata.

For a successful Analyze V1 response, `meta.inputs.mode` records canonical
effective-mode context. It is not a byte-for-byte mirror of the raw transport
request. Consequently, omitted mode, empty mode, whitespace-only mode,
explicit `strict`, and padded ` strict ` may all produce:

```json
{ "mode": "strict", "meta": { "inputs": { "mode": "strict" } } }
```

The raw requested spelling is not preserved in `meta.inputs.mode`, and the
current response does not expose separate `requestedMode` and `effectiveMode`
fields. A future need to preserve raw transport provenance requires a
separately reviewed contract.

The Reproducible Run Bundle uses the canonical top-level effective `mode` for
its portable result and fingerprint; `response.meta.inputs.mode` is not a
separate RRB identity field. Durable Evidence Package exports likewise use
the canonical effective mode. Neither export surface preserves raw mode
spelling under this contract.

### Analyze V1 alphabet contract

`GET /api/analyze-v1` and `POST /api/analyze-v1` use the same canonical
alphabet selector contract for successful analysis responses. The canonical
values are:

```text
auto | albanian | latin | sanskrit | ancient_greek | pie | turkish | german
```

- A missing, empty, or whitespace-only alphabet selects canonical `auto`.
- Surrounding whitespace is removed before validation, so padded canonical
  values such as ` latin ` are accepted as `latin`.
- Canonical values are case-sensitive. Mixed-case values such as `Latin` and
  unsupported non-empty values return HTTP `400` without analysis metadata.
- Successful responses expose the canonical selector in both the top-level
  `alphabet` field and `meta.inputs.alphabet`. `auto` remains `auto`; it is
  not replaced by the internally detected profile.
- Raw transport spelling is not preserved in `meta.inputs.alphabet`, and no
  separate requested, effective, or detected alphabet fields are exposed.
- Alphabet selection can affect deterministic profile and consonant analysis,
  but it does not change the canonical Seven-Voices vowel set
  `A, E, I, O, U, Y, Ë`.

### `GET /api/analyze-core`

Core-only view of the Seven-Voices heart for a single word.

This endpoint runs the same engine as `/api/analyze` but only returns the `core` snapshot
(see **Engine core v2 – core snapshot**). It is designed for:

- Quick UI previews
- Lightweight exports
- Heart-only comparisons

#### Query parameters

- `word` (required) – word to analyze, e.g. `study`
- `mode` (optional) – `"strict"` or `"open"` (defaults to `"strict"`)
- `alphabet` (optional) – `"auto"` or a specific alphabet key (defaults to `"auto"`)
- `manifest` (optional) – engine manifest version to use (defaults to latest)

#### Example

```http
GET /api/analyze-core?word=study&mode=strict&alphabet=auto
```

Response:

```json
{
  "ok": true,
  "core": {
    "word": "study",
    "engineVersion": "2025-11-16-core-2",
    "input": { "...": "..." },
    "voices": { "...": "..." },
    "consonants": { "...": "..." },
    "heartPaths": { "...": "..." }
  }
}
```

The UI uses this in two ways:

Heart section: to render the “Seven-Voices Heart (Core)” card and summary.

Export JSON (Core only): when the “Core only (Heart)” checkbox is ticked, the export layer
calls /api/analyze-core and saves the core snapshot instead of the full analysis.
