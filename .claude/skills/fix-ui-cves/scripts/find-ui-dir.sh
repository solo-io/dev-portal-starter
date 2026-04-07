#!/usr/bin/env bash
# find-ui-dir.sh: locate the UI package dir and detect pkg manager.
# Output: "<UI_DIR> yarn|npm"  (1 line)
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Find all package.json files outside node_modules.
find_pkg_jsons() { find "$REPO_ROOT" -name "package.json" -not -path "*/node_modules/*"; }

# Pick the best package.json dir: prefer path containing ui/client/frontend, else first result.
pick_ui_dir() {
  local files=("$@")
  for f in "${files[@]}"; do echo "$f"; done | grep -Ei '/(ui|client|frontend)/' | head -1 | xargs dirname 2>/dev/null \
    || dirname "${files[0]}"
}

# Detect pkg manager for a dir (1=yarn only, no pnpm — already cleaned by detect-pkg-manager.sh).
detect_pkg_manager() { [[ -f "$1/yarn.lock" ]] && echo "yarn" || echo "npm"; }

mapfile -t PKG_JSONS < <(find_pkg_jsons)
[[ ${#PKG_JSONS[@]} -eq 0 ]] && { echo "0"; exit 1; }
[[ ${#PKG_JSONS[@]} -eq 1 ]] && UI_DIR="$(dirname "${PKG_JSONS[0]}")" || UI_DIR="$(pick_ui_dir "${PKG_JSONS[@]}")"

echo "$UI_DIR $(detect_pkg_manager "$UI_DIR")"
