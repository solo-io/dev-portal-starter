import { colors } from "./colors";

export { colors } from "./colors";
export { globalStyles } from "./global-styles";

// Themes
export const defaultTheme = { ...colors };
export type SiteTheme = typeof defaultTheme;
