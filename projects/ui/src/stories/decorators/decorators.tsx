import { Decorator } from "@storybook/react";

export const appContentDecorator: Decorator = (Story) => {
  return (
    <div className="AppContent" data-theme={"light"}>
      <Story />
    </div>
  );
};
