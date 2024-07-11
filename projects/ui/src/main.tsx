import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { App } from "./Components/App";
import { ToasterWithOptions } from "./Components/Common/ToasterWithOptions";
import { AuthContextProvider } from "./Context/AuthContext";

ReactDM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider
    router={createBrowserRouter([
      {
        path: "*",
        element: (
          <AuthContextProvider>
            <ToasterWithOptions />
            <App />
          </AuthContextProvider>
        ),
      },
    ])}
  />
);
