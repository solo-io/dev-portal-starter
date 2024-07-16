import { injectable } from "react-magnetic-di";
import { SWRResponse } from "swr";
import { createLoadedSwrResponse } from "./story-helpers";

export const createSwrInjectable = <ReturnType>(
  from: (...args: any[]) => SWRResponse<ReturnType>,
  implementation: ReturnType | (() => ReturnType)
) => {
  return injectable(from as any, () => {
    return createLoadedSwrResponse(
      typeof implementation === "function"
        ? (implementation as any)()
        : implementation
    );
  });
};
