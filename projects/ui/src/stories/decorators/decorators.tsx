import { Decorator, ReactRenderer } from "@storybook/react";
import { PartialStoryFn } from "@storybook/types";
import { ComponentProps } from "react";
import { DiProvider } from "react-magnetic-di";
import { StyledAppContainer } from "../../Components/AppContent";

export const appContentDecorator: Decorator = (Story) => {
  return (
    <StyledAppContainer data-theme={"light"}>
      <Story />
    </StyledAppContainer>
  );
};

// Not a decorator itself, but creates/returns a decorator with the data passed in via the callback
export const makeDiProviderDecoratorFromUseArray = <TArgs,>(
  getUseArrayFunc: (args: TArgs) => ComponentProps<typeof DiProvider>["use"]
) => {
  return (
    Story: PartialStoryFn<ReactRenderer, TArgs>,
    { args }: { args: TArgs }
  ) => (
    <DiProvider use={getUseArrayFunc(args)}>
      <Story />
    </DiProvider>
  );
};
