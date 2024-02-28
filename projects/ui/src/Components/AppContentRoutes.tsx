import styled from "@emotion/styled";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  oidcAuthCodeConfigCallbackPath,
  oidcAuthCodeConfigLogoutPath,
} from "../user_variables.tmplr";
import { ApiDetailsPage } from "./ApiDetails/ApiDetailsPage";
import { ApisPage } from "./Apis/ApisPage";
import { ErrorBoundary } from "./Common/ErrorBoundary";
import LoggedOut from "./Common/LoggedOut";
import { HomePage } from "./Home/HomePage";
import { Footer } from "./Structure/Footer";

const MainContentContainer = styled.div`
  grid-area: contentcontainer;

  display: grid;
  grid-template-rows: 1fr 40px;
  grid-template-areas:
    "content"
    "footer";

  min-height: 100%;
`;

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
    <MainContentContainer>
      <Routes>
        <Route
          path={oidcAuthCodeConfigCallbackPath}
          element={<Navigate to="/" replace />}
        />
        <Route
          path={oidcAuthCodeConfigLogoutPath}
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
          path="/api-details/:apiProductId/:apiVersion"
          element={
            <ErrorBoundary fallback="There was an issue displaying details about that API">
              <ApiDetailsPage />
            </ErrorBoundary>
          }
        />
      </Routes>

      <Footer />
    </MainContentContainer>
  );
}

export default AppContentRoutes;
