import { MantineTheme } from "@mantine/core";
import { Color } from "../types";

export const parseColor = (theme: MantineTheme, color: Color | undefined) => {
  switch (color) {
    case "white":
      return theme.white;
    case "black":
      return theme.black;
    case "red":
    case "primary":
      return theme.primaryColor;
    case "dark":
    case "secondary":
      return theme.colors.dark[6];
    case "indigo":
    case "tertiary":
      return theme.colors.indigo[6];
    default:
      return undefined;
  }
};
