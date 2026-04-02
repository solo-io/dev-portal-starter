---
name: fix-ui-cves
description: "Audit and remediate security vulnerabilities in a frontend package using yarn audit, trivy, and grype."
---

# Fix UI CVEs

All scripts are at `.claude/skills/fix-ui-cves/scripts/`.

Before starting, create a todo list with these items:
- Find UI dir + detect pkg manager
- Ensure correct Node version
- Install scanners
- Scan for vulnerabilities
- Fix each vulnerability
- Re-scan to confirm fixes
- Peer dependency alignment
- Prune resolutions
- Build
- Report

Mark each item complete as you finish it.

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

## 5. Re-scan to confirm

```sh
bash .claude/skills/fix-ui-cves/scripts/scan.sh <UI_DIR> <PKG_MANAGER>
```

If issues remain, repeat step 4 with a different approach.

## 6. Peer dependency alignment (AI)

After upgrading a suite package (storybook, eslint, babel, jest), check sibling packages for mismatched peer deps. Upgrade siblings to match, or update import paths if the suite consolidated APIs into the root package.

## 7. Prune resolutions (AI)

For each resolution added: remove it, run `$PKG_MANAGER install`, check the lockfile. If the safe version still resolves naturally, leave it removed — otherwise restore.

## 8. Build

```sh
# Output: 1=passed, 0=failed
bash .claude/skills/fix-ui-cves/scripts/build.sh <UI_DIR> <PKG_MANAGER>
```

## 9. Report

List: direct upgrades, resolutions added/removed, peer dep changes, scanner results.

## Notes

- Prefer direct upgrades over resolutions.
- Use `>=safe-version` for resolutions unless a peer dep cap is needed.
- If a CVE has no fix available, report it and skip rather than breaking the build.
