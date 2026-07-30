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

// Node ships its own file-backed `localStorage` global, which shadows jsdom's
// implementation and arrives with none of the Storage methods on it (accessing
// it also emits a `--localstorage-file` warning). Install a working in-memory
// Storage so code under test can use `localStorage` as it would in a browser.
// `sessionStorage` is not shadowed, so it needs no equivalent.
const storage = new Map<string, string>();
Object.defineProperty(window, "localStorage", {
  configurable: true,
  value: {
    get length() {
      return storage.size;
    },
    key: (i: number) => [...storage.keys()][i] ?? null,
    getItem: (k: string) => storage.get(String(k)) ?? null,
    setItem: (k: string, v: string) => void storage.set(String(k), String(v)),
    removeItem: (k: string) => void storage.delete(String(k)),
    clear: () => storage.clear(),
  } satisfies Storage,
});
