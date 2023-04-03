import { NavLink } from "react-router-dom";
import { Icon } from "../../Assets/Icons";
import {
  fetchJson,
  restpointPrefix,
  useGetCurrentUser,
} from "../../Apis/hooks";
import { Button } from "../Common/Button";
import { User } from "../../Apis/api-types";
import { useState } from "react";
import { Tooltip } from "antd";
import { Loading } from "../Common/Loading";

/**
 * MAIN COMPONENT
 **/
export function LoggedInUser() {
  const { isLoading, data: user, refetch: refetchUser } = useGetCurrentUser();

  const [attemptingAccessChange, setAttemptingAccessChange] = useState(false);

  const attemptLogin = () => {
    setAttemptingAccessChange(true);

    fetchJson<User>(`${restpointPrefix}/login`)
      .then((response) => {
        refetchUser();
        setAttemptingAccessChange(false);
      })
      .catch(() => setAttemptingAccessChange(false));
  };
  const attemptLogout = () => {
    setAttemptingAccessChange(true);

    fetchJson(`${restpointPrefix}/logout`)
      .then((response) => {
        refetchUser();
        setAttemptingAccessChange(false);
      })
      .catch(() => setAttemptingAccessChange(false));
  };

  return !user ? (
    <Button onClick={attemptLogin} disabled={attemptingAccessChange}>
      LOG IN
    </Button>
  ) : (
    <Tooltip
      placement="bottom"
      color=""
      title={
        <div className="userDropdown">
          <NavLink to={"/usage-plans"}>API Keys</NavLink>
          <div
            onClick={attemptLogout}
            role="button"
            className={attemptingAccessChange ? "disabled" : ""}
          >
            LOG OUT
          </div>
        </div>
      }
    >
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
    </Tooltip>
  );
}
