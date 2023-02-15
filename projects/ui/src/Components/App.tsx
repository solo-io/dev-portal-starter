import { useEffect } from "react";
import { AppContextProvider } from "../Context/AppContext";
import { useGetPokemonByNameQuery } from "../redux/services/pokemon";
import AppContent from "./AppContent";

function App() {
  const { data, error, isLoading } = useGetPokemonByNameQuery("bulbasaur");
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(data, error, isLoading);
  }, [data, error, isLoading]);

  // eslint-disable-next-line no-console
  console.log(import.meta.env, import.meta.env.VITE_UI_VERSION);
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
}

export default App;
