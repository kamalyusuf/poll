import type { CSSObject, MantineTheme } from "@mantine/core";

interface ThemeComponent {
  defaultProps?: Record<string, any>;
  classNames?: Record<string, string>;
  styles?:
    | Record<string, CSSObject>
    | ((theme: MantineTheme, params: any) => Record<string, CSSObject>);
}

export const styles: Record<string, ThemeComponent> = {
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
