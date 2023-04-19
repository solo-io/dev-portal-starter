import { Decorator } from "@storybook/react";

export const appContentDecorator: Decorator = (Story) => {
  return (
    <div className="AppContainer" data-theme={"light"}>
      <Story />
    </div>
  );
};
