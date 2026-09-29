# Bundled CMUdict pronunciation source

This directory contains the exact offline pronunciation artifact used by the
Open Instrument v0.1 spoken-first runtime.

- Source: CMUdict, Carnegie Mellon University
- Repository: `https://github.com/cmusphinx/cmudict.git`
- Revision: `74790861f652b15e4ac49015a90074ad62a27690`
- File: `cmudict.dict`
- SHA-256: `81917843c7f44ce2b094ac63873c2c7a4cf802040792c455ba3ca406891c3d22`
- Bytes: `3618488`
- Source notation: `ARPABET`
- Runtime profile: `open-instrument.cmudict-arpabet-en-us.v0_1`
- License: `cmudict.LICENSE`
- Runtime mode: offline; no network, provider, or G2P fallback

The adapter preserves the source pronunciation, source form, variant order,
source revision, and source notation. It maps only the vowel categories frozen
by `OPEN_INSTRUMENT_PRONUNCIATION_TO_VOICE_AUTHORITY_CONTRACT_V0_1`.

The complete CMUdict base vowel inventory is handled explicitly in the source
profile. Unsupported source categories remain Null; spelling is never used as a
pronunciation fallback.
