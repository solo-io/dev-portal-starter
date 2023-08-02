import type { Meta, StoryObj } from "@storybook/react";
import { DeepPartialObject, DiProvider, injectable } from "react-magnetic-di";
import { MemoryRouter } from "react-router-dom";
import { API, APIKey, UsagePlan } from "../../Apis/api-types";
import {
  useListApiKeys,
  useListApis,
  useListUsagePlans,
} from "../../Apis/hooks";
import { UsagePlansPage } from "../../Components/UsagePlans/UsagePlansPage";
import { appContentDecorator } from "../decorators/decorators";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
const meta = {
  title: "API Keys / Usage Plans Page",
  component: UsagePlansPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof UsagePlansPage>;

export default meta;
type Story = StoryObj<typeof meta>;

//
// Variant: full usage plan page.
// This includes the steps for adding mock data.
//

//
// 1. Define mock data.
//    This is done outside the decorator function so that the
//    mock data stays the same and doesn't regenerate each time
//    the decorator renders.
const mockApisList: DeepPartialObject<API>[] = [
  {
    apiId: "some-api",
    contact: "some-contact",
    description: "A mock API.",
    title: "Some title",
    apiProductDisplayName: "Some API Product",
    apiVersion: "some-version",
    usagePlans: ["bronze", "silver", "gold"],
  },
];
const mockUsagePlans: DeepPartialObject<UsagePlan>[] = [
  {
    apiIds: ["some-api"],
    authPolicies: [],
    name: "bronze",
    rateLimitPolicy: {
      requestsPerUnit: 5,
      unit: "HOUR",
    },
  },
  {
    apiIds: ["some-api"],
    authPolicies: [],
    name: "silver",
    rateLimitPolicy: {
      requestsPerUnit: 20,
      unit: "HOUR",
    },
  },
];
const mockApiKeys: DeepPartialObject<{
  usagePlan: string;
  apiKeys: APIKey[];
}>[] = [
  {
    usagePlan: "bronze",
    apiKeys: [
      {
        id: "some-api-key-id",
        name: "mock-api-key",
        metadata: {
          "some-key": "some-value",
          "another-key": "another-value",
        },
      },
    ],
  },
  {
    usagePlan: "silver",
    apiKeys: [],
  },
];

export const Default: Story = {
  decorators: [
    appContentDecorator,
    (Story) => {
      //
      // 2. Create the injectable hooks using react-magnetic-di.
      //    Make sure to add `di(myHookName)` in the component
      //    that this story is for, so that the hook can be injected!
      const useListApisDi = injectable(useListApis, () => ({
        isLoading: false,
        data: mockApisList,
      }));
      const useListUsagePlansDi = injectable(useListUsagePlans, () => ({
        isLoading: false,
        data: mockUsagePlans,
      }));
      const useListApiKeysDi = injectable(useListApiKeys, () => ({
        isLoading: false,
        data: mockApiKeys,
      }));

      //
      // 3. Wrap your <Story> in the <DiProvider> using the above injectable hooks.
      return (
        <MemoryRouter>
          <DiProvider
            use={[useListApisDi, useListUsagePlansDi, useListApiKeysDi]}
          >
            <Story />
          </DiProvider>
        </MemoryRouter>
      );
    },
  ],
};
