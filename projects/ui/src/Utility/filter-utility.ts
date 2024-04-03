import { KeyValuePair } from "../Components/Common/DataPairPill";

/**
 * HELPER TYPE DEFS
 **/
export enum FilterType {
  name,
  keyValuePair,
  apiType,
  team,
  subscriptionStatus,
}
export type FilterPair = {
  displayName: string;
  type: FilterType;
  value?: string;
};

/**
 * HELPER FUNCTION
 **/
export function getPairString(pair: KeyValuePair) {
  return `${pair.pairKey} : ${pair.value}`;
}
export function parsePairString(pairString: string): KeyValuePair {
  const [pairKey, value] = pairString.split(":").map((s) => s.trim());
  return {
    pairKey,
    value,
  };
}
