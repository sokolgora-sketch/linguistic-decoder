#!/usr/bin/env bash
set -euo pipefail
cd ~/studio

echo "== confirm package.json lint script =="
node -p "require('./package.json').scripts.lint"

echo
echo "== find any .eslintignore anywhere (should be none outside node_modules) =="
find . -path "./node_modules" -prune -o -name ".eslintignore" -print

echo
echo "== run lint with explicit globs (bypass npm script completely) =="
npx eslint -c eslint.config.mjs \
  "src/**/*.{js,jsx,ts,tsx}" \
  "app/**/*.{js,jsx,ts,tsx}" \
  "tests/**/*.{js,jsx,ts,tsx}" \
  "scripts/**/*.{js,jsx,ts,tsx,mjs}" \
  2>&1 | head -n 80

echo
echo "== verify plugins installed =="
node -p "require('@typescript-eslint/eslint-plugin/package.json').version"
node -p "require('eslint-plugin-ban/package.json').version"
