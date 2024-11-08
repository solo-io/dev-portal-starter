import { useContext, useMemo } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ReactComponent as Logo } from "../../../Assets/logo.svg";
import { AppContext } from "../../../Context/AppContext";
import { ErrorBoundary } from "../../Common/ErrorBoundary";
import { HeaderStyles } from "../Header.style";
import { OidcAuthCodeHeaderDropdown } from "./OidcAuthCodeHeaderDropdown";
import {apiPageReload} from "../../../user_variables.tmplr";

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
    <HeaderStyles.StyledTopNavHeader aria-label="Site top level menus">
      <HeaderStyles.StyledTopNavContent pageContentIsWide={pageContentIsWide}>
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
            onClick={apiPageReload === "true" ? () => (window.location.href = "/apis") : undefined}
            className={`navLink ${inAPIsArea ? "active" : ""}`}
          >
            APIs
          </NavLink>
          <div className="divider" />
          <ErrorBoundary fallback="Access issues" class="horizontalError">
            <OidcAuthCodeHeaderDropdown />
          </ErrorBoundary>
        </div>
      </HeaderStyles.StyledTopNavContent>
    </HeaderStyles.StyledTopNavHeader>
  );
};

export default OidcAuthCodeHeaderVariant;
