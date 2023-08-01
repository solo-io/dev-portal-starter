import { Navigate, Route, Routes } from "react-router-dom";
import { ApiDetailsPage } from "./ApiDetails/ApiDetailsPage";
import { ApisPage } from "./ApisList/ApisPage";
import { ErrorBoundary } from "./Common/ErrorBoundary";
import LoggedOut from "./Common/LoggedOut";
import { HomePage } from "./Home/HomePage";
import { Footer } from "./Structure/Footer";
import { UsagePlansPage } from "./UsagePlans/UsagePlansPage";

/**
 * ROUTING COMPONENT
 *    This handles all our routing, but also operates as an
 *      error fallback of last resort. We typically try to have
 *      smaller sections of pages fail on their own, but if
 *      something goes wrong with the page this should stop the entire
 *      app from crashing ungracefully while at least letting us
 *      know the area that failed.
 **/
function AppContentRoutes() {
  return (
    <div className="MainContentContainer">
      <Routes>
        <Route
          path="/portal-server/v1/login"
          element={<Navigate to="/" replace />}
        />
        <Route
          path="/portal-server/v1/logout"
          element={<Navigate to="/" replace />}
        />
        <Route
          path={`/logout`}
          element={
            <ErrorBoundary fallback="There was an issue loading the Logout screen">
              <LoggedOut />
            </ErrorBoundary>
          }
        />
        <Route
          path="/"
          element={
            <ErrorBoundary fallback="There was an issue loading the Platform">
              <HomePage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/apis"
          element={
            <ErrorBoundary fallback="There was an issue displaying the list of APIs">
              <ApisPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/api-details/:apiId"
          element={
            <ErrorBoundary fallback="There was an issue displaying details about that API">
              <ApiDetailsPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/usage-plans"
          element={
            <ErrorBoundary fallback="There was an issue displaying the list of Usage Plans">
              <UsagePlansPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/usage-plans/:apiId"
          element={
            <ErrorBoundary fallback="There was an issue displaying information about the Usage Plan">
              <UsagePlansPage />
            </ErrorBoundary>
          }
        />
      </Routes>

      <Footer />
    </div>
  );
}

export default AppContentRoutes;
