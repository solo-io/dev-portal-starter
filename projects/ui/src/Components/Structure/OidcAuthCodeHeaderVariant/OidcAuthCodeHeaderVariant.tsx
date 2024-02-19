import { useContext, useMemo } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "../../../Assets/logo.svg";
import { AppContext } from "../../../Context/AppContext";
import { ErrorBoundary } from "../../Common/ErrorBoundary";
import { StyledTopNavContent, StyledTopNavHeader } from "../Header";
import { OidcAuthCodeHeaderDropdown } from "./OidcAuthCodeHeaderDropdown";

/**
 * This is for when there is an
 * oidcAuthorizationCode config in
 * the user's ExtAuthPolicy
 */
const OidcAuthCodeHeaderVariant = () => {
  const routerLocation = useLocation();

  const inAPIsArea = useMemo(() => {
    return ["/apis", "/api-details/"].some((s) =>
      routerLocation.pathname.includes(s)
    );
  }, [routerLocation.pathname]);

  const { pageContentIsWide } = useContext(AppContext);

  return (
    <>
      <StyledTopNavHeader aria-label="Site top level menus">
        <StyledTopNavContent pageContentIsWide={pageContentIsWide}>
          <div className="logoContainer">
            <Link to="/" aria-hidden="true">
              <Logo />
            </Link>
          </div>
          <div className="siteNavigating">
            <NavLink to={"/"} className={"navLink"} end>
              Home
            </NavLink>
            <NavLink
              to={"/apis"}
              className={`navLink ${inAPIsArea ? "active" : ""}`}
            >
              APIs
            </NavLink>
            <div className="divider" />
            <ErrorBoundary fallback="Access issues" class="horizontalError">
              <OidcAuthCodeHeaderDropdown />
            </ErrorBoundary>
          </div>
        </StyledTopNavContent>
      </StyledTopNavHeader>
    </>
  );
};

export default OidcAuthCodeHeaderVariant;
