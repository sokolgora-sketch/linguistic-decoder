#!/usr/bin/env bash
set -euo pipefail

WITH_GATE="${1:-}"

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

ERROR=0
MODEL="src/shared/freeOperatorEvidence.v0_1.ts"
TEST="tests/freeOperatorEvidence.v0_1.spec.ts"

echo "=== DOCK canonical audit v0.1 ==="

echo
echo "=== check free-operator model exists ==="
if [ ! -f "$MODEL" ]; then
  echo "DRIFT: missing $MODEL"
  ERROR=1
else
  echo "OK: $MODEL exists"
fi

echo
echo "=== check canonical categories ==="
REQUIRED_CATS=(
  "free_operator_attested"
  "functional_motivation_supported"
  "derivative_family_support"
  "homophone_collision"
  "historical_origin_not_claimed"
  "user_decides"
)

for cat in "${REQUIRED_CATS[@]}"; do
  if ! rg -n -F -- "\"$cat\"" "$MODEL" >/dev/null; then
    echo "DRIFT: missing category $cat in $MODEL"
    ERROR=1
  else
    echo "OK: $cat"
  fi
done

echo
echo "=== check boundary locks ==="
if ! rg -n -F -- 'historicalOriginClaim: "not_claimed"' "$MODEL" >/dev/null; then
  echo 'DRIFT: model does not lock historicalOriginClaim: "not_claimed"'
  ERROR=1
else
  echo 'OK: historicalOriginClaim locked to "not_claimed"'
fi

if ! rg -n -F -- 'userDecisionPosture: "user_decides"' "$MODEL" >/dev/null; then
  echo 'DRIFT: model does not lock userDecisionPosture: "user_decides"'
  ERROR=1
else
  echo 'OK: userDecisionPosture locked to "user_decides"'
fi

echo
echo "=== check DA examples are covered by tests ==="
for needle in "Gheg da" "Tosk daj" "ndaj" "ndarë" "gave"; do
  if ! rg -n -F -- "$needle" "$TEST" >/dev/null; then
    echo "DRIFT: missing test coverage phrase: $needle"
    ERROR=1
  else
    echo "OK: test covers $needle"
  fi
done

echo
echo "=== check no old blunt derivative reason remains ==="
if rg -n -F -g '!tests/__snapshots__/**' -- "externalCitation_derivative_not_embryo" src tests; then
  echo "DRIFT: old blunt derivative reason remains"
  ERROR=1
else
  echo "OK: old blunt derivative reason absent"
fi

echo
echo "=== check historical-origin drift words in runtime src ==="
HISTORICAL_HITS="$(
  rg -n -i -- "historicalOriginClaim:|originClaim: \"(?!not_claimed)|loanword.*therefore|latin_loanword|winnerClaim: true|languageSuperiorityClaim: true" src \
    --glob '*.ts' \
    --glob '!**/*.spec.ts' \
    --glob '!**/*.test.ts' \
    2>/dev/null || true
)"

if [ -n "$HISTORICAL_HITS" ]; then
  echo "DRIFT: possible historical-origin/winner/superiority claim in runtime src:"
  printf '%s\n' "$HISTORICAL_HITS"
  ERROR=1
else
  echo "OK: no obvious historical-origin/winner/superiority drift in runtime src"
fi


echo
echo "=== check validator exposes canonical diagnostics ==="
VALIDATOR="src/shared/reviewedExternalLexiconEvidenceGate.validator.v0_1.ts"
for needle in "evidenceCategories" "freeOperatorDiagnostic" "classifyFreeOperatorEvidenceV0_1"; do
  if ! rg -n -F -- "$needle" "$VALIDATOR" >/dev/null; then
    echo "DRIFT: validator missing canonical diagnostic hook: $needle"
    ERROR=1
  else
    echo "OK: validator exposes $needle"
  fi
done


echo
echo "=== check free-operator profile contract ==="
PROFILE="src/shared/freeOperatorProfile.v0_1.ts"
if [ ! -f "$PROFILE" ]; then
  echo "DRIFT: $PROFILE is missing"
  ERROR=1
else
  for token in "DA_FREE_OPERATOR_PROFILE_V0_1" "DI_FREE_OPERATOR_PROFILE_V0_1" "directFreeOperator" "derivativeFamilySupport" "homophoneCollisions"; do
    if rg -n -F -- "$token" "$PROFILE" >/dev/null; then
      echo "OK: profile exposes $token"
    else
      echo "DRIFT: profile missing $token"
      ERROR=1
    fi
  done
fi


echo
echo "=== check classifier is profile-driven ==="
CLASSIFIER="src/shared/freeOperatorEvidence.v0_1.ts"
if rg -n -F -- "FREE_OPERATOR_PROFILES_V0_1" "$CLASSIFIER" >/dev/null; then
  echo "OK: classifier reads free-operator profiles"
else
  echo "DRIFT: classifier does not read FREE_OPERATOR_PROFILES_V0_1"
  ERROR=1
fi

if rg -n -F -- 'operator === "da"' "$CLASSIFIER" >/dev/null; then
  echo "DRIFT: classifier still has DA-specific operator branch"
  ERROR=1
else
  echo "OK: classifier has no DA-specific operator branch"
fi

echo
echo "=== focused model test ==="
npm test -- tests/freeOperatorEvidence.v0_1.spec.ts --runInBand

if [ "$WITH_GATE" = "--with-gate" ]; then
  echo
  echo "=== gate:quick ==="
  npm run gate:quick
else
  echo
  echo "SKIP: gate:quick not run. Use: scripts/dock-canonical-audit.v0.1.sh --with-gate"
fi

echo
echo "=== dock verdict ==="
if [ "$ERROR" = "0" ]; then
  echo "DOCK PASS: canonical free-operator rule upheld."
  exit 0
fi

echo "DOCK FAIL: canonical drift detected."
exit 1
