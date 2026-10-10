# Open Instrument — Multilingual Discovery S5 Sanskrit Snapshot Authority v0.1

Status: `FROZEN_AUTHORITY_DEFINITION_NOT_ACQUIRED`.

Authority ID: `OPEN_INSTRUMENT_MULTILINGUAL_DISCOVERY_S5_SANSKRIT_SNAPSHOT_AUTHORITY_V0_1`.

This document freezes the upstream authority, component boundary, lookup
boundary, pronunciation firewall, and future acquisition contract for the
selected S5 Sanskrit source. It does not acquire source bytes, implement a
provider or adapter, change retrieval, run Discovery, or authorize S4.

## 1. Scope and repository relationship

The lane scope is `RETRIEVAL_PROVENANCE_AND_AUTHORITY_BOUNDARY`.

The selected source is the Cologne Digital Sanskrit Dictionaries (CDSL)
digital Monier-Williams Sanskrit-English Dictionary, based on the Oxford 1899
edition. The predecessor authority is
`docs/open-instrument/multilingual-discovery-s5-third-source-family-generalization-v0.1.md`.
That preregistration remains unchanged and continues to record acquisition as
not authorized until a later lane.

Repository facts at the start of this lane:

```text
REPOSITORY=sokolgora-sketch/linguistic-decoder
EXPECTED_MAIN=57d5daaecb4a477b7ee8a9a41de88573a3947d75
BRANCH=main
HEAD=57d5daaecb4a477b7ee8a9a41de88573a3947d75
ORIGIN_MAIN=57d5daaecb4a477b7ee8a9a41de88573a3947d75
DIVERGENCE=0/0
WORKTREE=CLEAN
```

The following labels are used throughout this record:

- `UPSTREAM FACT`: established from the official CDSL/MW authority or its
  official license text.
- `REPOSITORY-DERIVED FACT`: established from this repository's contracts or
  validation policy.
- `INFERENCE`: a bounded implementation consequence of those facts.
- `UNKNOWN`: not established in this lane.
- `PENDING_ACQUISITION`: intentionally deferred until the exact bytes are
  acquired and verified by a later authorized lane.

## 2. Upstream authority

| Field | Frozen value | Evidence class |
| --- | --- | --- |
| `UPSTREAM_PROJECT` | Cologne Digital Sanskrit Dictionaries (CDSL), hosted by the Sanskrit Lexicon organization | UPSTREAM FACT |
| `UPSTREAM_REPOSITORY` | `https://github.com/sanskrit-lexicon/csl-orig` | UPSTREAM FACT |
| `UPSTREAM_COMPONENT` | Monier-Williams Sanskrit-English Dictionary (MW), Oxford 1899 digital edition | UPSTREAM FACT |
| `UPSTREAM_COMPONENT_PATH` | `v02/mw/mw.txt` | UPSTREAM FACT |
| `UPSTREAM_DATA_DICTIONARY` | `https://github.com/sanskrit-lexicon/MWS/blob/master/DATA_DICTIONARY.md` | UPSTREAM FACT |
| `UPSTREAM_LICENSE_SOURCE` | CDSL/MW use-and-reuse statement plus the `csl-orig` license text: `https://github.com/sanskrit-lexicon/MWS/blob/master/index.html`, `https://github.com/sanskrit-lexicon/csl-orig/blob/main/LICENSE`, and `https://creativecommons.org/licenses/by-sa/4.0/` | UPSTREAM FACT |
| `UPSTREAM_LICENSE` | `CC BY-SA 4.0` for the CDSL dictionary data | UPSTREAM FACT |
| `UPSTREAM_ATTRIBUTION_REQUIREMENT` | Credit Monier-Williams and CDSL; retain a link to the selected source/component and the CC BY-SA 4.0 license; identify modifications when sharing adapted material; preserve required notices where supplied | UPSTREAM FACT |
| `UPSTREAM_REVISION_OR_COMMIT` | `55e8addbd96e8d9001b8789026b026763f4049c1` (`csl-orig` `main`, metadata-only lookup on 2026-10-11) | UPSTREAM FACT |
| `UPSTREAM_RELEASE_OR_VERSION` | Oxford 1899 bibliographic edition; no separate CDSL release tag is used for this authority record | UPSTREAM FACT / UNKNOWN for a CDSL release tag |
| `UPSTREAM_MAINTENANCE_STATUS` | Active maintained source workflow: `csl-orig` identifies itself as the canonical source-text store and documents maintainer-controlled correction batches; the repository was observed with current activity in 2026 | UPSTREAM FACT |

`csl-orig` is the canonical source-text store for CDSL dictionary bodies. Its
official repository documentation states that downstream generated XML,
front-ends, and APIs trace back to `v02/<dict>/<dict>.txt`, and that the
canonical files are maintained through a controlled correction workflow. The
MW component directory lists `mw.txt`; it does not list a full `mw.xml`
artifact. The official MWS page identifies the work as the Oxford 1899
Monier-Williams dictionary and identifies CDSL as the digital publisher.

The pinned commit above is a revision binding, not a claim that the future
acquisition lane has already retrieved or inspected the file bytes.

## 3. Component and license boundary

```text
LICENSE_BOUNDARY_VERIFIED=YES
LICENSE_APPLIES_TO_SELECTED_DATA=YES
LICENSE_COMPONENT=CDSL digital dictionary data for the MW component at csl-orig/v02/mw/mw.txt; repository code and documentation may have separate terms
```

The boundary is established by the official MW page's explicit statement that
dictionary data is released under CC BY-SA 4.0, together with the official
`csl-orig` repository's CC-BY-SA-4.0 license text. The 1899 printed work is a
bibliographic source fact; its age is not being used to infer the license of
the CDSL digital edition. The future manifest must carry the digital-data
license and evidence explicitly.

The future acquisition and any later sharing must preserve attribution to
Sir Monier Monier-Williams and the Cologne Digital Sanskrit Lexicon, identify
the exact `csl-orig` component and pinned revision, link the CC BY-SA 4.0
license, and state any modifications. This is a provenance requirement, not a
legal opinion.

## 4. Canonical artifact decision

```text
CANONICAL_PARSER_ARTIFACT=csl-orig@55e8addbd96e8d9001b8789026b026763f4049c1:v02/mw/mw.txt
SECONDARY_REFERENCE_ARTIFACTS=MWS/DATA_DICTIONARY.md; csl-orig/v02/mw/mwheader.xml for component metadata only; no full v02/mw/mw.xml listed by the inspected upstream directory
```

`mw.txt` is canonical because the official CDSL source repository identifies
the plain-text `v02/<dict>/<dict>.txt` file as the source from which downstream
artifacts are generated. It retains the source-native record stream and avoids
selecting a generated representation as a second authority. A future parser
must not silently substitute `mw.xml`, an online rendered page, a mirror, or a
repackaged corpus.

The official MWS data dictionary describes records bounded by `<L>...` and
`<LEND>`, with header fields including `<pc>`, `<k1>`, `<k2>`, and `<e>`.
It records `<k1>` and `<k2>` as SLP1 fields and distinguishes other fields that
may contain IAST, plain text, or other scripts. The future adapter must retain
all source records and all supported provenance fields; this authority lane
does not implement that adapter.

## 5. Lookup authority

The S5 preregistered lookup decision remains frozen and is consistent with the
upstream data dictionary:

```text
SOURCE_LOOKUP_RULE=exact source-native SLP1 using k1 as the sole lookup field
LOOKUP_FIELD=k1
LOOKUP_REPRESENTATION=SLP1
LOOKUP_FORM_CASE_POLICY=NO_LOWERCASE
CASE_NORMALIZATION=NONE
DIACRITIC_STRIPPING=NO
LOOKUP_AUTHORITY_CONSISTENT_WITH_PREREGISTRATION=YES
```

The official data dictionary defines `<k1>` as the primary headword in SLP1
and `<k2>` as a secondary headword in SLP1 that may carry Vedic accent marks.
`k2` remains attributable source provenance and is not an alternate lookup key
in S5. No lowercasing, Unicode normalization, diacritic stripping, fuzzy
matching, transliteration conversion, prefix matching, or semantic matching
is authorized by this document.

## 6. Pronunciation firewall

```text
PRONUNCIATION_FROM_TRANSLITERATION_ALLOWED=NO
```

SLP1, IAST, Devanagari, dictionary headword spelling, transliteration tables,
and traditional pronunciation assumptions are not pronunciation authority.
For future S5 records without a separately authorized spoken source:

```text
PRONUNCIATION=Null
VOICE_PATH=Null where pronunciation is required
GAMMA=Null where pronunciation is required
ZC=Null where Gamma is unavailable
```

This source-authority lane does not search for, select, or imply a Sanskrit
pronunciation source. Functional interpretation, Seven Voices, Gamma, ZC, and
spoken evidence remain outside scope.

## 7. Frozen snapshot identity

The future snapshot is bound to the pinned upstream commit and component path,
not to a moving `main` or `latest` URL:

```text
SNAPSHOT_UPSTREAM_REVISION=55e8addbd96e8d9001b8789026b026763f4049c1
SNAPSHOT_ARTIFACT_PATH=v02/mw/mw.txt
SNAPSHOT_ARTIFACT_FILENAME=mw.txt
SNAPSHOT_ENCODING=UNKNOWN_PENDING_ACQUISITION_BYTE_PREFLIGHT
SNAPSHOT_FORMAT=CSL_ORIG_PLAIN_TEXT_WITH_CSL_MARKUP
SNAPSHOT_EXPECTED_RECORD_MODEL=<L>...<LEND> source records; header fields include L, pc, k1, k2, and e
SNAPSHOT_ORDERING_AUTHORITY=physical record order in the pinned mw.txt bytes; preserve order before any derived index ordering
SNAPSHOT_ACQUISITION_ENDPOINT=https://raw.githubusercontent.com/sanskrit-lexicon/csl-orig/55e8addbd96e8d9001b8789026b026763f4049c1/v02/mw/mw.txt
```

The raw endpoint is only a transport locator. The commit, path, expected
encoding, byte count, and SHA-256 together define the future snapshot identity.
No source bytes were retrieved or inspected in this lane:

```text
BYTE_RETRIEVAL_REQUIRED_FOR_HASH=YES
BYTE_RETRIEVAL_PERFORMED=NO
SNAPSHOT_BYTE_SIZE=PENDING_ACQUISITION
SNAPSHOT_SHA256=PENDING_ACQUISITION
```

## 8. Future controlled acquisition procedure

Only a separately authorized acquisition lane may execute these steps:

1. Reconfirm the selected component, license evidence, and pinned commit. Do
   not resolve `main`, `latest`, a mirror, or a repackaged corpus.
2. Resolve the external source root and use an external, non-Git snapshot path
   such as `source-family/sanskrit-mw/1899-cdsl-csl-orig-55e8addb/mw.txt`.
   Repository bundling is not authorized by this document.
3. Fetch only the exact pinned raw endpoint into a same-filesystem temporary
   `.partial` file. Do not buffer the full artifact in memory and do not
   inspect source content before identity verification.
4. Verify the response is the expected artifact, the bytes decode under the
   recorded encoding, and the exact byte size and SHA-256 match the future
   manifest. The acquisition lane must compute these values from the bytes;
   it must never copy them from a third-party report.
5. Atomically rename the verified `.partial` file to `mw.txt` and write the
   provenance manifest beside it. The manifest must identify the source,
   revision, path, license, attribution, acquisition time, byte size, hash,
   encoding, and validation results.
6. If any identity, license, encoding, storage, or provenance check fails,
   remove only the controlled partial artifact and stop. Do not retry with a
   different revision or source.

The future lane must use bounded transport retries only for the same pinned
endpoint and identity. A retry is not permission to change the authority.

## 9. Future snapshot manifest schema

The acquisition sidecar must contain at least the following fields. Each field
must be classified as a source fact, acquisition fact, or derived validation
fact; semantic interpretation does not belong in the manifest.

| Field | Required value or rule | Fact class |
| --- | --- | --- |
| `schemaVersion` | frozen manifest schema identifier | derived validation fact |
| `sourceFamilyId` | repository-native Sanskrit source-family identifier | source fact / repository binding |
| `sourceTraditionId` | CDSL/MW tradition identifier | source fact |
| `sourceTitle` | Monier-Williams Sanskrit-English Dictionary | source fact |
| `sourceEdition` | Oxford 1899; CDSL digital edition | source fact |
| `upstreamProject` | Cologne Digital Sanskrit Dictionaries | source fact |
| `upstreamRepository` | `sanskrit-lexicon/csl-orig` | source fact |
| `upstreamRevision` | `55e8addbd96e8d9001b8789026b026763f4049c1` or a separately authorized frozen revision | acquisition fact |
| `artifactPath` | `v02/mw/mw.txt` | source fact |
| `artifactFilename` | `mw.txt` | source fact |
| `artifactByteSize` | computed from the acquired bytes | derived validation fact |
| `artifactSha256` | computed from the acquired bytes | derived validation fact |
| `encoding` | observed and verified byte encoding | derived validation fact |
| `format` | CSL source plain text with source markup | source fact / validation fact |
| `acquisitionTimestamp` | UTC timestamp of the controlled acquisition | acquisition fact |
| `license` | `CC BY-SA 4.0` for CDSL dictionary data | source fact |
| `licenseEvidence` | official CDSL/MW and license URLs | source fact |
| `attribution` | Monier-Williams, CDSL, component, revision, license, and modifications | source fact / acquisition fact |
| `lookupField` | `k1` | repository authority |
| `lookupRepresentation` | `SLP1` | source fact / repository authority |
| `casePolicy` | `NO_LOWERCASE`; no case normalization | repository authority |
| `unicodePolicy` | no diacritic stripping; preserve source text | repository authority |
| `pronunciationAuthority` | none from this snapshot; pronunciation is Null absent separate authority | repository authority |
| `provenanceNotes` | source/acquisition/validation facts only; no semantic interpretation | repository authority |

## 10. Future acquisition acceptance tests

The acquisition lane must fail closed unless all of the following pass:

1. The exact pinned revision is present and matches the recorded commit.
2. The artifact path is exactly `v02/mw/mw.txt`.
3. The computed byte size is recorded and remains bound to the snapshot.
4. The computed SHA-256 is recorded and remains bound to the snapshot.
5. The bytes decode under the verified encoding without silent replacement.
6. The file is parseable as the expected CDSL source format.
7. Every admitted record retains its source-native `<L>` identity.
8. Every admitted record retains `k1` exactly.
9. Every admitted record retains `k2` exactly when present.
10. Page/column `<pc>` locators remain individually recoverable when present.
11. Source-reference fields such as `<ls>` remain individually recoverable
    when present.
12. Physical source order is deterministic and reproducible.
13. Multiple records for one `k1` remain multiple records; no multiplicity is
    silently deduplicated.
14. No lowercasing occurs.
15. No diacritic stripping or transliteration conversion occurs.
16. No pronunciation is inferred from spelling, transliteration, or markup.
17. The complete provenance manifest is present and internally consistent.
18. Attribution and license evidence are present.

Candidate matching, Discovery, functional interpretation, pronunciation,
Seven Voices, Gamma, ZC, and any ZË-RO outcome are not snapshot acceptance
tests.

## 11. Stop conditions and scope firewall

Stop with `S5_SNAPSHOT_AUTHORITY_BLOCKED_LICENSE` if the selected digital
data's reuse status cannot be established from explicit upstream evidence.

Stop with a source-identity failure if the revision, path, file, encoding,
byte size, or SHA-256 does not match the frozen authority. Stop if required
provenance or attribution is missing. Do not substitute a mirror, repackaged
corpus, generated XML, alternate revision, or a moving latest dataset.

This lane does not:

- integrate Sanskrit into `/chat`;
- implement a Sanskrit provider or generic witness adapter;
- change candidate generation or retrieval semantics;
- run Sanskrit Discovery or the future 32-record sample;
- produce functional evidence or infer pronunciation;
- compute Seven Voices, Gamma, or ZC;
- change Seven Voices, Gamma, ZC, Functional Motivation Interpretation, or
  presentation aggregation;
- modify English Kaikki, Albanian, Latin, S4, or Diachronic work.

## 12. Validation and closure boundary

This deliverable is one documentation file only. No source bytes, production
code, tests, configuration, provider, adapter, runtime, or Discovery output
are changed by the authority definition.

Repository policy requires the full gate even for docs-only changes because no
docs-only bypass exists and the pre-push hook is not docs-only aware. The
closure lane must perform the focused documentation/path/consistency checks,
`git diff --check`, lint as required, `npm run gate:quick`, and the repository
required production build before normal push and review. No `--no-verify` is
permitted.

After a successful squash merge and fast-forward of main, the closeout must
record the merge proof and reconcile DF_BRAIN locally only. Linear mutation is
pending tool availability if no Linear connector is available. This document
does not close or start any subsequent lane.
