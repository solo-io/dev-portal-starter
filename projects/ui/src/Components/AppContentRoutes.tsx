import styled from "@emotion/styled";
import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AppContext } from "../Context/AppContext";
import {
  oidcAuthCodeConfigCallbackPath,
  oidcAuthCodeConfigLogoutPath,
} from "../user_variables.tmplr";
import { ApiProductDetailsPage } from "./ApiProductDetails/ApiProductDetailsPage";
import { ApisPage } from "./Apis/ApisPage";
import { ErrorBoundary } from "./Common/ErrorBoundary";
import LoggedOut from "./Common/LoggedOut";
import { HomePage } from "./Home/HomePage";
import { Footer } from "./Structure/Footer";
import { UsagePlansPage } from "./UsagePlans/UsagePlansPage";
// import AdminSubscriptionsPage from "./AdminSubscriptions/AdminSubscriptionsPage";
// import AdminTeamsPage from "./AdminTeams/AdminTeamsPage";
// import { AppsPage } from "./Apps/AppsPage";
// import AppDetailsPage from "./Apps/Details/AppDetailsPage";
// import TeamDetailsPage from "./Teams/Details/TeamDetailsPage";
// import { TeamsPage } from "./Teams/TeamsPage";

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
  const { portalServerType } = useContext(AppContext);

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
          path="/apis/:apiProductId"
          element={
            <ErrorBoundary fallback="There was an issue displaying the API Product details">
              <ApiProductDetailsPage />
            </ErrorBoundary>
          }
        />
        {/* // Note: Removing sections for GGv2 demo.
        <Route
          path="/apps"
          element={
            <ErrorBoundary fallback="There was an issue displaying the list of Apps">
              <AppsPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/apps/:appId"
          element={
            <ErrorBoundary fallback="There was an issue displaying the App details">
              <AppDetailsPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/teams"
          element={
            <ErrorBoundary fallback="There was an issue displaying the list of Teams">
              <TeamsPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/teams/:teamId"
          element={
            <ErrorBoundary fallback="There was an issue displaying the Team details">
              <TeamDetailsPage />
            </ErrorBoundary>
          }
        /> 
        {/*
        
        // Admin Routes
        * /}
        <Route
          path="/admin/subscriptions"
          element={
            <ErrorBoundary fallback="There was an issue displaying the Admin Teams page">
              <AdminSubscriptionsPage />
            </ErrorBoundary>
          }
        />
        <Route
          path="/admin/teams"
          element={
            <ErrorBoundary fallback="There was an issue displaying the Admin Subscriptions page">
              <AdminTeamsPage />
            </ErrorBoundary>
          }
        />*/}
        {/* 

        Gloo Mesh Gateway Routes
        */}
        {portalServerType === "gloo-mesh-gateway" && (
          <>
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
          </>
        )}
      </Routes>

      <Footer />
    </MainContentContainer>
  );
}

export default AppContentRoutes;
