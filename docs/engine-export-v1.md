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

### Analyze V1 word input and method metadata

`word` is the core lexical selector. GET trims surrounding whitespace from the
query value before orchestration. POST rejects missing, non-string, empty, and
whitespace-only values, but accepts a nonblank string with surrounding
whitespace. In this section, trimming means outer-whitespace removal only; it
does not define Unicode, case, lexical, or semantic normalization.

Deterministic analysis uses the effective trimmed word. Consequently, outer
padding does not change the Seven-Voices path, core candidates or ordering,
status, evidence posture, `Null`, or the `no_single_winner` and `user_decides`
boundaries.

The methods retain a compatibility distinction in selected request and
provenance surfaces. GET has already trimmed the word before later metadata is
constructed. POST may preserve the submitted nonblank spelling, including
surrounding whitespace, in surfaces such as `meta.inputs.word`,
`heartInstrumentV1.basisNfc`, and the inline `evidencePackage.word`. This is
not an analytical divergence, and the current response does not add formal
`requestedWord` or `effectiveWord` fields.

Other result surfaces derive from the effective word: the top-level result
`word`, the OriginClaim word, and the Reproducible Run Bundle `result.word`.
The `sanitized` value is also derived from the effective word, with additional
engine-level lowercasing and character filtering, so it is not a verbatim copy
of that spelling. The complete RRB fingerprint can nevertheless differ for
padded POST input
because projected result structures such as `heartInstrumentV1` may retain the
submitted spelling. This is provenance/result-structure sensitivity, not a
different analysis.

The inline Analyze V1 Evidence Package can retain the POST spelling in its
`word` surface. UI-generated durable Evidence Package exports derive their word
through normalized response/view-model data, so package forms should not be
assumed to preserve identical word provenance. The legacy `/api/analyze` route
re-exports the Analyze V1 handlers and inherits this behavior.

The current POST preservation behavior is retained for compatibility. Any
future change to normalize POST metadata would require a separate reviewed
compatibility decision because it could affect response metadata, the legacy
route, inline Evidence Package output, `heartInstrumentV1`, and complete RRB
fingerprints.

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

The POST seed options use JavaScript-style truthiness rather than boolean
literal parsing. Omitted values, `false`, `0`, `null`, and `""` disable seed
fallback. `true`, nonzero numbers, non-empty strings (including `"false"` and
`"0"`), arrays, and objects enable it; empty arrays and objects are also
truthy. When both named POST seed members are supplied, their effective values
are OR-combined. Only the resulting boolean is placed in `meta.inputs`; the
raw supplied type and spelling are not preserved.

When enabled, the fallback adds deterministic supplemental `Seed` candidate
records from `seedLexicon.v0.1` to the OriginClaim side-channel when no valid
upstream brain candidate is present. These records remain explicitly seed
source data under the existing `no_single_winner` posture; the control does
not promote them to reviewed, historical, Petro, or provider evidence.

The query seed aliases are development/testing controls. Each enables seed
fallback only when its first URL value is exactly `1`; other values, including
padding and `true`, do not enable it. The aliases are OR-combined, and the
same query behavior is available when a development query is supplied to
either route. These aliases do not preserve their raw values in metadata.
`ocg` is a development-only OriginClaim gate control and is disabled in
production. These controls are not ordinary stable analytical selectors.

The request object continues to retain top-level passthrough compatibility.
This version makes the existing runtime-influential extension names explicit.
Stricter extension type validation and requested/effective metadata remain
separate contract decisions. No requested/effective metadata fields are added
here.

### IPA request context and method metadata

`ipa` is optional pronunciation context in both GET query parameters and POST
request bodies. String values are trimmed before use, and blank values are
treated as absent. The POST field is schema-declared as an optional string;
wrong-type values retain the existing generic schema-validation `400` behavior.

IPA does not enter the deterministic core selector path, which is driven by
`word`, `mode`, and `alphabet`. It can still feed the bounded phonetic/carrier
path, so equivalent GET and POST requests can produce equivalent
`phoneticIpaV0_1` output and carrier-derived Evidence Package information.

The methods retain a transport-specific request-metadata distinction. For a
nonblank GET `ipa`, the normalized value is included in `meta.inputs.ipa`.
POST accepts and uses `ipa` through the same bounded carrier path, but
intentionally does not copy it into `meta.inputs`. This is request metadata,
not an analytical divergence; GET/POST semantic parity does not require
identical transport metadata in this contract version.

IPA may also be included in Reproducible Run Bundle input and fingerprinting
through bundle construction. That path does not read IPA from
`meta.inputs.ipa`. No requested/effective IPA fields are added here. The
legacy `/api/analyze` route re-exports these handlers and inherits the same
IPA behavior.

### Unknown request fields and compatibility

The explicitly documented fields define the Analyze V1 analytical request
surface. An otherwise unknown top-level POST field may be accepted by the
current passthrough parser for compatibility, but it is ignored before
orchestration. It is not an analytical input and is not automatically copied
into `meta.inputs`, successful response output, the Reproducible Run Bundle, or
the Evidence Package. Passthrough acceptance is not a public extension
mechanism or a guarantee that an unknown field will remain accepted.

Within `opts`, Analyze V1 recognizes only `brainCandidatesSeedFallback` and
`seedBrainCandidates`. Other nested members are currently tolerated but
ignored; they do not become analytical selectors or affect seed behavior.

GET reads a fixed set of documented query parameters. Unrelated query
parameters are ignored, are not forwarded, and are not copied into metadata or
analytical inputs. New supported request inputs should be added explicitly to
the declared request schema and reviewed contract. Any future decision to strip
or reject unknown POST fields or nested `opts` members requires a separate
compatibility review. The legacy `/api/analyze` route re-exports the Analyze
V1 handlers and inherits this request compatibility behavior.

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
