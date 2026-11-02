# Analysis Capability Baseline v1 to Runtime Regression v0.1

This record separates the frozen historical baseline from a regression snapshot
of the current runtime. It does not revise a scientific or preregistration
artifact.

## Artifact identities

| Role | Path | SHA-256 | Bytes |
| --- | --- | --- | ---: |
| Frozen manifest and 57-case corpus | `tests/fixtures/openInstrument/analysis-capability-baseline.v1.manifest.json` | `80e161d14538875e3cd9225cd6d43b8db2c40f7f68ca2fef661da216430e7d0a` | 9,087 |
| Frozen historical v1 output | `tests/fixtures/openInstrument/analysis-capability-baseline.v1.json` | `1cf20269b3d9516c66b8470b60208699e48e0a3ff78608107054078e91bc6d6d` | 284,890 |
| Current-runtime regression output | `tests/fixtures/openInstrument/analysis-capability-regression-baseline.v0_1.json` | `26d3cfd809ef8ee546bef96a24aeba43c6cae782240b83c2bc241c6efbe4c099` | 284,890 |

The successor was generated with `scripts/openInstrumentAnalysisCapabilityBaseline.v1.ts`
and the unchanged v1 manifest. It retains the existing v1 output schema and
corpus identifiers because the artifact shape and 57 inputs did not change.
Only the output file has a new name and purpose: it is a current-runtime
software regression snapshot, not a replacement scientific baseline.

## Exact migration

Recursive JSON comparison found 56 changed leaf values. They are exactly the
two fingerprint fields listed for each of the 28 cases below. For each row,
both `$.cases[index].fingerprint` and
`$.cases[index].repeatability.repeatedFingerprint` change from the listed old
value to the listed current value. All other JSON paths, including every case
measurement, aggregate, invariant result, and case identity, are equal.

| Index | Case ID | Frozen v1 fingerprint | Current regression fingerprint |
| ---: | --- | --- | --- |
| 0 | `canonical.study` | `94ec0943a9fc50f55b24666e178594b72a17c56caa369305c5a5999b716ef99f` | `b6fc3c8a4389f0f53767cd9b848b03ae6f498d66be8f1dca2cea8c85bac81802` |
| 1 | `canonical.damage` | `d51b07a3fdaf5d90abd461922f96aaad4e0186f476b46fdf6230b27b225406b3` | `e22515b2f5b0ebc9efe588443f433b4fac047c62a664e04806cf0052fadd665c` |
| 2 | `canonical.mystery` | `ea127e972dba602f01a321046f994a575dc2d1118860d69cad9cde911770d153` | `10c4e30b995f766364f0e7fad5ccb28b6503969f5f37fe9899be706fc73552aa` |
| 3 | `canonical.water` | `d26d666c59e215d980781d6d8fc4e83bc995608687c53d3eb88835c1d1ac23a6` | `0136164e82c6756a1790cbb3762aa6b7cbb5711f4dd0ab2d34a3df745de20269` |
| 4 | `target-sense.candle` | `6c14b30f506e58f60942e9d07aac3bbe14ba9da263fe0c73ad32a8fe5b5c7649` | `658ebeb3c29d80c878508524f3e570a9f67d9cce87c6f5d1edfe63506c5a083a` |
| 5 | `target-sense.water-physical-liquid` | `108af28a3db8ac2931ebac0873abe2fb0d3cd2fe937f0e3c628d2d2d3abf5ac0` | `68c71e150862468cc11058db5f8409197b20fb096e76dccc464ca36fb8259be6` |
| 8 | `scale50.river.nature` | `97d6a91ebeaaf882d4f6b70c1c3c1dc3faa77c5f90976ca74b0f6f536e1f010c` | `79c18f509021909363a38cfce20e6c75d539afac4477d1cbd4ac3b3e2e875ac9` |
| 9 | `scale50.mountain.nature` | `63eb2b3eecf79afe1d99c27afe60a64d5374a22417baa2b6ef00b638f8e479b7` | `1223f44532777b3760d8874c6a35fe42011564b7e74439fc790ea72ddb8748c3` |
| 10 | `scale50.stone.nature` | `d397b1029254de613e4ada7db4cd12a20eb1566bc9a8e5f37aa697b1ac7c29d2` | `bd0b615873bf98beafb7de53a12c3e44e341437d41bb9b05770979792aeb1014` |
| 11 | `scale50.tree.nature` | `3350761489d53c436fc1319cfb1aa2c40739a918b44b75638c6e9198c9cdfeb2` | `e07f8ff5a7f9f7ad59808b0c5815c586f426d4d7f09578602cde629a68a6e438` |
| 13 | `scale50.sea.nature` | `b76dad88692dca3756b21790cf08b845bdbffef63d5b0ca69d6613aefce8aebf` | `9a110bfe0d75045131dd7d397b6082f4cc67b6e5b8cf5127f63c2631d63a1a05` |
| 15 | `scale50.snow.nature` | `3f00ea642b49f576657e07cd656fece0ca38b1f494ded77a248d595b9b397c23` | `aa94bfe9c4c73f5419fac8b36f08510bd36d0da82681199beda45f0552f8d8a6` |
| 16 | `scale50.cloud.nature` | `c48725783255763be9c29d633fe7e9f3052fbb55278479a34590af9243596023` | `109e441d5935069e1a184f9c5e1d2639ff22472678f11ab9447df93854b67843` |
| 20 | `scale50.blood.body` | `aaee908b01b41269cfdf2b7365d77bdca4115bb198196f9eb55b21fda4e6f1d5` | `47f87bcf90a07a03f70fc5199d778c2b44179e6b1d7a686f010e71f9c0b49e18` |
| 22 | `scale50.skin.body` | `79cdef471aebf01d7ede3eeb88f66fe4f3e4d2d266d4f0b389cd2bc3887dcf35` | `9bc4f34604826541f56dfb5ea540349aaceb074e904584cdd2a6303ce94cc58a` |
| 29 | `scale50.speak.action` | `a3dcfeddffb8e6032057f68fc412211151036242f0c9dc607f17279a53696b87` | `2bd6ec48fca6c25012a7fc94aef5e944124b3a564998a4e400faecf16a2b18ea` |
| 32 | `scale50.drink.action` | `956b959d813b518a263c25fe18aedf3d67c3efaeb03c981799c6e296fb68c764` | `888528ced2b8ffca6b6377cf4067e7936519327deee612dccdaf1d2d14a7936e` |
| 33 | `scale50.sleep.action` | `03c01b074fe3b1720a63b5d7d0752bc102d9c3b21586aa59597de3ab991faa46` | `cacb0e6d74a860ef9e4c61b6100d10bfac37c69900cf6afc971f31c5174581e6` |
| 35 | `scale50.break.action` | `be469d3d38e152a08f45940beaadab097f5eec584ccc95565bbf73d0bcdced7f` | `8e88ef857b68f85292e283254d26902b020f349134bca6e955325629fc526171` |
| 37 | `scale50.truth.abstract` | `a309e391d024f46189e52d6450b7c462266971c648cdc1e5946e1e98671ecaed` | `21f469c8d958ca6ae662f5a2a922c0176121b3e6cfdab059e64219d4d522fa66` |
| 42 | `scale50.memory.abstract` | `1857102cb28f7271f5a5f102087ac55e3a22aa9792a59d198054455c1d6dd056` | `1ab80ddb22a908c12fc31260b4e26aa14ed277e049ed39cfb0e2298b73e0f51d` |
| 43 | `scale50.freedom.abstract` | `70c098bab9e55221b7c5ef61efc153206e92ae3c23e137834ab3c33a489a2a16` | `045c4a107f32138990d15d5f09d1242485ae33510ff5948f4ae0525c1e8cba4a` |
| 44 | `scale50.justice.abstract` | `18aa0db84a5d11a5910b1bedbd5a350b2762419be9a94de749fc5e46eeb649d9` | `67de47b3299aeb3c1994949050db0c0934db1995e0edd4e57321b0f8b57e5caa` |
| 46 | `scale50.change.abstract` | `489931a15fa5c939bbb209398e885ad569aec575067bad04ce13b8b7e95c4adb` | `69da31b0ca3eaf2977a32bed79f42d6dd0d8a80474480232bc8b936fce961ecc` |
| 47 | `scale50.mother.human-social` | `91192c658a2a2c0cdac9d5b92ca2fb18d41b673ae92ad50f70f4d57c54da8936` | `3ef7b548126b1d3bc421ec2c250e9ec8098f5a8d78a1a1b86a9f4b2a05e536a6` |
| 48 | `scale50.child.human-social` | `311f97cbb15da71a78b567d8d7f15e1e4f76a602ac54b4872a2a55dffb1c432c` | `c8fc66ed0f9715b13ec3ae57dd6606ea79edc6116e61d9a16a150527d03883a4` |
| 49 | `scale50.friend.human-social` | `107f62d3b65c4a607adf55a9ab398dd81854336afa3b533e687256292cbc3855` | `dec8bdbf53fd1044e13e4b6808c3ab5a36326ebaf3db26051c89d3b3eb2fd4fa` |
| 55 | `scale50.woman.human-social` | `3bf4486e412649297cdce95d8c8a55785249271e1f33a935da1f4e487d939ea2` | `d7c42f2cc6ecb428729d4e4b049c57232136b74ae4b8601fe5b13a06a598f602` |

Each fingerprint hashes the deterministic API result used by the regression
runner. These 28 hash pairs record the current API interpretation payload,
including the corrected candidate-side Voice authority result. The separate
case measurements and aggregate remain unchanged: 57 cases, 29 Null cases,
110 candidates, and 57/57 repeatable current fingerprints. This migration
records software-output compatibility; it does not change source membership,
RootMap ranking, canonical operators, functional interpretations, or any
scientific authority.
