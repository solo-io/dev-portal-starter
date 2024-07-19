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
    svgr(),
  ],
  build: {
    // This can be enabled for Google Lighthouse testing, but should be set
    // to false for actual builds since it adds a lot to the build size.
    sourcemap: false,
  },
});
