import { createTheme } from "@mantine/core";
import { colors } from "./colors";

export const theme = createTheme({
  fontFamily: "Finlandica, sans-serif",
  primaryColor: "indigo",
  fontSizes: {
    xs: "14",
    sm: "16",
    md: "20",
    lg: "22",
    xl: "26"
  },
  colors
});
