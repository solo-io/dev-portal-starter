import { Global, ThemeProvider } from "@emotion/react";
import { MantineProvider } from "@mantine/core";
import { AppContextProvider } from "../Context/AppContext";
import { defaultTheme, globalStyles } from "../Styles";
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
      <AppContextProvider>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <AppContent />
        </MantineProvider>
      </AppContextProvider>
    </ThemeProvider>
  );
}
