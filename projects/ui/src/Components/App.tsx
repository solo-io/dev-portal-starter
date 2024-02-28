import { Global, ThemeProvider } from "@emotion/react";
import { MantineProvider } from "@mantine/core";
import { AppContextProvider } from "../Context/AppContext";
import { colors, defaultTheme, globalStyles } from "../Styles";
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
        <MantineProvider
          theme={{
            colors: {
              blue: [
                colors.dropBlue,
                colors.splashBlueLight10,
                colors.splashBlueLight7,
                colors.splashBlue,
                colors.splashBlueDark10,
                colors.pondBlue,
                colors.lakeBlue,
                colors.lakeBlueDark10,
                colors.oceanBlue,
                colors.neptuneBlue,
              ],
            },
          }}
          withGlobalStyles
          withNormalizeCSS
        >
          <AppContent />
        </MantineProvider>
      </AppContextProvider>
    </ThemeProvider>
  );
}
