import { Popover } from "@mantine/core";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { restpointPrefix, useGetCurrentUser } from "../../Apis/hooks";
import { Icon } from "../../Assets/Icons";

/**
 * MAIN COMPONENT
 **/
export function LoggedInUser() {
  const { data: user } = useGetCurrentUser();
  const [opened, setOpened] = useState(false);

  // eslint-disable-next-line no-console
  console.log(user);

  return !user ? (
    <a href={`${restpointPrefix}/login`}>
      <div className="styledButton">Login</div>
    </a>
  ) : (
    <Popover position="bottom" opened={opened} onChange={setOpened}>
      <Popover.Target>
        <div className="userHolder" onClick={() => setOpened(!opened)}>
          <Icon.UserProfile className="userCircle" /> {user?.username}
          <Icon.DownArrow className="dropdownArrow" />
        </div>
      </Popover.Target>
      <Popover.Dropdown>
        <div className="userDropdown">
          <NavLink to={"/usage-plans"} onClick={() => setOpened(!opened)}>
            API Keys
          </NavLink>
          <a
            href={`${restpointPrefix}/logout`}
            onClick={() => setOpened(!opened)}
          >
            Logout
          </a>
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}
