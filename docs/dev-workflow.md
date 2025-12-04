# ZË-RO / Linguistic Decoder — Dev Workflow

This repo has strict rules so we don’t break the Seven-Voices engine or the Firebase Studio setup.

## 1. Core safety rails

- **Never** run auto-fix tools that touch many files at once (Gemini, `next lint --fix`, etc.).
- Treat `tsconfig`, `package.json`, `jest.config`, and Firebase config as **high-risk**.  
  Only change them in very small, deliberate commits.
- Every change must keep:

  ```bash
  npm test
  npm run build
  ```