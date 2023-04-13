import type { Meta, StoryObj } from "@storybook/react";
import { GenerateApiKeyModal } from "../../Components/UsagePlans/ApiKeys/GenerateApiKeyModal";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: "API Keys / Generate API Key Modal",
  component: GenerateApiKeyModal,
} satisfies Meta<typeof GenerateApiKeyModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    usagePlanName: "Bronze",
  },
};
