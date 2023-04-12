import type { Meta, StoryObj } from "@storybook/react";
import { APIKeysList } from "../Components/UsagePlans/ApiKeys/ApiKeysList";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  title: "Api Keys List",
  component: APIKeysList,
} satisfies Meta<typeof APIKeysList>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Empty: Story = {
  args: {
    apiId: "api-id-1",
    usagePlan: {
      apiIds: ["api-id-2"],
      authPolicies: [
        {
          authType: "some-auth-type",
        },
      ],
      name: "bronze",
      rateLimitPolicy: {
        requestsPerUnit: 5,
        unit: "SECOND",
      },
    },
  },
};
