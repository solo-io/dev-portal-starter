#!/usr/bin/env bash
# scan-dockerfile.sh: scan a Dockerfile's base image for OS CVEs using trivy and grype.
# Usage: bash scan-dockerfile.sh <DOCKERFILE>
# Output: labeled findings from both scanners.
set -e

DOCKERFILE="$1"
[[ -z "$DOCKERFILE" ]] && { echo "Usage: scan-dockerfile.sh <DOCKERFILE>"; exit 1; }

# Extract the final FROM line (runtime stage in multi-stage builds).
BASE_IMAGE=$(grep -i '^FROM' "$DOCKERFILE" | grep -iv ' as builder\b' | tail -1 | awk '{print $2}')
[[ -z "$BASE_IMAGE" ]] && { echo "Could not extract base image from $DOCKERFILE"; exit 1; }

echo "=== Dockerfile: $DOCKERFILE ==="
echo "=== Base image: $BASE_IMAGE ==="

trivy_scan() { trivy image "$BASE_IMAGE" --scanners vuln --vuln-type os 2>&1; }
grype_scan()  { GRYPE_DB_AUTO_UPDATE=false grype "$BASE_IMAGE" 2>&1; }

echo "=== trivy ===" && trivy_scan &
echo "=== grype ===" && grype_scan &
wait
