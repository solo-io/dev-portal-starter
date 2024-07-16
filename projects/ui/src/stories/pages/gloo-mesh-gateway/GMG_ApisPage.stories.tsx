import type { Meta, StoryObj } from "@storybook/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import { API } from "../../../Apis/api-types";
import { useListApis } from "../../../Apis/shared_hooks";
import { GMG_ApisPage } from "../../../Components/Apis/gloo-mesh-gateway-components/GMG_ApisPage";
import { AppContextProvider } from "../../../Context/AppContext";
import { makeDiProviderDecoratorFromUseArray } from "../../decorators/decorators";
import { gmg_generators } from "../../mocks/gmg_generators";
import { createSwrInjectable } from "../../mocks/utils/injectables";

const meta = {
  title: "GMG / API's Landing Page",
  component: GMG_ApisPage,
} satisfies Meta<typeof GMG_ApisPage>;

export default meta;
type DiProps = { useListApis: API[] };
type Story = StoryObj<ComponentProps<typeof GMG_ApisPage> & DiProps>;

export const Default: Story = {
  args: {
    useListApis: gmg_generators.createListApisResponse(),
  },
  decorators: [
    (Story) => {
      return (
        <MemoryRouter>
          <AppContextProvider>
            <Story />
          </AppContextProvider>
        </MemoryRouter>
      );
    },
    makeDiProviderDecoratorFromUseArray((args) => [
      createSwrInjectable(useListApis, args.useListApis),
    ]),
  ],
};
