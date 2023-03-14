import { AppContextProvider } from "../Context/AppContext";
import AppContent from "./AppContent";

function App() {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

export default App;
