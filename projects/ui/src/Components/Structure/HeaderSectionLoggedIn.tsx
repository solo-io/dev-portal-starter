import { Popover } from "@mantine/core";
import { useContext, useEffect, useMemo, useState } from "react";
import { di } from "react-magnetic-di";
import { NavLink, useLocation, useSearchParams } from "react-router-dom";
import { useGetCurrentUser } from "../../Apis/hooks";
import { Icon } from "../../Assets/Icons";
import { PortalAuthContext } from "../../Context/PortalAuthContext";
import { clientId, logoutEndpoint } from "../../user_variables.tmplr";

const HeaderSectionLoggedIn = () => {
  di(useGetCurrentUser);
  const { latestAccessToken } = useContext(PortalAuthContext);
  const { data: user } = useGetCurrentUser();
  const routerLocation = useLocation();
  const [opened, setOpened] = useState(false);

  const inUsagePlansArea = useMemo(
    () => routerLocation.pathname.includes("/usage-plans"),
    [routerLocation.pathname]
  );

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("state");
    newSearchParams.delete("session_state");
    newSearchParams.delete("code");
    setSearchParams(newSearchParams);
  }, [setSearchParams]);

  return (
    <Popover position="bottom" opened={opened} onChange={setOpened}>
      <Popover.Target>
        <button
          className="userLoginArea loggedIn"
          onClick={() => setOpened(!opened)}
        >
          <div className="userHolder">
            <Icon.UserProfile className="userCircle" />{" "}
            {!!user ? user.username : " "}
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
            href={`${logoutEndpoint}?id_token_hint=${latestAccessToken}&post_logout_redirect_uri=${window.location.origin}/logout&client_id=${clientId}`}
            className="logout"
          >
            Logout
          </a>
        </>
      </Popover.Dropdown>
    </Popover>
  );
};

export default HeaderSectionLoggedIn;
