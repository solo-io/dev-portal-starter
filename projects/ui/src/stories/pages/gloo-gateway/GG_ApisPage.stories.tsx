import type { Meta, StoryObj } from "@storybook/react";
import { ComponentProps } from "react";
import { MemoryRouter } from "react-router-dom";
import { ApiProductSummary } from "../../../Apis/api-types";
import { useListApiProducts } from "../../../Apis/gg_hooks";
import { GG_ApisPage } from "../../../Components/Apis/gloo-gateway-components/GG_ApisPage";
import { AppContextProvider } from "../../../Context/AppContext";
import { makeDiProviderDecoratorFromUseArray } from "../../decorators/decorators";
import { gg_generators } from "../../mocks/gg_generators";
import { createSwrInjectable } from "../../mocks/utils/injectables";

const meta = {
  title: "GG / API's Landing Page",
  component: GG_ApisPage,
} satisfies Meta<typeof GG_ApisPage>;

export default meta;
type DiProps = { useListApiProducts: ApiProductSummary[] };
type Story = StoryObj<ComponentProps<typeof GG_ApisPage> & DiProps>;

export const Default: Story = {
  args: {
    useListApiProducts: gg_generators.createListApiProductsResponse(),
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
      createSwrInjectable(useListApiProducts, args.useListApiProducts),
    ]),
  ],
};
