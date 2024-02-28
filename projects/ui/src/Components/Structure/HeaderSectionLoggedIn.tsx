import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Popover } from "@mantine/core";
import { useContext, useEffect, useMemo, useState } from "react";
import { di } from "react-magnetic-di";
import { NavLink, useLocation, useSearchParams } from "react-router-dom";
import { useGetCurrentUser } from "../../Apis/hooks";
import { Icon } from "../../Assets/Icons";
import { PortalAuthContext } from "../../Context/PortalAuthContext";
import { logoutEndpoint } from "../../user_variables.tmplr";

export const StyledUserDropdown = styled(Popover.Dropdown)(
  ({ theme }) => css`
    border: none;
    box-shadow: ${theme.marchGrey} 0px 2px 3px 1px;
    padding: 0px;
    margin-top: -8px;
    white-space: nowrap;
    a,
    button.logout,
    div {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 5px 50px;
      line-height: 35px;
      cursor: pointer;
      border-left: 4px solid transparent;
      border-bottom: 0px solid transparent !important;
      color: ${theme.defaultColoredText};

      &:first-child {
        border-top-left-radius: 2px;
        border-top-right-radius: 2px;
      }
      &:last-child {
        border-bottom-left-radius: 2px;
        border-bottom-right-radius: 2px;
      }
    }

    div.disabled {
      background: rgba(50, 50, 50, 0.4);
      color: ${theme.augustGrey};
      border-left-color: ${theme.augustGrey};
      cursor: default;
    }
  `
);

const HeaderSectionLoggedIn = () => {
  di(useGetCurrentUser);
  const { idToken } = useContext(PortalAuthContext);
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
      <StyledUserDropdown>
        <>
          <NavLink
            to={"/usage-plans"}
            className={inUsagePlansArea ? "active" : ""}
            onClick={() => setOpened(!opened)}
          >
            API Keys
          </NavLink>
          <a
            href={`${logoutEndpoint}?id_token_hint=${idToken}&post_logout_redirect_uri=${window.location.origin}/logout`}
            className="logout"
          >
            Logout
          </a>
        </>
      </StyledUserDropdown>
    </Popover>
  );
};

export default HeaderSectionLoggedIn;
