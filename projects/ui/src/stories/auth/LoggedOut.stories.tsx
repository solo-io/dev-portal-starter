import type { Meta, StoryObj } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import LoggedOut from "../../Components/Common/LoggedOut";
import { appContentDecorator } from "../decorators/decorators";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: "Auth / Logout Screen",
  component: LoggedOut,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof LoggedOut>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  decorators: [
    appContentDecorator,
    (Story) => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
};
