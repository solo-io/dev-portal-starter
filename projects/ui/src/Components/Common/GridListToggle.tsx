import { Tooltip } from "@mantine/core";
import { Icon } from "../../Assets/Icons";

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
          <button
            className="gridListToggle"
            aria-label="Show list view"
            onClick={() => {
              localStorage.setItem(PREFER_LIST_LOCAL_STORAGE_KEY, "true");
              onChange(true);
            }}
          >
            <Icon.ListViewIcon />
          </button>
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
