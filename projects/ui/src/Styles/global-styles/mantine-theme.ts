import { MantineThemeOverride } from "@mantine/core";
import { colors } from "../colors";

export const mantineThemeOverride: MantineThemeOverride = {
  // These colors are used for providing nice default theming
  // when using Mantine components.
  // Each color is required to have 10 shades, however we mainly
  // care about the commented lines, which are colors used
  // for specific app components.
  // https://v6.mantine.dev/theming/colors/
  colors: {
    gray: [
      colors.aprilGrey,
      colors.aprilGrey,
      colors.aprilGrey,
      colors.aprilGrey,
      colors.aprilGrey, // button color
      colors.aprilGreyDark10, // button hover color
      colors.septemberGrey, // some text colors
      colors.novemberGrey, // table header text color
      colors.novemberGrey,
      colors.novemberGrey,
    ],
    yellow: [
      colors.lightYellow,
      colors.midYellow,
      colors.midYellow,
      colors.midYellow,
      colors.midYellow,
      colors.midYellow,
      colors.midYellow, // button standard color
      colors.midYellowDark20, // button hover + active color
      colors.darkYellow,
      colors.darkYellow,
    ],
    red: [
      colors.lightRed, // button text
      colors.lightRedDark10,
      colors.midRed,
      colors.midRed,
      colors.midRed,
      colors.midRed,
      colors.darkRed, // button standard color
      colors.darkRedDark20, // button hover + active color
      colors.darkRedDark20,
      colors.darkRedDark20, // button text
    ],
    green: [
      colors.lightGreen, // button text
      colors.midGreen,
      colors.midGreen,
      colors.midGreen,
      colors.midGreen,
      colors.midGreen,
      colors.darkGreen, // button standard color
      colors.darkGreenDark20, // button hover + active color
      colors.darkGreenDark20,
      colors.darkGreenDark20,
    ],
  },
};
