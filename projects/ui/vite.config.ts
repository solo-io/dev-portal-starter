import react from "@vitejs/plugin-react";
import svgr from "@svgr/rollup";
import { defineConfig } from "vite";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint(), svgr()],
  define: {
    Process: {
      env: {
        UI_VERSION: "ui-version",
        RESTPOINT: process.env.RESTPOINT,
      },
    },
  },
});
