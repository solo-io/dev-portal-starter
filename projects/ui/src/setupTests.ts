/**
 * Vitest setup, run before each test file (see `test.setupFiles` in
 * vite.config.ts).
 */

// `insertedEnvironmentVariables` is a global the app reads at module-import
// time (declared in custom.d.ts): index.html defines it for dev builds and
// /projects/server/app.js injects real values when serving the built UI.
// Tests load modules without either, so define it here (in the jsdom
// environment, `window` is the global object, so this makes the bare
// identifier resolve).
(window as any).insertedEnvironmentVariables = {};
