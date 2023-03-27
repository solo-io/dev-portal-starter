import { NavLink } from "react-router-dom";
import { Icon } from "../../Assets/Icons";
import {
  fetchJson,
  restpointPrefix,
  useGetCurrentUser,
} from "../../Apis/hooks";
import { Button } from "../Common/Button";
import { User } from "../../Apis/api-types";
import { useEffect, useState } from "react";
import { Tooltip } from "antd";

/**
 * MAIN COMPONENT
 **/
export function LoggedInUser() {
  const { isLoading, data: user } = useGetCurrentUser();

  const [attemptingAccessChange, setAttemptingAccessChange] = useState(false);
  const [shownUser, setShownUser] = useState<User>();

  useEffect(() => {
    setShownUser(user || undefined);
  }, [user]);

  const attemptLogin = () => {
    setAttemptingAccessChange(true);

    fetchJson<User>(`${restpointPrefix}/login`, {
      method: "POST",
      body: JSON.stringify({ usagePlan: usagePlanName, apiId: apiKeyName }),
    })
      .then((response) => {
        setKeyValue(response);
        setAttemptingAccessChange(false);
      })
      .catch(() => setAttemptingAccessChange(false));
  };
  const attemptLogout = () => {
    setAttemptingAccessChange(true);

    fetchJson<User>(`${restpointPrefix}/login`, {
      method: "POST",
      body: JSON.stringify({ usagePlan: usagePlanName, apiId: apiKeyName }),
    })
      .then((response) => {
        setShownUser(undefined);
        setAttemptingAccessChange(false);
      })
      .catch(() => setAttemptingAccessChange(false));
  };

  return (
    <div className="userHolder">
      <Tooltip
        placement="bottom"
        color=""
        title={
          <>
            TODO:{" "}
            <NavLink to={"/usage-plans"}>DROPDOWN WITH USAGE PLANS</NavLink>
            <div onClick={attemptLogout}>LOG OUT</div>
          </>
        }
      >
        <Icon.UserProfile className="userCircle" />
        <Icon.DownArrow className="dropdownArrow" />
      </Tooltip>
    </div>
  );
}
