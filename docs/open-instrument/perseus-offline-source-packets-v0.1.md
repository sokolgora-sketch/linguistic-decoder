# Perseus offline source packets v0.1

This lane adds a bounded, provenance-preserving packet contract for the two
offline Perseus XML sources already represented by the Open Instrument source
adapter. Raw XML is acquisition data, not a repository artifact: it remains in
the local temporary acquisition area and is verified by byte length and
SHA-256 before lexical extraction.

## Pinned sources

| tradition | repository commit | source path | bytes | SHA-256 |
| --- | --- | --- | ---: | --- |
| `scaife.lewis-short.v0_1` | `PerseusDL/lexica@1c34cdf756c63cf37db61bd366d733431dbd7aa0` | `CTS_XML_TEI/perseus/pdllex/lat/ls/lat.ls.perseus-eng2.xml` | `77415379` | `933ba8fde0ef06823f69a130c95ba6f345ece3cb1603514b17972d1edd421d32` |
| `scaife.middle-liddell.v0_1` | `PerseusDL/canonical-pdlrefwk@02768b0c37d6102be4899fc0eb57f9d348195243` | `data/viaf66541464/001/viaf66541464.001.perseus-eng1.xml` | `20190148` | `e273dbed7938de7ab9ed4cf4af0e93216141f89226318a697c94b5d43f924cb7` |

Both sources were acquired and verified on `2026-11-05`. Their headers identify
the Perseus Digital Library and the historical source authors. Reuse is
recorded as CC BY-SA 4.0 with attribution, preservation of the availability
statement, and the obligation to offer modifications as applicable to the
source header.

## Extraction boundary

The implementation uses the namespace-aware `saxes` parser and accepts the
canonical TEI namespace (`http://www.tei-c.org/ns/1.0`) for `TEI` documents and
the unnamespaced legacy `TEI.2` profile used by both pinned files. Relevant
elements must remain in the document's accepted namespace; foreign-namespace
roots and lexical elements are rejected. It preserves source spelling, sense
order, identifiers, and an explicit review-required status. It rejects DTDs,
external entities, malformed or unsupported XML, ambiguous selectors, and
inputs exceeding bounded resource limits.

`FOUND` packets contain only verified source metadata and review-required source
extraction. `NOT_FOUND` requires an authorized completed lookup over a complete
verified snapshot. Packets reject target, embryo, semantic, controller, and
prior-result fields.

FJALË remains fail-closed in this lane: no FJALË source was accessed, copied,
substituted, or treated as reusable authority. Its packet is explicitly
`SOURCE_UNAVAILABLE` with `REUSE_AUTHORITY_UNVERIFIED` and
`accessPerformed: false`.

A structurally valid packet is not, by itself, cryptographic proof that its
entry text came from the pinned source bytes. Byte-level source verification and
the packet's structural validation are separate boundaries; this lane does not
claim independent cryptographic provenance for extracted entry text.

## Source-entry binding v0.1

`verifyStrictBlindPerseusSourceEntryBindingV1` is the independent verification
boundary for an untrusted `FOUND` packet. It first checks the independently
supplied bytes against the immutable tradition definition, then re-extracts the
entry selected by the packet locator with the bounded TEI parser. It accepts
only when source identity, locator, entry ordinal, ID/key, attested spelling,
extracted text and ordered senses all match the re-extraction. Missing bytes,
modified bytes, foreign source identity, altered packet fields and malformed
locators fail closed with explicit reason codes.

The verifier does not accept a caller-supplied hash, boolean assertion or
manually constructed packet as provenance evidence. Structural packet validity
remains useful input validation, but it is not cryptographic proof that entry
text came from the pinned source bytes. The committed tests use deterministic
synthetic TEI fixtures for parser/contract adversaries; optional local
integration tests use only the independently verified pinned files at structural
entry ordinal `0`, without semantic target lookup or interpretation.

The frozen three-tradition/five-stage research coverage matrix and both real
execution locks are unchanged. This implementation performs no target lookup,
embryo lookup, reveal, model/provider execution, or research run.
