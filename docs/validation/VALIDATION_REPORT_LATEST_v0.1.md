# ZË-RO External Validation Report v0.1

**Dataset:** validation.dataset.v0.1
**Counts:** full=8, train=7, holdout=1
**Baseline:** match

## Dataset summary

| Lang | Count |
| --- | --- |
| en | 6 |
| it | 1 |
| sq | 1 |

| Tag | Count |
| --- | --- |
| kinship | 2 |
| nature | 2 |
| body | 1 |
| food | 1 |
| music | 1 |
| tool | 1 |

## Mismatch (mask vs carrier)

with IPA: 8
mismatches: 6
rate: 0.75

## Clustering (lower within-tag distance is better)

| Space | withinAvg | acrossAvg | delta(across-within) |
| --- | --- | --- | --- |
| voiceSpace | 1.5 | 1.538462 | 0.038462 |
| baseline:vowelCount | 0.5 | 0.5 | 0 |
| baseline:orthography | 1 | 1.615385 | 0.615385 |
| control:shuffledTags | 2 | 1.5 | -0.5 |

## Top mismatches

| id | lang | word | ipa | ortho | ipaVoices | dist |
| --- | --- | --- | --- | --- | --- | --- |
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
