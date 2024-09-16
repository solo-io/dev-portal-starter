import { Global, ThemeProvider } from "@emotion/react";
import { MantineProvider } from "@mantine/core";
import { AppContextProvider } from "../Context/AppContext";
import { AppUtilsContextProvider } from "../Context/AppUtilsContext";
import { defaultTheme, globalStyles } from "../Styles";
import { mantineThemeOverride } from "../Styles/global-styles/mantine-theme";
import PortalServerTypeChecker from "../Utility/PortalServerTypeChecker";
import AppContent from "./AppContent";

/**
 * Currently this just wraps the app in a ContextProvider, which
 *   isn't being used. The context provider is a simple way to provide
 *   a "dark mode" alternative view or inject similar context-based needs.
 **/
export function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Global styles={globalStyles} />
      <AppUtilsContextProvider>
        <AppContextProvider>
          <PortalServerTypeChecker />

          <MantineProvider
            withGlobalStyles
            withNormalizeCSS
            theme={mantineThemeOverride}
          >
            <AppContent />
          </MantineProvider>
        </AppContextProvider>
      </AppUtilsContextProvider>
    </ThemeProvider>
  );
}
