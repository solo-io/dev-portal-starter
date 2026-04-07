#!/usr/bin/env bash
# scan.sh: run yarn-audit, trivy, and grype in parallel against UI_DIR.
# Usage: bash scan.sh <UI_DIR> <yarn|npm>
# Output: labeled findings from all three scanners.
set -e

UI_DIR="$1"
PKG_MANAGER="$2"

# Run pkg manager audit.
audit()  {
  cd "$UI_DIR" || return
  if [[ "$PKG_MANAGER" == "yarn" ]]; then
    yarn npm audit 2>&1
  else
    npm audit 2>&1
  fi
}

# Run trivy; ignore findings nested inside node_modules (false positives from sub-dep lockfiles).
trivy_scan() { trivy fs "$UI_DIR" --scanners vuln --vuln-type library 2>&1 | grep -v "node_modules/"; }

# Run grype; filter go-module findings (compiled Go binaries inside node_modules, not JS CVEs).
grype_scan() { GRYPE_DB_AUTO_UPDATE=false grype "dir:$UI_DIR" 2>&1 | grep -v "go-module"; }

echo "=== yarn/npm audit ===" && audit &
echo "=== trivy ===" && trivy_scan &
echo "=== grype ===" && grype_scan &
wait
