// For checking the output of a SASS color lighten/darken function,
// The SASS playground can be used: https://sass-lang.com/playground

const colorMap = {
  /**
   * SIZING
   **/
  // normalContentWidth: "1385px",
  // largeContentWidth: "1920px",

  // standardBorderRadius: "15px",
  // smallBorderRadius: "4px",

  /**
   * COLORS
   **/
  januaryGrey: "#f0f5f7",
  marchGrey: "#e9eef3",
  marchGreyDark3: "#dfe6ee",
  marchGreyDark5: "#d9e1ea",
  marchGreyDark10: "#c8d5e1",
  marchGreyLight5: "#fafbfc",
  aprilGrey: "#d4d8de",
  augustGrey: "#8693a5",
  septemberGrey: "#6e7477",
  novemberGrey: "#35393b",

  lightGreyTransparent: "#ccd4db21",
  lightGreyTransparentDark10: "rgba(174, 187, 198, 0.1294117647)",
  lightGreyTransparentDark25: "rgba(129, 149, 166, 0.1294117647)",
  midGreyTransparent: "#253e580b",
  darkGreyTransparent: "#253e5812",
  blackTransparent: "#00000026",

  greyOpaque: "#8693a5a2",
  greyBlueOpaque: "#253e58cc",

  dropBlue: "#f8fafb",
  splashBlue: "#dbe4ec",
  splashBlueLight5: "#ecf1f5",
  splashBlueLight7: "#f2f6f8",
  splashBlueLight10: "#fcfdfe",
  splashBlueDark10: "#bacbda",
  pondBlue: "#55b8e3",
  lakeBlue: "#158bc2",
  lakeBlueDark10: "#1274a2",
  lakeBlueLight10: "#23a9e7",
  lakeBlueLight20: "#51bbec",
  seaBlue: "#45698a",
  oceanBlue: "#325476",
  neptuneBlue: "#253e58",

  lightGreen: "#ebfff9",
  midGreen: "#0dce93",
  midGreenLight10: "#1df1b0",
  midGreenLight20: "#4df4c1",
  darkGreen: "#0fac7c",

  royalPurple: "#7e4bc6",

  lightRed: "#fff7f7",
  midRed: "#bf0a17",
  darkRed: "#a23f3a",

  pumpkinOrange: "#d75b1d",
  pumpkinOrangeLight10: "#e57842",
  pumpkinOrangeLight20: "#ec986e",

  lightYellow: "#fff6e5",
  midYellow: "#ffb831",
  darkYellow: "#c98709",

  // SEMANTIC COLORS
} as const; // "as const" forces all the color values to be an `as const` value instead of `string`

// Site wide
const semanticColorMap = {
  modalBack: colorMap.greyBlueOpaque,
  primary: colorMap.lakeBlue,
  primaryLight10: colorMap.lakeBlueLight10,
  primaryLight20: colorMap.lakeBlueLight20,
  secondary: colorMap.oceanBlue,
  background: colorMap.dropBlue,
  defaultText: colorMap.novemberGrey,
  defaultColoredText: colorMap.neptuneBlue,
  iconsColor: colorMap.lakeBlue,
  internalLinkColor: colorMap.lakeBlue,
  internalLinkColorDark10: colorMap.lakeBlueDark10,
  externalLinkColor: colorMap.neptuneBlue,

  // Api (Redoc/Swagger) Display
  defaultAction: colorMap.oceanBlue,
  deleteAction: colorMap.midRed,
  eventAction: colorMap.royalPurple,
  getAction: colorMap.lakeBlue,
  postAction: colorMap.darkGreen,
  putAction: colorMap.pumpkinOrange,
  apiDocumentationText: colorMap.neptuneBlue,
} as const;

export const colors = { ...colorMap, ...semanticColorMap } as const;
