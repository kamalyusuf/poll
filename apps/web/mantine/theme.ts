import type { MantineThemeOverride } from "@mantine/core";
import { styles } from "./styles";
import { colors } from "./colors";

export const theme: MantineThemeOverride = {
  fontFamily: "Finlandica, sans-serif",
  primaryColor: "indigo",
  primaryShade: 6,
  fontSizes: {
    xs: "14",
    sm: "16",
    md: "20",
    lg: "22",
    xl: "26"
  },
  components: styles,
  colors
};
