#!/usr/bin/env bash
# find-ui-dockerfile.sh: locate Dockerfiles for UI/frontend images.
# Output: one Dockerfile path per line, or "0" if none found.
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Find all Dockerfiles outside node_modules and .git.
mapfile -t DOCKERFILES < <(find "$REPO_ROOT" \( -name "Dockerfile" -o -name "Dockerfile.*" -o -name "*.Dockerfile" \) \
  -not -path "*/node_modules/*" -not -path "*/.git/*")

[[ ${#DOCKERFILES[@]} -eq 0 ]] && { echo "0"; exit 0; }
[[ ${#DOCKERFILES[@]} -eq 1 ]] && { echo "${DOCKERFILES[0]}"; exit 0; }

# Filter to UI/frontend related paths; fall back to all if none match.
UI_DOCKERFILES=$(printf '%s\n' "${DOCKERFILES[@]}" | grep -Ei '(ui|frontend|ui-frontend)' || true)
if [[ -n "$UI_DOCKERFILES" ]]; then
  echo "$UI_DOCKERFILES"
else
  printf '%s\n' "${DOCKERFILES[@]}"
fi
