import styled from "@emotion/styled";
import { Tooltip } from "@mantine/core";
import { Icon } from "../../Assets/Icons";

const GridListToggleButton = styled.button`
  background: inherit;
  border: none;
  padding: 4px;
  margin: 0;
  height: 32px;
  width: 32px;
  border-radius: 4px;
  svg {
    width: 22px;
    height: 22px;
    * {
      fill: constants.$seaBlue;
    }
  }
  border: 1px solid transparent;
  &:hover {
    background-color: constants.$splashBlue;
  }
  &:active {
    background-color: darken(constants.$splashBlue, 10);
    svg * {
      fill: constants.$oceanBlue;
    }
  }
`;

const PREFER_LIST_LOCAL_STORAGE_KEY = "prefer-list-view";

export const isListViewPreferred = () =>
  localStorage.getItem(PREFER_LIST_LOCAL_STORAGE_KEY) === "true";

const GridListToggle = ({
  isList,
  onChange,
}: {
  isList: boolean;
  onChange: (newIsList: boolean) => void;
}) => {
  //
  // Render
  //
  return (
    <>
      {!isList ? (
        <Tooltip
          title={"Show list view"}
          position="bottom"
          label="Show list view"
        >
          <GridListToggleButton
            aria-label="Show list view"
            onClick={() => {
              localStorage.setItem(PREFER_LIST_LOCAL_STORAGE_KEY, "true");
              onChange(true);
            }}
          >
            <Icon.ListViewIcon />
          </GridListToggleButton>
        </Tooltip>
      ) : (
        <Tooltip
          title={"Show grid view"}
          position="bottom"
          label="Show grid view"
        >
          <button
            className="gridListToggle"
            aria-label="Show grid view"
            onClick={() => {
              localStorage.setItem(PREFER_LIST_LOCAL_STORAGE_KEY, "false");
              onChange(false);
            }}
          >
            <Icon.TileViewIcon />
          </button>
        </Tooltip>
      )}
    </>
  );
};

export default GridListToggle;
