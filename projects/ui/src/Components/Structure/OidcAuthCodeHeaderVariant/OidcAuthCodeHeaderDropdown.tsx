import { Popover } from "@mantine/core";
import { useMemo, useState } from "react";
import { di } from "react-magnetic-di";
import { NavLink, useLocation } from "react-router-dom";
import { useGetCurrentUser } from "../../../Apis/hooks";
import { Icon } from "../../../Assets/Icons";
import {
  oidcAuthCodeConfigCallbackPath,
  oidcAuthCodeConfigLogoutPath,
} from "../../../user_variables.tmplr";

/**
 * MAIN COMPONENT
 **/
export function OidcAuthCodeHeaderDropdown() {
  di(useGetCurrentUser);
  const { data: user } = useGetCurrentUser();

  const routerLocation = useLocation();
  const inUsagePlansArea = useMemo(
    () => routerLocation.pathname.includes("/usage-plans"),
    [routerLocation.pathname]
  );

  const [opened, setOpened] = useState(false);

  // eslint-disable-next-line no-console
  // console.log(user);

  const isLoggedIn = !!user?.email || !!user?.username || !!user?.name;
  return !isLoggedIn ? (
    <div className="userLoginArea loggedOut">
      <a href={oidcAuthCodeConfigCallbackPath}>
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
          <div className="userHolder">
            <Icon.UserProfile className="userCircle" /> {user?.username}
            <Icon.DownArrow
              className={`dropdownArrow canRotate ${opened ? "rotate180" : ""}`}
            />
          </div>
        </button>
      </Popover.Target>
      <Popover.Dropdown className="userDropdown">
        <>
          <NavLink
            to={"/usage-plans"}
            className={inUsagePlansArea ? "active" : ""}
            onClick={() => setOpened(!opened)}
          >
            API Keys
          </NavLink>
          <a
            href={oidcAuthCodeConfigLogoutPath}
            onClick={() => setOpened(!opened)}
          >
            Logout
          </a>
        </>
      </Popover.Dropdown>
    </Popover>
  );
}
