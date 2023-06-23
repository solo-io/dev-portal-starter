import { faker } from "@faker-js/faker";
import type { Meta, StoryObj } from "@storybook/react";
import { DeepPartialObject, DiProvider, injectable } from "react-magnetic-di";
import { MemoryRouter } from "react-router-dom";
import { API } from "../../Apis/api-types";
import { useListApis } from "../../Apis/hooks";
import { ApisPage } from "../../Components/ApisList/ApisPage";
import { appContentDecorator } from "../decorators/decorators";
import { arrGen } from "../generators";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
const meta = {
  title: "APIs / APIs Page",
  component: ApisPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ApisPage>;

export default meta;
type Story = StoryObj<typeof meta>;

//
// Variant: loading
//
export const Loading: Story = {
  args: {},
  decorators: [
    (Story) => {
      const useListApisDi = injectable(useListApis, () => ({
        isLoading: true,
      }));
      return (
        <MemoryRouter>
          <DiProvider use={[useListApisDi]}>
            <Story />
          </DiProvider>
        </MemoryRouter>
      );
    },
  ],
};

//
// Variant: with content
//
const mockApisList: DeepPartialObject<API>[] = [
  {
    apiProductId: "some-api-product-id",
    apiProductDisplayName: "Mock API Product",
    apiVersion: "v1",
    apiId: "some-api",
    contact: "some-contact",
    customMetadata: arrGen(10).reduce(
      (accum, _) => ({
        ...accum,
        [faker.color.human()]: faker.animal.bear(),
      }),
      {} as Record<string, string>
    ),
    description: "A mock API with metadata.",
    title: "Some title",
  },
  {
    apiId: "some-api-2",
    contact: "some-contact-2",
    description: "A mock API with no metadata.",
    title: "Some title 2",
  },
];
export const Default: Story = {
  decorators: [
    appContentDecorator,
    (Story) => {
      const useListApisDi = injectable(useListApis, () => ({
        isLoading: false,
        data: mockApisList,
      }));
      return (
        <MemoryRouter>
          <DiProvider use={[useListApisDi]}>
            <Story />
          </DiProvider>
        </MemoryRouter>
      );
    },
  ],
};
