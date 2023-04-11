import type { Meta, StoryObj } from "@storybook/react";
import { ApiKeyCard } from "../Components/UsagePlans/ApiKeys/ApiKeyCard";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: "Api Key Card",
  component: ApiKeyCard,
} satisfies Meta<typeof ApiKeyCard>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    apiKey: {
      id: "api-key-id",
      name: "mock-api-key-name",
      apiKey: "adf",
      metadata: {
        SomeKey: "SomeValue",
      },
    },
    usagePlanName: "bronze",
  },
};
