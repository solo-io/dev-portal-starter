import Color from "color";

const baseColors = {
  januaryGrey: "#f0f5f7",
  marchGrey: "#e9eef3",
  aprilGrey: "#d4d8de",
  augustGrey: "#8693a5",
  septemberGrey: "#6e7477",
  novemberGrey: "#35393b",

  lightGreyTransparent: "#ccd4db21",
  darkGreyTransparent: "#253e5812",

  dropBlue: "#f8fafb",
  splashBlue: "#dbe4ec",
  pondBlue: "#55b8e3",
  lakeBlue: "#158bc2",
  seaBlue: "#45698a",
  oceanBlue: "#325476",
  neptuneBlue: "#253e58",

  lightGreen: "#ebfff9",
  midGreen: "#0dce93",
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
} as const;

// We can modify the base colors using the color package.
// https://www.npmjs.com/package/color
const colorMap = {
  ...baseColors,

  marchGreyDark3: Color(baseColors.marchGrey).darken(0.03).hex(),
  marchGreyDark5: Color(baseColors.marchGrey).darken(0.05).hex(),
  marchGreyDark10: Color(baseColors.marchGrey).darken(0.1).hex(),
  marchGreyLight5: Color(baseColors.marchGrey).lighten(0.05).hex(),

  aprilGreyDark10: Color(baseColors.aprilGrey).darken(0.1).hex(),

  splashBlueLight5: Color(baseColors.splashBlue).lighten(0.05).hex(),
  splashBlueLight7: Color(baseColors.splashBlue).lighten(0.07).hex(),
  splashBlueLight10: Color(baseColors.splashBlue).lighten(0.1).hex(),
  splashBlueDark10: Color(baseColors.splashBlue).darken(0.1).hex(),

  lakeBlueDark10: Color(baseColors.lakeBlue).darken(0.1).hex(),
  lakeBlueLight10: Color(baseColors.lakeBlue).lighten(0.1).hex(),
  lakeBlueLight20: Color(baseColors.lakeBlue).lighten(0.2).hex(),

  midGreenLight10: Color(baseColors.midGreen).lighten(0.1).hex(),
  midGreenLight20: Color(baseColors.midGreen).lighten(0.2).hex(),

  darkGreenDark20: Color(baseColors.darkGreen).darken(0.2).hex(),

  lightGreyTransparentDark10: Color(baseColors.lightGreyTransparent)
    .darken(0.1)
    .hex(),
  lightGreyTransparentDark25: Color(baseColors.lightGreyTransparent)
    .darken(0.25)
    .hex(),

  lightRedDark10: Color(baseColors.lightRed).darken(0.1).desaturate(0.25).hex(),
  lightMidRed: Color(baseColors.midRed).lighten(1.2).desaturate(0.2).hex(),
  darkRedDark20: Color(baseColors.darkRed).darken(0.2).hex(),

  pumpkinOrangeLight10: Color(baseColors.pumpkinOrange).lighten(0.1).hex(),
  pumpkinOrangeLight20: Color(baseColors.pumpkinOrange).lighten(0.2).hex(),

  midYellowDark20: Color(baseColors.midYellow).darken(0.2).hex(),
} as const;

const semanticColorMap = {
  // Site wide
  primary: colorMap.lakeBlue,
  primaryLight10: colorMap.lakeBlueLight10,
  primaryLight20: colorMap.lakeBlueLight20,
  secondary: colorMap.oceanBlue,
  background: colorMap.dropBlue,
  defaultText: colorMap.novemberGrey,
  defaultColoredText: colorMap.neptuneBlue,
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

// Exporting "as const" forces all the color values to be an `as const` value instead of `string`.
export const colors = { ...colorMap, ...semanticColorMap } as const;
