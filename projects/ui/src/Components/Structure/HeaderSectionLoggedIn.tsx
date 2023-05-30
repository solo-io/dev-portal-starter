import { Popover } from "@mantine/core";
import { useContext, useMemo, useState } from "react";
import { di } from "react-magnetic-di";
import { NavLink, useLocation } from "react-router-dom";
import { useGetCurrentUser } from "../../Apis/hooks";
import { Icon } from "../../Assets/Icons";
import { PortalAuthContext } from "../../Context/PortalAuthContext";

const HeaderSectionLoggedIn = () => {
  di(useGetCurrentUser);
  const { data: user } = useGetCurrentUser();
  const routerLocation = useLocation();
  const { onLogout } = useContext(PortalAuthContext);
  const [opened, setOpened] = useState(false);

  const inUsagePlansArea = useMemo(
    () => routerLocation.pathname.includes("/usage-plans"),
    [routerLocation.pathname]
  );

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
          <button
            className="logout"
            onClick={() => {
              onLogout();
              setOpened(false);
            }}
          >
            Logout
          </button>
        </>
      </Popover.Dropdown>
    </Popover>
  );
};

export default HeaderSectionLoggedIn;
