import { Icon } from "../../Assets/Icons";

export type KeyValuePair = { key: string; value: string };

export function DataPairPill({
  key,
  value,
  onRemove,
}: KeyValuePair & {
  onRemove?: () => any;
}) {
  return (
    <div className="dataPairPill">
      <label>{key}:</label> <div>value</div>{" "}
      {!!onRemove && (
        <button
          className="removingX"
          aria-label={`Remove ${key} : ${value} pair`}
          onClick={onRemove}
        >
          <Icon.SmallX />
        </button>
      )}
    </div>
  );
}
