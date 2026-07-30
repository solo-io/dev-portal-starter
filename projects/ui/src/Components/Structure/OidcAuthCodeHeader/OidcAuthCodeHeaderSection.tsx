import { Popover } from "@mantine/core";
import { useContext, useState } from "react";
import { NavLink } from "react-router";
import { useGetCurrentUser } from "../../../Apis/gg_hooks";
import { Icon } from "../../../Assets/Icons";
import { AppContext } from "../../../Context/AppContext";
import { useIsLoggedIn } from "../../../Context/AuthContext";
import {
  oidcAuthCodeConfigCallbackPath,
  oidcAuthCodeConfigLogoutPath,
} from "../../../user_variables.tmplr";
import { startLogin } from "../../../Utility/login/loginRedirect";
import { useInArea } from "../../../Utility/utility";
import { StyledUserDropdown } from "../BasicAuth/HeaderSectionLoggedIn";

/**
 * MAIN COMPONENT
 **/
export function OidcAuthCodeHeaderSection() {
  const { portalServerType } = useContext(AppContext);
  const isLoggedIn = useIsLoggedIn();
  const { data: user } = useGetCurrentUser();

  const [opened, setOpened] = useState(false);

  const inUsagePlansArea = useInArea(["/usage-plans"]);

  // eslint-disable-next-line no-console
  // console.log(user);

  return !isLoggedIn ? (
    <div className="userLoginArea loggedOut">
      {/* The href is kept for native anchor semantics (middle-click, copy
          link); a normal click goes through the shared startLogin() so the
          header and the session-expired re-login start sign-in the same way. */}
      <a
        href={oidcAuthCodeConfigCallbackPath}
        onClick={(e) => {
          e.preventDefault();
          startLogin();
        }}
      >
        <div className="styledButton">LOGIN</div>
      </a>
    </div>
  ) : (
    <Popover position="bottom" opened={opened} onChange={setOpened}>
      <Popover.Target>
        <button
          className="userLoginArea loggedIn"
          onClick={() => setOpened(!opened)}
        >
          {/*
           * Note: The "userHolder" class is kept here for testing purposes.
           */}
          <div className="userHolder dropdownContainer">
            <Icon.UserProfile className="userCircle" /> {user?.username ?? ""}
            <Icon.DownArrow
              className={`dropdownArrow canRotate ${opened ? "rotate180" : ""}`}
            />
          </div>
        </button>
      </Popover.Target>
      <StyledUserDropdown>
        <>
          {portalServerType === "gloo-mesh-gateway" && (
            <NavLink
              to={"/usage-plans"}
              className={inUsagePlansArea ? "active" : ""}
              onClick={() => setOpened(!opened)}
            >
              API Keys
            </NavLink>
          )}
          <a
            href={oidcAuthCodeConfigLogoutPath}
            onClick={() => setOpened(!opened)}
          >
            Logout
          </a>
        </>
      </StyledUserDropdown>
    </Popover>
  );
}
