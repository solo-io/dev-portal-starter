import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";
import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["react-magnetic-di/babel-plugin"],
      },
    }),
    eslint(),
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
});
