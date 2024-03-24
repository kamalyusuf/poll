import type { MantineTheme, MantineThemeComponents } from "@mantine/core";

export const styles: MantineThemeComponents = {
  TextInput: {
    styles: (theme: MantineTheme) => ({
      input: {
        "&:focus": {
          borderColor: theme.colors.indigo[6]
        }
      },
      required: {
        color: "red"
      }
    })
  },
  Input: {
    styles: (theme: MantineTheme) => ({
      input: {
        "&:focus": {
          borderColor: theme.colors.indigo[6]
        }
      },
      required: {
        color: theme.primaryColor
      }
    })
  },
  PasswordInput: {
    styles: (theme: MantineTheme) => ({
      input: {
        "&:focus": {
          borderColor: theme.colors.indigo[6]
        }
      },
      required: {
        color: theme.primaryColor
      }
    })
  },
  Menu: {
    styles: (theme: MantineTheme) => ({
      itemHovered: {
        backgroundColor: theme.colors.gray[2]
      }
    })
  },
  Title: {
    defaultProps: {},
    styles: () => ({
      root: {
        fontFamily: "Finlandica, sans-serif"
      }
    })
  }
};
