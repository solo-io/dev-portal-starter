import { Decorator } from "@storybook/react";
import { StyledAppContainer } from "../../Components/AppContent";

export const appContentDecorator: Decorator = (Story) => {
  return (
    <StyledAppContainer data-theme={"light"}>
      <Story />
    </StyledAppContainer>
  );
};
