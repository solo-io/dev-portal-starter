import type { Meta, StoryObj } from "@storybook/react";
import { ApiKeyDetailsModal } from "../../Components/UsagePlans/ApiKeys/ApiKeyDetailsModal";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: "API Keys / API Key Details Modal",
  component: ApiKeyDetailsModal,
} satisfies Meta<typeof ApiKeyDetailsModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    usagePlanName: "some-usage-plan",
    apiKey: {
      apiKey: undefined,
      id: "example-key-id",
      name: "Example API Key Name",
      metadata: {
        "some-key": "some-value",
      },
    },
  },
};
