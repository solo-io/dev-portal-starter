import { Global, ThemeProvider } from "@emotion/react";
import { MantineProvider } from "@mantine/core";
import type { Preview } from "@storybook/react";
import React from "react";
import { ToasterWithOptions } from "../src/Components/Common/ToasterWithOptions";
import { defaultTheme, globalStyles } from "../src/Styles";

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
      <ThemeProvider theme={defaultTheme}>
        <Global styles={globalStyles} />
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <ToasterWithOptions />
          <Story />
        </MantineProvider>
      </ThemeProvider>
    ),
  ],
};

export default preview;
