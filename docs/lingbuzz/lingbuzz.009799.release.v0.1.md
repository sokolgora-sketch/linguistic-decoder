# LingBuzz 009799 — ZË-RO v0.1 (release lock)

- LingBuzz ID: 009799
- Landing page: https://ling.auf.net/lingbuzz/009799
- Published: Feb 2026 (per LingBuzz page)
- Release commit (repo): ab48e837f851ff59fcf3bccfbd123b2f6c1c0470
- PDF source (markdown): docs/lingbuzz/instrument-baseline-report.v0.1.md

## Reproduce (instrument baselines)
```bash
npm install
npm run gate:quick

npm test -- tests/research/turkish.spectrum.step20.v0.1.spec.ts
npm test -- tests/research/pseudowords.spectrum.step20.v0.1.spec.ts
npm test -- tests/research/taiwan.spectrum.rootOnly.v1.0.spec.ts
```

## Notes
- v0.1 is a measurement + reproducibility report (not a semantics-proof claim).
- Keep v0.1 immutable; publish improvements as new LingBuzz entries (v0.2, v0.3...).
