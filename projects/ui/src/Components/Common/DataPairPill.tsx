import { Icon } from "../../Assets/Icons";

export type KeyValuePair = { pairKey: string; value: string };

export function DataPairPill({
  pairKey,
  value,
  onRemove,
}: KeyValuePair & {
  onRemove?: () => any;
}) {
  return (
    <div className="dataPairPill">
      <label>{pairKey} :</label>
      <div>{value}</div>{" "}
      {!!onRemove && (
        <button
          className="removingX"
          aria-label={`Remove ${pairKey} : ${value} pair`}
          onClick={onRemove}
        >
          <Icon.SmallX />
        </button>
      )}
    </div>
  );
}
