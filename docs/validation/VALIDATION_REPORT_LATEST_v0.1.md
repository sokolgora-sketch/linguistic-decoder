# ZË-RO External Validation Report v0.1

**Dataset:** validation.dataset.v0.1
**Counts:** full=10, train=8, holdout=2
**Baseline:** missing

## Dataset summary

| Lang | Count |
| --- | --- |
| en | 6 |
| el | 1 |
| it | 1 |
| sa | 1 |
| sq | 1 |

| Tag | Count |
| --- | --- |
| kinship | 3 |
| nature | 2 |
| body | 1 |
| food | 1 |
| measure | 1 |
| music | 1 |
| tool | 1 |

## Mismatch (mask vs carrier)

with IPA: 10
mismatches: 7
rate: 0.7

## Clustering (lower within-tag distance is better)

| Space | withinAvg | acrossAvg | delta(across-within) |
| --- | --- | --- | --- |
| voiceSpace | 1.25 | 1.634146 | 0.384146 |
| baseline:vowelCount | 0.75 | 0.536585 | -0.213415 |
| baseline:orthography | 1 | 1.609756 | 0.609756 |
| control:shuffledTags | 1.75 | 1.585366 | -0.164634 |

## Top mismatches

| id | lang | word | ipa | ortho | ipaVoices | dist |
| --- | --- | --- | --- | --- | --- | --- |
| el_metra_v0_1 | el | μέτρο | /ˈme.tro/ |  | EO | 2 |
| en_island_v0_1 | en | island | /ˈaɪlənd/ | IA | AIË | 2 |
| en_knife_v0_1 | en | knife | /naɪf/ | IE | AI | 2 |
| en_rhythm_v0_1 | en | rhythm | /ˈɹɪðəm/ | Y | IË | 2 |
| en_water_v0_1 | en | water | /ˈwɔːtəɹ/ | AE | OË | 2 |
| en_bread_v0_1 | en | bread | /bɹɛd/ | EA | E | 1 |
| en_father_v0_1 | en | father | /ˈfɑːðəɹ/ | AE | AË | 1 |

## Diagnostics

notesCount: 0

| orthography unmapped | count |
| --- | --- |

| ipa unmapped | count |
| --- | --- |
