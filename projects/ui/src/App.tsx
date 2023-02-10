import AppContent from "./AppContent";
import { AppContextProvider } from "./Context/AppContext";

function App() {
  console.log(import.meta.env, import.meta.env.VITE_UI_VERSION);
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

export default App;
