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

### Analyze V1 request extensions

Analyze V1 request inputs are grouped into the following surfaces:

- Core selectors: `word`, `mode`, and `alphabet`.
- Optional context: `ipa` and `language`.
- Semantic context: `targetSenseId` and `targetSenseLabel`.
- Experimental/internal POST options: `opts.brainCandidatesSeedFallback` and
  `opts.seedBrainCandidates`.
- Development query controls: `seed`, `seedBrainCandidates`,
  `brainCandidatesSeedFallback`, and `ocg`.

The target-sense fields are optional. String values are trimmed before semantic
use. A label-only request derives a deterministic internal sense ID, while an
explicit ID takes precedence. Target-sense context may affect semantic
alignment and candidate projection, but it does not declare an etymological
winner; the `no_single_winner` and `user_decides` boundaries remain unchanged.

The named POST extensions are explicitly recognized by the route while
retaining the existing compatibility behavior. Non-string target-sense values
are treated as absent rather than rejected. Seed option values retain the
existing truthiness-compatible behavior and are not strict boolean fields in
this contract version. Only the two named seed members are consumed; unrelated
nested `opts` members remain ignored. Raw `opts` is not copied wholesale into
response metadata.

The query seed aliases are development/testing controls. Each enables seed
fallback only when its value is exactly `1`; other values do not enable it.
`ocg` is a development-only OriginClaim gate control and is disabled in
production. These controls are not ordinary stable analytical selectors.

The request object continues to retain top-level passthrough compatibility.
This version makes the existing runtime-influential extension names explicit;
the policy for unrelated unknown fields and stricter extension type validation
remains a separate contract decision. No requested/effective metadata fields
are added here.

### Analyze V1 error behavior

For invalid client requests, Analyze V1 returns HTTP `400` with a JSON body
containing an `error` string. Human-readable wording is diagnostic and
non-normative; clients should not parse or depend on exact message text.

Malformed JSON and request-schema failures use this same envelope. Explicit
unsupported string values for `mode` and `alphabet` identify the affected
field, while schema/type failures are not guaranteed to use field-specific
wording.

Unexpected response-contract or orchestration failures return HTTP `500`.
Diagnostic fields in those internal failure responses are not part of the
public API contract. The legacy `/api/analyze` route inherits this behavior
because it re-exports the Analyze V1 handlers.

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
