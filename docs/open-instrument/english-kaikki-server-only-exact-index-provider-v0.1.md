# English Kaikki server-only exact index provider v0.1

This document records the Lane A implementation boundary over the already
published external English Kaikki deterministic index. It does not register a
Discovery provider, change `/api/analyze-v1`, change `/chat`, or authorize S4.

## Runtime boundary

`src/shared/openInstrument/englishKaikkiServerOnlyExactIndexProvider.v0_1.ts`
is a server-bound module because it depends on `node:fs/promises` and opens
only the configured external artifact. No client module, UI path, generic
Discovery registry, or existing API route imports it in this lane.

Production configuration is derived only from
`OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT` and the frozen relative source/index
paths. The canonical root must be outside the Git worktree. Missing roots,
missing files, symlinks, manifest schema errors, frozen identity mismatches,
and byte-length mismatches produce a configuration failure result.

## Exact lookup

The provider applies the existing English Kaikki join-key operator, then uses
a bounded binary-search probe over sorted `directory.ndjson`. It reads only
the selected posting range from `postings.ndjson`; it never scans the full
directory or postings file for a lookup. A missing key returns the existing
valid `LEXICAL_SENSE_SOURCE_NOT_FOUND` NULL.

The selected posting range is checked for canonical JSON Lines, exact posting
count, exact lookup key, canonical posting order, safe integer ranges, and
complete LF framing. Each posting then reads only its recorded source byte
range from the verified external JSONL snapshot. The exact bytes are hashed
before frozen adapter re-adaptation, and the recovered source-record identity,
locator, and lookup key must agree with the posting.

## Source-fact boundary

The provider preserves all posting collisions, physical source records, POS
values, senses, and glosses in source order. It performs no deduplication,
ranking, winner selection, fuzzy matching, semantic normalization, target
mapping, functional correspondence, historical claim, pronunciation mapping,
or model call. Existing adapter projection supplies source facts only; the
generic Discovery bridge remains a later, separately authorized lane.

## Test fixture

The committed fixture at
`tests/fixtures/openInstrument/englishKaikkiDeterministicIndexProvider.v0_1/`
contains three synthetic physical records, two lookup keys, three postings,
and a recomputable fixture identity. The test-only constructor requires an
explicit injected adapter, so the synthetic source identity cannot weaken the
production frozen identity path.
