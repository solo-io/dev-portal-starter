---
name: fix-ui-cves
description: "Audit and remediate security vulnerabilities in a frontend package (JS deps + Dockerfile OS packages) using yarn audit, trivy, and grype."
---

# Fix UI CVEs

All scripts are at `.claude/skills/fix-ui-cves/scripts/`.

Before starting, create a todo list with these items:
- Find UI dir + detect pkg manager
- Ensure correct Node version
- Install scanners
- Scan JS dependencies for vulnerabilities
- Fix each JS vulnerability
- Re-scan JS to confirm fixes
- Find + scan UI Dockerfiles for OS CVEs
- Fix each Dockerfile OS CVE
- Re-scan Dockerfile to confirm fixes
- Final scan gate (no fixable CVEs remaining)
- Peer dependency alignment
- Prune resolutions
- Build
- Verify dev server starts
- Report

Mark each item complete as you finish it.

## Rules

- Prefer direct upgrades over resolutions.
- Use `>=safe-version` for resolutions unless a peer dep cap is needed.
- If a CVE has no fix available, report it and skip rather than breaking the build.
- **Never edit `yarn.lock` or `package-lock.json` directly.** All changes must go through `package.json` (deps, devDeps, or resolutions) followed by `$PKG_MANAGER install` to regenerate the lockfile.
- **Dockerfile:** only modify the runtime/final stage. Prefer bumping the base image tag over adding package upgrade commands. Fall back to `apk add --upgrade` / `apt-get install --upgrade` for specific packages only if no updated image tag resolves the CVE. Never use blanket `apk upgrade`.

## 1. Find UI dir + pkg manager

```sh
# Output: "<UI_DIR> yarn|npm" — abort if output is "0"
bash .claude/skills/fix-ui-cves/scripts/find-ui-dir.sh
```

Capture `UI_DIR` and `PKG_MANAGER` from the output.

## 2. Ensure correct Node version

```sh
# Output: 1=ok, 0=wrong version and could not switch — abort if 0
bash .claude/skills/fix-ui-cves/scripts/ensure-node.sh
```

## 3. Install scanners + scan

```sh
# Installs/updates trivy and grype, updates grype DB. Output: 1|0 — abort if 0
bash .claude/skills/fix-ui-cves/scripts/ensure-scanners.sh

# Runs yarn/npm audit, trivy, and grype in parallel. Returns labeled findings from all three.
bash .claude/skills/fix-ui-cves/scripts/scan.sh <UI_DIR> <PKG_MANAGER>
```

Consolidate the findings into a deduplicated list of vulnerable packages + CVE IDs. If none → report clean and stop.

## 4. Fix each vulnerability (AI)

For each CVE, try in order:

a. **Direct upgrade** — bump in `package.json` deps/devDeps, run `$PKG_MANAGER install`.

b. **Resolution** — if transitive, add to `resolutions`:
   ```json
   "resolutions": { "pkg": ">=safe-version" }
   ```
   Check peer dep ranges first — if any dep caps the major, add a `<next-major` cap. Run `$PKG_MANAGER install` and watch for new peer dep warnings.

## 5. Re-scan JS to confirm

```sh
bash .claude/skills/fix-ui-cves/scripts/scan.sh <UI_DIR> <PKG_MANAGER>
```

If issues remain, repeat step 4 with a different approach.

## 6. Find + scan UI Dockerfiles for OS CVEs

```sh
# Output: one Dockerfile path per line, or "0" if none found.
bash .claude/skills/fix-ui-cves/scripts/find-ui-dockerfile.sh
```

For each Dockerfile found, scan its base image:

```sh
# Scans the runtime base image for OS package CVEs using trivy and grype in parallel.
bash .claude/skills/fix-ui-cves/scripts/scan-dockerfile.sh <DOCKERFILE>
```

Consolidate OS CVE findings per Dockerfile. If none → skip to step 9.

## 7. Fix each Dockerfile OS CVE (AI)

For each CVE, identify the vulnerable OS package and fix in order of preference:

a. **Update base image tag** — check if a newer patch tag of the base image exists that includes the fix (e.g., `nginx:1.27.3-alpine` → `nginx:1.27.4-alpine`). Use `docker pull` or check the registry to confirm the tag exists, then update the `FROM` line. Re-scan after updating to verify the CVE is resolved before moving on.

b. **Upgrade specific package** — if no updated image tag resolves the CVE, add or update an `apk add --upgrade` (Alpine) or `apt-get install --upgrade` (Debian/Ubuntu) line in the runtime stage, after the `FROM`:
   ```dockerfile
   RUN apk add --no-cache --upgrade <vulnerable-package>
   ```
   Prefer upgrading only the affected package rather than a blanket `apk upgrade`.

**Package not installed?** Enterprise scanners (Wiz, Snyk) often flag CVEs for packages available in the Alpine package index even if the package is not explicitly installed in the image — they attribute vulnerabilities to the OS layer, not just installed packages. If a CVE references a package that `apk info <pkg>` shows is not installed, still add the `apk add --no-cache --upgrade <pkg>` line. This pins the package to a safe version so it is fixed if ever pulled in as a transitive dependency, and satisfies scanners that inspect the Alpine package index.

Rules:
- Only modify the **runtime/final stage** (`FROM` line that is NOT `AS builder` or similar build-only alias).
- For multi-stage builds, do not add upgrade commands to intermediate build stages unless the CVE is also reachable there.
- If a CVE has no fix available yet in the Alpine/Debian repos, report it and skip.

## 8. Re-scan Dockerfile to confirm

```sh
bash .claude/skills/fix-ui-cves/scripts/scan-dockerfile.sh <DOCKERFILE>
```

If the CVE still appears, verify the upgraded package version satisfies the fix version and retry step 7.

## 9. Final scan gate

Re-run both the JS and Dockerfile scans one final time:

```sh
bash .claude/skills/fix-ui-cves/scripts/scan.sh <UI_DIR> <PKG_MANAGER>
bash .claude/skills/fix-ui-cves/scripts/scan-dockerfile.sh <DOCKERFILE>  # if Dockerfiles exist
```

Evaluate the results:

- **CVEs with a fix available that still appear** → the scan has **not passed**. Report `[FAILED] scan did not pass — <CVE IDs and packages still vulnerable>` and **stop** (do not proceed to PR).
- **CVEs with no fix available** → these are acceptable. Note them in the final report but do **not** block the PR.
- **No remaining fixable CVEs** → scan passed. Continue.

## 10. Peer dependency alignment (AI)

After upgrading a suite package (storybook, eslint, babel, jest), check sibling packages for mismatched peer deps. Upgrade siblings to match, or update import paths if the suite consolidated APIs into the root package.

## 11. Prune resolutions (AI)

For each resolution added: remove it, run `$PKG_MANAGER install`, check the lockfile. If the safe version still resolves naturally, leave it removed — otherwise restore.

## 12. Build

```sh
# Output: 1=passed, 0=failed
bash .claude/skills/fix-ui-cves/scripts/build.sh <UI_DIR> <PKG_MANAGER>
```

## 13. Verify dev server starts

```sh
# Output: 1=passed, 0=failed
bash .claude/skills/fix-ui-cves/scripts/verify.sh <UI_DIR> <PKG_MANAGER>
```

Starts whichever of `start` or `dev` exists in package.json, waits 20s to confirm the process doesn't crash, then kills it. If neither script exists, the check is skipped.

## 14. Report

List: direct upgrades, resolutions added/removed, peer dep changes, Dockerfile OS package changes, scanner results. Include any CVEs skipped due to no fix being available.

