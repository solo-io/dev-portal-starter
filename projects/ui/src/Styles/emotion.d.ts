import "@emotion/react";
import { SiteTheme } from "./index";

// Add colors to emotionjs styled element Theme - https://emotion.sh/docs/typescript#define-a-theme
declare module "@emotion/react" {
  // Disable this rule since we're updating an interface by extending it in a module
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  export interface Theme extends SiteTheme {}
}
