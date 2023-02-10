import "@stoplight/elements/styles.min.css";
import "../src/Styles/main.scss";

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
};

// export const decorators = [
//   (Story) => (
//     // <ThemeProvider theme={defaultTheme}>
//     //   <Global styles={globalStyles} />
//     //   <Global
//     //     styles={css`
//     //       // Removing body background in favor of storybook background,
//     //       // which can be updated in the toolbar.
//     //       body {
//     //         background: unset;
//     //       }
//     //     `}
//     //   />
//     //   <DiProvider
//     //     // Dependency injecting common functions.
//     //     // These can be overridden in individual stories.
//     //     use={[useGetYamlInjectable(), useSoloPagingInjectable()]}>
//     <Story />
//     //   </DiProvider>
//     // </ThemeProvider>
//   ),
// ];
