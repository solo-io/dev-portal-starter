import { Box, Popover } from "@mantine/core";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "../../Assets/Icons";
import { colors } from "../../Styles";
import { CustomPage, customPages } from "../../user_variables.tmplr";
import { getCustomPagePath, useInArea } from "../../Utility/utility";
import { StyledUserDropdown } from "./BasicAuth/HeaderSectionLoggedIn";

const CustomPageNavLink = ({
  page,
  onClick,
}: {
  page: CustomPage;
  onClick: () => void;
}) => {
  const onThisPage = useInArea([page.path]);
  return (
    <NavLink
      onClick={onClick}
      to={getCustomPagePath(page)}
      className={`navLink ${onThisPage ? "active" : ""}`}
    >
      {page.title}
    </NavLink>
  );
};

const CustomPagesNavSection = () => {
  const [opened, setOpened] = useState(false);
  const inAnyCustomPageArea = useInArea(
    customPages?.map((page) => page.path) ?? []
  );

  if (!customPages.length) {
    return null;
  }
  return (
    <Box
      sx={{
        height: "100%",
        marginRight: "15px",
        // TODO: The navbar uses classes: should refactor this into a style file.
        borderBottom: inAnyCustomPageArea ? "4px solid " + colors.lakeBlue : "",
      }}
    >
      <Popover position="bottom" opened={opened} onChange={setOpened}>
        <Popover.Target>
          <button
            className="userLoginArea loggedIn"
            onClick={() => setOpened(!opened)}
          >
            <div
              className="userHolder"
              style={
                inAnyCustomPageArea
                  ? // TODO: The navbar uses classes: should refactor this into a style file.
                    { color: colors.lakeBlue, marginTop: "0px" }
                  : {}
              }
            >
              Navigation
              <Icon.DownArrow
                className={`dropdownArrow canRotate ${opened ? "rotate180" : ""}`}
              />
            </div>
          </button>
        </Popover.Target>
        <StyledUserDropdown>
          {customPages.map((page) => (
            <CustomPageNavLink
              key={page.path}
              page={page}
              onClick={() => setOpened(false)}
            />
          ))}
        </StyledUserDropdown>
      </Popover>
    </Box>
  );
};

export default CustomPagesNavSection;
