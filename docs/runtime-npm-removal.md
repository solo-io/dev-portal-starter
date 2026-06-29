# Why the runtime image removes npm

The serve stage of the [Dockerfile](../Dockerfile) deletes npm and npx:

```dockerfile
RUN rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx
```

This is safe and is what resolves the npm bundled-dependency CVEs
(`picomatch`, `brace-expansion`, `ip-address`).

## Why removing npm is safe

The container does not use npm at runtime. The entrypoint starts the server
directly with Node:

```dockerfile
ENTRYPOINT ... node ./bin/www
```

The UI is already built in the earlier `build_stage`, and only the compiled
server (which includes the built UI) is copied into the serve stage. Nothing in
the running image shells out to npm or npx, so deleting them changes no runtime
behavior — it only removes files that would otherwise sit unused on disk.

## Why this resolves the CVEs

The reported CVEs are in dependencies that npm bundles inside its own
`node_modules` — not in this project's dependencies. There were two ways to
address them:

1. Upgrade npm so it bundles patched versions of those dependencies.
2. Remove npm entirely, so the vulnerable files no longer exist in the image.

We use option 2 because it eliminates the files a scanner would flag, rather
than relying on a specific npm version staying patched. As a bonus, the base
image (`node:22.22.2-bookworm-slim`) already ships an npm (10.9.7) whose bundled
dependencies are the patched versions:

| Bundled dependency | Version in base image | Status   |
| ------------------ | --------------------- | -------- |
| `picomatch`        | 4.0.3                 | patched  |
| `brace-expansion`  | 2.0.2                 | patched  |
| `ip-address`       | 10.1.0                | patched  |

So even before removal the CVEs were addressed by the base image bump; removing
npm guarantees those files are gone from the runtime image regardless of what
the base image ships in the future.

## Why we don't run `npm install -g npm@latest`

An earlier approach upgraded npm in place to pull patched bundled dependencies.
That `npm install -g npm@latest` step fails deterministically on this base image
(`npm error code MODULE_NOT_FOUND` / `Cannot find module 'promise-retry'`) when
the bundled npm tries to replace itself mid-install. Removing npm avoids the
broken self-upgrade entirely and is a smaller, more durable change.
