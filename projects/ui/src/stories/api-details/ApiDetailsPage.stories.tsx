import type { Meta, StoryObj } from "@storybook/react";
import { DeepPartialObject, DiProvider, injectable } from "react-magnetic-di";
import { MemoryRouter, useParams } from "react-router-dom";
import { APIProduct } from "../../Apis/api-types";
import { useGetApiDetails, useListApis } from "../../Apis/hooks";
import { ApiProductDetailsPage } from "../../Components/ApiDetails/ApiProductDetailsPage";
import { appContentDecorator } from "../decorators/decorators";
import exampleOpenApiSchema from "./exampleOpenApiSchema";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
const meta = {
  title: "API Details / API Details Page",
  component: ApiProductDetailsPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ApiProductDetailsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

//
// Variant: with example schema
//
// This uses an example schema from the OpenApi-Specification repository:
// https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/examples/v2.0/json/uber.json
//
const mockApisList: DeepPartialObject<APIProduct>[] = [
  {
    apiProductDisplayName: "Uber API",
    apiProductId: "uber-api",
    apiVersions: [
      {
        apiId: "uber-api",
        contact: "uber-api-contact",
        customMetadata: {},
        description: "A mock API.",
        title: "Uber API",
      },
    ],
  },
];
export const Default: Story = {
  decorators: [
    appContentDecorator,
    (Story) => {
      const useGetApiDetailsDi = injectable(useGetApiDetails, () => ({
        isLoading: false,
        data: exampleOpenApiSchema,
      }));
      const useParamsDi = injectable(useParams, () => ({
        apiProductId: mockApisList[0].apiProductId,
        apiVersion: mockApisList[0].apiVersions![0].apiVersion,
      }));
      const useListApisDi = injectable(useListApis, () => ({
        isLoading: false,
        data: mockApisList,
      }));
      return (
        <MemoryRouter>
          <DiProvider use={[useGetApiDetailsDi, useParamsDi, useListApisDi]}>
            <Story />
          </DiProvider>
        </MemoryRouter>
      );
    },
  ],
};
