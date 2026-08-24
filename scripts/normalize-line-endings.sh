#!/bin/bash
# Normalize line endings to LF
git config core.safecrlf false
git add --renormalize -A
if ! git diff --cached --quiet; then
  git commit -m "Normalize line endings to LF [skip ci]" || true
  git push || true
fi
