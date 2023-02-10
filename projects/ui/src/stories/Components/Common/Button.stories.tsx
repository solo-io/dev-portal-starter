import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import Button from "../../../Common/Button";

export default {
  component: Button,
} as ComponentMeta<typeof Button>;

//
// Story
//
const MainStory: ComponentStory<typeof Button> = (args) => {
  return (
    <MemoryRouter>
      <Button {...args} />
    </MemoryRouter>
  );
};

export const DefaultButton = MainStory.bind({});
DefaultButton.args = {
  children: "Testing",
};
DefaultButton.play = async ({ canvasElement }) => {
  // const canvas = within(canvasElement);
  // const methodBubble = canvas.queryByTestId("solo-tag");
  // expect(methodBubble).not.toBeNull();
};
