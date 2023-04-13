import { MantineProvider } from "@mantine/core";
import type { Preview } from "@storybook/react";
import React from "react";
import { ToasterWithOptions } from "../src/Components/Common/ToasterWithOptions";
import { AppContextProvider } from "../src/Context/AppContext";
import "../src/Styles/main.scss";

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <AppContextProvider>
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <ToasterWithOptions />
          <Story />
        </MantineProvider>
      </AppContextProvider>
    ),
  ],
};

export default preview;
