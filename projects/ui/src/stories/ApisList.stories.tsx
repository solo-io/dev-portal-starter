import type { Meta, StoryObj } from "@storybook/react";
import { ApisList } from "../Components/ApisList/ApisList";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: "Apis List",
  component: ApisList,
} satisfies Meta<typeof ApisList>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    allFilters: [],
    nameFilter: "",
    usingGridView: false,
  },
};
