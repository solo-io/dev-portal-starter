import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import svgr from "vite-plugin-svgr";
// "vitest/config" re-exports Vite's defineConfig with the `test` block typed.
import { defineConfig } from "vitest/config";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["react-magnetic-di/babel-plugin"],
      },
    }),
    // Linting is a separate concern (and a separate CI step); running it on
    // every file the test runner transforms would just slow tests down.
    ...(process.env.VITEST ? [] : [eslint()]),
    svgr({
      // - The named ReactComponent export comes from vite-plugin-svgr.
      //   See this comment for the config: https://github.com/nrwl/nx/issues/19282#issuecomment-1877617377
      // - Any other svg imports (not matching "*.svg?react") use the default Vite
      //   static file import: https://vitejs.dev/guide/assets#importing-asset-as-url
      // - For SVGR options, see: https://react-svgr.com/docs/options/
      svgrOptions: {
        exportType: "named",
        ref: false,
        // Svgo is used to optimize SVG code before transforming it into a component.
        // We run this manually, using `yarn svgo`, after adding SVG assets.
        svgo: false,
        titleProp: true,
        icon: false,
      },
      // Specifies the files in the build the plugin should include.
      include: "**/*.svg?react",
    }),
  ],
  build: {
    // This can be enabled for Google Lighthouse testing, but should be set
    // to false for actual builds since it adds a lot to the build size.
    sourcemap: false,
  },
  test: {
    // Unit tests exercise browser-facing modules (window, sessionStorage, ...).
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./src/setupTests.ts"],
  },
});
