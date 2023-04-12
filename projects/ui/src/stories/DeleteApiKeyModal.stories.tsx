import type { Meta, StoryObj } from "@storybook/react";
import { DeleteApiKeyModal } from "../Components/UsagePlans/ApiKeys/DeleteApiKeyModal";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: "Delete Api Key Modal",
  component: DeleteApiKeyModal,
} satisfies Meta<typeof DeleteApiKeyModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    apiKeyId: "Example API ID",
    usagePlanName: "Some-usage-plan",
  },
};
