import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router";
import { SWRConfig } from "swr";
import { SessionExpiredError } from "./Apis/sessionExpiry";
import { App } from "./Components/App";
import { ConfigErrorPage } from "./Components/Common/ConfigErrorPage";
import { ToasterWithOptions } from "./Components/Common/ToasterWithOptions";
import { AuthContextProvider } from "./Context/AuthContext";
import { configErrors } from "./user_variables.tmplr";

const renderApp = () => (
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

// A variable the app cannot interpret leaves it unable to say which behavior
// was asked for -- notably which authentication flow -- so it reports that
// instead of picking one and looking healthy while behaving unexpectedly.
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  configErrors.length > 0 ? (
    <ConfigErrorPage errors={configErrors} />
  ) : (
    renderApp()
  )
);
