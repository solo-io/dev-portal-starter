import type { Meta, StoryObj } from "@storybook/react";
import { DiProvider, injectable } from "react-magnetic-di";
import { MemoryRouter, useParams } from "react-router-dom";
import { useGetApiDetails } from "../../Apis/hooks";
import { ApiDetailsPage } from "../../Components/ApiDetails/ApiDetailsPage";
import { appContentDecorator } from "../decorators/decorators";
import exampleOpenApiSchema from "./exampleOpenApiSchema";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
const meta = {
  title: "API Details / API Details Page",
  component: ApiDetailsPage,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof ApiDetailsPage>;

export default meta;
type Story = StoryObj<typeof meta>;

//
// Variant: with example schema
//
// This uses an example schema from the OpenApi-Specification repository:
// https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/examples/v2.0/json/uber.json
//
export const Default: Story = {
  decorators: [
    appContentDecorator,
    (Story) => {
      const useGetApiDetailsDi = injectable(useGetApiDetails, () => ({
        isLoading: false,
        data: exampleOpenApiSchema,
      }));
      const useParamsDi = injectable(useParams, () => ({
        apiId: "swagger-petstore",
      }));
      return (
        <MemoryRouter>
          <DiProvider use={[useGetApiDetailsDi, useParamsDi]}>
            <Story />
          </DiProvider>
        </MemoryRouter>
      );
    },
  ],
};
