#!/usr/bin/env bash
# ensure-node.sh: verify correct Node version is active; switch via fnm or nvm if needed.
# Output: 1=correct version active, 0=failed to switch
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Read required version from .nvmrc; strip leading 'v'.
required_version() { cat "$REPO_ROOT/.nvmrc" 2>/dev/null | tr -d 'v \n'; }

# Get current node major.minor.patch; strip leading 'v'.
current_version() { node --version 2>/dev/null | tr -d 'v \n'; }

# Try fnm then nvm to switch to the required version.
switch_node() {
  eval "$(fnm env 2>/dev/null)" && fnm use 2>/dev/null && return 0
  export NVM_DIR="$HOME/.nvm" && [[ -s "$NVM_DIR/nvm.sh" ]] && source "$NVM_DIR/nvm.sh" && nvm use 2>/dev/null && return 0
  return 1
}

REQUIRED="$(required_version)"
[[ -z "$REQUIRED" ]] && { echo 1; exit 0; }  # no .nvmrc — proceed
[[ "$(current_version)" == "$REQUIRED" ]] && { echo 1; exit 0; }

cd "$REPO_ROOT" && switch_node && echo 1 || { echo 0; exit 1; }
