import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { App } from "./Components/App";
import { ToasterWithOptions } from "./Components/Common/ToasterWithOptions";
import { PortalAuthContextProvider } from "./Context/PortalAuthContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <RouterProvider
    router={createBrowserRouter([
      {
        path: "*",
        element: (
          <PortalAuthContextProvider>
            <ToasterWithOptions />
            <App />
          </PortalAuthContextProvider>
        ),
      },
    ])}
  />
);
