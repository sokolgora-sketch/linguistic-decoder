# Analysis Capability Baseline v1 to Runtime Regression v0.1

This record separates the frozen historical baseline from a regression snapshot
of the current runtime. It does not revise a scientific or preregistration
artifact.

## Artifact identities

| Role | Path | SHA-256 | Bytes |
| --- | --- | --- | ---: |
| Frozen manifest and 57-case corpus | `tests/fixtures/openInstrument/analysis-capability-baseline.v1.manifest.json` | `80e161d14538875e3cd9225cd6d43b8db2c40f7f68ca2fef661da216430e7d0a` | 9,087 |
| Frozen historical v1 output | `tests/fixtures/openInstrument/analysis-capability-baseline.v1.json` | `1cf20269b3d9516c66b8470b60208699e48e0a3ff78608107054078e91bc6d6d` | 284,890 |
| Current-runtime regression output | `tests/fixtures/openInstrument/analysis-capability-regression-baseline.v0_1.json` | `7896d9e89e21afc9686fdee01cbc272ee7e4793895d1a37f136a5e33944e8e61` | 284,890 |

The successor uses the unchanged v1 manifest and output schema. It is generated
with `OPEN_INSTRUMENT_EXTERNAL_SOURCE_ROOT` set to the empty string, matching
the hosted CI invocation. This keeps the software regression artifact
independent of workstation-only optional English lexical sources. It is a
current-runtime software snapshot, not a replacement scientific baseline.

## Exact migration

Recursive JSON comparison found 12 changed leaf values. They
are exactly the two fingerprint fields for each of the 6 cases
below: `$.cases[index].fingerprint` and
`$.cases[index].repeatability.repeatedFingerprint`. All other JSON paths,
including case measurements, aggregates, invariant results, and case
identities, are equal to frozen v1.

| Index | Case ID | Frozen v1 fingerprint | Current regression fingerprint |
| ---: | --- | --- | --- |
| 0 | `canonical.study` | `94ec0943a9fc50f55b24666e178594b72a17c56caa369305c5a5999b716ef99f` | `afe6f4d1cafb75467ee68f8f7ac86c45879661b54a763df416edd709413d3ecf` |
| 1 | `canonical.damage` | `d51b07a3fdaf5d90abd461922f96aaad4e0186f476b46fdf6230b27b225406b3` | `20057f7adbdca40d15c8a3f36343ae9af859fc42fa32f3ed84f696f1e38c0ed9` |
| 3 | `canonical.water` | `d26d666c59e215d980781d6d8fc4e83bc995608687c53d3eb88835c1d1ac23a6` | `dfd6976a6a0a791e94da145e73a03623d6431f480ac5c1e3e087177b87d3cb0b` |
| 5 | `target-sense.water-physical-liquid` | `108af28a3db8ac2931ebac0873abe2fb0d3cd2fe937f0e3c628d2d2d3abf5ac0` | `ce9c0dd94947f4ec6519a50533323c6c89a3ab2033183b2f1eb7f8be2b428b79` |
| 35 | `scale50.break.action` | `be469d3d38e152a08f45940beaadab097f5eec584ccc95565bbf73d0bcdced7f` | `01dcb06740c50bad6adbaabb4c0295a4797c2c884dbd2e5e606581116c2f8e79` |
| 46 | `scale50.change.abstract` | `489931a15fa5c939bbb209398e885ad569aec575067bad04ce13b8b7e95c4adb` | `34fe0350238cb4229a2ad6c93a72e5e382be0f4dd0664dcb4b7f5ed9345c642b` |

The fingerprints reflect fail-closed candidate-side Voice projection in raw
discovery and functional interpretation under the pinned empty optional-source
environment. The case measurements and aggregate remain unchanged: 57 cases,
29 Null cases, 110 candidates, and 57/57 repeatable fingerprints. This
migration records software-output compatibility; it does not change source
membership, RootMap ranking, canonical operators, functional interpretations,
or scientific authority.
