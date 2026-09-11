import styled from "@emotion/styled";
import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router";
import { AppContext } from "../Context/AppContext";
import { useIsLoggedIn } from "../Context/AuthContext";
import {
  appliedOidcAuthCodeConfig,
  customPages,
  oidcAuthCodeConfigCallbackPath,
  oidcAuthCodeConfigLogoutPath,
} from "../user_variables.tmplr";
import { PKCE_CALLBACK_PATH } from "../Utility/login/loginRedirect";
import { getCustomPagePath } from "../Utility/utility";
import AdminAppsPage from "./AdminApps/AdminAppsPage";
import AdminSubscriptionsPage from "./AdminSubscriptions/AdminSubscriptionsPage";
import AdminTeamsPage from "./AdminTeams/AdminTeamsPage";
import { ApiDetailsPage } from "./ApiDetails/ApiDetailsPage";
import { ApisPage } from "./Apis/ApisPage";
import { AppsPage } from "./Apps/AppsPage";
import AppDetailsPage from "./Apps/Details/AppDetailsPage";
import { ErrorBoundary } from "./Common/ErrorBoundary";
import { Loading } from "./Common/Loading";
import LoggedOut from "./Common/LoggedOut";
import CustomPageLanding from "./CustomPage/CustomPageLanding";
import { HomePage } from "./Home/HomePage";
import { Footer } from "./Structure/Footer";
import TeamDetailsPage from "./Teams/Details/TeamDetailsPage";
import { TeamsPage } from "./Teams/TeamsPage";
import { UsagePlansPage } from "./UsagePlans/UsagePlansPage";

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
  const isLoggedIn = useIsLoggedIn();
  const { portalServerType } = useContext(AppContext);

  return (
    <MainContentContainer>
      {/* 
      // region Shared
      */}
      <Routes>
        {/*
        This must stay ahead of the gateway paths below: those default to
        "/login" and "/logout", and when two routes have the same path
        react-router matches the one declared first — so a "/logout" gateway
        route would shadow this handler, and clicking Logout would land back on
        the home page with the session still in place.
        */}
        <Route
          path={`/logout`}
          element={
            <ErrorBoundary fallback="There was an issue loading the Logout screen">
              <LoggedOut />
            </ErrorBoundary>
          }
        />
        {/*
        Where the identity provider lands the browser after a PKCE sign-in.
        The code exchange itself runs in the header, which is on every route;
        this only gives the user something to look at while it does, since
        `onLogin` navigates away as soon as it completes.
        */}
        {!appliedOidcAuthCodeConfig && (
          <Route
            path={PKCE_CALLBACK_PATH}
            element={<Loading message="Signing in..." />}
          />
        )}
        {/*
        In oidcAuthorizationCode (BFF) deployments the gateway owns these paths
        and lands the browser back on them after signing in or out, so the app
        just returns the user to where they were headed. They are unused in
        PKCE deployments, which use the callback route above.
        */}
        {appliedOidcAuthCodeConfig && (
          <>
            <Route
              path={oidcAuthCodeConfigCallbackPath}
              element={<Navigate to="/" replace />}
            />
            <Route
              path={oidcAuthCodeConfigLogoutPath}
              element={<Navigate to="/" replace />}
            />
          </>
        )}
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
          path="/apis/:id"
          element={
            <ErrorBoundary fallback="There was an issue displaying the API Product details">
              <ApiDetailsPage />
            </ErrorBoundary>
          }
        />
        {/* 
        // region GG
        */}
        {portalServerType === "gloo-gateway" && isLoggedIn && (
          <>
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
        
            Admin Routes
            */}
            <Route
              path="/admin/subscriptions"
              element={
                <ErrorBoundary fallback="There was an issue displaying the Admin Teams page">
                  <AdminSubscriptionsPage />
                </ErrorBoundary>
              }
            />
            <Route
              path="/admin/apps"
              element={
                <ErrorBoundary fallback="There was an issue displaying the Admin Apps page">
                  <AdminAppsPage />
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
            />
          </>
        )}
        {/* 

        // region GMG
        */}
        {portalServerType === "gloo-mesh-gateway" && (
          <>
            {isLoggedIn && (
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
          </>
        )}
        {customPages.map((page) => (
          <Route
            key={page.path}
            path={getCustomPagePath(page)}
            element={
              <ErrorBoundary
                fallback={`There was an issue displaying the custom ${page.title} page.`}
              >
                <CustomPageLanding />
              </ErrorBoundary>
            }
          />
        ))}
      </Routes>

      <Footer />
    </MainContentContainer>
  );
}

export default AppContentRoutes;
