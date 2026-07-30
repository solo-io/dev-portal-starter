#!/usr/bin/env bash
# build.sh: run the package manager build in UI_DIR to verify nothing is broken.
# Usage: bash build.sh <UI_DIR> <yarn|npm>
# Output: 1=passed, 0=failed
set -e

UI_DIR="$1"
PKG_MANAGER="$2"

cd "$UI_DIR" && $PKG_MANAGER run build && echo 1 || { echo 0; exit 1; }
