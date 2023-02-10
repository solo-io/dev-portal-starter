import { ComponentMeta, ComponentStory } from "@storybook/react";
import { within } from "@storybook/testing-library";
import { MemoryRouter } from "react-router-dom";
import ApiDetails from "../../Components/ApiDetails/ApiDetails";

export default {
  component: ApiDetails,
} as ComponentMeta<typeof ApiDetails>;

//
// Story
//
const MainStory: ComponentStory<typeof ApiDetails> = () => {
  return (
    <MemoryRouter>
      <ApiDetails />
    </MemoryRouter>
  );
};

export const DefaultApiDetails = MainStory.bind({});
DefaultApiDetails.args = {};
DefaultApiDetails.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const methodBubble = canvas.queryByTestId("solo-tag");
  // expect(methodBubble).not.toBeNull();
};
