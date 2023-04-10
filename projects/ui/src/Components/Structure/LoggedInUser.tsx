import { NavLink } from "react-router-dom";
import { Icon } from "../../Assets/Icons";
import { restpointPrefix, useGetCurrentUser } from "../../Apis/hooks";
import { Loading } from "../Common/Loading";
import { Popover } from "@mantine/core";

/**
 * MAIN COMPONENT
 **/
export function LoggedInUser() {
  const { isLoading, data: user } = useGetCurrentUser();

  // eslint-disable-next-line no-console
  console.log(user);

  return !user ? (
    <a href={`${restpointPrefix}/login`}>
      <div className="styledButton">LOGIN</div>
    </a>
  ) : (
    <Popover position="bottom">
      <Popover.Target>
        <div className="userDropdown">
          <NavLink to={"/usage-plans"}>API Keys</NavLink>
          <a href={`${restpointPrefix}/logout`}>
            <div className="styledButton">LOGOUT</div>
          </a>
        </div>
      </Popover.Target>
      <Popover.Dropdown>
        <div className="userHolder">
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <Icon.UserProfile className="userCircle" /> {user?.username}
              <Icon.DownArrow className="dropdownArrow" />
            </>
          )}
        </div>
      </Popover.Dropdown>
    </Popover>
  );
}
