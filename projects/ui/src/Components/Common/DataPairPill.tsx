import styled from "@emotion/styled";
import { Icon } from "../../Assets/Icons";

export const DataPairPillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
`;

const StyledDataPairPill = styled.div`
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: max-content;
  line-height: 25px;
  color: constants.$oceanBlue;
  background: white;
  border-radius: constants.$standardBorderRadius;
  border: 1px solid constants.$splashBlue;

  label,
  div {
    font-size: 0.8em;
  }
  label {
    white-space: nowrap;
    font-weight: 500;
    padding-right: 5px;
  }
  div {
    word-break: break-all;
  }
`;

export type KeyValuePair = { pairKey: string; value: string };

export function DataPairPill({
  pairKey,
  value,
  onRemove,
}: KeyValuePair & {
  onRemove?: () => any;
}) {
  return (
    <StyledDataPairPill>
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
    </StyledDataPairPill>
  );
}
