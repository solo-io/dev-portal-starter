import AppContent from "./AppContent";
import { AppContextProvider } from "./Context/AppContext";

function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

export default App;
