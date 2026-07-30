#!/usr/bin/env bash
# ensure-scanners.sh: install/update trivy and grype, then update the grype DB.
# Output: 1=ready, 0=failed
set -e

# Install trivy if missing, upgrade if present.
ensure_trivy() { which trivy &>/dev/null && brew upgrade trivy &>/dev/null || brew install aquasecurity/trivy/trivy &>/dev/null; }

# Install grype via cask if missing (formula is deprecated).
ensure_grype() { which grype &>/dev/null || brew install --cask grype &>/dev/null; }

ensure_trivy & ensure_grype & wait && grype db update &>/dev/null && echo 1 || { echo 0; exit 1; }
