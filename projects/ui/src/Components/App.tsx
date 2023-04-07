import { MantineProvider } from "@mantine/core";
import { AppContextProvider } from "../Context/AppContext";
import AppContent from "./AppContent";

/**
 * Currently this just wraps the app in a ContextProvider, which
 *   isn't being used. The context provider is a simple way to provide
 *   a "dark mode" alternative view or inject similar context-based needs.
 **/
export function App() {
  return (
    <AppContextProvider>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <AppContent />
      </MantineProvider>
    </AppContextProvider>
  );
}
