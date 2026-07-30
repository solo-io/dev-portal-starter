import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import { SWRConfig } from "swr";
import { SessionExpiredError } from "./Apis/sessionExpiry";
import { App } from "./Components/App";
import { ToasterWithOptions } from "./Components/Common/ToasterWithOptions";
import { AuthContextProvider } from "./Context/AuthContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <SWRConfig
    value={{
      // Retrying can't fix a dead session, and would re-fire the failing
      // request on the default backoff forever; SessionExpiryHandler owns the
      // recovery. All other errors keep SWR's default retry behavior.
      shouldRetryOnError: (error) => !(error instanceof SessionExpiredError),
    }}
  >
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
  </SWRConfig>
);
