# Sanskrit MW source-family adapter v0.1

Status: `IMPLEMENTED_SOURCE_RECORD_BOUNDARY_ONLY`

This adapter implements the frozen S5 CDSL Monier-Williams source-record
boundary. It does not activate Sanskrit in production, run Discovery, build an
index, perform semantic interpretation, or infer pronunciation.

## Frozen identity

| Field | Value |
| --- | --- |
| Source family | `sanskrit-mw` |
| Source tradition | `cdsl-monier-williams-1899` |
| Snapshot | `open-instrument.sanskrit-mw.snapshot.1899-cdsl-csl-orig-55e8addb.v0_1` |
| Upstream revision | `55e8addbd96e8d9001b8789026b026763f4049c1` |
| Artifact | `v02/mw/mw.txt` |
| Encoding | UTF-8 |
| Bytes | `50163993` |
| SHA-256 | `555ecf5aadaaf21e5965d6b3b419f428fc9ab9237f563627001ceca468d0cff8` |
| Format | CSL source plain text with source markup |
| License | CC BY-SA 4.0 |

The raw snapshot remains external, hash-bound, and untracked. The machine-local
absolute source path is intentionally absent from this document and from the
implementation.

## Adapter boundary

The adapter accepts one exact physical `<L>...<LEND>` record byte sequence,
one-based physical record ordinal, and the verified frozen snapshot identity.
It preserves `L`, `pc`, `k1`, `k2`, optional `h`, and `e` exactly as source
fields. `k1` is the sole exact case-sensitive SLP1 lookup form; no lowercasing,
Unicode normalization, diacritic stripping, transliteration, fuzzy matching,
or semantic matching is performed.

Record identity is snapshot-scoped `snapshotId#L-<L>` because the completed
S5 structural evidence established unique `L` values. The locator retains both
`L` and `pc`; physical ordering is retained as `recordOrdinal` and
`sourceOrdering`. Same-`k1` records are all returned in source order and are
never deduplicated or winner-selected.

`e` is preserved as `rawEntryMetadata`, a lexicographic content-container
field. It is not re-labelled as a citation, not projected into the generic
`gloss` field, and not treated as semantic or functional evidence. The adapter
therefore introduces no generic analytical-contract change.

## Registration and runtime posture

The source is registered through
`src/shared/openInstrument/sanskritMwSourceFamilyRegistration.v0_1.ts` with the
locked state:

```text
REGISTERED_AND_DISABLED_PENDING_FUTURE_ACTIVATION_LANE
SANSKRIT_SOURCE_ENABLED_BY_DEFAULT=NO
SANSKRIT_SOURCE_RUNTIME_ACTIVE_AFTER_MERGE=NO
FUTURE_ACTIVATION_LANE_REQUIRED=YES
```

The registration is source-specific and is not imported by the live Discovery
server seam. Sanskrit remains unavailable to ordinary `/chat` use after this
implementation lane.

## Firewalls

- raw source bytes are never imported into Git;
- snapshot identity mismatch fails closed;
- malformed records fail closed without salvage;
- source multiplicity and exact case are preserved;
- pronunciation, Voice path, Gamma, and ZC remain `Null`;
- candidate generation, ranking, filtering, winner policy, and analytical
  semantics are unchanged;
- no S5 32-record experiment or Discovery execution is performed.
